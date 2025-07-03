import React from "react";
import { Bug, TrendingUp, Calendar, Target, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EggLogForm } from "@/components/EggLogForm";
import { WeeklyStats } from "@/components/WeeklyStats";
import { GoalSetting } from "@/components/GoalSetting";
import { TrendsChart } from "@/components/TrendsChart";
import { useEggLogData } from "@/hooks/use-egg-log-data";
import { formatNumber, formatGrams } from "@/lib/waxworm-utils";

export default function Index() {
  const {
    isLoading,
    addEntry,
    updateGoal,
    getCurrentWeekStats,
    getTrendData,
    getTotalCollections,
    goalSettings,
    exportData,
  } = useEggLogData();

  const currentWeekStats = getCurrentWeekStats();
  const trendData = getTrendData(8); // Last 8 weeks
  const totalStats = getTotalCollections();

  const handleExportToGoogleSheets = async () => {
    try {
      const data = exportData();
      // TODO: Implement Google Sheets API integration
      console.log("Export data:", data);

      // For now, download as CSV
      const csvContent = [
        ["Date", "Grams Logged", "Egg Count", "Notes", "Created At"],
        ...data.map((row) => [
          row.Date,
          row["Grams Logged"],
          row["Egg Count"],
          row.Notes,
          row["Created At"],
        ]),
      ]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waxworm-eggs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading your egg logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Bug className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-800">
                  Waxworm Egg Logger
                </h1>
                <p className="text-sm text-emerald-600">
                  Track your egg collections and goals
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700"
              >
                {totalStats.entryCount} collections
              </Badge>
              <Button
                onClick={handleExportToGoogleSheets}
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-700 text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Total Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-emerald-800">
                  {formatGrams(totalStats.totalGrams)}
                </p>
                <p className="text-sm text-emerald-600">
                  {formatNumber(totalStats.totalEggs)} eggs total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-700 text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-emerald-800">
                  {goalSettings.weeklyGoalGrams > 0
                    ? formatGrams(goalSettings.weeklyGoalGrams)
                    : "Not Set"}
                </p>
                {goalSettings.weeklyGoalGrams > 0 && (
                  <p className="text-sm text-emerald-600">
                    {formatNumber(goalSettings.weeklyGoalEggs)} eggs weekly
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-700 text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-emerald-800">
                  {formatGrams(currentWeekStats.totalGrams)}
                </p>
                <p className="text-sm text-emerald-600">
                  {currentWeekStats.progressPercentage}% of goal
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            <EggLogForm onSubmit={addEntry} />
            <GoalSetting
              currentGoal={goalSettings.weeklyGoalGrams}
              onSave={updateGoal}
            />
          </div>

          {/* Middle Column - Weekly Stats */}
          <div>
            <WeeklyStats stats={currentWeekStats} />
          </div>

          {/* Right Column - Trends */}
          <div>
            <TrendsChart data={trendData} />
          </div>
        </div>

        {/* Footer */}
        <Separator className="my-12 bg-emerald-200" />
        <footer className="text-center text-sm text-emerald-600">
          <p>Waxworm Egg Logger - Tracking your collections with precision</p>
          <p className="mt-1 text-xs text-emerald-500">
            1 gram = 650 eggs • Data stored locally in your browser
          </p>
        </footer>
      </main>
    </div>
  );
}
