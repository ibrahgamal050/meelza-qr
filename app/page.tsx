"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Download, QrCode, Palette, Settings, BarChart3 } from "lucide-react"
import QRCodeGenerator from "@/components/qr-code-generator"
import Link from "next/link"

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState("https://example.com")
  const [size, setSize] = useState([256])
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">QR Code Generator</h1>
                <p className="text-sm text-muted-foreground">Create custom QR codes with advanced options</p>
              </div>
            </div>
            {/* Navigation to dashboard */}
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/create">
                <Button>Create & Track QR Code</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info banner about tracking features */}
        <div className="mb-8 p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Want to track your QR code performance?</h3>
              <p className="text-sm text-muted-foreground">
                Create trackable QR codes with analytics, short URLs, and detailed scan statistics.
              </p>
            </div>
            <Link href="/create">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Content & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Input */}
                <div className="space-y-2">
                  <Label htmlFor="qr-text" className="text-sm font-medium">
                    Text or URL
                  </Label>
                  <Textarea
                    id="qr-text"
                    placeholder="Enter text or URL to generate QR code..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Size Control */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Size: {size[0]}px</Label>
                  <Slider value={size} onValueChange={setSize} max={512} min={128} step={32} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>128px</span>
                    <span>512px</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fg-color" className="text-sm font-medium">
                      Foreground Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="fg-color"
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="h-10 w-16 rounded border border-border cursor-pointer"
                      />
                      <Input
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bg-color" className="text-sm font-medium">
                      Background Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="bg-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-10 w-16 rounded border border-border cursor-pointer"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-lg border border-border bg-muted p-8">
                    <QRCodeGenerator
                      text={text}
                      size={size[0]}
                      foregroundColor={foregroundColor}
                      backgroundColor={backgroundColor}
                      onGenerate={setQrCodeDataUrl}
                    />
                  </div>

                  {qrCodeDataUrl && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button
                        onClick={() => {
                          const link = document.createElement("a")
                          link.download = "qrcode.png"
                          link.href = qrCodeDataUrl
                          link.click()
                        }}
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Generate SVG version
                          const canvas = document.querySelector("canvas")
                          if (canvas) {
                            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size[0]}" height="${size[0]}" viewBox="0 0 ${size[0]} ${size[0]}">
                              <image href="${qrCodeDataUrl}" width="${size[0]}" height="${size[0]}"/>
                            </svg>`
                            const blob = new Blob([svg], { type: "image/svg+xml" })
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement("a")
                            link.download = "qrcode.svg"
                            link.href = url
                            link.click()
                            URL.revokeObjectURL(url)
                          }
                        }}
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download SVG
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForegroundColor("#000000")
                      setBackgroundColor("#ffffff")
                    }}
                  >
                    Classic
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForegroundColor("#0891b2")
                      setBackgroundColor("#f0f9ff")
                    }}
                  >
                    Ocean
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForegroundColor("#84cc16")
                      setBackgroundColor("#f7fee7")
                    }}
                  >
                    Nature
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForegroundColor("#ffffff")
                      setBackgroundColor("#1f2937")
                    }}
                  >
                    Dark
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
