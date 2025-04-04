import type { NextAuthConfig, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import { SESSION_MAX_AGE } from "@/config/constants";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInSchema } from "@/app/schemas/auth.schema";
import { bcryptPasswordCompare } from "@/lib/bcrypt";
import ResendProvider from "next-auth/providers/resend";
import { routes } from "@/config/routes";
import type { AdapterUser } from "@auth/core/adapters";
import { issueChallenge } from "@/lib/otp";

export const config = {
  adapter: PrismaAdapter(db),
  useSecureCookies: false,
  trustHost: true,
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE / 1000,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const validatedField = SignInSchema.safeParse(credentials);

          if (!validatedField.success) return null;

          const user = await db.user.findUnique({
            where: { email: validatedField.data.email },
            select: { id: true, email: true, hashedPassword: true },
          });

          if (!user) return null;

          const match = await bcryptPasswordCompare(
            validatedField.data.password,
            user.hashedPassword
          );

          if (!match) return null;

          await issueChallenge(user.id, user.email);

          const dbUser = await db.user.findUnique({
            where: { id: user.id },
            omit: {hashedPassword: true}
          })

          return { ...dbUser, requires2FA: true };
          
        } catch (error) {
          console.log({ error });
          return null;
        }
      },
    }),
    ResendProvider({}),
  ],
  pages: {
    signIn: routes.signIn,
    signOut: "/auth/sign-out",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ user, token }) {
      const session = await db.session.create({
        data: {
          sessionToken: crypto.randomUUID(),
          userId: user.id as string,
          expires: new Date(Date.now() + SESSION_MAX_AGE),
          requires2FA: user.requires2FA as boolean,
        },
      });
      // console.log({ session }, "session");
      if (!session) return null;

      if (user) token.requires2FA = user.requires2FA;

      token.id = session.sessionToken;
      token.exp = session.expires.getTime();

      return token;
    },
    async session({ session, user }) {
      session.user = {
        id: session.userId,
        email: user.email,
      } as AdapterUser;
      return session;
    },
  },
  jwt: {
		encode: async ({ token }) => token?.id as string,
	},
} as NextAuthConfig;
