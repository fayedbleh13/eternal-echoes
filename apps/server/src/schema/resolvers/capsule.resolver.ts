import { CapsuleModel } from "../../models/Capsule.model.js";
import { LetterModel } from "../../models/Letter.model.js";
import { ApolloContext } from "../../context.js";
import { sendCapsuleEmail } from "../../services/email.js";

export const capsuleResolvers = {
  Query: {
    myCapsules: async (_parent: any, _args: any, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      return await CapsuleModel.find({ ownerId: context.user.id });
    },
    capsule: async (_parent: any, { id }: { id: string }, context: ApolloContext) => {
      const capsule = await CapsuleModel.findById(id);
      if (!capsule) return null;
      
      if (capsule.ownerId.toString() !== context.user?.id && (capsule as any).status !== "DELIVERED") {
        throw new Error("Unauthorized or not yet delivered");
      }
      return capsule;
    },
    unlockedCapsule: async (_parent: any, { shareToken }: { shareToken: string }) => {
      const capsule = await CapsuleModel.findOne({ shareToken });
      if (!capsule) return null;
      
      const status = (capsule as any).status;
      const deliveryDate = (capsule as any).deliveryDate;

      if (status !== "DELIVERED" && deliveryDate && new Date() < deliveryDate) {
         return capsule; 
      }
      
      return capsule;
    }
  },
  Mutation: {
    createCapsule: async (_parent: any, { input }: any, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      return await CapsuleModel.create({
        ...input,
        ownerId: context.user.id,
        status: "DRAFT"
      });
    },
    lockCapsule: async (_parent: any, { id }: { id: string }, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      const capsule = await CapsuleModel.findOneAndUpdate(
        { _id: id, ownerId: context.user.id },
        { status: "SEALED" },
        { new: true }
      );
      if (!capsule) throw new Error("Capsule not found or not yours");
      return capsule;
    },
    sendCapsule: async (_parent: any, { id }: { id: string }, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      
      // Get capsule first to check if it has recipient email
      const existingCapsule = await CapsuleModel.findOne({
        _id: id,
        ownerId: context.user.id,
        status: { $in: ["DRAFT", "SEALED"] }
      });
      
      if (!existingCapsule) throw new Error("Capsule not found, not yours, or already delivered");
      
      // Update status to DELIVERED
      const capsule = await CapsuleModel.findOneAndUpdate(
        { _id: id, ownerId: context.user.id },
        { status: "DELIVERED" },
        { new: true }
      );
      
      // Send email notification if recipient email exists
      if (capsule?.recipientEmail) {
        try {
          await sendCapsuleEmail({
            to: capsule.recipientEmail,
            recipientName: capsule.recipientName,
            capsuleTitle: capsule.title,
            shareToken: capsule.shareToken,
            deliveryDate: capsule.deliveryDate
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the mutation if email fails, just log it
        }
      }
      
      return capsule;
    },
    updateCapsule: async (_parent: any, { id, input }: { id: string, input: any }, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      const capsule = await CapsuleModel.findOneAndUpdate(
        { _id: id, ownerId: context.user.id },
        { ...input },
        { new: true }
      );
      if (!capsule) throw new Error("Capsule not found or not yours");
      return capsule;
    },
    claimCapsule: async (_parent: any, { shareToken }: { shareToken: string }, context: ApolloContext) => {
      if (!context.user) throw new Error("Unauthorized");
      const capsule = await CapsuleModel.findOneAndUpdate(
        { shareToken },
        { recipientId: context.user.id },
        { new: true }
      );
      if (!capsule) throw new Error("Capsule not found");
      return capsule;
    }
  },
  Capsule: {
    id: (parent: any) => parent._id || parent.id,
    letters: async (parent: any) => {
      const status = (parent as any).status;
      const deliveryDate = (parent as any).deliveryDate;

      if (status === "DRAFT" || (status === "SEALED" && deliveryDate && new Date() >= deliveryDate) || status === "DELIVERED") {
         return await LetterModel.find({ capsuleId: parent._id });
      }
      return [];
    }
  }
};
