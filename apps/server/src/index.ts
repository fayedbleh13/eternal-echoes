import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// GraphQL Schema Placeholder
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Welcome to Eternal Echoes API!",
  },
};

// Start Server Function
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    console.log("Connecting to MongoDB Atlas...");
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️ Missing MONGODB_URI. Skipping DB connection for now.");
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ Successfully connected to MongoDB Atlas!");
    }

    // 2. Initialize Apollo Server
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await apolloServer.start();

    // 3. Mount Apollo Server at /graphql
    app.use("/graphql", expressMiddleware(apolloServer));

    // 4. Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Backend Server ready at http://localhost:${PORT}`);
      console.log(`🚀 GraphQL API ready at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
