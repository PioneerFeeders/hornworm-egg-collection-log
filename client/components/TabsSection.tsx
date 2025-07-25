import React, { useState } from "react";
import { Target, TrendingUp, History, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalSetting } from "@/components/GoalSetting";
import { TrendsChart } from "@/components/TrendsChart";
import { RecentEntries } from "@/components/RecentEntries";
import { EggHarvestSchedule } from "@/components/EggHarvestSchedule";
import { TrendData, EggLogEntry } from "@shared/api";
import { cn } from "@/lib/utils";

interface TabsSectionProps {
  currentGoal: number;
  onSaveGoal: (goalGrams: number) => void;
  trendData: TrendData[];
  entries: EggLogEntry[];
  onEditEntry: (entry: EggLogEntry) => void;
  onDeleteEntry: (id: string) => void;
  isLoading?: boolean;
}

export function TabsSection({
  currentGoal,
  onSaveGoal,
  trendData,
  entries,
  onEditEntry,
  onDeleteEntry,
  isLoading = false,
}: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState<
    "goals" | "analytics" | "history" | "schedule"
  >("goals");

  return (
    <div className="w-full">
      {/* Custom Tab Navigation */}
      <div className="grid w-full grid-cols-4 bg-retro-100 border border-retro-200 rounded-lg p-1">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("goals")}
          className={cn(
            "flex items-center gap-1 h-10 rounded-md transition-all text-xs sm:text-sm",
            activeTab === "goals"
              ? "bg-gradient-to-r from-retro-500 to-retro-400 text-white shadow-md hover:from-retro-600 hover:to-retro-500"
              : "text-retro-700 hover:bg-retro-200 hover:text-retro-800",
          )}
        >
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Goals</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("analytics")}
          className={cn(
            "flex items-center gap-1 h-10 rounded-md transition-all text-xs sm:text-sm",
            activeTab === "analytics"
              ? "bg-gradient-to-r from-neon-500 to-neon-400 text-white shadow-md hover:from-neon-600 hover:to-neon-500"
              : "text-retro-700 hover:bg-retro-200 hover:text-retro-800",
          )}
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Charts</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex items-center gap-1 h-10 rounded-md transition-all text-xs sm:text-sm",
            activeTab === "history"
              ? "bg-gradient-to-r from-retro-500 to-retro-400 text-white shadow-md hover:from-retro-600 hover:to-retro-500"
              : "text-retro-700 hover:bg-retro-200 hover:text-retro-800",
          )}
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("schedule")}
          className={cn(
            "flex items-center gap-1 h-10 rounded-md transition-all text-xs sm:text-sm",
            activeTab === "schedule"
              ? "bg-gradient-to-r from-neon-500 to-neon-400 text-white shadow-md hover:from-neon-600 hover:to-neon-500"
              : "text-retro-700 hover:bg-retro-200 hover:text-retro-800",
          )}
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Schedule</span>
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "goals" && (
          <GoalSetting
            currentGoal={currentGoal}
            onSave={onSaveGoal}
            isLoading={isLoading}
          />
        )}

        {activeTab === "analytics" && (
          <TrendsChart data={trendData} isLoading={isLoading} />
        )}

        {activeTab === "history" && (
          <RecentEntries
            entries={entries}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
            isLoading={isLoading}
          />
        )}

        {activeTab === "schedule" && <EggHarvestSchedule />}
      </div>
    </div>
  );
}
