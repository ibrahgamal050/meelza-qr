import "server-only";
import { redirect, notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import { QrCode } from "@/models/QrCode";

export default async function RedirectPage(
  ctx: { params: Promise<{ shortCode: string }> }
) {
  // ✅ لازم await للـ params
  const { shortCode } = await ctx.params;

  await dbConnect();

  const qr = await QrCode.findOne({
    shortUrl: shortCode.toLowerCase(),
    isActive: { $ne: false },
  }).lean();

  if (!qr) {
    // اعرض صفحة 404 القياسية
    notFound();
  }

  // هيوقف التنفيذ ويحوّل مباشرة
  redirect(qr.originalUrl);
}
