import { EggLogEntry } from "@shared/api";

/**
 * Automatic Google Sheets integration using Google Apps Script webhook
 */

export interface GoogleAppsScriptConfig {
  webhookUrl: string;
  sheetUrl: string;
}

/**
 * Set up Google Apps Script for automatic sync
 */
export function getGoogleAppsScriptCode(): string {
  return `
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    console.log('Received data:', data);
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 6).setValues([
        ["Date", "Grams Logged", "Egg Count", "Notes", "Created At", "Entry ID"]
      ]);
    }
    
    if (data.action === "CREATE") {
      // Add new entry
      var date = new Date(data.entry.date);
      var createdAt = new Date(data.entry.createdAt);
      
      var row = [
        Utilities.formatDate(date, Session.getScriptTimeZone(), "MM/dd/yyyy"),
        data.entry.gramsLogged,
        data.entry.eggCount,
        data.entry.notes || "",
        Utilities.formatDate(createdAt, Session.getScriptTimeZone(), "MM/dd/yyyy HH:mm:ss"),
        data.entry.id
      ];
      
      sheet.appendRow(row);
      
    } else if (data.action === "UPDATE") {
      // Find and update existing entry
      var dataRange = sheet.getDataRange();
      var values = dataRange.getValues();
      
      for (var i = 1; i < values.length; i++) { // Start from 1 to skip header
        if (values[i][5] === data.entry.id) { // Column F has entry ID
          var date = new Date(data.entry.date);
          var createdAt = new Date(data.entry.createdAt);
          
          sheet.getRange(i + 1, 1, 1, 6).setValues([[
            Utilities.formatDate(date, Session.getScriptTimeZone(), "MM/dd/yyyy"),
            data.entry.gramsLogged,
            data.entry.eggCount,
            data.entry.notes || "",
            Utilities.formatDate(createdAt, Session.getScriptTimeZone(), "MM/dd/yyyy HH:mm:ss"),
            data.entry.id
          ]]);
          break;
        }
      }
      
    } else if (data.action === "DELETE") {
      // Find and delete entry
      var dataRange = sheet.getDataRange();
      var values = dataRange.getValues();
      
      for (var i = 1; i < values.length; i++) { // Start from 1 to skip header
        if (values[i][5] === data.entry.id) { // Column F has entry ID
          sheet.deleteRow(i + 1);
          break;
        }
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: "Entry processed successfully"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({message: "Hornworm Egg Logger webhook is active"}))
    .setMimeType(ContentService.MimeType.JSON);
}
`.trim();
}

/**
 * Automatically sync entry to Google Sheets via Apps Script webhook
 */
export async function syncToGoogleSheetsAuto(
  config: GoogleAppsScriptConfig,
  entry: EggLogEntry,
  action: "CREATE" | "UPDATE" | "DELETE",
): Promise<{ success: boolean; message: string }> {
  try {
    if (!config.webhookUrl) {
      throw new Error("No webhook URL configured");
    }

    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        entry,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: `Entry ${action.toLowerCase()}d successfully in Google Sheets`,
      };
    } else {
      throw new Error(result.error || "Unknown error from Google Apps Script");
    }
  } catch (error) {
    console.error("Error syncing to Google Sheets:", error);
    return {
      success: false,
      message: `Failed to sync: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Test the webhook connection
 */
export async function testWebhookConnection(
  webhookUrl: string,
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      return result.message && result.message.includes("webhook");
    }

    return false;
  } catch (error) {
    console.error("Webhook test failed:", error);
    return false;
  }
}

/**
 * Extract sheet ID from Google Sheets URL
 */
export function extractSheetIdFromUrl(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Generate setup instructions for Google Apps Script
 */
export function getSetupInstructions(): string {
  return `
🚀 AUTOMATIC GOOGLE SHEETS SETUP:

1. Open your Google Sheet
2. Go to Extensions → Apps Script
3. Delete any existing code and paste the provided script
4. Click "Deploy" → "New Deployment"
5. Choose "Web app" as the type
6. Set "Execute as" to "Me"
7. Set "Who has access" to "Anyone"
8. Click "Deploy" and copy the webhook URL
9. Paste the webhook URL in the app

That's it! Your entries will now sync automatically! ✨
`.trim();
}
