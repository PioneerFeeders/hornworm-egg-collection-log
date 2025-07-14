import { supabase, TABLES, mapEggLogFromDB, mapEggLogToDB } from "./supabase";
import { EggLogEntry } from "@shared/api";
import { generateId } from "./waxworm-utils";

// For demo purposes, we'll simulate the cloud database
// In a real implementation, this would connect to your actual Supabase instance

class CloudDataService {
  private mockData: EggLogEntry[] = [];
  private mockGoalSettings = { weeklyGoalGrams: 0, weeklyGoalEggs: 0 };
  private subscribers: Array<() => void> = [];

  // Simulate cloud storage with localStorage as fallback for demo
  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem("hornworm-cloud-data");
      if (stored) {
        const data = JSON.parse(stored);
        this.mockData = data.entries || [];
        this.mockGoalSettings = data.goalSettings || {
          weeklyGoalGrams: 0,
          weeklyGoalEggs: 0,
        };
      }
    } catch (error) {
      console.warn("Failed to load cloud data:", error);
    }
  }

  private saveToLocalStorage() {
    try {
      const data = {
        entries: this.mockData,
        goalSettings: this.mockGoalSettings,
        lastSync: new Date().toISOString(),
      };
      localStorage.setItem("hornworm-cloud-data", JSON.stringify(data));

      // Notify all subscribers of data change
      this.subscribers.forEach((callback) => callback());
    } catch (error) {
      console.warn("Failed to save cloud data:", error);
    }
  }

  // Subscribe to data changes for real-time updates
  subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  // Egg log operations
  async getEggLogs(): Promise<EggLogEntry[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...this.mockData];
  }

  async addEggLog(
    entry: Omit<EggLogEntry, "id" | "createdAt">,
  ): Promise<EggLogEntry> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newEntry: EggLogEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    // Check for duplicates
    const duplicate = this.mockData.find(
      (existing) =>
        Math.abs(
          new Date(existing.createdAt).getTime() -
            new Date(newEntry.createdAt).getTime(),
        ) < 1000 &&
        existing.gramsLogged === newEntry.gramsLogged &&
        existing.date.split("T")[0] === newEntry.date.split("T")[0],
    );

    if (duplicate) {
      throw new Error("Duplicate entry detected");
    }

    this.mockData.push(newEntry);
    this.saveToLocalStorage();

    console.log("☁️ Added to cloud:", newEntry);
    return newEntry;
  }

  async updateEggLog(entry: EggLogEntry): Promise<EggLogEntry> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const index = this.mockData.findIndex((e) => e.id === entry.id);
    if (index === -1) {
      throw new Error("Entry not found");
    }

    this.mockData[index] = entry;
    this.saveToLocalStorage();

    console.log("☁️ Updated in cloud:", entry);
    return entry;
  }

  async deleteEggLog(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.mockData = this.mockData.filter((e) => e.id !== id);
    this.saveToLocalStorage();

    console.log("☁️ Deleted from cloud:", id);
  }

  // Goal settings operations
  async getGoalSettings() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...this.mockGoalSettings };
  }

  async updateGoalSettings(goalGrams: number) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.mockGoalSettings = {
      weeklyGoalGrams: goalGrams,
      weeklyGoalEggs: Math.round(goalGrams * 650), // 1g = 650 eggs
    };

    this.saveToLocalStorage();
    console.log("☁️ Updated goal in cloud:", this.mockGoalSettings);
    return this.mockGoalSettings;
  }

  // Sync status
  async getLastSyncTime(): Promise<string | null> {
    try {
      const stored = localStorage.getItem("hornworm-cloud-data");
      if (stored) {
        const data = JSON.parse(stored);
        return data.lastSync || null;
      }
    } catch (error) {
      console.warn("Failed to get last sync time:", error);
    }
    return null;
  }
}

// Export singleton instance
export const cloudDataService = new CloudDataService();

// For development: expose to window for debugging
if (typeof window !== "undefined") {
  (window as any).cloudDataService = cloudDataService;
}
