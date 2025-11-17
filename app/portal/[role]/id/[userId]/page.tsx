"use client"

import { GetCurrentUser } from "@/app/features/auth/api/get-current-user"
import InstructoreDashboard from "./dashboards/instructor-dashboard";
import StudentDashboard from "./dashboards/student-dashboard";
import { Loader2 } from "lucide-react";
import { UseCurrentUserParams } from "@/app/features/hooks/use-current-user-in-url";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboards = () => {

  const {data:user, isLoading} = GetCurrentUser();
  const params = UseCurrentUserParams();
  const router  = useRouter();
    useEffect(() =>{
    if (isLoading) return;
    
    if (user?.role !== params.role || user?.id !== params.userId) {
          router.replace(`/portal/${user?.role}/id/${user?.id}`);
    } 
    },[user, isLoading, params.role, params.userId, router]);
 
    
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Welcome...</span>
      </div>
    );
  }
  return (
    <div>
      {/* <InstructoreDashboard user={{name:"mugis",id:'k9777y0vgyhm4xyv5mawcvtpw97vfrfz',"email":"mugisha",image:"dkd"}} isLoading ={false}/> */}
      {user?.role === "instructor" ? <InstructoreDashboard  user={user} isLoading ={isLoading} /> : user?.role === "student" && <StudentDashboard user={user} isLoading ={isLoading}  />}
    </div>
  )
}

export default Dashboards