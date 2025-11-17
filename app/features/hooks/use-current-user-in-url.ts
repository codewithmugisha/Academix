import { useParams } from "next/navigation";

export const UseCurrentUserParams = () =>{
    const params = useParams();
    
    const {userId , role} = params;
    return {
        userId,
        role
       
    }
}

