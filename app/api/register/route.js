import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return Response.json({ error: "Missing username or password" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [existing] = await connection.execute(
      "SELECT user_id FROM user_login WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      await connection.end();
      return Response.json({ error: "Username already taken" }, { status: 400 });
    }

    await connection.execute(
      "INSERT INTO user_login (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    await connection.end();

    return Response.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
