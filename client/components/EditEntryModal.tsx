import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Save, X, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { gramsToEggs } from "@/lib/waxworm-utils";
import { EggLogEntry } from "@shared/api";

interface EditEntryModalProps {
  entry: EggLogEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: EggLogEntry) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function EditEntryModal({
  entry,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isLoading = false,
}: EditEntryModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [gramsLogged, setGramsLogged] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);

  // Reset form when entry changes
  useEffect(() => {
    if (entry) {
      setDate(parseISO(entry.date));
      setGramsLogged(entry.gramsLogged.toString());
      setNotes(entry.notes || "");
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry) return;

    const grams = parseFloat(gramsLogged);
    if (isNaN(grams) || grams <= 0) return;

    const updatedEntry: EggLogEntry = {
      ...entry,
      date: date.toISOString(),
      gramsLogged: grams,
      eggCount: gramsToEggs(grams),
      notes: notes.trim() || undefined,
    };

    onSave(updatedEntry);
  };

  const handleDelete = () => {
    if (!entry) return;
    if (confirm("Are you sure you want to delete this entry?")) {
      onDelete(entry.id);
    }
  };

  const gramsValue = parseFloat(gramsLogged) || 0;
  const eggCount = gramsToEggs(gramsValue);

  if (!entry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-retro-200">
        <DialogHeader>
          <DialogTitle className="text-retro-800 flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Collection Entry
          </DialogTitle>
        </DialogHeader>

        <form name="edit-entry" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="edit-entry" />
        </form>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-retro-700">
              Collection Date
            </Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  id="edit-date"
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
            <Label htmlFor="edit-grams" className="text-retro-700">
              Weight (grams)
            </Label>
            <Input
              id="edit-grams"
              name="grams"
              type="number"
              step="0.01"
              min="0"
              value={gramsLogged}
              onChange={(e) => setGramsLogged(e.target.value)}
              placeholder="Enter weight in grams"
              className="border-retro-200 focus:border-retro-400 focus:ring-retro-400"
            />
            {gramsValue > 0 && (
              <p className="text-sm text-retro-600 font-medium">
                ≈ {eggCount.toLocaleString()} eggs
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes" className="text-retro-700">
              Notes (optional)
            </Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this collection..."
              className="border-retro-200 focus:border-retro-400 focus:ring-retro-400 resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            onClick={handleDelete}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!gramsLogged || isLoading}
            className="bg-gradient-to-r from-retro-600 to-retro-500 hover:from-retro-700 hover:to-retro-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
