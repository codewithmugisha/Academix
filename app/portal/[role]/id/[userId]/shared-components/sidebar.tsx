"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Users,
  Book,
  FileText,
  ClipboardList,
  CheckSquare,
  Bell,
  Menu,
  X,
  Settings,
  User,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "home", icon: <Home size={20} /> },
  { name: "Notifications", href: "notifications", icon: <Bell size={20} /> },
  { name: "Students", href: "students", icon: <Users size={20} /> },
  { name: "Submissions", href: "submission", icon: <Book size={20} /> },
  { name: "Exams", href: "exams", icon: <FileText size={20} /> },
  { name: "Quizzes", href: "quizzes", icon: <ClipboardList size={20} /> },
  { name: "Marks", href: "marks", icon: <CheckSquare size={20} /> },
  { name: "Claims", href: "claims", icon: <Bell size={20} /> },
  { name: "Profile", href: "profile", icon: <User size={20} /> },
  { name: "Preferences", href: "preferences", icon: <Settings size={20} /> },
];

interface UserProps {
  id: Id<"users">;
  name: string;
  role: string;
  email: string;
  image: string;
}

interface Props {
  user: UserProps;
  isLoading: boolean;
  currentPage: string; // Fixed: string for path comparison
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

export const Sidebar = ({ user: currentUser, isLoading, currentPage, setCurrentPage }: Props) => {
  const [open, setOpen] = useState(false);



  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant={"ghost"}
        className="cursor-pointer top-4 md:hidden p-2 rounded-md border bg-white shadow-lg hover:shadow-black"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg shadow-black p-6 transition-transform duration-300 ease-in-out z-40
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
      >
        <h2 className="text-2xl font-bold mb-8">{currentUser?.role} Panel</h2>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = currentPage === item.href;
            return (
              <Button
                key={item.href}
                size={"lg"}
                variant={"ghost"}
                onClick={() => setCurrentPage(item.href)}
                className={cn(
                  "relative flex items-center gap-3 p-3 rounded-lg font-medium overflow-hidden group",
                  "transition-all duration-200 ease transform hover:scale-[1.002]",
                  // Hover state
                  "hover:bg-slate-100 hover:text-slate-900",
                  // Active state with enhanced animation
                  isActive
                    ? [
                        "bg-slate-800 text-white shadow-md",
                        "hover:bg-slate-700 hover:scale-100", // Subtle scale reset on hover
                        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:transition-all after:duration-300 after:ease-in-out after:scale-x-100",
                      ]
                    : [
                        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-slate-800 after:transition-all after:duration-300 after:ease-in-out after:scale-x-0 group-hover:after:scale-x-100",
                      ]
                )}
              >
                <span className="relative z-10">{item.icon}</span> {/* Ensure icon doesn't clip */}
                <span className="hidden md:inline relative z-10">{item.name}</span>
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};