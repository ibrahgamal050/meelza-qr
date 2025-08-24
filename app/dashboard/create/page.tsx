"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Palette, Settings, Save, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import QRCodeGenerator from "@/components/qr-code-generator"
import { createQRCode } from "@/lib/qr-service"
import { useToast } from "@/hooks/use-toast"

export default function CreateQRCodePage() {
  const [originalUrl, setOriginalUrl] = useState("https://example.com")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [size, setSize] = useState([256])
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [createdQRCode, setCreatedQRCode] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleCreateQRCode = async () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const qrCode = await createQRCode({
        originalUrl,
        title: title || undefined,
        description: description || undefined,
        customization: {
          size: size[0],
          foregroundColor,
          backgroundColor,
        },
      })

      setCreatedQRCode(qrCode)
      toast({
        title: "Success",
        description: "QR code created successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const copyShortUrl = () => {
    if (createdQRCode?.shortUrlFull) {
      navigator.clipboard.writeText(createdQRCode.shortUrlFull)
      toast({
        title: "Copied",
        description: "Short URL copied to clipboard",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold text-foreground">Create QR Code</h1>
                  <p className="text-sm text-muted-foreground">Generate trackable QR codes with analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  QR Code Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-medium">
                    Destination URL *
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                  />
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title (Optional)
                  </Label>
                  <Input id="title" placeholder="My QR Code" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this QR code..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] resize-none"
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
                      text={createdQRCode?.shortUrlFull || originalUrl}
                      size={size[0]}
                      foregroundColor={foregroundColor}
                      backgroundColor={backgroundColor}
                      onGenerate={setQrCodeDataUrl}
                    />
                  </div>

                  {!createdQRCode ? (
                    <Button onClick={handleCreateQRCode} disabled={isCreating} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      {isCreating ? "Creating..." : "Create QR Code"}
                    </Button>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">QR Code Created Successfully!</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-700">Short URL:</span>
                            <code className="text-sm bg-green-100 px-2 py-1 rounded">{createdQRCode.shortUrlFull}</code>
                            <Button size="sm" variant="outline" onClick={copyShortUrl}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => router.push(`/qr/${createdQRCode.id}`)} className="flex-1">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.download = `qrcode-${createdQRCode.shortUrl}.png`
                            link.href = qrCodeDataUrl
                            link.click()
                          }}
                          className="flex-1"
                        >
                          Download PNG
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {createdQRCode && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Download your QR code</p>
                      <p className="text-sm text-muted-foreground">Use it in your marketing materials</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Track performance</p>
                      <p className="text-sm text-muted-foreground">Monitor scans and user engagement</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Optimize campaigns</p>
                      <p className="text-sm text-muted-foreground">Use analytics to improve results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
