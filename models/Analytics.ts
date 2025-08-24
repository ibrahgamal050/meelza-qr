import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    qrCodeId: { type: Schema.Types.ObjectId, ref: "QrCode", unique: true, index: true },
    totalScans: { type: Number, default: 0 },
    uniqueScans: { type: Number, default: 0 },
    scansByDate: { type: Map, of: Number, default: {} },    // "YYYY-MM-DD" -> count
    scansByCountry: { type: Map, of: Number, default: {} },
    scansByCity: { type: Map, of: Number, default: {} },
    scansByDevice: { type: Map, of: Number, default: {} },
    scansByOS: { type: Map, of: Number, default: {} },
    lastScan: { type: Date, default: null },
  },
  { timestamps: true }
);

export type AnalyticsDoc = InferSchemaType<typeof AnalyticsSchema> & { _id: Types.ObjectId };
export const Analytics = models.Analytics || model("Analytics", AnalyticsSchema);
