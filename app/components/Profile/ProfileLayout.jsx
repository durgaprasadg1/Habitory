import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";

export default function ProfileLayout({ user, stats, loading }) {
  return (
    <div className="min-h-screen bg-[#F8F5F2] px-4 py-8">
      <div className="max-w-xl mx-auto bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-6 shadow-sm">

        <ProfileHeader user={user} />

        <ProfileStats stats={stats} loading={loading} />

      </div>
    </div>
  );
}
