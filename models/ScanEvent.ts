import { Schema, model, models, InferSchemaType, Types } from "mongoose";

const Location = new Schema(
  { country: String, city: String },
  { _id: false }
);

const Device = new Schema(
  { type: String, os: String },
  { _id: false }
);

const ScanEventSchema = new Schema(
  {
    qrCodeId: { type: Schema.Types.ObjectId, ref: "QrCode", required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    isUnique: { type: Boolean, default: false },
    location: { type: Location, default: undefined },
    device: { type: Device, default: undefined },
    ip: String,
    ua: String,
  },
  { timestamps: true }
);

export type ScanEventDoc = InferSchemaType<typeof ScanEventSchema> & { _id: Types.ObjectId };
export const ScanEvent = models.ScanEvent || model("ScanEvent", ScanEventSchema);
