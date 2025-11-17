"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GetCurrentUser } from "../api/get-current-user";

export default function AuthRedirect() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = GetCurrentUser();

  useEffect(() => {

    if (userLoading) {
      console.log("User still loading, skipping redirect...");
      return;
    }

    console.log("User loaded:", user);

    if (!user) {
      console.log("No user found, redirecting to /onboarding");
      router.replace("/onboarding");
      return;
    }

    const validRoles = ["instructor", "student"];
    if (validRoles.includes(user.role)) {
      const redirectPath = `/portal/${user.role}/id/${user.id}`;
      console.log("Valid role, redirecting to:", redirectPath);
      router.replace(redirectPath);
      return;
    }

    console.log("Invalid role:", user.role, "—redirecting to /onboarding");
    router.replace("/onboarding");
  }, [user, userLoading, router]);

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return <div>Redirecting.d..</div>;
}