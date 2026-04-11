import { LetterModel } from "../../models/Letter.model.js";
import { CapsuleModel } from "../../models/Capsule.model.js";
import { ApolloContext } from "../../context.js";

export const letterResolvers = {
  Query: {
    letter: async (_parent: any, { id }: { id: string }, context: ApolloContext) => {
      const letter = await LetterModel.findById(id);
      if (!letter) return null;
      
      const capsule = await CapsuleModel.findById(letter.capsuleId);
      if (!capsule) throw new Error("Capsule not found");

      if (capsule.ownerId.toString() !== context.user?.id) {
        const status = (capsule as any).status;
        const deliveryDate = (capsule as any).deliveryDate;

        if (status !== "DELIVERED" && (!deliveryDate || new Date() < deliveryDate)) {
          throw new Error("Unauthorized or not yet delivered");
        }
      }
      
      return letter;
    },
  },
  Mutation: {
    createLetter: async (_parent: any, { input }: any, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      
      const capsule = await CapsuleModel.findById(input.capsuleId);
      if (!capsule) throw new Error("Capsule not found");
      if (capsule.ownerId.toString() !== context.user.id) throw new Error("Not your capsule");
      if ((capsule as any).status !== "DRAFT") throw new Error("Cannot add letters to a sealed capsule");

      return await LetterModel.create({
        ...input,
        authorId: context.user.id
      });
    },
  },
  Letter: {
    id: (parent: any) => parent._id || parent.id,
  }
};
