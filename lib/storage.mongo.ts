import { dbConnect } from "@/lib/mongodb";
import { QrCode } from "@/models/QrCode";
import { ScanEvent } from "@/models/ScanEvent";
import { Analytics } from "@/models/Analytics";
import type { Types } from "mongoose";

// ---- Types من ملفك ./types (استخدمها لو حابب) ----
// import type { QRCode as TQRCode, ScanEvent as TScanEvent, Analytics as TAnalytics } from "./types";

// == Utilities ==
export const generateShortUrl = (length = 8): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

// == QR Code operations ==
export async function saveQRCode(qr: {
  id?: string;
  originalUrl: string;
  shortUrl: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  customization?: { size?: number; foregroundColor?: string; backgroundColor?: string };
  campaign?: { name?: string; startDate?: Date; endDate?: Date };
}) {
  await dbConnect();

  // لو فيه id يبقى update، غير كده create
  if (qr.id) {
    const _id = qr.id as unknown as Types.ObjectId;
    const updated = await QrCode.findByIdAndUpdate(
      _id,
      {
        originalUrl: qr.originalUrl,
        shortUrl: qr.shortUrl,
        title: qr.title,
        description: qr.description,
        isActive: qr.isActive ?? true,
        customization: qr.customization,
        campaign: qr.campaign,
      },
      { new: true }
    ).lean();
    return updated;
  } else {
    // ضمان تفرد shortUrl
    let code = (qr.shortUrl || generateShortUrl()).toLowerCase();
    while (await QrCode.findOne({ shortUrl: code }).lean()) {
      code = generateShortUrl().toLowerCase();
    }
    const created = await QrCode.create({
      originalUrl: qr.originalUrl,
      shortUrl: code,
      title: qr.title,
      description: qr.description,
      isActive: qr.isActive ?? true,
      customization: qr.customization,
      campaign: qr.campaign,
    });
    return created.toObject();
  }
}

export async function getQRCodes() {
  await dbConnect();
  const list = await QrCode.find().sort({ createdAt: -1 }).lean();
  return list;
}

export async function getQRCodeById(id: string) {
  await dbConnect();
  return QrCode.findById(id).lean();
}

export async function deleteQRCode(id: string) {
  await dbConnect();
  await QrCode.deleteOne({ _id: id });
  await ScanEvent.deleteMany({ qrCodeId: id });
  await Analytics.deleteOne({ qrCodeId: id });
}

// == Scan Event operations ==
export async function saveScanEvent(evt: {
  qrCodeId: string;
  timestamp?: Date;
  isUnique?: boolean;
  location?: { country?: string; city?: string };
  device?: { type?: string; os?: string };
  ip?: string;
  ua?: string;
}) {
  await dbConnect();

  const qr = await QrCode.findById(evt.qrCodeId);
  if (!qr) throw new Error("QR code not found");

  const timestamp = evt.timestamp || new Date();
  const country = evt.location?.country || "Unknown";
  const city = evt.location?.city || "Unknown";
  const device = evt.device?.type || "Unknown";
  const os = evt.device?.os || "Unknown";
  const dateKey = timestamp.toISOString().split("T")[0];

  // 1) احفظ الحدث
  await ScanEvent.create({
    qrCodeId: qr._id,
    timestamp,
    isUnique: !!evt.isUnique,
    location: { country, city },
    device: { type: device, os },
    ip: evt.ip,
    ua: evt.ua,
  });

  // 2) عدّادات سريعة على QrCode
  await QrCode.updateOne({ _id: qr._id }, { $inc: { scans: 1 }, $set: { updatedAt: new Date() } });

  // 3) حدّث Analytics (upsert + inc على مفاتيح ديناميكية)
  await Analytics.updateOne(
    { qrCodeId: qr._id },
    {
      $inc: {
        totalScans: 1,
        uniqueScans: evt.isUnique ? 1 : 0,
        [`scansByDate.${dateKey}`]: 1,
        [`scansByCountry.${country}`]: 1,
        [`scansByCity.${city}`]: 1,
        [`scansByDevice.${device}`]: 1,
        [`scansByOS.${os}`]: 1,
      },
      $set: { lastScan: timestamp },
    },
    { upsert: true }
  );
}

export async function getScanEvents(limit = 200) {
  await dbConnect();
  return ScanEvent.find().sort({ timestamp: -1 }).limit(limit).lean();
}

export async function getScanEventsByQRCodeId(qrCodeId: string, limit = 200) {
  await dbConnect();
  return ScanEvent.find({ qrCodeId }).sort({ timestamp: -1 }).limit(limit).lean();
}

// == Analytics operations ==
export async function getAnalytics() {
  await dbConnect();
  return Analytics.find().sort({ updatedAt: -1 }).lean();
}

export async function getAnalyticsByQRCodeId(qrCodeId: string) {
  await dbConnect();
  return Analytics.findOne({ qrCodeId }).lean();
}
