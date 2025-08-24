import type { ProcessedAnalytics } from "./analytics-processor"

const API_BASE = "/api"

export const getQRCodeAnalytics = async (
  qrCodeId: string,
  dateRange = "7d",
  groupBy = "day",
): Promise<ProcessedAnalytics & { totalScans: number; uniqueScans: number }> => {
  const params = new URLSearchParams({ dateRange, groupBy })
  const response = await fetch(`${API_BASE}/analytics/${qrCodeId}?${params}`)

  if (!response.ok) {
    throw new Error("Failed to fetch analytics")
  }

  return response.json()
}

export const getOverviewAnalytics = async (): Promise<{
  overview: {
    totalQRCodes: number
    activeQRCodes: number
    totalScans: number
    totalUniqueScans: number
    recentScansCount: number
  }
  topQRCodes: Array<{
    id: string
    title: string
    totalScans: number
    uniqueScans: number
  }>
}> => {
  const response = await fetch(`${API_BASE}/analytics/overview`)

  if (!response.ok) {
    throw new Error("Failed to fetch overview analytics")
  }

  return response.json()
}
