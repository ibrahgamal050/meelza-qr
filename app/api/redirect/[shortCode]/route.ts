import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { QrCode } from "@/models/QrCode";
import { saveScanEvent } from "@/lib/storage.mongo";

function parseUA(ua: string) {
  const os = /Android/i.test(ua) ? "Android"
    : /iPhone|iPad|iOS/i.test(ua) ? "iOS"
    : /Windows/i.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/i.test(ua) ? "macOS" : "Other";

  const device = /Mobile|Android|iPhone/i.test(ua) ? "Mobile"
    : /iPad|Tablet/i.test(ua) ? "Tablet" : "Desktop";

  return { os, device };
}

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  await dbConnect();
  const code = params.code.toLowerCase();
  const qr = await QrCode.findOne({ shortUrl: code });
  if (!qr || !qr.isActive) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ua = req.headers.get("user-agent") || "";
  const ip = (req.headers.get("x-forwarded-for") || req.ip || "").split(",")[0].trim();
  const { os, device } = parseUA(ua);

  // TODO: لو عايز GeoIP فعلي، ضيف خدمة geoip-lite هنا
  await saveScanEvent({
    qrCodeId: qr._id.toString(),
    isUnique: true, // حط لوجيك uniqueness لو عايز (بناءً على كوكي/آيبي + نافذة زمنية)
    location: { country: "Unknown", city: "Unknown" },
    device: { type: device, os },
    ip,
    ua,
  });

  return NextResponse.redirect(qr.originalUrl, { status: 302 });
}
