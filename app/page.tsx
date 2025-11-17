"use client";

import { GetCurrentUser } from "./features/auth/api/get-current-user";
import AuthRedirect from "./features/auth/components/AuthRedirect";


export default function Home() {
const {data, isLoading} = GetCurrentUser();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <AuthRedirect />
        
      </main>
    </div>
  );
}
