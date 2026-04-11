import mongoose from "mongoose";
import { nanoid } from "nanoid";

const capsuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Recipient Info
    recipientName: { type: String, required: true },
    recipientEmail: { type: String }, // Optional
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For claimed capsules
    
    // Sharing & Security
    shareToken: { 
      type: String, 
      required: true, 
      unique: true, 
      default: () => nanoid(10) 
    },
    
    // Status & Delivery
    status: { 
      type: String, 
      enum: ["DRAFT", "SEALED", "DELIVERED"], 
      default: "DRAFT" 
    },
    deliveryDate: { type: Date },
    
    // We can also compute isDelivered on the fly, but storing the state is good for indexes
  },
  { timestamps: true }
);

export const CapsuleModel = mongoose.model("Capsule", capsuleSchema);
