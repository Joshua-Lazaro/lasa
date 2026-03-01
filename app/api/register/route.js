import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

function isStrongPassword(password) {
  if (typeof password !== "string") return false;
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

function mapUserTypeLabel(userType) {
  if (userType === 1) return "Beginner";
  if (userType === 2) return "Home Cook";
  if (userType === 3) return "Enthusiast";
  return "Other";
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

export async function GET() {
  let connection;

  try {
    connection = await createConnection();

    const [totalRows] = await connection.execute(
      "SELECT COUNT(*) AS total_users FROM user_login"
    );
    const totalUsers = Number(totalRows[0]?.total_users || 0);

    const [rows] = await connection.execute(
      `
        SELECT user_type, COUNT(*) AS count
        FROM user_login
        GROUP BY user_type
        ORDER BY user_type
      `
    );

    const stats = rows.map((row) => {
      const count = Number(row.count);
      const percentage = totalUsers === 0 ? 0 : Number(((count / totalUsers) * 100).toFixed(2));

      return {
        user_type: Number(row.user_type),
        label: mapUserTypeLabel(Number(row.user_type)),
        count,
        percentage,
      };
    });

    return Response.json({
      total_users: totalUsers,
      stats,
    });
  } catch (err) {
    console.error("Registration stats error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function POST(request) {
  const {
    username,
    password,
    user_firstname,
    user_middlename,
    user_lastname,
    gender,
    date_of_birth,
    user_type,
  } = await request.json();

  if (
    !username ||
    !password ||
    !user_firstname ||
    !user_lastname ||
    gender === undefined ||
    !date_of_birth ||
    user_type === undefined
  ) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsedGender = Number(gender);
  const parsedUserType = Number(user_type);

  if (!Number.isInteger(parsedGender) || !Number.isInteger(parsedUserType)) {
    return Response.json({ error: "Invalid gender or user type" }, { status: 400 });
  }

  if (!isStrongPassword(password)) {
    return Response.json(
      {
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await createConnection();

    const [existing] = await connection.execute(
      "SELECT user_id FROM user_login WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      await connection.end();
      return Response.json({ error: "Username already taken" }, { status: 400 });
    }

    await connection.execute(
      `
        INSERT INTO user_login (
          username,
          password,
          user_firstname,
          user_middlename,
          user_lastname,
          gender,
          date_of_birth,
          user_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        username.trim(),
        hashedPassword,
        user_firstname.trim(),
        (user_middlename || "").trim(),
        user_lastname.trim(),
        parsedGender,
        date_of_birth,
        parsedUserType,
      ]
    );

    await connection.end();

    return Response.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
