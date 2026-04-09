# Eternal Echoes

A modern, full-stack time-capsule letter platform serving as a production-grade showcase of cutting-edge React patterns and robust backend architecture.

## Tech Stack
- **Frontend**: TanStack Start (React 19, Server-Side Rendering, File-Based Routing)
- **Backend API**: Node.js + Express
- **GraphQL**: Apollo Server + Schema-first modeling
- **Database**: MongoDB Atlas (+ Mongoose ODM)
- **Authentication**: Better Auth (Google OAuth)
- **Tooling**: Turborepo, TypeScript, ESLint, Prettier

## Running Locally

This project uses Turborepo to orchestrate a monorepo setup.

1. Ensure you have Node.js 18+ installed.
2. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
4. Start both the frontend and backend servers together:
   ```bash
   npm run dev
   ```

The frontend will start on [http://localhost:3000](http://localhost:3000) and the backend GraphQL API on [http://localhost:4000/graphql](http://localhost:4000/graphql).

## Workspace Structure

- `apps/web`: The TanStack Start PWA Frontend.
- `apps/server`: The Node.js Express server.
- `packages/eslint-config`: Shared ESLint rules used across apps.
- `packages/typescript-config`: Shared `tsconfig.json` configurations.
