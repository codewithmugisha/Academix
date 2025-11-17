
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sidebar } from "../shared-components/sidebar";

import { GetCurrentUser } from "@/app/features/auth/api/get-current-user";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { UseCurrentUserParams } from "@/app/features/hooks/use-current-user-in-url";
import { notFound, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Add for spinner; install if needed via lucide-react
import { Id } from "@/convex/_generated/dataModel";
import UserButton from "../shared-components/user-button";

import SettingsPage from "../instructors-components/StudentsPage";
import DashboardHome from "../instructors-components/Home";
import StudentsPage from "../instructors-components/StudentsPage";
import CoursesPage from "../instructors-components/submission";
import ExamsPage from "../instructors-components/ExamsPage";
import QuizzesPage from "../instructors-components/QuizzesPage";
import MarksPage from "../instructors-components/Marks";
import ClaimsPage from "../instructors-components/ClaimsPage";
import Profile from "../instructors-components/Profile";
import Preferences from "../instructors-components/Preferences";
import SubmissionPage from "../instructors-components/submission";
import NotificationsPage from "../instructors-components/Notification";

interface User {
  id: Id<"users">;
  role: "instructor";
  name: string;
  image: string;
  email: string;
  // Add other fields
}

interface Props {
  user: User; // Passed from page.tsx (SSR-friendly)
  isLoading: boolean;
}

interface DashboardLayout {
    currentPage: React.ReactNode,
    setCurrentPage:React.Dispatch<React.SetStateAction<string>>
}


const InstructoreDashboard = ({user: propUser, isLoading} :Props) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  useEffect(() => {
    setNotifications([
      "Alice submitted Exam 1",
      "Bob requested a claim",
      "Charlie enrolled in a new course",
    ]);
  }, []);

  const { data: user, isLoading: userLoading} = GetCurrentUser(); // Assume your hook supports error
  const params = UseCurrentUserParams();
  const router = useRouter();

  useEffect(() => {
    if (userLoading) return; // Early bail during load

    if (!user) {
      router.replace("/onboarding"); // Or login, if unauth
      return;
    }

    const expectedPath = `/portal/${user.role}/id/${user.id}`;
    const currentPath = `/portal/${params.role}/id/${params.userId}`;

    // Check mismatch and avoid self-redirect loop
    if (params.userId !== user.id || params.role !== user.role || currentPath !== expectedPath) {
      console.log("URL mismatch detected—redirecting for security:", { params, user }); // Debug log
      router.replace(expectedPath);
      return;
    }
  }, [router, user, userLoading, params.userId, params.role]); // Granular deps for stability

  // Loading state
  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState("home");

const renderCurrentPage = () => {
  switch(currentPage) {
    case "home":
        return <DashboardHome setCurrentPage={setCurrentPage} user={propUser} isLoading={isLoading}  />
    case "preferences":
        return <Preferences  />
    case "students":
        return <StudentsPage  />
    case "submission":
        return <SubmissionPage />
    case "exams":
        return <ExamsPage />
    case "quizzes":
        return <QuizzesPage />
    case "marks":
        return <MarksPage />
    case "claims":
        return <ClaimsPage />
    case "notifications":
        return <NotificationsPage />
    case "profile":
        return <Profile user={propUser} />
    default:
      return notFound();
  };

}
  return (
    <div className="flex h-screen">
      <Sidebar
          currentPage ={currentPage}
          setCurrentPage = {setCurrentPage}
          user={propUser} isLoading = {isLoading}
       />
      <main className="flex-1 p-6 md:ml-10 overflow-y-scroll">
        <UserButton user={propUser} isLoading={isLoading} setCurrentPage={setCurrentPage}/>
        {renderCurrentPage()}
      </main>
   
    </div>
  );
};

export default InstructoreDashboard;