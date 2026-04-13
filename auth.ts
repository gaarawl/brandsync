import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

const isSecure = process.env.NODE_ENV === "production";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name: isSecure
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isSecure,
        maxAge: SESSION_MAX_AGE,
      },
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Fetch fresh name from DB so name changes take effect immediately
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { name: true },
        });
        if (dbUser?.name) {
          session.user.name = dbUser.name;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.email) {
        try {
          await sendWelcomeEmail(user.email, user.name || "Créateur");
          if (user.id) {
            await prisma.user.update({
              where: { id: user.id },
              data: { welcomeEmailSent: true },
            });
          }
        } catch (e) {
          console.error("Failed to send welcome email:", e);
        }
      }
    },
  },
});
