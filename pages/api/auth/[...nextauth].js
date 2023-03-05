import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      secret: process.env.AUTH_SECRET,
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await prisma.user.findFirst({ where: { email } });

        if (!user) {
          throw new Error("No user found with email Please Sign up");
        }

        const checkPassword = await compare(password, user.password);

        if (!checkPassword || user.email !== email) {
          throw new Error("Username or Password doesn't match");
        }

        return user;
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id && user.role) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.id && token.role) {
        session.id = token.id;
        session.role = token.role;
      }
      return session;
    },
  },

  // session: {
  //   strategy: "database",
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },
  // callbacks: {
  //   jwt: async ({ token, user }) => {
  //     // First time JWT callback is run, user object is available
  //     if (user && user.id && user.role) {
  //       token.id = user.id;
  //       token.role = user.role;
  //     }
  //     return token;
  //   },
  //   session: async ({ session, token }) => {
  //     if (token && token.id && token.role) {
  //       session.id = token.id;
  //       session.role = token.role;
  //     }
  //     return session;
  //   },
  // },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
