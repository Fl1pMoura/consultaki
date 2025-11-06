import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const clinic = await db.query.usersToClinicsTable.findFirst({
        where: eq(schema.usersToClinicsTable.userId, session.userId),
        with: {
          clinic: true,
        },
      });
      return {
        user: {
          ...user,
          clinicId: clinic?.clinicId,
        },
        session,
      };
    }),
  ],
});
