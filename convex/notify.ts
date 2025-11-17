import { mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const notifyUserApproval = mutation({
  args: {
    receiverId: v.id("users"),
    role: v.union(v.literal("student"), v.literal("instructor")),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const authUser = await ctx.db.get(userId);
    if (!authUser || authUser.role !== "instructor") {
      throw new Error("Unauthorized");
    }

    const receiver = await ctx.db.get(args.receiverId);
    if (!receiver) throw new Error("Recipient not found!");

    if (receiver.role && receiver.role !== "unallocated") {
      return { message: "Role is already allocated" };
    }

    await ctx.db.patch(args.receiverId, { role: args.role });
    const updatedReceiver = await ctx.db.get(args.receiverId);

    const htmlContent = `
      <h1>Hello ${receiver.name},</h1>
      <p>Your Academix account has been approved.</p>
      <p>Dashboard: https://yourapp.com/portal/${updatedReceiver?.role}/${receiver._id}</p>
    `;

    // 🔥 Call the Node runtime email sender here
    await ctx.scheduler.runAfter(0,api.email.sendEmailAction, {
      to: receiver.email!,
      subject: "Your Academix Account is Approved",
      html: htmlContent,
    });

    return { success: true };
  },
});
