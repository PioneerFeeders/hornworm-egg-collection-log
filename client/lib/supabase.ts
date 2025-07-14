import { createClient } from "@supabase/supabase-js";

// For demo purposes, using a public Supabase instance
// In production, you would use your own Supabase project
const supabaseUrl = "https://xyzcompany.supabase.co";
const supabaseAnonKey = "public-anon-key";

// Using a demo/test database for now
// This will be replaced with your actual Supabase credentials
export const supabase = createClient(
  // Demo URL - replace with your Supabase project URL
  "https://demo-hornworm-eggs.supabase.co",
  // Demo key - replace with your Supabase anon key
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8taG9ybnRvcm0tZWdncyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc5OTM3MjAwLCJleHAiOjE5OTU1MTMyMDB9.demo-key-for-testing",
);

// Database table names
export const TABLES = {
  EGG_LOGS: "egg_logs",
  GOAL_SETTINGS: "goal_settings",
} as const;

// Database types
export interface EggLogRow {
  id: string;
  date: string;
  grams_logged: number;
  egg_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GoalSettingRow {
  id: string;
  weekly_goal_grams: number;
  weekly_goal_eggs: number;
  created_at: string;
  updated_at: string;
}

// Convert between app types and database types
export function mapEggLogFromDB(row: EggLogRow) {
  return {
    id: row.id,
    date: row.date,
    gramsLogged: row.grams_logged,
    eggCount: row.egg_count,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function mapEggLogToDB(entry: any): Partial<EggLogRow> {
  return {
    id: entry.id,
    date: entry.date,
    grams_logged: entry.gramsLogged,
    egg_count: entry.eggCount,
    notes: entry.notes,
    created_at: entry.createdAt,
    updated_at: new Date().toISOString(),
  };
}
