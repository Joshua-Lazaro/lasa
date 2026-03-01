import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-small-latest";

function normalizeIngredient(value) {
  return (value || "").toLowerCase().trim().replace(/s$/i, "");
}

function parseRecipeIngredients(rawIngredientList) {
  return (rawIngredientList || "")
    .split(/,|\n/)
    .map((item) => item.toLowerCase().trim())
    .filter(Boolean);
}

function buildHeuristicMatches(recipeRows, inventoryIngredients) {
  return recipeRows
    .map((recipe) => {
      const recipeIngredients = parseRecipeIngredients(recipe.recipe_ingredient_list);

      const matches = inventoryIngredients.filter((inventoryIngredient) =>
        recipeIngredients.some((recipeIngredient) => {
          const normalizedRecipeIngredient = normalizeIngredient(recipeIngredient);
          const normalizedInventoryIngredient = normalizeIngredient(inventoryIngredient);
          return (
            normalizedRecipeIngredient.includes(normalizedInventoryIngredient) ||
            normalizedInventoryIngredient.includes(normalizedRecipeIngredient)
          );
        })
      );

      return {
        ...recipe,
        recipeIngredients,
        matchCount: matches.length,
        matchedIngredients: matches,
      };
    })
    .sort((a, b) => b.matchCount - a.matchCount);
}

function extractJsonObject(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
    if (fencedMatch?.[1]) {
      try {
        return JSON.parse(fencedMatch[1]);
      } catch {
        return null;
      }
    }

    const firstCurly = text.indexOf("{");
    const lastCurly = text.lastIndexOf("}");
    if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
      try {
        return JSON.parse(text.slice(firstCurly, lastCurly + 1));
      } catch {
        return null;
      }
    }

    return null;
  }
}

async function getMistralSuggestions(inventoryIngredients, candidateRecipes) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey || candidateRecipes.length === 0) return [];

  const prompt = [
    "You are a cooking assistant.",
    "Pick the best recipe suggestions for a user based on the ingredients they currently have.",
    "Return ONLY valid JSON with this exact shape:",
    '{"suggestions":[{"recipe_id":"string","matched_ingredients":["ingredient"],"score":0.0,"reason":"short reason"}]}',
    "Rules:",
    "- Use only recipe_id values from the provided candidates.",
    "- Suggest up to 8 recipes, sorted best to worst.",
    "- matched_ingredients must only include ingredients present in user inventory.",
    "- score must be between 0 and 1.",
    "- Keep reason to one short sentence.",
    "User inventory:",
    JSON.stringify(inventoryIngredients),
    "Candidate recipes:",
    JSON.stringify(candidateRecipes),
  ].join("\n");

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: "You must return strict JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral request failed with status ${response.status}`);
  }

  const data = await response.json();
  const messageContent = data?.choices?.[0]?.message?.content;

  const contentText =
    typeof messageContent === "string"
      ? messageContent
      : Array.isArray(messageContent)
      ? messageContent
          .map((part) => (typeof part?.text === "string" ? part.text : ""))
          .join("\n")
      : "";

  const parsed = extractJsonObject(contentText);
  const suggestions = Array.isArray(parsed?.suggestions) ? parsed.suggestions : [];

  return suggestions;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  });

  try {
    // Fetch user inventory
    const [inventoryRows] = await connection.execute(
      "SELECT ingredient_name FROM user_inventory WHERE user_id = ?",
      [session.user.id]
    );
    const inventoryIngredients = inventoryRows
      .map((row) => (row.ingredient_name || "").toLowerCase().trim())
      .filter(Boolean);

    // Fetch all recipes
    const [recipeRows] = await connection.execute(
      "SELECT recipe_id, recipe_name, recipe_ingredient_list, recipe_steps FROM recipe_list"
    );

    const heuristicMatches = buildHeuristicMatches(recipeRows, inventoryIngredients);
    const candidateRecipes = heuristicMatches
      .filter((recipe) => recipe.matchCount >= 1)
      .slice(0, 40)
      .map((recipe) => ({
        recipe_id: String(recipe.recipe_id),
        recipe_name: recipe.recipe_name,
        ingredients: recipe.recipeIngredients,
        pre_score: recipe.matchCount,
      }));

    if (candidateRecipes.length > 0 && process.env.MISTRAL_API_KEY) {
      try {
        const aiSuggestions = await getMistralSuggestions(inventoryIngredients, candidateRecipes);
        const recipeById = new Map(
          heuristicMatches.map((recipe) => [String(recipe.recipe_id), recipe])
        );

        const aiMatchedRecipes = aiSuggestions
          .map((suggestion, index) => {
            const recipeId = String(suggestion?.recipe_id || "");
            const baseRecipe = recipeById.get(recipeId);
            if (!baseRecipe) return null;

            const matchedIngredients = Array.isArray(suggestion?.matched_ingredients)
              ? suggestion.matched_ingredients.filter(Boolean)
              : baseRecipe.matchedIngredients;

            return {
              ...baseRecipe,
              matchedIngredients,
              aiRank: index + 1,
              aiScore:
                typeof suggestion?.score === "number"
                  ? Math.max(0, Math.min(1, suggestion.score))
                  : undefined,
              aiReason:
                typeof suggestion?.reason === "string" ? suggestion.reason : undefined,
            };
          })
          .filter(Boolean);

        if (aiMatchedRecipes.length > 0) {
          return NextResponse.json(aiMatchedRecipes);
        }
      } catch (aiError) {
        console.error("Mistral suggestion failed, using heuristic fallback:", aiError);
      }
    }

    const fallbackRecipes = heuristicMatches.filter((recipe) => recipe.matchCount >= 4);

    return NextResponse.json(fallbackRecipes);
  } catch (err) {
    console.error("AI Suggestion error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}