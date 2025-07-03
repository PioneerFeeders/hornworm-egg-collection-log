/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Waxworm egg logging types
 */
export interface EggLogEntry {
  id: string;
  date: string; // ISO date string
  gramsLogged: number;
  eggCount: number; // Calculated: grams * 650
  notes?: string;
  createdAt: string;
}

export interface WeeklyStats {
  weekStart: string; // ISO date string (Sunday)
  weekEnd: string; // ISO date string (Saturday)
  totalGrams: number;
  totalEggs: number;
  goalGrams: number;
  goalEggs: number;
  dailyEntries: EggLogEntry[];
  progressPercentage: number;
  isAhead: boolean;
  difference: number; // Difference from goal in grams
}

export interface TrendData {
  date: string;
  grams: number;
  eggs: number;
  cumulative: number;
}

export interface GoalSettings {
  weeklyGoalGrams: number;
  weeklyGoalEggs: number;
  isActive: boolean;
}

/**
 * API Request/Response types
 */
export interface LogEggRequest {
  date: string;
  gramsLogged: number;
  notes?: string;
}

export interface LogEggResponse {
  success: boolean;
  entry: EggLogEntry;
}

export interface GetWeeklyStatsRequest {
  weekStart: string;
}

export interface GetWeeklyStatsResponse {
  success: boolean;
  stats: WeeklyStats;
}

export interface GetTrendDataRequest {
  startDate: string;
  endDate: string;
}

export interface GetTrendDataResponse {
  success: boolean;
  trends: TrendData[];
}

export interface UpdateGoalRequest {
  weeklyGoalGrams: number;
}

export interface UpdateGoalResponse {
  success: boolean;
  goal: GoalSettings;
}

export interface GoogleSheetsExportResponse {
  success: boolean;
  message: string;
  sheetUrl?: string;
}
