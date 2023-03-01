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
  secret: process.env.AUTH_SECRET,
  // session: {
  //   jwt: true,
  //   maxAge: 30 * 24 * 60 * 60,
  // },
};
export default NextAuth(authOptions);
