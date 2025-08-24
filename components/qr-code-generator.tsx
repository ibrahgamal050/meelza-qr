"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QRCodeGeneratorProps {
  text: string
  size: number
  foregroundColor: string
  backgroundColor: string
  onGenerate: (dataUrl: string) => void
}

export default function QRCodeGenerator({
  text,
  size,
  foregroundColor,
  backgroundColor,
  onGenerate,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current || !text.trim()) return

      try {
        await QRCode.toCanvas(canvasRef.current, text, {
          width: size,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
          errorCorrectionLevel: "M",
        })

        // Get data URL for download
        const dataUrl = canvasRef.current.toDataURL("image/png")
        onGenerate(dataUrl)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQRCode()
  }, [text, size, foregroundColor, backgroundColor, onGenerate])

  if (!text.trim()) {
    return (
      <div
        className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 text-muted-foreground"
        style={{ width: size, height: size }}
      >
        <p className="text-sm text-center px-4">Enter text or URL to generate QR code</p>
      </div>
    )
  }

  return <canvas ref={canvasRef} className="rounded-lg shadow-sm" style={{ maxWidth: "100%", height: "auto" }} />
}
