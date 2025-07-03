import { useState, useEffect, useCallback } from "react";
import { subWeeks, addDays } from "date-fns";
import { EggLogEntry, WeeklyStats, TrendData, GoalSettings } from "@shared/api";
import {
  generateId,
  getWeekBounds,
  calculateWeeklyStats,
  generateTrendData,
} from "@/lib/waxworm-utils";

const STORAGE_KEY = "waxworm_egg_logs";
const GOAL_STORAGE_KEY = "waxworm_goals";

export function useEggLogData() {
  const [entries, setEntries] = useState<EggLogEntry[]>([]);
  const [goalSettings, setGoalSettings] = useState<GoalSettings>({
    weeklyGoalGrams: 0,
    weeklyGoalEggs: 0,
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem(STORAGE_KEY);
      const savedGoals = localStorage.getItem(GOAL_STORAGE_KEY);

      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
      } else {
        // Add some sample data for first-time users
        const sampleEntries: EggLogEntry[] = [
          {
            id: generateId(),
            date: new Date().toISOString(),
            gramsLogged: 2.5,
            eggCount: 1625,
            notes: "Morning collection",
            createdAt: new Date().toISOString(),
          },
          {
            id: generateId(),
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            gramsLogged: 3.2,
            eggCount: 2080,
            notes: "Good yield today",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        setEntries(sampleEntries);
      }

      if (savedGoals) {
        setGoalSettings(JSON.parse(savedGoals));
      } else {
        // Set a default weekly goal
        const defaultGoal: GoalSettings = {
          weeklyGoalGrams: 15,
          weeklyGoalEggs: 9750,
          isActive: true,
        };
        setGoalSettings(defaultGoal);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goalSettings));
    }
  }, [goalSettings, isLoading]);

  // Add new entry
  const addEntry = useCallback(
    (entryData: Omit<EggLogEntry, "id" | "createdAt">) => {
      const newEntry: EggLogEntry = {
        ...entryData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      setEntries((prev) => [...prev, newEntry]);
      return newEntry;
    },
    [],
  );

  // Update goal
  const updateGoal = useCallback((weeklyGoalGrams: number) => {
    const newGoal: GoalSettings = {
      weeklyGoalGrams,
      weeklyGoalEggs: Math.round(weeklyGoalGrams * 650),
      isActive: weeklyGoalGrams > 0,
    };

    setGoalSettings(newGoal);
    return newGoal;
  }, []);

  // Get current week stats
  const getCurrentWeekStats = useCallback((): WeeklyStats => {
    const { start } = getWeekBounds();
    return calculateWeeklyStats(entries, start, goalSettings.weeklyGoalGrams);
  }, [entries, goalSettings.weeklyGoalGrams]);

  // Get trend data for a specific period
  const getTrendData = useCallback(
    (weeks: number = 4): TrendData[] => {
      const endDate = new Date();
      const startDate = subWeeks(endDate, weeks);
      return generateTrendData(entries, startDate, endDate);
    },
    [entries],
  );

  // Get recent entries (last 10)
  const getRecentEntries = useCallback((): EggLogEntry[] => {
    return entries
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  }, [entries]);

  // Delete entry
  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  // Export data for Google Sheets
  const exportData = useCallback(() => {
    const exportEntries = entries.map((entry) => ({
      Date: entry.date.split("T")[0],
      "Grams Logged": entry.gramsLogged,
      "Egg Count": entry.eggCount,
      Notes: entry.notes || "",
      "Created At": entry.createdAt.split("T")[0],
    }));

    return exportEntries;
  }, [entries]);

  // Get total collections (all time)
  const getTotalCollections = useCallback(() => {
    const totalGrams = entries.reduce(
      (sum, entry) => sum + entry.gramsLogged,
      0,
    );
    const totalEggs = entries.reduce((sum, entry) => sum + entry.eggCount, 0);

    return {
      totalGrams: Number(totalGrams.toFixed(2)),
      totalEggs,
      entryCount: entries.length,
    };
  }, [entries]);

  return {
    // Data
    entries,
    goalSettings,
    isLoading,

    // Actions
    addEntry,
    updateGoal,
    deleteEntry,

    // Computed data
    getCurrentWeekStats,
    getTrendData,
    getRecentEntries,
    getTotalCollections,
    exportData,
  };
}
