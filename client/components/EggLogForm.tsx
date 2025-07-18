import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar, Plus, AlertTriangle, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { gramsToEggs } from "@/lib/waxworm-utils";
import {
  getPlacementInstructions,
  canHarvestOnDate,
  getDayName,
  isOffScheduleHarvest,
} from "@/lib/placement-instructions";
import { EggLogEntry } from "@shared/api";

interface EggLogFormProps {
  onSubmit: (entry: Omit<EggLogEntry, "id" | "createdAt">) => void;
  isLoading?: boolean;
}

export function EggLogForm({ onSubmit, isLoading = false }: EggLogFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [gramsLogged, setGramsLogged] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placementInstructions = getPlacementInstructions(date);
  const canHarvest = canHarvestOnDate(date);
  const isOffSchedule = isOffScheduleHarvest(date);
  const dayName = getDayName(date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submissions
    if (isSubmitting || isLoading) return;

    const grams = parseFloat(gramsLogged);
    if (isNaN(grams) || grams <= 0) return;

    setIsSubmitting(true);

    try {
      const entry = {
        date: date.toISOString(),
        gramsLogged: grams,
        eggCount: gramsToEggs(grams),
        notes: notes.trim() || undefined,
      };

      // Submit to local storage (existing functionality)
      await onSubmit(entry);

      // Also submit to Netlify forms if deployed
      try {
        const formData = new FormData(e.target as HTMLFormElement);

        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData as any).toString(),
        });
      } catch (netlifyError) {
        // Silently fail for local development
        console.log("Netlify form submission not available in development");
      }

      // Reset form only on successful submission
      setGramsLogged("");
      setNotes("");
      console.log("✅ Form submitted successfully");
    } catch (error) {
      console.error("❌ Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const gramsValue = parseFloat(gramsLogged) || 0;
  const eggCount = gramsToEggs(gramsValue);

  return (
    <Card className="border-retro-200 shadow-lg bg-gradient-to-br from-white to-retro-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-retro-800 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Log Egg Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          name="egg-collection"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="egg-collection" />
          <input
            type="hidden"
            name="collection-date"
            value={format(date, "yyyy-MM-dd")}
          />
          <div className="space-y-2">
            <Label htmlFor="date" className="text-retro-700">
              Collection Date
            </Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      setShowCalendar(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Placement Instructions */}
          <div className="space-y-3">
            <div
              className={`p-4 rounded-lg border-2 ${placementInstructions.bgColor}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{placementInstructions.icon}</span>
                <h3 className={`font-bold ${placementInstructions.color}`}>
                  {dayName} Harvest Instructions
                </h3>
              </div>

              {isOffSchedule && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    <strong>Off-schedule harvest on {dayName}!</strong>{" "}
                    Defaulting to refrigerator storage for flexible timing.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {placementInstructions.nextActionDate !==
                  "No movement needed" && (
                  <div className="text-sm text-gray-700">
                    <strong>Next movement:</strong>
                    &nbsp;{placementInstructions.nextAction} on
                    <span className="font-semibold">
                      &nbsp;{placementInstructions.nextActionDate}
                    </span>
                  </div>
                )}

                {placementInstructions.additionalNotes && (
                  <div className="text-xs text-gray-600 italic bg-white/50 p-2 rounded">
                    💡 <strong>Note:</strong>{" "}
                    {placementInstructions.additionalNotes}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grams" className="text-retro-700">
              Weight (grams)
            </Label>
            <Input
              id="grams"
              name="grams"
              type="number"
              step="0.01"
              min="0"
              value={gramsLogged}
              onChange={(e) => setGramsLogged(e.target.value)}
              placeholder="Enter weight in grams"
              className="border-retro-200 focus:border-retro-400 focus:ring-retro-400"
              required
            />
            {gramsValue > 0 && (
              <p className="text-sm text-retro-600 font-medium">
                ≈ {eggCount.toLocaleString()} eggs
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-retro-700">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this collection..."
              className="border-retro-200 focus:border-retro-400 focus:ring-retro-400 resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={!gramsLogged || isLoading || isSubmitting}
            className="w-full bg-gradient-to-r from-retro-600 to-retro-500 hover:from-retro-700 hover:to-retro-600 text-white shadow-lg disabled:opacity-50"
          >
            {isLoading || isSubmitting
              ? "Logging..."
              : isOffSchedule
                ? `Log Off-Schedule Harvest (${dayName})`
                : "Log Collection"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
