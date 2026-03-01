import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { username, password } = credentials;

        let connection;

        try {
          connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,
            ssl: {
              rejectUnauthorized: false
             }
          });

          const [rows] = await connection.execute(
            "SELECT user_id, username, user_firstname, password FROM user_login WHERE username = ?",
            [username]
          );

          if (rows.length === 0) {
            return null;
          }

          const user = rows[0];

         
          const isBcryptHash = typeof user.password === "string" && user.password.startsWith("$2");
          const isValid = isBcryptHash
            ? await bcrypt.compare(password, user.password)
            : user.password === password;

          if (!isValid) {
            return null;
          }

          
          return {
            id: user.user_id,
            name: user.user_firstname || user.username,
          };

        } catch (err) {
          console.error("DB login error:", err);
          return null;
        } finally {
          if (connection) await connection.end();
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      
      if (token) {
        session.user.id = token.id;

        let connection;
        try {
          connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,
            ssl: {
              rejectUnauthorized: false,
            },
          });

          const [rows] = await connection.execute(
            "SELECT user_firstname FROM user_login WHERE user_id = ? LIMIT 1",
            [token.id]
          );

          if (rows.length > 0 && rows[0].user_firstname) {
            session.user.name = rows[0].user_firstname;
          } else if (token.name) {
            session.user.name = token.name;
          }
        } catch (err) {
          console.error("Session name lookup error:", err);
          if (token.name) {
            session.user.name = token.name;
          }
        } finally {
          if (connection) await connection.end();
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };