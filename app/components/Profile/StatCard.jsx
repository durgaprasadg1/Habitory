export default function StatCard({ label, value }) {
  return (
    <div className="bg-[#F8F5F2] p-3 rounded-lg">
      <p className="text-[#78716C] text-xs">{label}</p>
      <p className="text-[#1C1917] font-semibold text-xl">
        {value}
      </p>
    </div>
  );
}
