import type { QRCode } from "./types"

const API_BASE = "/api"

export const createQRCode = async (data: {
  originalUrl: string
  title?: string
  description?: string
  customization?: {
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
}): Promise<QRCode & { shortUrlFull: string }> => {
  const response = await fetch(`${API_BASE}/qr`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create QR code")
  }

  return response.json()
}

export const updateQRCode = async (id: string, data: Partial<QRCode>): Promise<QRCode> => {
  const response = await fetch(`${API_BASE}/qr/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update QR code")
  }

  return response.json()
}

export const getQRCode = async (id: string): Promise<QRCode> => {
  const response = await fetch(`${API_BASE}/qr/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch QR code")
  }

  return response.json()
}
