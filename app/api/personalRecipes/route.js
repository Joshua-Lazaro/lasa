import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

function parseLongTextAsArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [value];
}

function ingredientToReadableText(ingredient) {
  if (!ingredient) return "";

  if (typeof ingredient === "string") {
    return ingredient.trim();
  }

  if (typeof ingredient === "object") {
    const quantity = ingredient.quantity ? `${ingredient.quantity} ` : "";
    const unit = ingredient.unit ? `${ingredient.unit} ` : "";
    const name = ingredient.name ? `${ingredient.name}` : "";
    return `${quantity}${unit}${name}`.trim();
  }

  return String(ingredient).trim();
}

function toLongTextValue(items, isIngredient = false) {
  if (!Array.isArray(items)) return "";

  return items
    .map((item) => (isIngredient ? ingredientToReadableText(item) : String(item ?? "").trim()))
    .filter(Boolean)
    .join("\n");
}

function normalizeRecipeRow(row) {
  return {
    personal_recipe_id: row.personal_recipe_id,
    user_id: row.user_id,
    personal_recipe_name: row.personal_recipe_name,
    personal_recipe_ingredients: parseLongTextAsArray(row.personal_recipe_ingredients),
    personal_recipe_steps: parseLongTextAsArray(row.personal_recipe_steps),
    additional_notes: row.additional_notes || "",
  };
}

async function createConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const connection = await createConnection();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const [rows] = await connection.execute(
        `
          SELECT
            personal_recipe_id,
            user_id,
            personal_recipe_name,
            personal_recipe_ingredients,
            personal_recipe_steps,
            additional_notes
          FROM personal_recipe
          WHERE personal_recipe_id = ? AND user_id = ?
          LIMIT 1
        `,
        [id, session.user.id]
      );

      if (rows.length === 0) {
        return Response.json({ error: "Recipe not found" }, { status: 404 });
      }

      return Response.json(normalizeRecipeRow(rows[0]));
    }

    const [rows] = await connection.execute(
      `
        SELECT
          personal_recipe_id,
          user_id,
          personal_recipe_name,
          personal_recipe_ingredients,
          personal_recipe_steps,
          additional_notes
        FROM personal_recipe
        WHERE user_id = ?
        ORDER BY personal_recipe_id DESC
      `,
      [session.user.id]
    );

    return Response.json(rows.map(normalizeRecipeRow));
  } catch (error) {
    console.error("personalRecipes GET error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name, ingredients, steps, additional_notes } = await request.json();

  if (!name?.trim()) {
    return Response.json({ error: "Recipe title is required" }, { status: 400 });
  }

  const connection = await createConnection();

  try {
    const ingredientText = toLongTextValue(ingredients, true);
    const stepsText = toLongTextValue(steps, false);
    const notesText = String(additional_notes ?? "").trim();

    const [result] = await connection.execute(
      `
        INSERT INTO personal_recipe (
          user_id,
          personal_recipe_ingredients,
          personal_recipe_steps,
          personal_recipe_name,
          additional_notes
        ) VALUES (?, ?, ?, ?, ?)
      `,
      [
        session.user.id,
        ingredientText,
        stepsText,
        name.trim(),
        notesText,
      ]
    );

    const [rows] = await connection.execute(
      `
        SELECT
          personal_recipe_id,
          user_id,
          personal_recipe_name,
          personal_recipe_ingredients,
          personal_recipe_steps,
          additional_notes
        FROM personal_recipe
        WHERE personal_recipe_id = ? AND user_id = ?
        LIMIT 1
      `,
      [result.insertId, session.user.id]
    );

    return Response.json(normalizeRecipeRow(rows[0]), { status: 201 });
  } catch (error) {
    console.error("personalRecipes POST error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const {
    personal_recipe_id,
    personal_recipe_name,
    personal_recipe_ingredients,
    personal_recipe_steps,
    additional_notes,
  } = await request.json();

  if (!personal_recipe_id) {
    return Response.json({ error: "Recipe id is required" }, { status: 400 });
  }

  if (!personal_recipe_name?.trim()) {
    return Response.json({ error: "Recipe title is required" }, { status: 400 });
  }

  const connection = await createConnection();

  try {
    const ingredientText = toLongTextValue(personal_recipe_ingredients, true);
    const stepsText = toLongTextValue(personal_recipe_steps, false);

    const [existingRows] = await connection.execute(
      "SELECT additional_notes FROM personal_recipe WHERE personal_recipe_id = ? AND user_id = ? LIMIT 1",
      [personal_recipe_id, session.user.id]
    );

    if (existingRows.length === 0) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    const notesText =
      additional_notes !== undefined
        ? String(additional_notes ?? "").trim()
        : String(existingRows[0].additional_notes ?? "");

    const [updateResult] = await connection.execute(
      `
        UPDATE personal_recipe
        SET
          personal_recipe_name = ?,
          personal_recipe_ingredients = ?,
          personal_recipe_steps = ?,
          additional_notes = ?
        WHERE personal_recipe_id = ? AND user_id = ?
      `,
      [
        personal_recipe_name.trim(),
        ingredientText,
        stepsText,
        notesText,
        personal_recipe_id,
        session.user.id,
      ]
    );

    if (updateResult.affectedRows === 0) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    const [rows] = await connection.execute(
      `
        SELECT
          personal_recipe_id,
          user_id,
          personal_recipe_name,
          personal_recipe_ingredients,
          personal_recipe_steps,
          additional_notes
        FROM personal_recipe
        WHERE personal_recipe_id = ? AND user_id = ?
        LIMIT 1
      `,
      [personal_recipe_id, session.user.id]
    );

    return Response.json(normalizeRecipeRow(rows[0]));
  } catch (error) {
    console.error("personalRecipes PUT error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { personal_recipe_id } = await request.json();
  if (!personal_recipe_id) {
    return Response.json({ error: "Recipe id is required" }, { status: 400 });
  }

  const connection = await createConnection();

  try {
    const [result] = await connection.execute(
      "DELETE FROM personal_recipe WHERE personal_recipe_id = ? AND user_id = ?",
      [personal_recipe_id, session.user.id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("personalRecipes DELETE error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}