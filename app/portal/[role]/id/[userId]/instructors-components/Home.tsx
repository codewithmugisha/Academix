// app/portal/[role]/id/[userId]/home.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Mail, BookOpen, Award, Bell, UserPlus, TrendingUp, Calendar, Star, X, EyeClosed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { GetInstructorConcerns } from "@/app/features/instructors/api/get-instructor-concerns";
import { CommunityTable } from "../shared-components/community-table";
import { cn } from "@/lib/utils";
import { TooltipInstance } from "../shared-components/use-tool-tip";

interface User {
  id: Id<"users">;
  role: "student" | "instructor";
  name: string;
  email: string;
  image?: string;
}

interface Props {
  user?: User;
  isLoading: boolean,
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
}

const DashboardHome = ({ user ,setCurrentPage, isLoading:userLoading}: Props) => {

  const {data:InstructorsData, isLoading:dataLoading} = GetInstructorConcerns();
 
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [totalStudents, setTotalStudents] = useState<number | undefined>(0);
  const [pendingClaims, setPendingClaims] = useState<number | undefined>(0);
  const [upcommingExams, setUpcommingExams] = useState<number | undefined>(0);
  const [countNotification, setCountNotification] = useState<undefined |number>(0);
  const [communityHidden, setHideCommunity] = useState<boolean>(false);

  //query instructor-concerns
  // const { myStudents, exams,receivedNotifications,sentNotifications} = InstructorsData;
  useEffect(() =>{
    if(dataLoading) return;
    console.log({InstructorsData})
    const countStudents = () => setTotalStudents(InstructorsData?.myStudents.length);
    
    const countClaims = () =>  setPendingClaims(InstructorsData?.claims.length);
  
    const countExams = () =>    setUpcommingExams(InstructorsData?.exams.length);

         // todo sent notification count
    const countReceivedNotifications = () =>  setCountNotification(InstructorsData?.receivedNotifications.length);
    
   
    
  },[dataLoading, InstructorsData])

  const handleInvite = () => {
    if (!inviteEmail) return;
    console.log("Invite sent to:", inviteEmail, "as", user?.role === "instructor" ? "student" : "instructor");
    setInviteEmail("");
    setShowInviteModal(false);
    // setNotifications((prev) => [...prev, `Invite sent to ${inviteEmail}`]);
  };
  
  const avatarFallback = user?.name?.charAt(0)?.toUpperCase() || "?";
  
  if (userLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-8">
        {/* Header skeleton */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Stat cards skeleton*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent activity skeleton */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-4 w-4 rounded-full"  />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }
  
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <span className="text-red-500">User not found</span>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* User Details Header */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <TooltipInstance title="view profile">
            <Avatar className="h-12 w-12" onClick={()=>setCurrentPage("profile")}>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>

            </TooltipInstance>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={"secondary" }>{user.role}</Badge>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>
          <TooltipInstance title = "To add a new student">
          
          <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 self-start md:self-auto">
            <UserPlus size={20} />
            Enroll a student
          </Button>

          </TooltipInstance>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <TooltipInstance title="view students">

          <Card className="cursor-pointer bg-white flex-1 shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={()=> setCurrentPage("students")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Students Enrolled
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </TooltipInstance>
       <TooltipInstance title="view pending claims">
        <Card className="flex-1 cursor-pointer bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
         onClick={()=> setCurrentPage("claims")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
               Pending Claims
            </CardTitle>
            <Mail className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">{pendingClaims}</div>
            <p className="text-xs text-red-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 rotate-180" />
              -3 pending
            </p>
          </CardContent>
        </Card>
     </TooltipInstance>
{/* upcoming exams */}
   <TooltipInstance title="view upcoming exams">
        <Card className="flex-1 cursor-pointer bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
         onClick={()=> setCurrentPage("exams")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
                Upcoming Exams
             </CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">{upcommingExams}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Next: Nov 20
            </p>
          </CardContent>
        </Card>
   </TooltipInstance>

    <TooltipInstance title="view notifications">
        <Card className="flex-1 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-200"
         onClick={()=> setCurrentPage("notifications")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">{countNotification}</div>
      {/* // ------------ */}
            <p className="text-xs text-indigo-600 flex items-center gap-1">
              <Star className="h-3 w-3" />
              2 unread
            </p>
          </CardContent>
        </Card>

    </TooltipInstance>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white shadow-sm cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {!InstructorsData?.receivedNotifications &&( <li
                
                className="flex items-center space-x-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <span>No recent activites</span>
              </li>)}
          <ul className="space-y-3">
            {InstructorsData?.receivedNotifications.map((notification, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Award className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>{notification.description}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* community members */}
      <div className="flex flex-col gap-y-1.5 mt-6">
                <div className="w-full flex justify-end">
                <TooltipInstance title={communityHidden ? "show community": "Hide community"}>
                {communityHidden ?<EyeClosed size={24} className="bg-gray-100 cursor-pointer" onClick={()=>setHideCommunity(!communityHidden)}/> : <X size={24} className="bg-gray-100 cursor-pointer" onClick={()=>setHideCommunity(true)}/>}
                </TooltipInstance>
                
                </div>
            <Card className={cn("bg-white transition-all ease-in-out", communityHidden && "hidden")} >
              <CardHeader className="flex justify-between">
                <CardTitle>Our community overview</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-x-1">
                <div className="flex flex-col gap-y-1.5 items-center">
                <Badge>Instructors</Badge>
                  <span>127</span>
                </div>
                <div className="flex flex-col gap-y-1.5 items-center">
                <Badge>Students</Badge>
                  <span>120</span>
                </div>
                <div className="flex flex-col gap-y-1.5 items-center">
                <Badge variant={"destructive"}>Unallocated</Badge>
                  <span>120</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                 <CardTitle>
                    Community
                 </CardTitle>
                 <CardContent>
                   <CommunityTable user={user} />  

                 </CardContent>
              </CardHeader>
            </Card>
          </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className={cn("fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",communityHidden && "hidden")}>
          <Card className={cn("w-full max-w-md p-6 transition-all")}>
            <CardHeader>
              <CardTitle className="text-gray-900">
                Invite a {user.role === "instructor" ? "Student" : "Instructor"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button onClick={handleInvite} className="flex-1">
                  Send Invite
                </Button>
                <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
          
        </div>
      )}
    </main>
  );
};

export default DashboardHome;