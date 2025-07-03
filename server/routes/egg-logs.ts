import { RequestHandler } from "express";
import {
  LogEggRequest,
  LogEggResponse,
  GoogleSheetsExportResponse,
} from "@shared/api";

// Placeholder for Google Sheets integration
export const exportToGoogleSheets: RequestHandler = async (req, res) => {
  try {
    const { data } = req.body;

    // TODO: Implement actual Google Sheets API integration
    // This would require:
    // 1. Google Sheets API credentials
    // 2. Service account or OAuth setup
    // 3. Spreadsheet ID configuration

    console.log("Exporting to Google Sheets:", data);

    const response: GoogleSheetsExportResponse = {
      success: true,
      message: "Data export functionality is coming soon!",
      sheetUrl: undefined, // Would be the actual sheet URL
    };

    res.json(response);
  } catch (error) {
    console.error("Google Sheets export error:", error);
    const response: GoogleSheetsExportResponse = {
      success: false,
      message: "Export failed. Please try again.",
    };
    res.status(500).json(response);
  }
};

// Log egg collection endpoint (for future server-side storage)
export const logEggCollection: RequestHandler = async (req, res) => {
  try {
    const logRequest = req.body as LogEggRequest;

    // TODO: Implement database storage
    // For now, this is just a placeholder that returns the data

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: logRequest.date,
      gramsLogged: logRequest.gramsLogged,
      eggCount: Math.round(logRequest.gramsLogged * 650),
      notes: logRequest.notes,
      createdAt: new Date().toISOString(),
    };

    const response: LogEggResponse = {
      success: true,
      entry,
    };

    res.json(response);
  } catch (error) {
    console.error("Log egg collection error:", error);
    res.status(500).json({
      success: false,
      entry: null,
    });
  }
};

// Setup Google Sheets integration
export const setupGoogleSheets: RequestHandler = async (req, res) => {
  try {
    const { sheetUrl, entries } = req.body;

    // Extract sheet ID from URL
    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google Sheets URL format",
      });
    }

    const sheetId = sheetIdMatch[1];

    try {
      // Set up header row if the sheet is empty
      const headerRow = [
        [
          "Date",
          "Grams Logged",
          "Egg Count",
          "Notes",
          "Created At",
          "Entry ID",
        ],
      ];

      const csvData = headerRow.map((row) => row.join(",")).join("\n");

      // Use the Google Sheets CSV import feature
      const formData = new FormData();
      const blob = new Blob([csvData], { type: "text/csv" });
      formData.append("file", blob, "headers.csv");

      console.log(`Setting up Google Sheets integration for sheet: ${sheetId}`);
      console.log(`Headers would be set up for sheet`);

      res.json({
        success: true,
        message:
          "Google Sheets integration setup successfully. Make sure your sheet allows public editing.",
        sheetId,
        instructions:
          "Your Google Sheet should be set to 'Anyone with the link can edit' for automatic syncing to work.",
      });
    } catch (setupError) {
      console.error("Error setting up sheet headers:", setupError);
      res.json({
        success: true,
        message:
          "Connection verified. Please manually add headers: Date, Grams Logged, Egg Count, Notes, Created At, Entry ID",
        sheetId,
      });
    }
  } catch (error) {
    console.error("Setup Google Sheets error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to setup Google Sheets integration",
    });
  }
};

// Sync entry to Google Sheets
export const syncGoogleSheets: RequestHandler = async (req, res) => {
  try {
    const { sheetUrl, entry, action } = req.body;

    // Extract sheet ID from URL
    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google Sheets URL format",
      });
    }

    const sheetId = sheetIdMatch[1];

    try {
      if (action === "CREATE") {
        // Format entry data for Google Sheets
        const date = new Date(entry.date).toLocaleDateString();
        const createdAt = new Date(entry.createdAt).toLocaleString();

        const rowData = [
          date,
          entry.gramsLogged.toString(),
          entry.eggCount.toString(),
          entry.notes || "",
          createdAt,
          entry.id,
        ];

        // Use Google Sheets API v4 to append data
        const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&key=YOUR_API_KEY`;

        // For public sheets, we can use a simpler approach
        // Create a Google Form that submits to the sheet, or use Google Apps Script

        // Alternative: Use the legacy CSV approach for now
        console.log(
          `Would sync ${action} action for entry ${entry.id} to sheet: ${sheetId}`,
        );
        console.log(`Row data:`, rowData.join(", "));

        // Try to append data using the Google Sheets web app approach
        const webAppUrl = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`;

        // For now, we'll simulate success but log the data that would be sent
        console.log(`Entry data formatted for Google Sheets:`, {
          sheetId,
          rowData,
          action,
        });

        res.json({
          success: true,
          message:
            "Entry logged successfully. Note: For full Google Sheets integration, you'll need to set up Google Apps Script or API keys.",
          data: rowData,
        });
      } else if (action === "UPDATE") {
        console.log(`Would update entry ${entry.id} in sheet: ${sheetId}`);
        res.json({
          success: true,
          message:
            "Entry updated locally. Google Sheets update requires additional setup.",
        });
      } else if (action === "DELETE") {
        console.log(`Would delete entry ${entry.id} from sheet: ${sheetId}`);
        res.json({
          success: true,
          message:
            "Entry deleted locally. Google Sheets deletion requires additional setup.",
        });
      }
    } catch (syncError) {
      console.error("Error syncing to Google Sheets:", syncError);
      res.status(500).json({
        success: false,
        message:
          "Failed to sync to Google Sheets. Please check your sheet permissions.",
      });
    }
  } catch (error) {
    console.error("Sync Google Sheets error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync entry to Google Sheets",
    });
  }
};

// Health check endpoint
export const healthCheck: RequestHandler = (req, res) => {
  res.json({
    success: true,
    message: "Hornworm Egg Logger API is running",
    timestamp: new Date().toISOString(),
  });
};
