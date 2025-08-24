"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode as QrIcon, Download, Edit, RotateCcw, Calendar } from "lucide-react";
import Link from "next/link";
import QRCodeGenerator from "@/components/qr-code-generator";
import AnalyticsCharts from "@/components/analytics-charts";
import { exportAnalyticsToCSV } from "@/lib/analytics-processor";

// نوع بيانات ال QR Code من API
type QRCodeDoc = {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  customization?: { size?: number; foregroundColor?: string; backgroundColor?: string };
  createdAt: string;
  updatedAt: string;
};

export default function QRCodePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [qrCode, setQrCode] = useState<QRCodeDoc | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  // جلب البيانات
  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);

        // 1) جلب بيانات QR Code
        const res = await fetch(`/api/qr/${id}`, { cache: "no-store" });
        const json = await res.json();
        if (json?.ok) setQrCode(json.data);
        else setQrCode(null);

        // 2) جلب Analytics (لو عندك API مناسب)
        const aRes = await fetch(`/api/analytics/qr/${id}?range=${dateRange}`, { cache: "no-store" }).catch(() => null);
        if (aRes && aRes.ok) {
          const aJson = await aRes.json();
          if (!aJson.error) setAnalytics(aJson.data);
        }
      } catch (e) {
        console.error("Failed to load QR page:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, dateRange]);

  // تحميل
  if (!id || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading QR code data...</p>
        </div>
      </div>
    );
  }

  // مش لاقي
  if (!qrCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <QrIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">QR Code Not Found</h1>
          <p className="text-muted-foreground mb-4">The QR code you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // تصدير CSV
  const handleExportCSV = () => {
    if (!analytics || !qrCode) return;
    const csvContent = exportAnalyticsToCSV([], qrCode.title || qrCode.originalUrl);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-analytics-${qrCode.shortUrl}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  ← Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Badge variant="outline">WEBSITE</Badge>
                <Badge variant={qrCode.isActive ? "default" : "secondary"}>
                  {qrCode.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* QR Code Header */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-foreground mb-2">{qrCode.title || qrCode.originalUrl}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(qrCode.createdAt).toLocaleDateString()}
              </div>
              <div>No folder</div>
            </div>

            {/* Campaign Settings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">CAMPAIGN START</label>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Add Date
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CAMPAIGN END</label>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Add Date
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">PRINT RUN</label>
                <Button variant="link" className="p-0 h-auto text-primary">
                  + Add
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">MEDIUM</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="print">Print</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border border-border mb-4">
              <QRCodeGenerator
                text={`${window.location.origin}/r/${qrCode.shortUrl}`}
                size={qrCode.customization?.size || 256}
                foregroundColor={qrCode.customization?.foregroundColor || "#000000"}
                backgroundColor={qrCode.customization?.backgroundColor || "#ffffff"}
                onGenerate={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {window.location.origin}/r/{qrCode.shortUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">TOTAL SCANS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalScans || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">UNIQUE SCANS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.uniqueScans || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-xl">Scans</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Today</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Scans
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>{analytics && <AnalyticsCharts analytics={analytics} />}</CardContent>
        </Card>
      </main>
    </div>
  );
}
