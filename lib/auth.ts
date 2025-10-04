import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { APP_ROLES, ac } from "./permissions";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  allowedRedirectURLs: [`${process.env.NEXT_PUBLIC_AUTH_URL}/dashboard`],
  plugins: [
    admin({
      ac,
      roles: APP_ROLES,
    }),
  ],
});
