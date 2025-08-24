export interface QRCode {
  id: string
  originalUrl: string
  shortUrl: string
  title?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  customization: {
    size: number
    foregroundColor: string
    backgroundColor: string
  }
  campaign?: {
    name?: string
    startDate?: Date
    endDate?: Date
    medium?: string
  }
}

export interface ScanEvent {
  id: string
  qrCodeId: string
  timestamp: Date
  userAgent: string
  ipAddress?: string
  location?: {
    country?: string
    city?: string
    latitude?: number
    longitude?: number
  }
  device: {
    type: "mobile" | "desktop" | "tablet"
    os: string
    browser: string
  }
  isUnique: boolean
}

export interface Analytics {
  qrCodeId: string
  totalScans: number
  uniqueScans: number
  scansByDate: Record<string, number>
  scansByCountry: Record<string, number>
  scansByCity: Record<string, number>
  scansByDevice: Record<string, number>
  scansByOS: Record<string, number>
  lastScan?: Date
}
