import React, { useState, useEffect } from "react";
import { Cloud, CloudOff, Wifi, WifiOff, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cloudDataService } from "@/lib/cloud-data-service";

export function SyncStatus() {
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check last sync time
    const checkSyncTime = async () => {
      const syncTime = await cloudDataService.getLastSyncTime();
      setLastSyncTime(syncTime);
    };

    checkSyncTime();

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Subscribe to data changes to update sync time
    const unsubscribe = cloudDataService.subscribe(() => {
      checkSyncTime();
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribe();
    };
  }, []);

  const getSyncStatusText = () => {
    if (!isOnline) {
      return "Offline - Changes saved locally";
    }

    if (!lastSyncTime) {
      return "Syncing...";
    }

    const syncDate = new Date(lastSyncTime);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - syncDate.getTime()) / 60000,
    );

    if (diffMinutes < 1) {
      return "Synced now";
    } else if (diffMinutes < 60) {
      return `Synced ${diffMinutes}m ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      return `Synced ${diffHours}h ago`;
    }
  };

  const getSyncIcon = () => {
    if (!isOnline) {
      return <CloudOff className="h-3 w-3" />;
    }

    if (!lastSyncTime) {
      return <Cloud className="h-3 w-3 animate-pulse" />;
    }

    return <CheckCircle className="h-3 w-3" />;
  };

  const getSyncVariant = () => {
    if (!isOnline) {
      return "outline" as const;
    }

    if (!lastSyncTime) {
      return "secondary" as const;
    }

    return "default" as const;
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getSyncVariant()} className="text-xs">
        {getSyncIcon()}
        <span className="ml-1">{getSyncStatusText()}</span>
      </Badge>

      {/* Network status indicator */}
      <div className="flex items-center">
        {isOnline ? (
          <Wifi className="h-3 w-3 text-green-500" />
        ) : (
          <WifiOff className="h-3 w-3 text-gray-400" />
        )}
      </div>
    </div>
  );
}
