import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar, Plus } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { gramsToEggs } from "@/lib/waxworm-utils";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const grams = parseFloat(gramsLogged);
    if (isNaN(grams) || grams <= 0) return;

    const entry = {
      date: date.toISOString(),
      gramsLogged: grams,
      eggCount: gramsToEggs(grams),
      notes: notes.trim() || undefined,
    };

    onSubmit(entry);

    // Reset form
    setGramsLogged("");
    setNotes("");
  };

  const gramsValue = parseFloat(gramsLogged) || 0;
  const eggCount = gramsToEggs(gramsValue);

  return (
    <Card className="border-emerald-200 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-emerald-800 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Log Egg Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-emerald-700">
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

          <div className="space-y-2">
            <Label htmlFor="grams" className="text-emerald-700">
              Weight (grams)
            </Label>
            <Input
              id="grams"
              type="number"
              step="0.01"
              min="0"
              value={gramsLogged}
              onChange={(e) => setGramsLogged(e.target.value)}
              placeholder="Enter weight in grams"
              className="border-emerald-200 focus:border-emerald-400"
              required
            />
            {gramsValue > 0 && (
              <p className="text-sm text-emerald-600">
                ≈ {eggCount.toLocaleString()} eggs
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-emerald-700">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this collection..."
              className="border-emerald-200 focus:border-emerald-400 resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={!gramsLogged || isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? "Logging..." : "Log Collection"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
