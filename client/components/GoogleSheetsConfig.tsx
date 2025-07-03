import React, { useState } from "react";
import {
  Settings,
  Link,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  FileText,
  Zap,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  getGoogleAppsScriptCode,
  getSetupInstructions,
  testWebhookConnection,
} from "@/lib/google-sheets-auto";

interface GoogleSheetsConfigProps {
  isConnected: boolean;
  sheetUrl?: string;
  webhookUrl?: string;
  onConnect: (sheetUrl: string, webhookUrl: string) => Promise<boolean>;
  onDisconnect: () => void;
}

export function GoogleSheetsConfig({
  isConnected,
  sheetUrl,
  webhookUrl,
  onConnect,
  onDisconnect,
}: GoogleSheetsConfigProps) {
  const [inputUrl, setInputUrl] = useState(sheetUrl || "");
  const [inputWebhook, setInputWebhook] = useState(webhookUrl || "");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleConnect = async () => {
    if (!inputUrl.trim()) {
      setError("Please enter a Google Sheets URL");
      return;
    }

    if (!inputWebhook.trim()) {
      setError("Please enter a Google Apps Script webhook URL");
      return;
    }

    // Validate Google Sheets URL format
    const isValidSheetUrl = inputUrl.includes("docs.google.com/spreadsheets");
    if (!isValidSheetUrl) {
      setError("Please enter a valid Google Sheets URL");
      return;
    }

    // Validate webhook URL format
    const isValidWebhook = inputWebhook.includes("script.google.com/macros/s/");
    if (!isValidWebhook) {
      setError("Please enter a valid Google Apps Script webhook URL");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Test webhook connection first
      const webhookWorks = await testWebhookConnection(inputWebhook.trim());
      if (!webhookWorks) {
        setError(
          "Webhook test failed. Please check your Google Apps Script deployment.",
        );
        setIsConnecting(false);
        return;
      }

      const success = await onConnect(inputUrl.trim(), inputWebhook.trim());
      if (!success) {
        setError(
          "Failed to connect to Google Sheets. Please check the configuration.",
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
    setInputWebhook("");
    setError(null);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTestWebhook = async () => {
    if (!inputWebhook.trim()) {
      setError("Please enter a webhook URL first");
      return;
    }

    setIsTesting(true);
    setError(null);

    try {
      const works = await testWebhookConnection(inputWebhook.trim());
      if (works) {
        setError(null);
        // Success feedback could be added here
      } else {
        setError(
          "Webhook test failed. Please check your Google Apps Script deployment.",
        );
      }
    } catch (err) {
      setError("Test failed. Please try again.");
    } finally {
      setIsTesting(false);
    }
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
            <Alert className="border-neon-200 bg-gradient-to-r from-neon-50 to-blue-50">
              <Zap className="h-4 w-4 text-neon-600" />
              <AlertDescription className="text-neon-700 font-medium">
                🚀 Setting up AUTOMATIC Google Sheets sync
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="text-neon-700">
                  Google Apps Script Webhook URL
                </Label>
                <Input
                  id="webhook-url"
                  value={inputWebhook}
                  onChange={(e) => setInputWebhook(e.target.value)}
                  placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
                  className="border-neon-200 focus:border-neon-400 focus:ring-neon-400"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleTestWebhook}
                    disabled={isTesting || !inputWebhook.trim()}
                    size="sm"
                    variant="outline"
                    className="border-neon-200 text-neon-700 hover:bg-neon-50"
                  >
                    {isTesting ? "Testing..." : "Test Webhook"}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => setShowScript(!showScript)}
                variant="outline"
                className="w-full border-neon-200 text-neon-700 hover:bg-neon-50"
              >
                <Code className="h-4 w-4 mr-2" />
                {showScript ? "Hide" : "Show"} Apps Script Code
              </Button>

              {showScript && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-neon-700">
                      Copy this code to your Google Apps Script:
                    </p>
                    <Button
                      onClick={() =>
                        copyToClipboard(
                          getGoogleAppsScriptCode(),
                          "Apps Script code",
                        )
                      }
                      size="sm"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <Textarea
                    value={getGoogleAppsScriptCode()}
                    readOnly
                    className="font-mono text-xs h-32 resize-none"
                  />
                </div>
              )}

              <Button
                onClick={() => setShowInstructions(!showInstructions)}
                variant="outline"
                className="w-full border-neon-200 text-neon-700 hover:bg-neon-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                {showInstructions ? "Hide" : "Show"} Setup Instructions
              </Button>

              {showInstructions && (
                <div className="p-3 bg-neon-50 rounded-lg border border-neon-200 text-sm">
                  <pre className="whitespace-pre-wrap text-neon-800">
                    {getSetupInstructions()}
                  </pre>
                </div>
              )}
            </div>

            <Button
              onClick={handleConnect}
              disabled={
                isConnecting || !inputUrl.trim() || !inputWebhook.trim()
              }
              className="w-full bg-gradient-to-r from-neon-600 to-neon-500 hover:from-neon-700 hover:to-neon-600 text-white shadow-lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Automatic Sync"}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700 font-bold">
                  🚀 AUTOMATIC SYNC ACTIVE!
                </p>
              </div>
              <p className="text-xs text-green-600 mb-1">
                📊 Sheet: <span className="break-all">{sheetUrl}</span>
              </p>
              <p className="text-xs text-green-600">
                🔗 Webhook: <span className="break-all">{webhookUrl}</span>
              </p>
              <div className="mt-2 p-2 bg-green-100 rounded border border-green-200">
                <p className="text-xs text-green-700 font-medium">
                  ✨ All new entries will automatically appear in your Google
                  Sheet!
                </p>
              </div>
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
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Sheet
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
