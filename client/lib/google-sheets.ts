import { EggLogEntry } from "@shared/api";

/**
 * Simple Google Sheets integration using Google Forms
 * This approach works without API keys by using a Google Form that submits to a sheet
 */

export interface GoogleSheetsConfig {
  sheetUrl: string;
  sheetId: string;
}

/**
 * Extract sheet ID from Google Sheets URL
 */
export function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Create a CSV row from an entry
 */
export function formatEntryForSheet(entry: EggLogEntry): string {
  const date = new Date(entry.date).toLocaleDateString();
  const createdAt = new Date(entry.createdAt).toLocaleString();

  // Escape commas and quotes in notes
  const notes = entry.notes ? `"${entry.notes.replace(/"/g, '""')}"` : "";

  return [
    date,
    entry.gramsLogged.toString(),
    entry.eggCount.toString(),
    notes,
    createdAt,
    entry.id,
  ].join(",");
}

/**
 * Generate Google Sheets setup instructions
 */
export function getSetupInstructions(sheetId: string): string {
  return `
To enable automatic Google Sheets integration:

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/${sheetId}/edit
2. Add these headers in row 1: Date, Grams Logged, Egg Count, Notes, Created At, Entry ID
3. Make sure sharing is set to "Anyone with the link can edit"
4. For automatic sync, you'll need to set up Google Apps Script (advanced)

For now, you can manually copy-paste data from the CSV export feature.
  `.trim();
}

/**
 * Simple sync function that opens Google Sheets for manual entry
 */
export async function syncToGoogleSheets(
  config: GoogleSheetsConfig,
  entry: EggLogEntry,
  action: "CREATE" | "UPDATE" | "DELETE",
): Promise<boolean> {
  try {
    // For CREATE actions, format the data for easy copying
    if (action === "CREATE") {
      const csvRow = formatEntryForSheet(entry);

      // Store the formatted data in localStorage for the user to copy
      const pendingEntries = JSON.parse(
        localStorage.getItem("pending_sheets_sync") || "[]",
      );

      pendingEntries.push({
        entry,
        csvRow,
        timestamp: new Date().toISOString(),
      });

      localStorage.setItem(
        "pending_sheets_sync",
        JSON.stringify(pendingEntries),
      );

      console.log("Entry ready for Google Sheets:", csvRow);
      return true;
    }

    return true;
  } catch (error) {
    console.error("Error preparing data for Google Sheets:", error);
    return false;
  }
}

/**
 * Get pending entries that haven't been synced to Google Sheets
 */
export function getPendingEntries(): Array<{
  entry: EggLogEntry;
  csvRow: string;
  timestamp: string;
}> {
  try {
    return JSON.parse(localStorage.getItem("pending_sheets_sync") || "[]");
  } catch {
    return [];
  }
}

/**
 * Clear pending entries (call after manual sync)
 */
export function clearPendingEntries(): void {
  localStorage.removeItem("pending_sheets_sync");
}

/**
 * Generate a Google Apps Script for advanced users
 */
export function generateGoogleAppsScript(): string {
  return `
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 6).setValues([
      ["Date", "Grams Logged", "Egg Count", "Notes", "Created At", "Entry ID"]
    ]);
  }
  
  // Add the new entry
  var row = [
    new Date(data.date).toLocaleDateString(),
    data.gramsLogged,
    data.eggCount,
    data.notes || "",
    new Date(data.createdAt).toLocaleString(),
    data.id
  ];
  
  sheet.appendRow(row);
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
  `.trim();
}
