import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback } from "react";

type requestType = {}
export const EnrollMember = () =>{
    
  const mutate = useMutation(api.instructors.enrollInstructor);

  const mutation = useCallback(()=>{},[])
}