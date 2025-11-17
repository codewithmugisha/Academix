import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async(ctx) =>{
        const userId = await getAuthUserId(ctx);

        if(!userId) {
            return null;
        }
    const members = await ctx.db.query("users").collect();


    return members;
}
})