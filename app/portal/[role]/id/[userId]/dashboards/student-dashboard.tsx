// app/portal/[role]/id/[userId]/StudentDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {  DashboardHeader } from "../shared-components/DashboardHeader"; // Reuse shared
import { GetCurrentUser } from "@/app/features/auth/api/get-current-user";
import { UseCurrentUserParams } from "@/app/features/hooks/use-current-user-in-url";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Sidebar } from "../shared-components/sidebar";
import UserButton from "../shared-components/user-button";

interface User {
  id: Id<"users">;
  role: string | undefined;
  name: string | undefined;
  image: string | undefined;
  email: string | undefined;
  // Add other fields
}

interface Props {
  user: User; // Passed from page.tsx (SSR-friendly)
  isLoading: boolean;
}

const StudentDashboard = ({ user: propUser , isLoading }: Props) => {
    
  const [notifications, setNotifications] = useState<string[]>([]);
  useEffect(() => {
    setNotifications(["New course available", "Assignment due tomorrow"]); // Fetch from Convex if dynamic
  }, []);

  const finalUser = propUser;
  const { signOut } = useAuthActions();
  const params = UseCurrentUserParams();
  const router = useRouter();

  // Security check (your existing logic)

 

  return (
    <div className="flex min-h-screen">
      <Sidebar  user={propUser}  isLoading={isLoading}/>
      <main className="flex-1 p-6 md:ml-10">
        <UserButton user={propUser} isLoading={isLoading} />

        <DashboardHeader user={finalUser} signOut={signOut} />
        <h1 className="text-3xl font-bold mb-2">Welcome, Student!</h1>
        <p className="text-muted-foreground mb-6">Your learning dashboard.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader><CardTitle>Enrolled Courses</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">5</CardContent>
          </Card>
          {/* More student-specific cards */}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <ul className="list-disc list-inside space-y-1">
            {notifications.map((n, idx) => <li key={idx} className="text-gray-700">{n}</li>)}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;