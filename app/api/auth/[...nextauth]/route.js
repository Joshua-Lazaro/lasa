import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";

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
            "SELECT user_id, username, password FROM user_login WHERE username = ?",
            [username]
          );

          if (rows.length === 0) {
            return null;
          }

          const user = rows[0];

         
          const isValid = user.password === password;

          if (!isValid) {
            return null;
          }

          
          return {
            id: user.user_id,
            name: user.username,
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
      }
      return token;
    },

    async session({ session, token }) {
      
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };