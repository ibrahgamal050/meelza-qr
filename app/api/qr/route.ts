import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { QrCode } from "@/models/QrCode";

function generateId() {
  return crypto.randomUUID();
}

function generateShortUrl(length = 7) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl, title, description, customization, campaign } = body;

    if (!originalUrl) {
      return NextResponse.json({ error: "Original URL is required" }, { status: 400 });
    }

    await dbConnect();

    // توليد shortUrl مع ضمان التفرد
    let shortUrl = generateShortUrl();
    let exists = await QrCode.findOne({ shortUrl }).lean();
    while (exists) {
      shortUrl = generateShortUrl();
      exists = await QrCode.findOne({ shortUrl }).lean();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

    const qrCode = await QrCode.create({
      originalUrl,
      shortUrl,
      title,
      description,
      customization: customization || undefined,
      campaign,
    });

    return NextResponse.json({
      ...qrCode.toObject(),
      shortUrlFull: `${baseUrl}/r/${qrCode.shortUrl}`,
    });
  } catch (error) {
    console.error("Error creating QR code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const codes = await QrCode.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: codes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch QR codes" }, { status: 500 });
  }
}
