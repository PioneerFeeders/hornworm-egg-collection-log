import { format } from "date-fns";

export interface PlacementInstruction {
  container: string;
  icon: string;
  temperature: string;
  duration: string;
  nextAction: string;
  nextActionDate: string;
  color: string;
  bgColor: string;
  urgent?: boolean;
  additionalNotes?: string;
}

/**
 * Get placement instructions based on harvest date
 */
export function getPlacementInstructions(date: Date): PlacementInstruction {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  switch (dayOfWeek) {
    case 1: // Monday
      return {
        container: "Refrigerator",
        icon: "❄️",
        temperature: "4°C",
        duration: "Store for 1 day",
        nextAction: "Move to incubator",
        nextActionDate: "Tuesday",
        color: "text-blue-700",
        bgColor: "bg-blue-50 border-blue-200",
        additionalNotes: "Label: 'Monday Harvest - Move to Incubator Tuesday'",
      };

    case 2: // Tuesday
      return {
        container: "Incubator",
        icon: "🌡️",
        temperature: "28°C",
        duration: "Permanent storage",
        nextAction: "Stay in incubator",
        nextActionDate: "No movement needed",
        color: "text-orange-700",
        bgColor: "bg-orange-50 border-orange-200",
        additionalNotes: "Direct to incubator - no refrigeration needed",
      };

    case 3: // Wednesday
      return {
        container: "Incubator",
        icon: "🌡️",
        temperature: "28°C",
        duration: "Permanent storage",
        nextAction: "Stay in incubator",
        nextActionDate: "No movement needed",
        color: "text-orange-700",
        bgColor: "bg-purple-50 border-purple-200",
        urgent: true,
        additionalNotes:
          "BUSY DAY: Also move Monday & Sunday eggs from fridge to incubator today!",
      };

    case 4: // Thursday
      return {
        container: "Refrigerator",
        icon: "❄️",
        temperature: "4°C",
        duration: "Store until needed",
        nextAction: "Move to incubator when ready",
        nextActionDate: "Flexible timing",
        color: "text-blue-700",
        bgColor: "bg-yellow-50 border-yellow-200",
        additionalNotes:
          "Off-schedule harvest - store in refrigerator for flexible timing",
      };

    case 5: // Friday
      return {
        container: "Refrigerator",
        icon: "❄️",
        temperature: "4°C",
        duration: "Store for 3+ days",
        nextAction: "Move to incubator",
        nextActionDate: "Monday (next week)",
        color: "text-blue-700",
        bgColor: "bg-blue-50 border-blue-200",
        additionalNotes: "Label: 'Friday Harvest - Move to Incubator Monday'",
      };

    case 6: // Saturday
      return {
        container: "Refrigerator",
        icon: "❄️",
        temperature: "4°C",
        duration: "Store until needed",
        nextAction: "Move to incubator when ready",
        nextActionDate: "Flexible timing",
        color: "text-blue-700",
        bgColor: "bg-yellow-50 border-yellow-200",
        additionalNotes:
          "Off-schedule harvest - store in refrigerator for flexible timing",
      };

    case 0: // Sunday
    default:
      return {
        container: "Refrigerator",
        icon: "❄️",
        temperature: "4°C",
        duration: "Store for 3 days",
        nextAction: "Move to incubator",
        nextActionDate: "Wednesday",
        color: "text-blue-700",
        bgColor: "bg-blue-50 border-blue-200",
        additionalNotes:
          "Label: 'Sunday Harvest - Move to Incubator Wednesday'",
      };
  }
}

/**
 * Check if a date allows harvest (now always returns true)
 */
export function canHarvestOnDate(date: Date): boolean {
  // Allow harvest on any day
  return true;
}

/**
 * Check if a date is off-schedule (Thursday or Saturday)
 */
export function isOffScheduleHarvest(date: Date): boolean {
  const dayOfWeek = date.getDay();
  // Thursday (4) or Saturday (6) are off-schedule
  return dayOfWeek === 4 || dayOfWeek === 6;
}

/**
 * Get the day name from a date
 */
export function getDayName(date: Date): string {
  return format(date, "EEEE");
}
