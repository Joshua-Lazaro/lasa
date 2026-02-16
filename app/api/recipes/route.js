import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    let sql = "SELECT recipe_id, recipe_name FROM recipe_list";
    const values = [];

    if (query) {
      sql += " WHERE recipe_name LIKE ?";
      values.push(`%${query}%`);
    }

    const [rows] = await connection.execute(sql, values);
    await connection.end();

    return Response.json(rows);
  } catch (err) {
    console.error("Recipes API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
