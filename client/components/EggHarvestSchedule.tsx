import React from "react";
import { Calendar, Snowflake, Thermometer, Egg } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScheduleRow {
  harvestDay: string;
  actionTaken: string;
  actionIcon: React.ReactNode;
  actionColor: string;
  nextMovementDay: string;
  nextAction: string;
  nextIcon: React.ReactNode;
  nextColor: string;
}

const scheduleData: ScheduleRow[] = [
  {
    harvestDay: "Monday",
    actionTaken: "Refrigerate harvested eggs",
    actionIcon: <Snowflake className="h-4 w-4" />,
    actionColor: "text-blue-600 bg-blue-50",
    nextMovementDay: "Tuesday",
    nextAction: "Move to incubator",
    nextIcon: <Thermometer className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
  },
  {
    harvestDay: "Tuesday",
    actionTaken: "Place harvested eggs in incubator",
    actionIcon: <Thermometer className="h-4 w-4" />,
    actionColor: "text-orange-600 bg-orange-50",
    nextMovementDay: "—",
    nextAction: "Stay in incubator",
    nextIcon: <Thermometer className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
  },
  {
    harvestDay: "Wednesday",
    actionTaken:
      "Place harvested eggs in incubator + Move Monday & Sunday eggs from fridge to incubator",
    actionIcon: <Thermometer className="h-4 w-4" />,
    actionColor: "text-purple-600 bg-purple-50",
    nextMovementDay: "—",
    nextAction: "Stay in incubator",
    nextIcon: <Thermometer className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
  },
  {
    harvestDay: "Thursday",
    actionTaken: "NO HARVEST",
    actionIcon: <Calendar className="h-4 w-4" />,
    actionColor: "text-gray-600 bg-gray-50",
    nextMovementDay: "—",
    nextAction: "No action needed",
    nextIcon: <Calendar className="h-4 w-4" />,
    nextColor: "text-gray-600 bg-gray-50",
  },
  {
    harvestDay: "Friday",
    actionTaken: "Refrigerate harvested eggs",
    actionIcon: <Snowflake className="h-4 w-4" />,
    actionColor: "text-blue-600 bg-blue-50",
    nextMovementDay: "Monday (next week)",
    nextAction: "Move to incubator",
    nextIcon: <Thermometer className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
  },
  {
    harvestDay: "Saturday",
    actionTaken: "NO HARVEST",
    actionIcon: <Calendar className="h-4 w-4" />,
    actionColor: "text-gray-600 bg-gray-50",
    nextMovementDay: "—",
    nextAction: "No action needed",
    nextIcon: <Calendar className="h-4 w-4" />,
    nextColor: "text-gray-600 bg-gray-50",
  },
  {
    harvestDay: "Sunday",
    actionTaken: "Refrigerate harvested eggs",
    actionIcon: <Snowflake className="h-4 w-4" />,
    actionColor: "text-blue-600 bg-blue-50",
    nextMovementDay: "Wednesday",
    nextAction: "Move to incubator",
    nextIcon: <Thermometer className="h-4 w-4" />,
    nextColor: "text-orange-600 bg-orange-50",
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
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-retro-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-retro-600 text-white">
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Harvest Day
                </th>
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Action Taken That Day
                </th>
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Next Movement Day
                </th>
                <th className="border border-retro-400 px-4 py-3 text-left font-bold">
                  Next Action
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
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${row.actionColor}`}
                    >
                      {row.actionIcon}
                      <span className="text-sm font-medium">
                        {row.actionTaken}
                      </span>
                    </div>
                  </td>
                  <td className="border border-retro-300 px-4 py-3 font-medium text-retro-700">
                    {row.nextMovementDay}
                  </td>
                  <td className="border border-retro-300 px-4 py-3">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${row.nextColor}`}
                    >
                      {row.nextIcon}
                      <span className="text-sm font-medium">
                        {row.nextAction}
                      </span>
                    </div>
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

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-retro-600 mb-1">
                      Action Today:
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${row.actionColor}`}
                    >
                      {row.actionIcon}
                      <span className="text-sm font-medium">
                        {row.actionTaken}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-retro-600 mb-1">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-retro-50 rounded-lg border border-retro-200">
          <h3 className="font-bold text-retro-800 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Action Legend
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="text-blue-600 bg-blue-50 p-2 rounded-full">
                <Snowflake className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Refrigerate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-orange-600 bg-orange-50 p-2 rounded-full">
                <Thermometer className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Incubate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-green-600 bg-green-50 p-2 rounded-full">
                <Egg className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Harvest</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">
            ⚠️ Important Notes:
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • <strong>Thursday & Saturday:</strong> NO fresh harvest on these
              days
            </li>
            <li>
              • <strong>Wednesday is busy:</strong> Fresh harvest + move
              refrigerated eggs (Monday & Sunday) to incubator
            </li>
            <li>
              • <strong>Tuesday & Wednesday eggs:</strong> Go straight to
              incubator and stay there
            </li>
            <li>
              • <strong>Monday, Friday & Sunday eggs:</strong> Start in
              refrigerator, then move to incubator
            </li>
            <li>
              • <strong>Always label containers</strong> with harvest date and
              action taken
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
