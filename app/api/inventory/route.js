import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET inventory
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const [rows] = await connection.execute(
      "SELECT * FROM user_inventory WHERE user_id = ?",
      [session.user.id]
    );

    // Ensure ingredient_quantity is a float
    const parsedRows = rows.map(r => ({
      ...r,
      ingredient_quantity: parseFloat(r.ingredient_quantity)
    }));

    return Response.json(parsedRows);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// POST add/update
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { ingredient_id, ingredient_name, quantity, measure, operation = "increment" } = await request.json();
  const qty = parseFloat(quantity);
  if (isNaN(qty) || qty <= 0) return Response.json({ error: "Invalid quantity" }, { status: 400 });
  if (!["increment", "set"].includes(operation)) {
    return Response.json({ error: "Invalid operation" }, { status: 400 });
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  try {
    // Check if ingredient exists
    const [rows] = await connection.execute(
      "SELECT ingredient_quantity FROM user_inventory WHERE user_id = ? AND ingredient_id = ?",
      [session.user.id, ingredient_id]
    );

    if (rows.length > 0) {
      // Update existing quantity either by incrementing or setting directly
      const currentQty = parseFloat(rows[0].ingredient_quantity);
      const newQty = operation === "set" ? qty : currentQty + qty;

      await connection.execute(
        `UPDATE user_inventory
         SET ingredient_quantity = ?, ingredient_measure = ?
         WHERE user_id = ? AND ingredient_id = ?`,
        [newQty, measure, session.user.id, ingredient_id]
      );
    } else {
      // Insert new
      await connection.execute(
        `INSERT INTO user_inventory
         (user_id, ingredient_id, ingredient_name, ingredient_quantity, ingredient_measure)
         VALUES (?, ?, ?, ?, ?)`,
        [session.user.id, ingredient_id, ingredient_name, qty, measure]
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// DELETE single or all
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { ingredient_id, clearAll } = await request.json();
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  try {
    if (clearAll) {
      await connection.execute("DELETE FROM user_inventory WHERE user_id = ?", [session.user.id]);
    } else {
      if (!ingredient_id) return Response.json({ error: "Missing ingredient_id" }, { status: 400 });
      await connection.execute(
        "DELETE FROM user_inventory WHERE user_id = ? AND ingredient_id = ?",
        [session.user.id, ingredient_id]
      );
    }
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}