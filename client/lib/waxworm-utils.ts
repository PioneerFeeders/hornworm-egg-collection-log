import {
  startOfWeek,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { EggLogEntry, WeeklyStats, TrendData } from "@shared/api";

/**
 * Constants
 */
export const EGGS_PER_GRAM = 650;

/**
 * Convert grams to egg count
 */
export function gramsToEggs(grams: number): number {
  return Math.round(grams * EGGS_PER_GRAM);
}

/**
 * Convert egg count to grams
 */
export function eggsToGrams(eggs: number): number {
  return Number((eggs / EGGS_PER_GRAM).toFixed(3));
}

/**
 * Get the start and end of week (Sunday to Saturday)
 */
export function getWeekBounds(date: Date = new Date()) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  return {
    start: weekStart,
    end: weekEnd,
    startISO: weekStart.toISOString(),
    endISO: weekEnd.toISOString(),
  };
}

/**
 * Check if a date is in the current week
 */
export function isInCurrentWeek(date: string | Date): boolean {
  const checkDate = typeof date === "string" ? parseISO(date) : date;
  const { start, end } = getWeekBounds();

  return isWithinInterval(checkDate, { start, end });
}

/**
 * Calculate weekly statistics from entries
 */
export function calculateWeeklyStats(
  entries: EggLogEntry[],
  weekStart: Date,
  goalGrams: number = 0,
): WeeklyStats {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

  // Filter entries for this week
  const weekEntries = entries.filter((entry) => {
    const entryDate = parseISO(entry.date);
    return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
  });

  const totalGrams = weekEntries.reduce(
    (sum, entry) => sum + entry.gramsLogged,
    0,
  );
  const totalEggs = gramsToEggs(totalGrams);
  const goalEggs = gramsToEggs(goalGrams);

  const progressPercentage = goalGrams > 0 ? (totalGrams / goalGrams) * 100 : 0;
  const difference = totalGrams - goalGrams;
  const isAhead = difference >= 0;

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    totalGrams: Number(totalGrams.toFixed(2)),
    totalEggs,
    goalGrams,
    goalEggs,
    dailyEntries: weekEntries,
    progressPercentage: Number(progressPercentage.toFixed(1)),
    isAhead,
    difference: Number(Math.abs(difference).toFixed(2)),
  };
}

/**
 * Generate trend data from entries
 */
export function generateTrendData(
  entries: EggLogEntry[],
  startDate: Date,
  endDate: Date,
): TrendData[] {
  const filtered = entries.filter((entry) => {
    const entryDate = parseISO(entry.date);
    return isWithinInterval(entryDate, { start: startDate, end: endDate });
  });

  // Group by date and sum
  const dailyTotals = new Map<string, { grams: number; eggs: number }>();

  filtered.forEach((entry) => {
    const dateKey = format(parseISO(entry.date), "yyyy-MM-dd");
    const existing = dailyTotals.get(dateKey) || { grams: 0, eggs: 0 };
    dailyTotals.set(dateKey, {
      grams: existing.grams + entry.gramsLogged,
      eggs: existing.eggs + entry.eggCount,
    });
  });

  // Convert to trend data with cumulative totals
  let cumulative = 0;
  const trends: TrendData[] = [];

  Array.from(dailyTotals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, totals]) => {
      cumulative += totals.grams;
      trends.push({
        date,
        grams: Number(totals.grams.toFixed(2)),
        eggs: totals.eggs,
        cumulative: Number(cumulative.toFixed(2)),
      });
    });

  return trends;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Format grams display
 */
export function formatGrams(grams: number): string {
  return `${grams.toFixed(2)}g`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
