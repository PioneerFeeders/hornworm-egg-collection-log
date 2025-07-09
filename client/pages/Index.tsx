import React from "react";
import {
  Bug,
  TrendingUp,
  Calendar,
  Target,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EggLogForm } from "@/components/EggLogForm";
import { WeeklyStats } from "@/components/WeeklyStats";
import { TabsSection } from "@/components/TabsSection";
import { NetlifyForms } from "@/components/NetlifyForms";
import { useEggLogData } from "@/hooks/use-egg-log-data";
import { formatNumber, formatGrams } from "@/lib/waxworm-utils";

export default function Index() {
  const {
    isLoading,
    entries,
    addEntry,
    updateGoal,
    editEntry,
    deleteEntry,
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
      <div className="min-h-screen bg-gradient-to-br from-retro-50 via-white to-neon-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-retro-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-retro-600 font-medium">Loading your egg logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-50 via-white to-neon-50">
      <NetlifyForms />
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-retro-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-retro-600 to-retro-500 rounded-xl shadow-lg">
                <Bug className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-retro-800 to-retro-600 bg-clip-text text-transparent">
                  Hornworm Egg Logger
                </h1>
                <p className="text-sm text-retro-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Track your collections with style
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-retro-50 text-retro-700 border-retro-300"
              >
                {totalStats.entryCount} collections
              </Badge>
              <Button
                onClick={handleExportToGoogleSheets}
                variant="outline"
                size="sm"
                className="border-retro-200 text-retro-700 hover:bg-retro-50 hover:border-retro-300"
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
        {/* Collection Form - Moved to Top */}
        <div className="mb-8">
          <EggLogForm onSubmit={addEntry} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm border-retro-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-retro-700 text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Total Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-retro-800 to-retro-600 bg-clip-text text-transparent">
                  {formatGrams(totalStats.totalGrams)}
                </p>
                <p className="text-sm text-retro-600">
                  {formatNumber(totalStats.totalEggs)} eggs total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-neon-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-neon-700 text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-neon-800 to-neon-600 bg-clip-text text-transparent">
                  {goalSettings.weeklyGoalGrams > 0
                    ? formatGrams(goalSettings.weeklyGoalGrams)
                    : "Not Set"}
                </p>
                {goalSettings.weeklyGoalGrams > 0 && (
                  <p className="text-sm text-neon-600">
                    {formatNumber(goalSettings.weeklyGoalEggs)} eggs weekly
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-retro-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-retro-700 text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-retro-800 to-retro-600 bg-clip-text text-transparent">
                  {formatGrams(currentWeekStats.totalGrams)}
                </p>
                <p className="text-sm text-retro-600">
                  {currentWeekStats.progressPercentage}% of goal
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Weekly Stats */}
          <div>
            <WeeklyStats stats={currentWeekStats} />
          </div>

          {/* Right Column - Tabs (Goals, Analytics, History) */}
          <div>
            <TabsSection
              currentGoal={goalSettings.weeklyGoalGrams}
              onSaveGoal={updateGoal}
              trendData={trendData}
              entries={entries}
              onEditEntry={editEntry}
              onDeleteEntry={deleteEntry}
            />
          </div>
        </div>

        {/* Footer */}
        <Separator className="my-12 bg-gradient-to-r from-retro-200 via-neon-200 to-retro-200" />
        <footer className="text-center text-sm text-retro-600">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-retro-400" />
            Waxworm Egg Logger - Tracking collections with retro style
            <Sparkles className="h-4 w-4 text-neon-400" />
          </p>
          <p className="mt-2 text-xs text-retro-500">
            1 gram = 650 eggs • Data stored locally in your browser • Built with
            ❤️
          </p>
        </footer>
      </main>
    </div>
  );
}
