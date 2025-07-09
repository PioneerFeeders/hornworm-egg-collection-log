import React, { useState } from "react";
import { Target, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gramsToEggs } from "@/lib/waxworm-utils";

interface GoalSettingProps {
  currentGoal: number; // in grams
  onSave: (goalGrams: number) => void;
  isLoading?: boolean;
}

export function GoalSetting({
  currentGoal,
  onSave,
  isLoading = false,
}: GoalSettingProps) {
  const [goalInput, setGoalInput] = useState<string>(currentGoal.toString());
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (value: string) => {
    setGoalInput(value);
    setHasChanges(value !== currentGoal.toString());
  };

  const handleSave = () => {
    const goal = parseFloat(goalInput) || 0;
    onSave(goal);
    setHasChanges(false);
  };

  const goalValue = parseFloat(goalInput) || 0;
  const eggCount = gramsToEggs(goalValue);

  return (
    <Card className="border-retro-200 shadow-lg bg-gradient-to-br from-white to-retro-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-retro-800 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form name="weekly-goal" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="weekly-goal" />
        </form>
        <div className="space-y-2">
          <Label htmlFor="goal" className="text-retro-700">
            Target (grams per week)
          </Label>
          <Input
            id="goal"
            type="number"
            step="0.01"
            min="0"
            value={goalInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter weekly goal in grams"
            className="border-retro-200 focus:border-retro-400 focus:ring-retro-400"
          />
          {goalValue > 0 && (
            <p className="text-sm text-retro-600 font-medium">
              ≈ {eggCount.toLocaleString()} eggs per week
            </p>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className="w-full bg-gradient-to-r from-retro-600 to-retro-500 hover:from-retro-700 hover:to-retro-600 text-white shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Goal"}
        </Button>

        {currentGoal > 0 && !hasChanges && (
          <div className="text-center p-3 bg-retro-50 rounded-lg border border-retro-200">
            <p className="text-sm text-retro-700">
              Current goal: <strong>{currentGoal}g</strong> (
              {gramsToEggs(currentGoal).toLocaleString()} eggs) per week
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
