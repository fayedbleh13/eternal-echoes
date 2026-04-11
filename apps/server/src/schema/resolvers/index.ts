import { userResolvers } from "./user.resolver.js";
import { capsuleResolvers } from "./capsule.resolver.js";
import { letterResolvers } from "./letter.resolver.js";
import { aiResolvers } from "./ai.resolver.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...capsuleResolvers.Query,
    ...letterResolvers.Query,
  },
  Mutation: {
    ...capsuleResolvers.Mutation,
    ...letterResolvers.Mutation,
    ...aiResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Capsule: {
    ...capsuleResolvers.Capsule,
  },
  Letter: {
    ...letterResolvers.Letter,
  },
};
