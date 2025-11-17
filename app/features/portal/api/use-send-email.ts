import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

type requestType = {role:string; receiverId: Id<"users">}
type responseType = boolean | null;

type Options = {
    onSuccess?: (data:responseType) => void;
    onError?: (error:Error) =>void;
    onSettled?: () => void;
    throwError?: boolean ;
}

export const UseSendEmail = () =>{
    const [data, setData] = useState<responseType>(null);
    const [error, setError] = useState< Error | null > (null);
    const [status, setStatus] = useState<"isError"|"isSuccess"|"isSettled"|"pending"|null> (null);

    const isError = useMemo(()=>status === 'isError', [status])
    const isSuccess = useMemo(()=> status === 'isSuccess' , [status])
    const isPending = useMemo(() => status === 'pending', [status])
    const isSettled = useMemo(() => status === 'isSettled', [status])

    const mutation = useMutation(api.sendEmail.notifyUserApproval);

    const mutate  = useCallback(async(values:requestType, options:Options) =>{
        try {
            setStatus("pending");
            const response = await mutation(values);
            options?.onSuccess?.(response);

            
        } catch (error) {
            options?.onError?.(error as Error)
            setStatus("isError");
            
        }
        finally{
            options?.onSettled?.();
            setStatus("isSettled");
        }

    }, [mutation])
    
    
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