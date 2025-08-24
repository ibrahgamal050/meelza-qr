import type { ScanEvent } from "./types"

export interface ProcessedAnalytics {
  chartData: Array<{
    date: string
    unique: number
    nonUnique: number
    total: number
  }>
  topCountries: Array<{
    country: string
    scans: number
    percentage: number
  }>
  topCities: Array<{
    city: string
    scans: number
    percentage: number
  }>
  deviceBreakdown: Array<{
    device: string
    scans: number
    percentage: number
  }>
  osBreakdown: Array<{
    os: string
    scans: number
    percentage: number
  }>
}

export const processAnalyticsData = (
  scanEvents: ScanEvent[],
  dateRange = "7d",
  groupBy = "day",
): ProcessedAnalytics => {
  // Filter events by date range
  const now = new Date()
  let startDate: Date

  switch (dateRange) {
    case "1d":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const filteredEvents = scanEvents.filter((event) => event.timestamp >= startDate)

  // Process chart data
  const chartData = processChartData(filteredEvents, groupBy, startDate, now)

  // Process location data
  const { topCountries, topCities } = processLocationData(filteredEvents)

  // Process device data
  const { deviceBreakdown, osBreakdown } = processDeviceData(filteredEvents)

  return {
    chartData,
    topCountries,
    topCities,
    deviceBreakdown,
    osBreakdown,
  }
}

const processChartData = (
  events: ScanEvent[],
  groupBy: string,
  startDate: Date,
  endDate: Date,
): Array<{ date: string; unique: number; nonUnique: number; total: number }> => {
  const dataMap = new Map<string, { unique: number; nonUnique: number; total: number }>()

  // Initialize all dates in range
  const current = new Date(startDate)
  while (current <= endDate) {
    const key = formatDateKey(current, groupBy)
    dataMap.set(key, { unique: 0, nonUnique: 0, total: 0 })

    if (groupBy === "hour") {
      current.setHours(current.getHours() + 1)
    } else {
      current.setDate(current.getDate() + 1)
    }
  }

  // Aggregate events
  events.forEach((event) => {
    const key = formatDateKey(event.timestamp, groupBy)
    const existing = dataMap.get(key) || { unique: 0, nonUnique: 0, total: 0 }

    existing.total += 1
    if (event.isUnique) {
      existing.unique += 1
    } else {
      existing.nonUnique += 1
    }

    dataMap.set(key, existing)
  })

  return Array.from(dataMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

const processLocationData = (events: ScanEvent[]) => {
  const countryMap = new Map<string, number>()
  const cityMap = new Map<string, number>()

  events.forEach((event) => {
    const country = event.location?.country || "Unknown"
    const city = event.location?.city || "Unknown"

    countryMap.set(country, (countryMap.get(country) || 0) + 1)
    cityMap.set(city, (cityMap.get(city) || 0) + 1)
  })

  const totalScans = events.length

  const topCountries = Array.from(countryMap.entries())
    .map(([country, scans]) => ({
      country,
      scans,
      percentage: Math.round((scans / totalScans) * 100),
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 10)

  const topCities = Array.from(cityMap.entries())
    .map(([city, scans]) => ({
      city,
      scans,
      percentage: Math.round((scans / totalScans) * 100),
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 10)

  return { topCountries, topCities }
}

const processDeviceData = (events: ScanEvent[]) => {
  const deviceMap = new Map<string, number>()
  const osMap = new Map<string, number>()

  events.forEach((event) => {
    const device = event.device.type
    const os = event.device.os

    deviceMap.set(device, (deviceMap.get(device) || 0) + 1)
    osMap.set(os, (osMap.get(os) || 0) + 1)
  })

  const totalScans = events.length

  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([device, scans]) => ({
      device,
      scans,
      percentage: Math.round((scans / totalScans) * 100),
    }))
    .sort((a, b) => b.scans - a.scans)

  const osBreakdown = Array.from(osMap.entries())
    .map(([os, scans]) => ({
      os,
      scans,
      percentage: Math.round((scans / totalScans) * 100),
    }))
    .sort((a, b) => b.scans - a.scans)

  return { deviceBreakdown, osBreakdown }
}

const formatDateKey = (date: Date, groupBy: string): string => {
  if (groupBy === "hour") {
    return date.toISOString().slice(0, 13) // YYYY-MM-DDTHH
  }
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

export const exportAnalyticsToCSV = (scanEvents: ScanEvent[], qrCodeTitle = "QR Code"): string => {
  const headers = [
    "Date",
    "Time",
    "Country",
    "City",
    "Device Type",
    "Operating System",
    "Browser",
    "Is Unique",
    "IP Address",
  ]

  const rows = scanEvents.map((event) => [
    event.timestamp.toISOString().split("T")[0],
    event.timestamp.toISOString().split("T")[1].split(".")[0],
    event.location?.country || "Unknown",
    event.location?.city || "Unknown",
    event.device.type,
    event.device.os,
    event.device.browser,
    event.isUnique ? "Yes" : "No",
    event.ipAddress || "Unknown",
  ])

  const csvContent = [
    `# Analytics Export for: ${qrCodeTitle}`,
    `# Generated on: ${new Date().toISOString()}`,
    "",
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n")

  return csvContent
}
