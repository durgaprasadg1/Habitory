"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Loader from "../../components/Home/Loader";
import ProfileLayout from "../../components/Profile/ProfileLayout";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const img  = user?.imageUrl
  console.log("User in ProfilePage:", );
  const fetchUserProfile = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) fetchUserProfile();
  }, [isLoaded, user]);

  if (!isLoaded)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  if (!user) return null;

  return (
    <>
   
    <ProfileLayout
      user={user}
      stats={profileData?.stats}
      loading={statsLoading}
      img = {img}
    />
  
   </>
   );
}
