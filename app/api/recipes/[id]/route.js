import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Recipe ID is missing" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    });

    const [rows] = await connection.execute(
      `SELECT recipe_id, recipe_name, recipe_ingredient_list, recipe_steps
       FROM recipe_list
       WHERE recipe_id = ?`,
      [id]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error("Recipe fetch error:", err);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}