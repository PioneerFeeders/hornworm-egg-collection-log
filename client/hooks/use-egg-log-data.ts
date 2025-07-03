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
const SHEETS_CONFIG_KEY = "google_sheets_config";

export function useEggLogData() {
  const [entries, setEntries] = useState<EggLogEntry[]>([]);
  const [goalSettings, setGoalSettings] = useState<GoalSettings>({
    weeklyGoalGrams: 0,
    weeklyGoalEggs: 0,
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<{
    isConnected: boolean;
    sheetUrl?: string;
    webhookUrl?: string;
  }>({
    isConnected: false,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem(STORAGE_KEY);
      const savedGoals = localStorage.getItem(GOAL_STORAGE_KEY);
      const savedSheetsConfig = localStorage.getItem(SHEETS_CONFIG_KEY);

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

      if (savedSheetsConfig) {
        setGoogleSheetsConfig(JSON.parse(savedSheetsConfig));
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

  // Save Google Sheets config to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(
        SHEETS_CONFIG_KEY,
        JSON.stringify(googleSheetsConfig),
      );
    }
  }, [googleSheetsConfig, isLoading]);

  // Sync entry to Google Sheets
  const syncToGoogleSheets = useCallback(
    async (entry: EggLogEntry, action: "CREATE" | "UPDATE" | "DELETE") => {
      if (!googleSheetsConfig.isConnected || !googleSheetsConfig.webhookUrl) {
        return;
      }

      try {
        // Use automatic Google Sheets integration
        const { syncToGoogleSheetsAuto } = await import(
          "@/lib/google-sheets-auto"
        );

        const result = await syncToGoogleSheetsAuto(
          {
            sheetUrl: googleSheetsConfig.sheetUrl || "",
            webhookUrl: googleSheetsConfig.webhookUrl,
          },
          entry,
          action,
        );

        if (result.success) {
          console.log(`✅ ${result.message}`);
        } else {
          console.error(`❌ ${result.message}`);
        }
      } catch (error) {
        console.error("Error syncing to Google Sheets:", error);
      }
    },
    [googleSheetsConfig],
  );

  // Add new entry
  const addEntry = useCallback(
    async (entryData: Omit<EggLogEntry, "id" | "createdAt">) => {
      const newEntry: EggLogEntry = {
        ...entryData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      setEntries((prev) => [...prev, newEntry]);

      // Sync to Google Sheets
      await syncToGoogleSheets(newEntry, "CREATE");

      return newEntry;
    },
    [syncToGoogleSheets],
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
  const editEntry = useCallback(
    async (updatedEntry: EggLogEntry) => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === updatedEntry.id ? updatedEntry : entry,
        ),
      );

      // Sync to Google Sheets
      await syncToGoogleSheets(updatedEntry, "UPDATE");
    },
    [syncToGoogleSheets],
  );

  // Delete entry
  const deleteEntry = useCallback(
    async (id: string) => {
      const entryToDelete = entries.find((entry) => entry.id === id);
      if (!entryToDelete) return;

      setEntries((prev) => prev.filter((entry) => entry.id !== id));

      // Sync to Google Sheets
      await syncToGoogleSheets(entryToDelete, "DELETE");
    },
    [entries, syncToGoogleSheets],
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

  // Connect to Google Sheets
  const connectGoogleSheets = useCallback(
    async (sheetUrl: string, webhookUrl: string) => {
      try {
        // Test webhook connection
        const { testWebhookConnection } = await import(
          "@/lib/google-sheets-auto"
        );

        const webhookWorks = await testWebhookConnection(webhookUrl);
        if (!webhookWorks) {
          console.error("Webhook test failed");
          return false;
        }

        setGoogleSheetsConfig({
          isConnected: true,
          sheetUrl,
          webhookUrl,
        });

        console.log("✅ Google Sheets automatic sync connected successfully!");
        return true;
      } catch (error) {
        console.error("Error connecting to Google Sheets:", error);
        return false;
      }
    },
    [],
  );

  // Disconnect from Google Sheets
  const disconnectGoogleSheets = useCallback(() => {
    setGoogleSheetsConfig({
      isConnected: false,
    });
  }, []);

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
    googleSheetsConfig,
    isLoading,

    // Actions
    addEntry,
    updateGoal,
    editEntry,
    deleteEntry,
    connectGoogleSheets,
    disconnectGoogleSheets,

    // Computed data
    getCurrentWeekStats,
    getTrendData,
    getRecentEntries,
    getTotalCollections,
    exportData,
  };
}
