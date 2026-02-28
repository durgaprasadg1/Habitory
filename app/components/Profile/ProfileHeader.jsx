export default function ProfileHeader({ user }) {
  return (
    <>
      <div className="flex items-center ">
        <div>
          <h1 className="text-lg font-semibold text-[#1C1917]">
            {user?.firstName
              ? `${user.firstName} ${user.lastName || ""}`
              : "—"}
          </h1>
          <p className="text-sm text-[#78716C]">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      <div className="border-t border-[#E7E5E4]" />
    </>
  );
}
