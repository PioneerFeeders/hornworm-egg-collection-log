import { useState, useEffect, useCallback } from "react";
import { subWeeks, addDays } from "date-fns";
import { EggLogEntry, WeeklyStats, TrendData, GoalSettings } from "@shared/api";
import {
  generateId,
  getWeekBounds,
  calculateWeeklyStats,
  generateTrendData,
} from "@/lib/waxworm-utils";
import { cloudDataService } from "@/lib/cloud-data-service";

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
        // Initialize with empty array for first-time users
        setEntries([]);
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

      setEntries((prev) => {
        // Check for potential duplicates (same date and grams within 1 second)
        const recentDuplicate = prev.find(
          (entry) =>
            Math.abs(
              new Date(entry.createdAt).getTime() -
                new Date(newEntry.createdAt).getTime(),
            ) < 1000 &&
            entry.gramsLogged === newEntry.gramsLogged &&
            entry.date.split("T")[0] === newEntry.date.split("T")[0],
        );

        if (recentDuplicate) {
          console.warn(
            "⚠️ Potential duplicate entry detected, skipping:",
            newEntry,
          );
          return prev;
        }

        const updated = [...prev, newEntry];
        console.log("✅ Entry added successfully:", newEntry);
        console.log("📊 Total entries now:", updated.length);
        return updated;
      });

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

  // Edit entry
  const editEntry = useCallback((updatedEntry: EggLogEntry) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      ),
    );
    console.log("✅ Entry updated successfully:", updatedEntry);
  }, []);

  // Delete entry
  const deleteEntry = useCallback(
    (id: string) => {
      const entryToDelete = entries.find((entry) => entry.id === id);
      if (!entryToDelete) return;

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      console.log("✅ Entry deleted successfully:", entryToDelete);
    },
    [entries],
  );

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
    editEntry,
    deleteEntry,

    // Computed data
    getCurrentWeekStats,
    getTrendData,
    getRecentEntries,
    getTotalCollections,
    exportData,
  };
}
