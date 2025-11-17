"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, User, Clock } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { TooltipInstance } from "./use-tool-tip";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEnrollInstructor } from "@/app/features/instructors/api/enroll-instructor";
import { toast } from "sonner";

export type  User =  {
  id: Id<"users">;
  role: "student" | "instructor";
  name: string;
  email: string;
  image?: string;
}

// Props interface
interface Props {
  open: boolean;
  user: Member | null;
  authedUser: User
  onOpenChange?: (open: boolean) => void;
  setOnOpenChange?: (open: boolean) => void;
}

// Member type (from table context)
export type Member = {
  _id: Id<"users">;
  _creationTime: number;
  email?: string | undefined;
  name?: string | undefined;
  role?: "instructor" | "student" | "unallocated" | undefined;
  image?: string | undefined;
  emailVerificationTime?: number | undefined;
  phone?: string | undefined;
  phoneVerificationTime?: number | undefined;
  isAnonymous?: boolean | undefined;
};

const getRoleVariant = (role?: Member["role"]) => {
  switch (role) {
    case "instructor":
      return "default" as const;
    case "student":
      return "secondary" as const;
    case "unallocated":
      return "outline" as const;
    default:
      return "outline" as const;
  }
};

const formatDate = (timestamp?: number) => {
  if (!timestamp) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
};





type Role = "student"|"instructor"


export const UserDialog = ({ open, user, onOpenChange,setOnOpenChange, authedUser }: Props) => {
  if (!user) return null;

  const [openModal, setOpenModal] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [pending, setPending] = useState(false);
  const [response, setResponse] = useState("");

  const {data,mutate,error,} = useEnrollInstructor();
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
    if(currentRole === "instructor"){
    e.preventDefault();

    setPending(true);
    mutate({courseCode, courseName, enrollee:user._id, role:currentRole},{
      onSuccess:(data) => {
         console.log(data);
         toast.success(data?.message || "Email sent successfully!");
         setOpenModal(false);
         onOpenChange(false);
      },
      onError:(error)=>{
        console.log(error)
      },
      onSettled:()=>{
        console.log("settled");
        setPending(false)
      }
    })

    setCourseCode("");
    setCourseName("");
  }
  else if(currentRole === "student") {

    
    console.log("sent")// to do 
  }
    
  }

  return (
    <>
    
   
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name ?? "Anonymous User"}</h3>
              <Badge variant={getRoleVariant(user.role)} className="mt-1">
                {user.role ?? "unallocated"}
              </Badge>
             </div>
          </DialogTitle>
          <DialogDescription>
            {authedUser?.id === user._id && "Me"}
            Detailed view of user {user.name ?? "ID"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email */}
          {user.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {user.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm">{user.phone}</p>
              </div>
            </div>
          )}

          {/* Account Created */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Account Created</p>
              <p className="text-sm">{formatDate(user._creationTime)}</p>
            </div>
          </div>

          {/* Email Verified */}
          {user.emailVerificationTime && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Verified</p>
                <p className="text-sm">{formatDate(user.emailVerificationTime)}</p>
              </div>
            </div>
          )}

          {/* Phone Verified */}
          {user.phoneVerificationTime && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone Verified</p>
                <p className="text-sm">{formatDate(user.phoneVerificationTime)}</p>
              </div>
            </div>
          )}

          {/* Anonymous */}
          {user.isAnonymous && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Anonymous Account</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            
           {!user?.role && authedUser?.role === "instructor" 
           &&<TooltipInstance title="Open the enrollment form">
             <Button className="flex-1 cursor-pointer"
           onClick={()=>setOpenModal(true)}
            >Enroll (him/her)</Button>
           </TooltipInstance>
           }

          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={openModal} onOpenChange={setOpenModal} >
      <DialogContent className="space-y-1.5 overflow-y-auto w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
             Enroll {user?.name}
          </DialogTitle>
          <DialogDescription>
            {user.name} will receive an invitation on {user?.email}
          </DialogDescription>
        </DialogHeader>

          {/* Email */}
          <form  className=" py-4 space-y-3" onSubmit={handleSubmit}>
            <div className="flex gap-x-2 items-center">
              <label htmlFor="">Choose an Option</label>
              <Select onValueChange={(value)=> setCurrentRole(value as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder = "Select an option"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectGroup>

                </SelectContent>
              </Select>              
            </div>

            {/*  using hooks functionality  to determine the form design*/}

            {currentRole === "student" ?
            ""
            :
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <label htmlFor="courseName">Course Name</label>
                <Input 
                  type="text"
                  id="courseName"
                  value={courseName}
                  onChange={(e)=>setCourseName(e.target.value)}
                  placeholder="eg:Mathematics"
                  disabled={pending}/>
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="courseCode">Course code</label>
                <Input 
                  type="text"
                  id="courseCode"
                  value={courseCode}
                  onChange={(e)=>setCourseCode(e.target.value)}
                  placeholder="eg:E404204D"
                 disabled={pending}/>
              </div>
            </div>
            }
          <DialogFooter className="flex justify-between w-full gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={pending} onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </DialogClose>
            <TooltipInstance title="Send & save changes">
              <Button className="gap-2" disabled={pending || !currentRole}>
                <Mail size={20} />
                <span>Send</span>
              </Button>

            </TooltipInstance>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
     
     </>
  );
};