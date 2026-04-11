import { UserModel } from "../../models/User.model.js";
import { ApolloContext } from "../../context.js";

export const userResolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: ApolloContext) => {
      if (!context.user) return null;
      return await UserModel.findById(context.user.id);
    },
  },
  User: {
    id: (parent: any) => parent._id || parent.id,
  }
};
