import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        try {
          const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,
          });

          const [rows] = await connection.execute(
            "SELECT user_id, username, password FROM user_login WHERE username = ?",
            [username]
          );

          await connection.end();

          if (rows.length === 0) return null;
          const user = rows[0];

          
          const isValid = user.password === password; 
          

          if (!isValid) return null;

          return { id: user.user_id, name: user.username }; 
        } catch (err) {
          console.error("DB login error:", err);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      
      if (user) token.id = user.id;
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
