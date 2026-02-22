import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET: Fetch current user's inventory
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
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Database error" }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// POST: Add or update ingredient
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { ingredient_id, ingredient_name, quantity, increment } = await request.json();
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
      "SELECT ingredient_quantity FROM user_inventory WHERE user_id = ? AND ingredient_id = ?",
      [session.user.id, ingredient_id]
    );

    if (rows.length > 0) {
      const newQuantity = parseFloat(rows[0].ingredient_quantity) + parseFloat(quantity);
      await connection.execute(
        `UPDATE user_inventory
         SET ingredient_quantity = ?, ingredient_measure = ?
         WHERE user_id = ? AND ingredient_id = ?`,
        [newQuantity, increment, session.user.id, ingredient_id]
      );
    } else {
      await connection.execute(
        `INSERT INTO user_inventory
         (user_id, ingredient_id, ingredient_name, ingredient_quantity, ingredient_measure)
         VALUES (?, ?, ?, ?, ?)`,
        [session.user.id, ingredient_id, ingredient_name, quantity, increment]
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

// DELETE: Remove ingredient or clear all
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