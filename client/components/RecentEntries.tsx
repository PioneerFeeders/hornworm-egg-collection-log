import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Edit, History, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditEntryModal } from "@/components/EditEntryModal";
import { EggLogEntry } from "@shared/api";
import { formatGrams } from "@/lib/waxworm-utils";

interface RecentEntriesProps {
  entries: EggLogEntry[];
  onEdit: (entry: EggLogEntry) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function RecentEntries({
  entries,
  onEdit,
  onDelete,
  isLoading = false,
}: RecentEntriesProps) {
  const [editingEntry, setEditingEntry] = useState<EggLogEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (entry: EggLogEntry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedEntry: EggLogEntry) => {
    onEdit(updatedEntry);
    setIsEditModalOpen(false);
    setEditingEntry(null);
  };

  const handleDeleteEdit = (id: string) => {
    onDelete(id);
    setIsEditModalOpen(false);
    setEditingEntry(null);
  };

  const recentEntries = entries
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <>
      <Card className="border-retro-200 shadow-lg bg-gradient-to-br from-white to-retro-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-retro-800 flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Collections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-6 text-retro-500">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No collections recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-retro-100 hover:border-retro-200 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-retro-700">
                        {formatGrams(entry.gramsLogged)}
                      </span>
                      <span className="text-sm text-retro-600">
                        {format(parseISO(entry.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-retro-500">
                        {entry.eggCount.toLocaleString()} eggs
                      </span>
                      <span className="text-xs text-retro-400">
                        {format(parseISO(entry.createdAt), "h:mm a")}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-retro-600 mt-1 italic">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-retro-400 hover:text-retro-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditClick(entry)}
                        className="text-retro-700 hover:text-retro-800"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Entry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditEntryModal
        entry={editingEntry}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEdit}
        onDelete={handleDeleteEdit}
        isLoading={isLoading}
      />
    </>
  );
}
