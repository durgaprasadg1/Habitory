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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
    } catch {
      toast.error("Failed to update habit");
    }
  };

  const handleDelete = async () => {
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
      setDeleteDialogOpen(false);
      setOpen(false);
      onDelete();
    } catch {
      toast.error("Failed to delete habit");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[#A8A29E] hover:text-[#1C1917] transition-colors"
        title="Edit habit"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-[#E7E5E4] border border-[#A8A29E]/40 text-[#1C1917]">
          <DialogHeader>
            <DialogTitle className="text-[#1C1917]">Edit Habit</DialogTitle>
            <DialogDescription className="text-[#A8A29E]">
              Update your habit details or delete it permanently.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label
                  htmlFor="edit-name"
                  className="text-sm font-medium text-[#1C1917]"
                >
                  Habit Name *
                </label>
                <input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-md border border-[#A8A29E]/50 bg-white px-3 py-2 text-sm text-[#1C1917] focus:ring-1 focus:ring-[#C08457] focus:border-[#C08457]"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="edit-category"
                  className="text-sm font-medium text-[#1C1917]"
                >
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
                <input
                  type="checkbox"
                  id="edit-isGoalHabit"
                  checked={isGoalHabit}
                  onChange={(e) => setIsGoalHabit(e.target.checked)}
                  className="h-4 w-4 rounded border-[#A8A29E]"
                />
                <label
                  htmlFor="edit-isGoalHabit"
                  className="text-sm font-medium text-[#1C1917]"
                >
                  Set as monthly goal habit
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
                className="bg-[#DC2626] hover:opacity-90 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>

              <div className="flex-1" />

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
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#E7E5E4] border border-[#A8A29E]/40 text-[#1C1917]">
          <DialogHeader>
            <DialogTitle className="text-[#DC2626]">Delete Habit</DialogTitle>
            <DialogDescription className="text-[#A8A29E]">
              Are you sure you want to delete this habit? This will permanently
              delete all tracking data for "{habit.name}". This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="border-[#A8A29E]/50 text-[#1C1917]"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[#DC2626] hover:opacity-90 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Habit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
