import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import * as dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { connectDB } from "./db/connection.js";
import { createContext, ApolloContext } from "./context.js";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 1. Better Auth Handler (MUST be before express.json())
app.all("/api/auth/*", toNodeHandler(auth));

// 2. Standard Middleware
app.use(cors({
  origin: [process.env.BETTER_AUTH_URL || "http://localhost:3000", "https://sandbox.embed.apollo.dev"],
  credentials: true
}));
app.use(express.json());

const startServer = async () => {
  try {
    // 3. Connect DB
    await connectDB();

    // 4. Apollo Server
    const server = new ApolloServer<ApolloContext>({
      typeDefs,
      resolvers,
    });
    await server.start();

    // 5. Mount Apollo with Context
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: createContext,
      })
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
      console.log(`🚀 Auth ready at http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
