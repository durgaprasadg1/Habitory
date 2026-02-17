"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "Health & Fitness",
  "Productivity",
  "Learning",
  "Finance",
  "Social",
  "Mindfulness",
  "Creativity",
  "Personal Growth",
  "Nutrition",
  "Sleep",
];

export const AddHabitDialog = ({ onAddHabit }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isGoalHabit, setIsGoalHabit] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAddHabit({ name, category, isGoalHabit });
      setName("");
      setCategory("");
      setIsGoalHabit(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#C08457] hover:opacity-90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#E7E5E4] border border-[#A8A29E]/40 text-[#1C1917]">
        <DialogHeader>
          <DialogTitle className="text-[#1C1917]">
            Add New Habit
          </DialogTitle>
          <DialogDescription className="text-[#A8A29E]">
            Create a new habit to track. You can mark it as your monthly goal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-[#1C1917]">
                Habit Name *
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-md border border-[#A8A29E]/50 bg-white px-3 py-2 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-1 focus:ring-[#C08457] focus:border-[#C08457]"
                placeholder="e.g., Exercise, Read, Meditate"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium text-[#1C1917]">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-white border border-[#A8A29E]/50 text-[#1C1917] focus:ring-1 focus:ring-[#C08457]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#E7E5E4] border border-[#A8A29E]/40 text-[#1C1917]">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="isGoalHabit"
                checked={isGoalHabit}
                onChange={(e) => setIsGoalHabit(e.target.checked)}
                className="h-4 w-4 rounded border-[#A8A29E]"
              />
              <label
                htmlFor="isGoalHabit"
                className="text-sm font-medium text-[#1C1917]"
              >
                Set as monthly goal habit
              </label>
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
              Add Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
