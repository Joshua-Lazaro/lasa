import mysql from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; 

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  let sql = "SELECT recipe_id, recipe_name FROM recipe_list";
  const values = [];

  if (query) {
    sql += " WHERE recipe_name LIKE ?";
    values.push(`%${query}%`);
  }

  const [rows] = await connection.execute(sql, values);
  await connection.end();

  return Response.json(rows);
}
