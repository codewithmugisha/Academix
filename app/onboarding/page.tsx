"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User, GraduationCap, BookOpen } from "lucide-react";
import { GetCurrentUser } from "../features/auth/api/get-current-user";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function OnboardingPage() {
  const {data:user, isLoading:userLoading} = GetCurrentUser();
  const {signOut} = useAuthActions();
  return (
    <div className="min-h-screen w-full bg-[rgb(246,238,219)] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-6">
        {/* todo is logo */}
        {/* <Image src="/logo.png" alt="Academix Logo" width={120} height={120} /> */}
         <h1 className="text-4xl font-black text-slate-500">Academix</h1>
      </div>

      {/* Title & Description */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-xl mb-10"
      >
        <h1 className="text-3xl font-bold text-black mb-2">{user?.name} Welcome to Academix</h1>
        <p className="text-black/70 text-base">
          Your account is successfully registered. While waiting for admin approval, explore what you can expect from our platform.
          <Button className="cursor-pointer" size={"sm"} onClick={()=>signOut()}>Logout for now</Button>
        </p>
      </motion.div>

      {/* Three Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="rounded-2xl shadow-md p-1">
          <CardContent className="flex flex-col items-center p-6 gap-4">
            <GraduationCap className="w-10 h-10 text-black" />
            <h2 className="font-semibold text-xl text-black">Student Dashboard</h2>
            <p className="text-black/60 text-sm text-center">
              Access your courses, track your learning progress, and manage assignments efficiently.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md p-1">
          <CardContent className="flex flex-col items-center p-6 gap-4">
            <User className="w-10 h-10 text-black" />
            <h2 className="font-semibold text-xl text-black">Instructor Tools</h2>
            <p className="text-black/60 text-sm text-center">
              Manage classes, upload materials, and guide students through an interactive learning experience.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md p-1">
          <CardContent className="flex flex-col items-center p-6 gap-4">
            <BookOpen className="w-10 h-10 text-black" />
            <h2 className="font-semibold text-xl text-black">Resource Library</h2>
            <p className="text-black/60 text-sm text-center">
              Access learning materials, guides, and resources curated for both students and instructors.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}