import { auth } from "./auth.js";
import { Request } from "express";

export interface ApolloContext {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  } | null;
}

export const createContext = async ({ req }: { req: Request }): Promise<ApolloContext> => {
  try {
    // Cast headers to any to satisfy the complex Union type requested by Better Auth in Node context
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return { user: null };
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image || undefined,
      },
    };
  } catch (error) {
    console.error("Auth context error:", error);
    return { user: null };
  }
};
