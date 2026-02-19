import StatCard from "./StatCard";

export default function ProfileStats({ stats, loading }) {
  return (
    <div>
      <h2 className="text-md font-semibold text-[#1C1917] mb-3">
        Profile Statistics
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`bg-[#F8F5F2] p-3 rounded-lg animate-pulse ${
                i === 4 ? "col-span-2" : ""
              }`}
            >
              <div className="h-3 bg-[#E7E5E4] rounded w-20 mb-2"></div>
              <div className="h-6 bg-[#E7E5E4] rounded w-12"></div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Habits" value={stats.totalHabits} />
          <StatCard label="Active Habits" value={stats.activeHabits} />
          <StatCard label="Total Logs" value={stats.totalLogs} />
          <StatCard label="Current Streak" value={`${stats.currentStreak} days`} />
          <div className="col-span-2">
            <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
          </div>
        </div>
      ) : (
        <p className="text-[#78716C] text-sm">
          Unable to load statistics
        </p>
      )}
    </div>
  );
}
