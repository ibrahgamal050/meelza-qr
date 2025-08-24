"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface AnalyticsChartsProps {
  analytics: {
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
    osBreakdown: Array<{
      os: string
      scans: number
      percentage: number
    }>
  }
}

const chartConfig = {
  unique: {
    label: "Unique",
    color: "hsl(var(--chart-2))",
  },
  nonUnique: {
    label: "Non-Unique",
    color: "hsl(var(--chart-1))",
  },
}

export default function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Over Time Chart */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">OVER TIME</h3>
        <div className="h-64">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.chartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="nonUnique" stackId="a" fill="var(--color-nonUnique)" />
                <Bar dataKey="unique" stackId="a" fill="var(--color-unique)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Operating System */}
      <Card>
        <CardHeader>
          <CardTitle>OPERATING SYSTEM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>OS</span>
              <div className="flex items-center gap-8">
                <span>SCANS</span>
                <span>%</span>
              </div>
            </div>
            {analytics.osBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.os}</span>
                <div className="flex items-center gap-8">
                  <span className="text-sm">{item.scans}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Countries */}
      <Card>
        <CardHeader>
          <CardTitle>TOP COUNTRIES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>#</span>
              <span>COUNTRY</span>
              <div className="flex items-center gap-8">
                <span>SCANS</span>
                <span>%</span>
              </div>
            </div>
            {analytics.topCountries.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{index + 1}</span>
                <span className="text-sm flex-1">{item.country}</span>
                <div className="flex items-center gap-8">
                  <span className="text-sm">{item.scans}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Cities */}
      <Card>
        <CardHeader>
          <CardTitle>TOP CITIES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>#</span>
              <span>CITY</span>
              <div className="flex items-center gap-8">
                <span>SCANS</span>
                <span>%</span>
              </div>
            </div>
            {analytics.topCities.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{index + 1}</span>
                <span className="text-sm flex-1">{item.city}</span>
                <div className="flex items-center gap-8">
                  <span className="text-sm">{item.scans}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
