"use client";

import { useState } from "react";
import { SignFlow } from "../../types";
import LoginCard from "./login";
import SignupCard from "./signup";

export const AuthScreen = () => {
    const [state, setState] = useState<SignFlow>("signIn");

  return (
    <div className="h-screen w-full p-0">
      <div className="flex h-full overflow-hidden flex-col md:flex-row justify-between">
        
        {/* Left Section */}
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-8 text-white bg-black text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
                Student & Instructor Management
        </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-md">
                Connecting educators and learners for effective academic progress.
         </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 bg-[#f6eedb] p-6">
          {state === "signIn" ?  <LoginCard setState={setState} /> : <SignupCard  setState={setState} />
         }
        </div>
      </div>
    </div>
  );
};
