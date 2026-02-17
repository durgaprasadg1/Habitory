"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

export const EditHabitDialog = ({ habit, onUpdate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(habit.name);
  const [category, setCategory] = useState(habit.category || "");
  const [isGoalHabit, setIsGoalHabit] = useState(habit.isGoalHabit || false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/habits/${habit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, isGoalHabit }),
      });

      if (!res.ok) {
        toast.error("Failed to update habit");
        return;
      }

      toast.success("Habit updated successfully!");
      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update habit");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will delete all tracking data for this habit.",
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/habits/${habit._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete habit");
        return;
      }

      toast.success("Habit deleted successfully!");
      setOpen(false);
      onDelete();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete habit");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-400 hover:text-white transition-colors"
        title="Edit habit"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md text-black">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update your habit details or delete it permanently.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Habit Name *
                </label>
                <input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isGoalHabit"
                  checked={isGoalHabit}
                  onChange={(e) => setIsGoalHabit(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="edit-isGoalHabit"
                  className="text-sm font-medium"
                >
                  Set as monthly goal habit
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>

              <div className="flex-1" />

              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
