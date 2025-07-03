import React from "react";
import { Target, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoalSetting } from "@/components/GoalSetting";
import { TrendsChart } from "@/components/TrendsChart";
import { TrendData } from "@shared/api";

interface TabsSectionProps {
  currentGoal: number;
  onSaveGoal: (goalGrams: number) => void;
  trendData: TrendData[];
  isLoading?: boolean;
}

export function TabsSection({
  currentGoal,
  onSaveGoal,
  trendData,
  isLoading = false,
}: TabsSectionProps) {
  return (
    <Tabs defaultValue="goals" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-retro-100 border border-retro-200">
        <TabsTrigger
          value="goals"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-retro-500 data-[state=active]:to-retro-400 data-[state=active]:text-white"
        >
          <Target className="h-4 w-4" />
          Goals
        </TabsTrigger>
        <TabsTrigger
          value="analytics"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-500 data-[state=active]:to-neon-400 data-[state=active]:text-white"
        >
          <TrendingUp className="h-4 w-4" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="goals" className="mt-6">
        <GoalSetting
          currentGoal={currentGoal}
          onSave={onSaveGoal}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <TrendsChart data={trendData} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
