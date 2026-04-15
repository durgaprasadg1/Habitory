import Image from "next/image";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";

export default function ProfileLayout({ user, stats, loading, img }) {
  return (
    <div className="min-h-screen bg-[#F8F5F2] px-4 py-8">
      <div className="max-w-xl mx-auto bg-white border border-[#E7E5E4] rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col items-center">

        <Image src={img} alt="User Profile Image" width={70} height={70} className="mx-auto my-4 rounded-full" />
        <ProfileHeader user={user} />
        </div>

        <ProfileStats stats={stats} loading={loading} />

      </div>
    </div>
  );
}
