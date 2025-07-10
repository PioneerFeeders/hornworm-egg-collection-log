import React from "react";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendData } from "@shared/api";
import { formatGrams } from "@/lib/waxworm-utils";

interface TrendsChartProps {
  data: TrendData[];
  isLoading?: boolean;
}

export function TrendsChart({ data, isLoading = false }: TrendsChartProps) {
  if (isLoading) {
    return (
      <Card className="border-retro-200">
        <CardHeader>
          <CardTitle className="text-retro-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Collection Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-retro-200 shadow-lg bg-gradient-to-br from-white to-retro-50">
        <CardHeader>
          <CardTitle className="text-retro-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Collection Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No trend data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM d"),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-retro-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-retro-800">{label}</p>
          <p className="text-sm text-retro-600">
            Daily: {formatGrams(data.grams)}
          </p>
          <p className="text-sm text-neon-600">
            Cumulative: {formatGrams(data.cumulative)}
          </p>
          <p className="text-xs text-retro-500">
            {data.eggs.toLocaleString()} eggs
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-retro-200 shadow-lg bg-gradient-to-br from-white to-retro-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-retro-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Collection Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0b4d6" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12, fill: "#7c2d92" }}
                axisLine={{ stroke: "#a855f7" }}
                tickLine={true}
                orientation="bottom"
                type="category"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#7c2d92" }}
                axisLine={{ stroke: "#a855f7" }}
                tickFormatter={(value) => `${value}g`}
                tickLine={true}
                orientation="left"
                type="number"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="grams"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: "#7c2d92", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#7c2d92", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#0ea5e9"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-retro-500"></div>
            <span className="text-retro-600">Daily Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-neon-500 border-dashed"></div>
            <span className="text-retro-600">Cumulative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
