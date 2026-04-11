import { generateLetterSuggestion as getGeminiSuggestion } from "../../services/gemini.js";
import { uploadToCloudinary } from "../../services/cloudinary.js";
import { ApolloContext } from "../../context.js";

export const aiResolvers = {
  Mutation: {
    generateLetterSuggestion: async (_parent: any, { prompt, tone }: { prompt: string; tone?: string }, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      return await getGeminiSuggestion(prompt, tone);
    },
    uploadMedia: async (_parent: any, { base64, filename }: { base64: string; filename: string }, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      return await uploadToCloudinary(base64, filename);
    },
  },
};
