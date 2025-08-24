import { type NextRequest, NextResponse } from "next/server"
import { getQRCodes, getAnalytics, getScanEvents } from "@/lib/storage.mongo"

export async function GET(request: NextRequest) {
  try {
    const qrCodes = getQRCodes()
    const analytics = getAnalytics()
    const scanEvents = getScanEvents()

    // Calculate overview statistics
    const totalQRCodes = qrCodes.length
    const activeQRCodes = qrCodes.filter((qr) => qr.isActive).length
    const totalScans = analytics.reduce((sum, analytic) => sum + analytic.totalScans, 0)
    const totalUniqueScans = analytics.reduce((sum, analytic) => sum + analytic.uniqueScans, 0)

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentScans = scanEvents.filter((event) => event.timestamp > sevenDaysAgo)
    const recentScansCount = recentScans.length

    // Top performing QR codes
    const topQRCodes = analytics
      .sort((a, b) => b.totalScans - a.totalScans)
      .slice(0, 5)
      .map((analytic) => {
        const qrCode = qrCodes.find((qr) => qr.id === analytic.qrCodeId)
        return {
          id: analytic.qrCodeId,
          title: qrCode?.title || qrCode?.originalUrl || "Untitled",
          totalScans: analytic.totalScans,
          uniqueScans: analytic.uniqueScans,
        }
      })

    return NextResponse.json({
      overview: {
        totalQRCodes,
        activeQRCodes,
        totalScans,
        totalUniqueScans,
        recentScansCount,
      },
      topQRCodes,
    })
  } catch (error) {
    console.error("Error fetching overview analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
