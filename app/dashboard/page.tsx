"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode as QrIcon, Plus, BarChart3, Users, MousePointer, Activity } from "lucide-react";
import Link from "next/link";

// نوع متوافق مع /api/qr
type QRCode = {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  title?: string;
  description?: string;
  scans?: number;
  isActive?: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [overview, setOverview] = useState({
    totalQRCodes: 0,
    activeQRCodes: 0,
    totalScans: 0,
    totalUniqueScans: 0,
    recentScansCount: 0,
  });
  const [topQRCodes, setTopQRCodes] = useState<
    Array<{ id: string; title: string; totalScans: number; uniqueScans: number }>
  >([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) جلب الأكواد
        const codesRes = await fetch("/api/qr", { cache: "no-store" });
        const codesJson = await codesRes.json();
        if (codesJson.ok) setQrCodes(codesJson.data as QRCode[]);

        // 2) جلب الإحصائيات
        const analyticsRes = await fetch("/api/analytics", { cache: "no-store" });
        const analyticsJson = await analyticsRes.json();
        if (!analyticsJson.error) {
          setOverview(analyticsJson.overview);
          setTopQRCodes(analyticsJson.topQRCodes);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <QrIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">QR Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage and track your QR codes</p>
              </div>
            </div>
            <Link href="/dashboard/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create QR Code
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
              <QrIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalQRCodes}</div>
              <p className="text-xs text-muted-foreground">{overview.activeQRCodes} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalScans}</div>
              <p className="text-xs text-muted-foreground">All time scans</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Scans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalUniqueScans}</div>
              <p className="text-xs text-muted-foreground">Unique visitors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.recentScansCount}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* QR Codes List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <QrIcon className="h-5 w-5" />
                Your QR Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qrCodes.length === 0 ? (
                  <div className="text-center py-8">
                    <QrIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No QR codes created yet</p>
                    <Link href="/dashboard/create">
                      <Button>Create Your First QR Code</Button>
                    </Link>
                  </div>
                ) : (
                  qrCodes.slice(0, 5).map((qrCode) => (
                    <div
                      key={qrCode._id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {qrCode.title || qrCode.originalUrl}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(qrCode.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={qrCode.isActive ? "default" : "secondary"}>
                          {qrCode.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Link href={`/qr/${qrCode._id}`}>
                          <Button variant="outline" size="sm" aria-label="View analytics">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing QR Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Performing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topQRCodes.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No scan data available yet</p>
                  </div>
                ) : (
                  topQRCodes.map((q, index) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{q.title}</h3>
                          <p className="text-xs text-muted-foreground">{q.uniqueScans} unique scans</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{q.totalScans}</div>
                        <p className="text-xs text-muted-foreground">total scans</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
