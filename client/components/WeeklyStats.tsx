import React from "react";
import { format, parseISO } from "date-fns";
import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WeeklyStats as WeeklyStatsType } from "@shared/api";
import { formatGrams, formatNumber } from "@/lib/waxworm-utils";
import { cn } from "@/lib/utils";

interface WeeklyStatsProps {
  stats: WeeklyStatsType;
  isLoading?: boolean;
}

export function WeeklyStats({ stats, isLoading = false }: WeeklyStatsProps) {
  if (isLoading) {
    return (
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const weekStartDate = format(parseISO(stats.weekStart), "MMM d");
  const weekEndDate = format(parseISO(stats.weekEnd), "MMM d, yyyy");

  return (
    <Card className="border-emerald-200 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-emerald-800 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          This Week
          <Badge variant="outline" className="text-xs ml-auto">
            {weekStartDate} - {weekEndDate}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-700">
              Goal Progress
            </span>
            <span className="text-sm text-gray-600">
              {stats.progressPercentage}%
            </span>
          </div>
          <Progress
            value={Math.min(stats.progressPercentage, 100)}
            className="h-3"
          />
          <div className="flex items-center gap-2">
            {stats.isAhead ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-orange-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                stats.isAhead ? "text-emerald-600" : "text-orange-500",
              )}
            >
              {stats.isAhead ? "Ahead" : "Behind"} by{" "}
              {formatGrams(stats.difference)}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Collected</p>
            <p className="text-2xl font-bold text-emerald-800">
              {formatGrams(stats.totalGrams)}
            </p>
            <p className="text-xs text-gray-500">
              {formatNumber(stats.totalEggs)} eggs
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Goal
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {formatGrams(stats.goalGrams)}
            </p>
            <p className="text-xs text-gray-500">
              {formatNumber(stats.goalEggs)} eggs
            </p>
          </div>
        </div>

        {/* Daily Breakdown */}
        {stats.dailyEntries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-emerald-700">
              Recent Collections
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {stats.dailyEntries
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 5)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <span className="text-gray-600">
                      {format(parseISO(entry.date), "MMM d")}
                    </span>
                    <span className="font-medium text-emerald-700">
                      {formatGrams(entry.gramsLogged)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {stats.dailyEntries.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No collections recorded this week</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
