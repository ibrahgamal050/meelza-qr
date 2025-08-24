import { Schema, model, models, InferSchemaType } from "mongoose";

const QrCodeSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, unique: true, required: true },
    title: String,
    description: String,
    customization: {
      size: { type: Number, default: 256 },
      foregroundColor: { type: String, default: "#000000" },
      backgroundColor: { type: String, default: "#ffffff" },
    },
    campaign: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type QrCodeDoc = InferSchemaType<typeof QrCodeSchema>;
export const QrCode = models.QrCode || model("QrCode", QrCodeSchema);
