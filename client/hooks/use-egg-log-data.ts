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

  // Load data from cloud service on mount
  useEffect(() => {
    const loadCloudData = async () => {
      try {
        console.log("☁️ Loading data from cloud...");

        // Load entries and goals from cloud
        const [cloudEntries, cloudGoals] = await Promise.all([
          cloudDataService.getEggLogs(),
          cloudDataService.getGoalSettings(),
        ]);

        setEntries(cloudEntries);

        if (cloudGoals.weeklyGoalGrams > 0) {
          setGoalSettings({
            weeklyGoalGrams: cloudGoals.weeklyGoalGrams,
            weeklyGoalEggs: cloudGoals.weeklyGoalEggs,
            isActive: cloudGoals.weeklyGoalGrams > 0,
          });
        } else {
          // Set a default weekly goal if none exists
          const defaultGoal: GoalSettings = {
            weeklyGoalGrams: 15,
            weeklyGoalEggs: 9750,
            isActive: true,
          };
          setGoalSettings(defaultGoal);
          await cloudDataService.updateGoalSettings(15);
        }

        console.log("☁️ Cloud data loaded successfully");
      } catch (error) {
        console.error("❌ Error loading cloud data:", error);

        // Fallback to localStorage if cloud fails
        try {
          const savedEntries = localStorage.getItem(STORAGE_KEY);
          const savedGoals = localStorage.getItem(GOAL_STORAGE_KEY);

          if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
          }
          if (savedGoals) {
            setGoalSettings(JSON.parse(savedGoals));
          }
        } catch (localError) {
          console.error("❌ Fallback to localStorage also failed:", localError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCloudData();

    // Subscribe to real-time updates
    const unsubscribe = cloudDataService.subscribe(() => {
      console.log("🔄 Real-time update received, refreshing data...");
      loadCloudData();
    });

    return unsubscribe;
  }, []);

  // Keep localStorage as backup sync
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goalSettings));
    }
  }, [goalSettings, isLoading]);

  // Add new entry
  const addEntry = useCallback(
    async (entryData: Omit<EggLogEntry, "id" | "createdAt">) => {
      try {
        console.log("☁️ Adding entry to cloud...", entryData);

        // Add to cloud first
        const newEntry = await cloudDataService.addEggLog(entryData);

        // Update local state
        setEntries((prev) => {
          const updated = [...prev, newEntry];
          console.log("✅ Entry added successfully:", newEntry);
          console.log("📊 Total entries now:", updated.length);
          return updated;
        });

        return newEntry;
      } catch (error) {
        console.error("❌ Failed to add entry to cloud:", error);

        // Fallback to local-only if cloud fails
        const newEntry: EggLogEntry = {
          ...entryData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };

        setEntries((prev) => [...prev, newEntry]);
        throw error; // Re-throw to handle in UI
      }
    },
    [],
  );

  // Update goal
  const updateGoal = useCallback(async (weeklyGoalGrams: number) => {
    try {
      console.log("☁️ Updating goal in cloud...", weeklyGoalGrams);

      // Update in cloud first
      const cloudGoal =
        await cloudDataService.updateGoalSettings(weeklyGoalGrams);

      // Update local state
      const newGoal: GoalSettings = {
        weeklyGoalGrams: cloudGoal.weeklyGoalGrams,
        weeklyGoalEggs: cloudGoal.weeklyGoalEggs,
        isActive: weeklyGoalGrams > 0,
      };

      setGoalSettings(newGoal);
      console.log("✅ Goal updated successfully:", newGoal);
      return newGoal;
    } catch (error) {
      console.error("❌ Failed to update goal in cloud:", error);

      // Fallback to local-only
      const newGoal: GoalSettings = {
        weeklyGoalGrams,
        weeklyGoalEggs: Math.round(weeklyGoalGrams * 650),
        isActive: weeklyGoalGrams > 0,
      };
      setGoalSettings(newGoal);
      throw error;
    }
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
  const editEntry = useCallback(async (updatedEntry: EggLogEntry) => {
    try {
      console.log("☁️ Updating entry in cloud...", updatedEntry);

      // Update in cloud first
      await cloudDataService.updateEggLog(updatedEntry);

      // Update local state
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === updatedEntry.id ? updatedEntry : entry,
        ),
      );
      console.log("✅ Entry updated successfully:", updatedEntry);
    } catch (error) {
      console.error("❌ Failed to update entry in cloud:", error);
      throw error;
    }
  }, []);

  // Delete entry
  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        const entryToDelete = entries.find((entry) => entry.id === id);
        if (!entryToDelete) return;

        console.log("☁️ Deleting entry from cloud...", id);

        // Delete from cloud first
        await cloudDataService.deleteEggLog(id);

        // Update local state
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        console.log("✅ Entry deleted successfully:", entryToDelete);
      } catch (error) {
        console.error("❌ Failed to delete entry from cloud:", error);
        throw error;
      }
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
