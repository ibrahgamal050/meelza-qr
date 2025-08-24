import { type NextRequest, NextResponse } from "next/server"
import { getAnalyticsByQRCodeId, getScanEventsByQRCodeId } from "@/lib/storage.mongo"
import { processAnalyticsData } from "@/lib/analytics-processor"

export async function GET(request: NextRequest, { params }: { params: { qrCodeId: string } }) {
  const { qrCodeId } = params
  const { searchParams } = new URL(request.url)
  const dateRange = searchParams.get("dateRange") || "7d"
  const groupBy = searchParams.get("groupBy") || "day"

  try {
    const analytics = getAnalyticsByQRCodeId(qrCodeId)
    const scanEvents = getScanEventsByQRCodeId(qrCodeId)

    if (!analytics) {
      return NextResponse.json({
        qrCodeId,
        totalScans: 0,
        uniqueScans: 0,
        scansByDate: {},
        scansByCountry: {},
        scansByCity: {},
        scansByDevice: {},
        scansByOS: {},
        chartData: [],
        topCountries: [],
        topCities: [],
        deviceBreakdown: [],
        osBreakdown: [],
      })
    }

    const processedData = processAnalyticsData(scanEvents, dateRange, groupBy)

    return NextResponse.json({
      ...analytics,
      ...processedData,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
