import React, { useState } from "react";
import { Cloud, X, Users, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function CloudSyncBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    // Show banner if user hasn't dismissed it before
    return !localStorage.getItem("cloud-sync-banner-dismissed");
  });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("cloud-sync-banner-dismissed", "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Alert className="border-blue-200 bg-blue-50 mb-6">
      <Cloud className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-blue-700 font-medium mb-1">
                🎉 <strong>Team Sync Enabled!</strong>
              </p>
              <p className="text-blue-600 text-sm">
                All egg collection data is now synced across devices. When you
                add entries on your phone, employees can see them instantly on
                their devices.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <div className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                <span>Mobile</span>
              </div>
              <span>↔</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Team</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
