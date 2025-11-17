import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const GetMembers = () =>{

    const data  =  useQuery(api.members.get);
    const isLoading = data === undefined;

    return {data, isLoading};

}