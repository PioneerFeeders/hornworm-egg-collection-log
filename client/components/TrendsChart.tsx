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
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
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
      <Card className="border-emerald-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
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
        <div className="bg-white p-3 border border-emerald-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-emerald-800">{label}</p>
          <p className="text-sm text-emerald-600">
            Daily: {formatGrams(data.grams)}
          </p>
          <p className="text-sm text-emerald-600">
            Cumulative: {formatGrams(data.cumulative)}
          </p>
          <p className="text-xs text-gray-500">
            {data.eggs.toLocaleString()} eggs
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-emerald-200 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-emerald-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Collection Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12, fill: "#059669" }}
                axisLine={{ stroke: "#10b981" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#059669" }}
                axisLine={{ stroke: "#10b981" }}
                tickFormatter={(value) => `${value}g`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="grams"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#34d399"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-500"></div>
            <span className="text-gray-600">Daily Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-400 border-dashed"></div>
            <span className="text-gray-600">Cumulative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
