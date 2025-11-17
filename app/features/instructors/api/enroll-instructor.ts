import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

type Role = "instructor" | "student"
type requestType = {courseName: string, courseCode:string, enrollee:Id<"users">, role:Role}
type responseType ={message:string } | null;

type Options = {
  onSuccess?: (data: responseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
}
export const useEnrollInstructor = () =>{
    
  const [data, setData] = useState<responseType>(null);
  const [error, setError]  = useState<Error | null>(null);
  const [status, setStatus] = useState<"isSettled"|"isSuccess"|"isError"|"isPending"|null> (null);

  const isError = useMemo(()=>status === 'isError', [status])
  const isSuccess = useMemo(()=> status === 'isSuccess' , [status])
  const isPending = useMemo(() => status === 'isPending', [status])
  const isSettled = useMemo(() => status === 'isSettled', [status])
  
  const mutation = useMutation(api.instructors.enrollInstructor);

  const mutate = useCallback(async(values:requestType, options:Options)=>{

    try {

      setStatus("isPending");
      const response = await mutation(values);
      options?.onSuccess?.(response);
      
    } catch (error) {
      options?.onError?.(error as Error)
      setStatus("isError")
    }
    finally{
      options?.onSettled?.();
      setStatus("isSettled");
    }

  
      
    },[mutation])
    return {
    data, 
    mutate,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
    }

}