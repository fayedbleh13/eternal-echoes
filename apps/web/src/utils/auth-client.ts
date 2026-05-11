import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.BETTER_AUTH_URL || "http://localhost:4000",
});

export const { useSession, signIn, signOut } = authClient;
