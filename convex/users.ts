import { getAuthUserId } from "@convex-dev/auth/server"
import {query} from "./_generated/server"
export const current = query({
    args:{},
    handler: async(ctx) =>{
        const userId = await getAuthUserId(ctx);

        if(!userId) return null;

       const user = await ctx.db.get(userId);

       return {
            id: userId,
            name: user?.name,
            email: user?.email,
            role: user?.role ?? "unallocated",
            image: user?.image,
       }
    }
})