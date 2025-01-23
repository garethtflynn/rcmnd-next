import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/db";
import { compare } from "bcrypt";

export const authOptions = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // "Strict" might prevent cross-site cookies
        path: "/", // Ensure it applies to the whole domain
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Sign-in",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "Enter your email address",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        console.log("USER LOG IN AUTHORIZE FUNCTION", user);

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        if (user) {
          console.log("Returning user:", {
            id: user.id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
          });
          return {
            id: user.id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
          }; // Ensure the returned object includes an id
        } else {
          return null; // Return null on failure
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT CALLBACK", { token, user });
        token.id = user.id; // Store user ID in token
      }
      return token;
    },
    async session({ session, token }) {
      console.log("SESSION CALLBACK", { session, token });
      // session.user.id = token.sub;
      // Add user ID to session
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
