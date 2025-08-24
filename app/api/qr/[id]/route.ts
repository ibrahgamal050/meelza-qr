import { NextRequest, NextResponse } from "next/server";
import { getQRCodeById, saveQRCode, deleteQRCode } from "@/lib/storage.mongo";

// GET /api/qr/[id]
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;                 // ✅ لازم await
  const qr = await getQRCodeById(id);              // ✅ async
  if (!qr) return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: qr });
}

// PUT /api/qr/[id]
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;               // ✅ لازم await
    const body = await req.json();

    const current = await getQRCodeById(id);
    if (!current) return NextResponse.json({ error: "QR code not found" }, { status: 404 });

    // saveQRCode في نسخة Mongo بتقبل update لما نمرّر id
    const updated = await saveQRCode({
      ...current,
      ...body,
      id,                                          // مهم عشان يتعامل كـ update
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    console.error("Error updating QR code:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/qr/[id]  (اختياري لكن مفيد)
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await deleteQRCode(id);
  return NextResponse.json({ ok: true });
}
