"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Copy, X } from "lucide-react";
import { toast } from "sonner";

export function CopyHabitsDialog({ open, onOpenChange, onCopyComplete }) {
  const [loading, setLoading] = useState(false);

  const handleCopyHabits = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/habits/copy-from-previous-month", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to copy habits");
        return;
      }

      const result = await res.json();
      toast.success(result.message || "Habits copied successfully!");
      onOpenChange(false);
      if (onCopyComplete) {
        onCopyComplete();
      }
    } catch (error) {
      toast.error("Failed to copy habits");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Mark that user has been asked for this month
      await fetch("/api/user/mark-habits-asked", {
        method: "POST",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to mark habits asked:", error);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#F8F5F2] border-[#A8A29E]/40">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1C1917]">
            <Calendar className="w-5 h-5 text-[#C08457]" />
            New Month Started!
          </DialogTitle>
          <DialogDescription className="text-[#A8A29E] pt-2">
            Would you like to continue with the same habits from last month?
            This will copy all your habits to the current month, so you don't
            have to add them manually again.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-4 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={loading}
            className="border-[#A8A29E]/40 text-[#1C1917] hover:bg-[#E7E5E4]  mr-5"
          >
            <X className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button
            type="button"
            onClick={handleCopyHabits}
            disabled={loading}
            className="bg-[#C08457] text-white hover:bg-[#A86D42]"
          >
            <Copy className="w-4 h-4 mr-2" />
            {loading ? "Copying..." : "Keep Same Habits"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
