import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

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
    const inventoryIngredients = inventoryRows.map(r => r.ingredient_name.toLowerCase());

    // Fetch all recipes
    const [recipeRows] = await connection.execute(
      "SELECT recipe_id, recipe_name, recipe_ingredient_list, recipe_steps FROM recipe_list"
    );

    // Match ingredients (fuzzy matching, ignore plurals)
    const matchingRecipes = recipeRows
      .map(r => {
        const recipeIngredients = r.recipe_ingredient_list
          .split(/,|\n/)
          .map(i => i.toLowerCase().trim());

        const matches = inventoryIngredients.filter(invIng =>
          recipeIngredients.some(recipeIng => {
            const ri = recipeIng.replace(/s$/i, "");
            const ii = invIng.replace(/s$/i, "");
            return ri.includes(ii) || ii.includes(ri);
          })
        );

        return { ...r, matchCount: matches.length, matchedIngredients: matches };
      })
      .filter(r => r.matchCount >= 4) // only recipes with 4+ ingredients
      .sort((a, b) => b.matchCount - a.matchCount);

    if (matchingRecipes.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(matchingRecipes);
  } catch (err) {
    console.error("AI Suggestion error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}