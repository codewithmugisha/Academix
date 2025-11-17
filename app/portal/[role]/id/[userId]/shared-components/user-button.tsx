import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Id } from '@/convex/_generated/dataModel';
import { signOut } from '@/convex/auth';
import { AvatarImage } from '@radix-ui/react-avatar'
import { Bell, LogOut, Settings, User } from 'lucide-react'


import { useAuthActions } from "@convex-dev/auth/react";
import { TooltipInstance } from './use-tool-tip';
import React from 'react';

interface User {
  id: Id<"users">;
  role: string | undefined;
  name: string | undefined;
  image: string | undefined;
  email: string | undefined;
}
interface Props {
  user: User;
  isLoading: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
}
const UserButton = ({user,isLoading, setCurrentPage}:Props) => {
    const avatarFallback = user?.name?.charAt(0)?.toUpperCase() || "?";
    
    const {signOut} = useAuthActions();
  return (
    <div className="flex justify-end">
          <DropdownMenu>
              <TooltipInstance title="me" >
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>

            </DropdownMenuTrigger>
              </TooltipInstance>
            <DropdownMenuContent className="w-56 bg-white space-y-2" align="end">
              <DropdownMenuLabel>
                <span className="truncate text-slate-700">{user?.name}</span>
              </DropdownMenuLabel>
              <DropdownMenuItem className="flex p-2 px-3 justify-start gap-x-3 overflow-hidden cursor-pointer items-center"
              onClick={()=>setCurrentPage("profile")}>
                <User size={24} />
                <span>My profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex p-2 px-3 justify-start gap-x-3 overflow-hidden cursor-pointer items-center"
              onClick={()=>setCurrentPage("preferences")}>
                <Settings size={24} />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex p-2 justify-start gap-x-3 bg-white overflow-hidden cursor-pointer items-center"
              onClick={()=>setCurrentPage("notification")}>
                <Bell size={24} />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex p-2 justify-start gap-x-3 bg-white overflow-hidden cursor-pointer items-center"
                onClick={() => signOut()}
              >
                <LogOut size={24} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  )
}

export default UserButton