"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

export const SetMonthlyGoalDialog = ({ currentGoal, habits, onSetGoal }) => {
  const [open, setOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalHabitId, setGoalHabitId] = useState("");

  useEffect(() => {
    if (currentGoal) {
      setGoalTitle(currentGoal.title || "");
      setGoalDescription(currentGoal.description || "");
      setGoalHabitId(currentGoal.habitId || "");
    }
  }, [currentGoal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalTitle.trim()) {
      onSetGoal({
        goalTitle,
        goalDescription,
        goalHabitId: goalHabitId || undefined,
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[#A8A29E]/50 text-[#1C1917] hover:bg-[#E7E5E4]"
        >
          <Target className="w-4 h-4 mr-2 text-[#C08457]" />
          Set Monthly Goal
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#E7E5E4] border border-[#A8A29E]/40 text-[#1C1917]">
        <DialogHeader>
          <DialogTitle className="text-[#1C1917]">
            Set Monthly Goal
          </DialogTitle>
          <DialogDescription className="text-[#A8A29E]">
            Define your goal for this month. You can link it to one of your habits.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="goalTitle" className="text-sm font-medium text-[#1C1917]">
                Goal Title *
              </label>
              <input
                id="goalTitle"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="h-10 w-full rounded-md border border-[#A8A29E]/50 bg-white px-3 py-2 text-sm text-[#1C1917] focus:ring-1 focus:ring-[#C08457] focus:border-[#C08457]"
                placeholder="e.g., Read 20 Days"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="goalDescription" className="text-sm font-medium text-[#1C1917]">
                Description
              </label>
              <textarea
                id="goalDescription"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                className="min-h-20 w-full rounded-md border border-[#A8A29E]/50 bg-white px-3 py-2 text-sm text-[#1C1917] focus:ring-1 focus:ring-[#C08457] focus:border-[#C08457]"
                placeholder="e.g., Read at least 30 minutes daily"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="goalHabit" className="text-sm font-medium text-[#1C1917]">
                Link to Habit (Optional)
              </label>
              <select
                id="goalHabit"
                value={goalHabitId}
                onChange={(e) => setGoalHabitId(e.target.value)}
                className="h-10 w-full rounded-md border border-[#A8A29E]/50 bg-white px-3 py-2 text-sm text-[#1C1917] focus:ring-1 focus:ring-[#C08457] focus:border-[#C08457]"
              >
                <option value="">None</option>
                {habits.map((habit) => (
                  <option key={habit._id} value={habit._id}>
                    {habit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#A8A29E]/50 text-[#1C1917]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-[#C08457] hover:opacity-90 text-white"
            >
              Save Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
