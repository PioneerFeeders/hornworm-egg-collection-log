import React from "react";
import {
  Calendar,
  Snowflake,
  Thermometer,
  Egg,
  Clock,
  ArrowRight,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScheduleRow {
  harvestDay: string;
  actionTaken: string;
  actionIcon: React.ReactNode;
  actionColor: string;
  containerLocation: string;
  containerIcon: React.ReactNode;
  duration: string;
  nextMovementDay: string;
  nextAction: string;
  nextIcon: React.ReactNode;
  nextColor: string;
  additionalNotes?: string;
}

interface DailyMovement {
  day: string;
  refrigeratorActions: {
    add: string[];
    remove: string[];
  };
  incubatorActions: {
    add: string[];
    remove: string[];
  };
  totalActions: number;
}

const dailyMovements: DailyMovement[] = [
  {
    day: "Monday",
    refrigeratorActions: {
      add: ["Monday harvest eggs"],
      remove: [],
    },
    incubatorActions: {
      add: ["Monday eggs (from fridge - moved Tuesday)"],
      remove: [],
    },
    totalActions: 1,
  },
  {
    day: "Tuesday",
    refrigeratorActions: {
      add: [],
      remove: ["Monday eggs (move to incubator)"],
    },
    incubatorActions: {
      add: ["Tuesday harvest eggs (direct)", "Monday eggs (from fridge)"],
      remove: [],
    },
    totalActions: 3,
  },
  {
    day: "Wednesday",
    refrigeratorActions: {
      add: [],
      remove: ["Sunday eggs (move to incubator)"],
    },
    incubatorActions: {
      add: ["Wednesday harvest eggs (direct)", "Sunday eggs (from fridge)"],
      remove: [],
    },
    totalActions: 3,
  },
  {
    day: "Thursday",
    refrigeratorActions: {
      add: [],
      remove: [],
    },
    incubatorActions: {
      add: [],
      remove: [],
    },
    totalActions: 0,
  },
  {
    day: "Friday",
    refrigeratorActions: {
      add: ["Friday harvest eggs"],
      remove: [],
    },
    incubatorActions: {
      add: [],
      remove: [],
    },
    totalActions: 1,
  },
  {
    day: "Saturday",
    refrigeratorActions: {
      add: [],
      remove: [],
    },
    incubatorActions: {
      add: [],
      remove: [],
    },
    totalActions: 0,
  },
  {
    day: "Sunday",
    refrigeratorActions: {
      add: ["Sunday harvest eggs"],
      remove: [],
    },
    incubatorActions: {
      add: [],
      remove: [],
    },
    totalActions: 1,
  },
];

const scheduleData: ScheduleRow[] = [
  {
    harvestDay: "Monday",
    actionTaken: "Refrigerate harvested eggs",
    actionIcon: <Snowflake className="h-4 w-4" />,
    actionColor: "text-blue-600 bg-blue-50",
    containerLocation: "Refrigerator (4°C)",
    containerIcon: <Package className="h-4 w-4 text-blue-600" />,
    duration: "Store for 1 day",
    nextMovementDay: "Tuesday",
    nextAction: "Move to incubator",
    nextIcon: <ArrowRight className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
    additionalNotes:
      "Label container: 'Monday Harvest - Move to Incubator Tuesday'",
  },
  {
    harvestDay: "Tuesday",
    actionTaken: "Place harvested eggs in incubator",
    actionIcon: <Thermometer className="h-4 w-4" />,
    actionColor: "text-orange-600 bg-orange-50",
    containerLocation: "Incubator (28°C)",
    containerIcon: <Package className="h-4 w-4 text-orange-600" />,
    duration: "Permanent storage",
    nextMovementDay: "—",
    nextAction: "Stay in incubator",
    nextIcon: <Thermometer className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
    additionalNotes: "ALSO move Monday's eggs from fridge to incubator today",
  },
  {
    harvestDay: "Wednesday",
    actionTaken:
      "Place harvested eggs in incubator + Move Monday & Sunday eggs from fridge to incubator",
    actionIcon: <Thermometer className="h-4 w-4" />,
    actionColor: "text-purple-600 bg-purple-50",
    containerLocation: "Incubator (28°C)",
    containerIcon: <Package className="h-4 w-4 text-purple-600" />,
    duration: "Permanent storage",
    nextMovementDay: "—",
    nextAction: "Stay in incubator",
    nextIcon: <Thermometer className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
    additionalNotes:
      "BUSY DAY: Fresh harvest + move 2 batches from fridge to incubator",
  },
  {
    harvestDay: "Thursday",
    actionTaken: "NO HARVEST",
    actionIcon: <Calendar className="h-4 w-4" />,
    actionColor: "text-gray-600 bg-gray-50",
    containerLocation: "No containers used",
    containerIcon: <Calendar className="h-4 w-4 text-gray-600" />,
    duration: "Rest day",
    nextMovementDay: "—",
    nextAction: "No action needed",
    nextIcon: <Calendar className="h-4 w-4" />,
    nextColor: "text-gray-600 bg-gray-50",
    additionalNotes: "Rest day - no egg handling activities",
  },
  {
    harvestDay: "Friday",
    actionTaken: "Refrigerate harvested eggs",
    actionIcon: <Snowflake className="h-4 w-4" />,
    actionColor: "text-blue-600 bg-blue-50",
    containerLocation: "Refrigerator (4°C)",
    containerIcon: <Package className="h-4 w-4 text-blue-600" />,
    duration: "Store for 3+ days",
    nextMovementDay: "Monday (next week)",
    nextAction: "Move to incubator",
    nextIcon: <ArrowRight className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
    additionalNotes:
      "Label container: 'Friday Harvest - Move to Incubator Monday'",
  },
  {
    harvestDay: "Saturday",
    actionTaken: "NO HARVEST",
    actionIcon: <Calendar className="h-4 w-4" />,
    actionColor: "text-gray-600 bg-gray-50",
    containerLocation: "No containers used",
    containerIcon: <Calendar className="h-4 w-4 text-gray-600" />,
    duration: "Rest day",
    nextMovementDay: "—",
    nextAction: "No action needed",
    nextIcon: <Calendar className="h-4 w-4" />,
    nextColor: "text-gray-600 bg-gray-50",
    additionalNotes: "Rest day - no egg handling activities",
  },
  {
    harvestDay: "Sunday",
    actionTaken: "Refrigerate harvested eggs",
    actionIcon: <Snowflake className="h-4 w-4" />,
    actionColor: "text-blue-600 bg-blue-50",
    containerLocation: "Refrigerator (4°C)",
    containerIcon: <Package className="h-4 w-4 text-blue-600" />,
    duration: "Store for 3 days",
    nextMovementDay: "Wednesday",
    nextAction: "Move to incubator",
    nextIcon: <ArrowRight className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
    additionalNotes:
      "Label container: 'Sunday Harvest - Move to Incubator Wednesday'",
  },
];

export function EggHarvestSchedule() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="border-retro-200 shadow-lg bg-gradient-to-br from-white to-retro-50">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-retro-800 text-2xl font-bold flex items-center justify-center gap-3">
          <Calendar className="h-6 w-6" />
          Egg Harvest Movement Schedule
        </CardTitle>
        <p className="text-retro-600 text-sm mt-2">
          Weekly reference chart for insect rearing employees
        </p>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="border-retro-200 text-retro-700 hover:bg-retro-50 print:hidden"
          >
            🖨️ Print Chart
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Daily Movement Tracker */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-retro-800 mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Daily Container Movement Checklist
          </h3>

          {/* Desktop Movement Grid */}
          <div className="hidden md:grid grid-cols-7 gap-2 mb-6">
            {dailyMovements.map((dayData) => (
              <Card
                key={dayData.day}
                className={`${
                  dayData.totalActions > 0
                    ? dayData.totalActions >= 3
                      ? "border-purple-300 bg-purple-50"
                      : "border-retro-300 bg-retro-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <CardContent className="p-3">
                  <div className="text-center mb-3">
                    <h4 className="font-bold text-sm text-retro-800">
                      {dayData.day}
                    </h4>
                    <div className="text-xs text-gray-600">
                      {dayData.totalActions === 0
                        ? "Rest Day"
                        : `${dayData.totalActions} actions`}
                    </div>
                  </div>

                  {/* Refrigerator Actions */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Snowflake className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">
                        Fridge
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayData.refrigeratorActions.add.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 text-xs text-green-700"
                        >
                          <Plus className="h-2 w-2" />
                          <span className="truncate">{action}</span>
                        </div>
                      ))}
                      {dayData.refrigeratorActions.remove.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 text-xs text-red-700"
                        >
                          <Minus className="h-2 w-2" />
                          <span className="truncate">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Incubator Actions */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Thermometer className="h-3 w-3 text-orange-600" />
                      <span className="text-xs font-medium text-orange-700">
                        Incubator
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayData.incubatorActions.add.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 text-xs text-green-700"
                        >
                          <Plus className="h-2 w-2" />
                          <span className="truncate">{action}</span>
                        </div>
                      ))}
                      {dayData.incubatorActions.remove.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 text-xs text-red-700"
                        >
                          <Minus className="h-2 w-2" />
                          <span className="truncate">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Movement List */}
          <div className="md:hidden space-y-3 mb-6">
            {dailyMovements.map((dayData) => (
              <Card key={dayData.day} className="border-retro-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-retro-800">{dayData.day}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        dayData.totalActions > 0
                          ? dayData.totalActions >= 3
                            ? "bg-purple-100 text-purple-700"
                            : "bg-retro-100 text-retro-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {dayData.totalActions === 0
                        ? "Rest Day"
                        : `${dayData.totalActions} actions`}
                    </span>
                  </div>

                  {dayData.totalActions > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Refrigerator */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Snowflake className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            Refrigerator
                          </span>
                        </div>
                        <div className="space-y-1">
                          {dayData.refrigeratorActions.add.map((action, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-1 text-xs text-green-700"
                            >
                              <Plus className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </div>
                          ))}
                          {dayData.refrigeratorActions.remove.map(
                            (action, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-1 text-xs text-red-700"
                              >
                                <Minus className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span>{action}</span>
                              </div>
                            ),
                          )}
                          {dayData.refrigeratorActions.add.length === 0 &&
                            dayData.refrigeratorActions.remove.length === 0 && (
                              <span className="text-xs text-gray-500">
                                No actions
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Incubator */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-700">
                            Incubator
                          </span>
                        </div>
                        <div className="space-y-1">
                          {dayData.incubatorActions.add.map((action, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-1 text-xs text-green-700"
                            >
                              <Plus className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </div>
                          ))}
                          {dayData.incubatorActions.remove.map((action, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-1 text-xs text-red-700"
                            >
                              <Minus className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </div>
                          ))}
                          {dayData.incubatorActions.add.length === 0 &&
                            dayData.incubatorActions.remove.length === 0 && (
                              <span className="text-xs text-gray-500">
                                No actions
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Movement Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Plus className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Add to container
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <Minus className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Remove from container
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-retro-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-retro-600 text-white">
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Harvest Day
                </th>
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Action & Container
                </th>
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Duration & Location
                </th>
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Next Movement
                </th>
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, index) => (
                <tr
                  key={row.harvestDay}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-retro-50"
                  } hover:bg-retro-100 transition-colors`}
                >
                  <td className="border border-retro-300 px-4 py-3 font-semibold text-retro-800">
                    {row.harvestDay}
                  </td>
                  <td className="border border-retro-300 px-4 py-3">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${row.actionColor} mb-2`}
                    >
                      {row.actionIcon}
                      <span className="text-sm font-medium">
                        {row.actionTaken}
                      </span>
                    </div>
                  </td>
                  <td className="border border-retro-300 px-4 py-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {row.containerIcon}
                        <span className="font-medium">
                          {row.containerLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{row.duration}</span>
                      </div>
                    </div>
                  </td>
                  <td className="border border-retro-300 px-4 py-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-retro-700">
                        {row.nextMovementDay}
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${row.nextColor}`}
                      >
                        {row.nextIcon}
                        <span>{row.nextAction}</span>
                      </div>
                    </div>
                  </td>
                  <td className="border border-retro-300 px-3 py-3">
                    <span className="text-xs text-gray-600 italic">
                      {row.additionalNotes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {scheduleData.map((row) => (
            <Card key={row.harvestDay} className="border-retro-200">
              <CardContent className="p-4">
                <div className="font-bold text-lg text-retro-800 mb-3">
                  {row.harvestDay}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-retro-600 mb-2">
                      Action Today:
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${row.actionColor} mb-2`}
                    >
                      {row.actionIcon}
                      <span className="text-sm font-medium">
                        {row.actionTaken}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-retro-600 mb-2">
                      Container & Duration:
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {row.containerIcon}
                        <span className="font-medium">
                          {row.containerLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{row.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-retro-600 mb-2">
                      Next Movement:{" "}
                      <span className="font-bold">{row.nextMovementDay}</span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${row.nextColor}`}
                    >
                      {row.nextIcon}
                      <span className="text-sm font-medium">
                        {row.nextAction}
                      </span>
                    </div>
                  </div>

                  {row.additionalNotes && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-xs font-medium text-yellow-800 mb-1">
                        📝 Important Note:
                      </div>
                      <div className="text-xs text-yellow-700">
                        {row.additionalNotes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-retro-50 rounded-lg border border-retro-200">
          <h3 className="font-bold text-retro-800 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Action & Container Legend
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="text-blue-600 bg-blue-50 p-2 rounded-full">
                <Snowflake className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-medium block">Refrigerate</span>
                <span className="text-xs text-gray-600">4°C storage</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-orange-600 bg-orange-50 p-2 rounded-full">
                <Thermometer className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-medium block">Incubate</span>
                <span className="text-xs text-gray-600">28°C storage</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-gray-600 bg-gray-50 p-2 rounded-full">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-medium block">Duration</span>
                <span className="text-xs text-gray-600">Storage time</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-retro-600 bg-retro-50 p-2 rounded-full">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-medium block">Container</span>
                <span className="text-xs text-gray-600">Storage location</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-3">
            ⚠️ Critical Container & Timing Instructions:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">
                📦 Container Management:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • <strong>Refrigerator:</strong> 4°C for slow development
                </li>
                <li>
                  • <strong>Incubator:</strong> 28°C for active development
                </li>
                <li>
                  • <strong>Always label containers</strong> with harvest date &
                  next action
                </li>
                <li>
                  • <strong>Use separate containers</strong> for each harvest
                  day
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">
                ⏰ Timing & Schedule:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • <strong>Thursday & Saturday:</strong> NO fresh harvest
                </li>
                <li>
                  • <strong>Wednesday:</strong> BUSY DAY - 3 tasks (fresh + 2
                  moves)
                </li>
                <li>
                  • <strong>Check containers daily</strong> for movement
                  schedule
                </li>
                <li>
                  • <strong>Set reminders</strong> for container movements
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
            <h4 className="font-semibold text-yellow-800 mb-2">
              🏷️ Labeling Examples:
            </h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>• "Monday Harvest - Move to Incubator Tuesday"</div>
              <div>• "Friday Harvest - Move to Incubator Monday"</div>
              <div>• "Sunday Harvest - Move to Incubator Wednesday"</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
