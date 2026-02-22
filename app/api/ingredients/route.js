import mysql from "mysql2/promise";

// GET: Search ingredients by name
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    connectTimeout: 10000,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  const [rows] = await connection.execute(
    "SELECT * FROM ingredient_list WHERE ingredient_name LIKE ?",
    [`%${query}%`]
  );

  await connection.end();

  return Response.json(rows);
}