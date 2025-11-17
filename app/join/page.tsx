"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from 'react-verification-input'
import { toast } from "sonner";


const JoinPage = () =>{



    // const workspaceId = UseWorkspaceId(); //you can use this instead


    const handleComplete = (value:string) =>{

       

        }


    return (
        <div className="h-screen flex flex-col items-center justify-center gap-y-8 bg-white p-8 rounded-lg shadow-md">
            <Image src="/globe.svg" width={60} height={60} alt="join"/>
            <div className="flex flex-col gap-y-4 justify-center items-center max-w-md">
                <div className="flex flex-col gap-y-4 justify-center items-center">
                    <h1 className="text-2xl font-bold">Join </h1>
                   <p className="text-md text-muted-foreground">Enter a workspace code to join</p>
                </div>
                <VerificationInput 
                onComplete={handleComplete}
                length={6}
                autoFocus
                  classNames={{
                    container: cn("flex gap-x-2 cursor-not-allowed opacity-50"),
                    character: "border uppercase h-auto rounded-md bg-gray-300  flex items-center justify-center text-lg font-medium text-red-500",
                    characterInactive: "bg-muted",
                    characterSelected: "bg-white text-black",
                    characterFilled: "bg-white text-white"
                }}
                />
                
            </div>
            <Button
             size={"lg"}
             variant={"outline"}
             asChild>

                <Link href="/">
                Back to home
                </Link>


            </Button>
        </div>
    )
}

export default JoinPage