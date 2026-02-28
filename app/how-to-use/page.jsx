"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Home,
  Plus,
  Target,
  Calendar,
  Check,
  BarChart3,
  History,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Edit,
  Trash2,
} from "lucide-react";

export default function HowToUsePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F8F5F2] text-[#1C1917] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#C08457] mb-2">
            How to Use Habit Tracker
          </h1>
          <p className="text-[#A8A29E]">
            Your simple guide to building better habits, one day at a time
          </p>
        </div>

        {/* Introduction */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="text-[#1C1917] text-xl">
              Welcome! 👋
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[#1C1917] space-y-3">
            <p>
              This app helps you track your daily habits and achieve your
              monthly goals. It's easy to use and designed to keep you
              motivated!
            </p>
            <p className="font-semibold text-[#C08457]">
              Let's get started with the basics: 
            </p>
          </CardContent>
        </Card>

        {/* Navigation Section */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              🧭 Navigate Around
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#1C1917]">
              At the top of every page, you'll find four main buttons:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Home className="w-5 h-5 text-[#C08457]" />
                <div>
                  <p className="font-semibold text-sm">Dashboard</p>
                  <p className="text-xs text-[#A8A29E]">Your main workspace</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <BarChart3 className="w-5 h-5 text-[#C08457]" />
                <div>
                  <p className="font-semibold text-sm">Analytics</p>
                  <p className="text-xs text-[#A8A29E]">See your progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <History className="w-5 h-5 text-[#C08457]" />
                <div>
                  <p className="font-semibold text-sm">History</p>
                  <p className="text-xs text-[#A8A29E]">View past months</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <User className="w-5 h-5 text-[#C08457]" />
                <div>
                  <p className="font-semibold text-sm">Profile</p>
                  <p className="text-xs text-[#A8A29E]">Your stats & info</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Dashboard */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <Home className="w-5 h-5 text-[#C08457]" />
              Step 1: Your Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>
              The <strong>Dashboard</strong> is where you'll spend most of your
              time. Here you can see all your habits and track them daily.
            </p>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="font-semibold text-sm">Switch Months:</p>
              <div className="flex items-center gap-2 text-sm text-[#A8A29E]">
                <ChevronLeft className="w-4 h-4" />
                <span>Click the arrows to move between months</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Add Habits */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <Plus className="w-5 h-5 text-[#C08457]" />
              Step 2: Add Your First Habit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>Time to create your first habit!</p>
            <div className="bg-white p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <span className="bg-[#C08457] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <p className="text-sm">
                  Click the{" "}
                  <strong className="text-[#C08457]">"Add Habit"</strong> button
                  <Plus className="w-3 h-3 inline mx-1" /> on your dashboard
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-[#C08457] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <p className="text-sm">
                  Enter a habit name (e.g., "Exercise", "Read", "Meditate")
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-[#C08457] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <p className="text-sm">
                  Choose a category (like Health & Fitness, Learning, etc.)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-[#C08457] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                  4
                </span>
                <p className="text-sm">Click "Add Habit" and you're done!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Set Monthly Goal */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <Target className="w-5 h-5 text-[#C08457]" />
              Step 3: Set Your Monthly Goal (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>
              Pick <strong>one habit</strong> each month to focus on as your
              main goal. This helps you stay focused!
            </p>
            <div className="bg-white p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <span className="bg-[#C08457] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <p className="text-sm">
                  Look for the <strong>"Set Monthly Goal"</strong> button
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-[#C08457] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <p className="text-sm">
                  Select which habit you want to focus on this month
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-[#C08457] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <p className="text-sm">
                  Watch your progress bar fill up as you complete this habit!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Track Daily */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <Check className="w-5 h-5 text-[#C08457]" />
              Step 4: Track Your Habits Daily
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>
              This is the most important part - marking your habits as complete
              each day!
            </p>
            <div className="bg-white p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-[#C08457] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1">
                    Open the Calendar:
                  </p>
                  <p className="text-sm text-[#A8A29E]">
                    Click the <Calendar className="w-3 h-3 inline" /> calendar
                    icon next to any habit to see all the days of the month
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#C08457] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-1">
                    Mark as Complete:
                  </p>
                  <p className="text-sm text-[#A8A29E]">
                    Click on today's date to mark it done. A checkmark ✓ will
                    appear!
                  </p>
                </div>
              </div>
              <div className="bg-[#F8F5F2] p-3 rounded">
                <p className="text-xs text-[#A8A29E] italic">
                  💡 Tip: You can only edit the current month. Past months are
                  saved and protected!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: View Analytics */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <BarChart3 className="w-5 h-5 text-[#C08457]" />
              Step 5: Check Your Progress (Analytics)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>
              Want to see how well you're doing? Head to the{" "}
              <strong>Analytics</strong> page!
            </p>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-sm">Here you'll find:</p>
              <ul className="space-y-2 ml-4">
                <li className="text-sm flex items-start gap-2">
                  <span className="text-[#C08457]">•</span>
                  <span>
                    <strong>Overview Cards:</strong> Quick stats on your
                    performance
                  </span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-[#C08457]">•</span>
                  <span>
                    <strong>Charts:</strong> Visual graphs showing your trends
                  </span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-[#C08457]">•</span>
                  <span>
                    <strong>Category Breakdown:</strong> See which areas you're
                    strongest in
                  </span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-[#C08457]">•</span>
                  <span>
                    <strong>Weekly Trends:</strong> Track your consistency week
                    by week
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 6: View History */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <History className="w-5 h-5 text-[#C08457]" />
              Step 6: Look Back at History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>
              The <strong>History</strong> page lets you review any previous
              month's data.
            </p>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p className="text-sm">
                Use the dropdown menu to select any past month and see:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="text-sm flex items-start gap-2">
                  <span className="text-[#C08457]">•</span>
                  <span>Your habits and completion rates</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-[#C08457]">•</span>
                  <span>Which goals you achieved</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-[#C08457]">•</span>
                  <span>Charts showing your performance trends</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 7: Edit & Delete */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <Edit className="w-5 h-5 text-[#C08457]" />
              Managing Your Habits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>Need to change or remove a habit? No problem!</p>
            <div className="bg-white p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <Edit className="w-4 h-4 text-[#C08457] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Edit a Habit:</p>
                  <p className="text-sm text-[#A8A29E]">
                    Click the edit icon next to any habit to change its name or
                    category
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Trash2 className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Delete a Habit:</p>
                  <p className="text-sm text-[#A8A29E]">
                    In the edit menu, you'll find a delete option to remove
                    habits you no longer need
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bonus Feature */}
        <Card className="bg-linear-to-br from-[#C08457]/10 to-[#E7E5E4] border border-[#C08457]/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1C1917]">
              <Sparkles className="w-5 h-5 text-[#C08457]" />
              Bonus: AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[#1C1917]">
            <p>
              Click the <strong className="text-[#C08457]">"AI Summary"</strong>{" "}
              button on your dashboard to get a smart summary of your progress!
            </p>
            <p className="text-sm text-[#A8A29E]">
              The AI will analyze your habits and give you personalized
              insights.
            </p>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 mb-6">
          <CardHeader>
            <CardTitle className="text-[#1C1917]">
              💡 Pro Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-[#1C1917]">
                <strong>Start Small:</strong> Begin with 2-3 habits. It's better
                to do a few well than many poorly!
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-[#1C1917]">
                <strong>Be Consistent:</strong> Check in daily, even if just for
                a minute. Consistency is key!
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-[#1C1917]">
                <strong>Review Weekly:</strong> Check your analytics every week
                to see your progress and stay motivated.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-[#1C1917]">
                <strong>Be Honest:</strong> Only mark habits as complete when
                you actually do them. This app works best with honesty!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-linear-to-br from-[#C08457] to-[#C08457]/80 border-none text-white mb-6">
          <CardContent className="py-6 text-center space-y-4">
            <h3 className="text-xl font-bold">Ready to Start?</h3>
            <p className="text-sm opacity-90">
              You now know everything you need to build better habits!
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-[#C08457] hover:bg-[#E7E5E4] font-semibold"
            >
              Go to Dashboard
              <Home className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-[#A8A29E] pb-4">
          <p>Need help? Just come back to this page anytime for a refresher.</p>
          <p className="mt-2">Happy habit tracking! 🎯</p>
        </div>
      </div>
    </main>
  );
}
