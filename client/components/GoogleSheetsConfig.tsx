import React, { useState } from "react";
import { Settings, Link, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface GoogleSheetsConfigProps {
  isConnected: boolean;
  sheetUrl?: string;
  onConnect: (sheetUrl: string) => Promise<boolean>;
  onDisconnect: () => void;
}

export function GoogleSheetsConfig({
  isConnected,
  sheetUrl,
  onConnect,
  onDisconnect,
}: GoogleSheetsConfigProps) {
  const [inputUrl, setInputUrl] = useState(sheetUrl || "");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!inputUrl.trim()) {
      setError("Please enter a Google Sheets URL");
      return;
    }

    // Validate Google Sheets URL format
    const isValidUrl = inputUrl.includes("docs.google.com/spreadsheets");
    if (!isValidUrl) {
      setError("Please enter a valid Google Sheets URL");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const success = await onConnect(inputUrl.trim());
      if (!success) {
        setError(
          "Failed to connect to Google Sheets. Please check the URL and permissions.",
        );
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    setInputUrl("");
    setError(null);
  };

  return (
    <Card className="border-neon-200 shadow-lg bg-gradient-to-br from-white to-neon-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-neon-800 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Google Sheets Integration
          {isConnected && (
            <Badge
              variant="outline"
              className="ml-auto bg-green-50 text-green-700 border-green-300"
            >
              <Check className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="sheet-url" className="text-neon-700">
                Google Sheets URL
              </Label>
              <Input
                id="sheet-url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                className="border-neon-200 focus:border-neon-400 focus:ring-neon-400"
              />
              <p className="text-xs text-neon-600">
                Copy the URL from your Google Sheets browser address bar
              </p>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-neon-200 bg-neon-50">
              <AlertCircle className="h-4 w-4 text-neon-600" />
              <AlertDescription className="text-neon-700">
                Make sure your Google Sheet is set to "Anyone with the link can
                edit" for automatic syncing to work.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleConnect}
              disabled={isConnecting || !inputUrl.trim()}
              className="w-full bg-gradient-to-r from-neon-600 to-neon-500 hover:from-neon-700 hover:to-neon-600 text-white shadow-lg"
            >
              <Link className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect to Google Sheets"}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium">
                ✅ Successfully connected to Google Sheets
              </p>
              <p className="text-xs text-green-600 mt-1 break-all">
                {sheetUrl}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
              >
                Disconnect
              </Button>
              <Button
                onClick={() => window.open(sheetUrl, "_blank")}
                variant="outline"
                className="flex-1 border-neon-200 text-neon-700 hover:bg-neon-50"
              >
                Open Sheet
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
