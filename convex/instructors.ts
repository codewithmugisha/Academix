import { mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

interface InstructorDashboard {
  myStudents: any[]; 
  quiz: any[];
  exams: any[];
  receivedNotifications: any[];
  sentNotifications: any[];
  claims: any[];
  courses: any[];
}
export const get = query({
    args: {},
    handler: async(ctx) =>{
        const userId = await getAuthUserId(ctx);

        if(!userId) {
            return null;
        }
        
        const user =  await ctx.db.get(userId);

        if(!user || user.role !== "instructor") {
            return null;
        }

        const myDetails = await ctx.db.query("instructors")
                            .withIndex("by_userId",(q) =>q.eq("userId",userId)).unique();

        if(!myDetails) return null;
      

        const instructorCourses =await ctx.db.query("instructorCourses")
                                    .withIndex("by_instructor_id", (q) =>q.eq("instructorId",myDetails?._id))
                                    .collect();

                                  
    if(instructorCourses.length === 0) {
      return {
        myStudents: [],
        quiz: [],
        exams: [],
        receivedNotifications: [],
        sentNotifications: [],
        claims: [],
        courses: [],
      };
    }

    const courseIds = instructorCourses.map((ic)=>ic.courseId);


    let myStudents:any[] = [];
    for(const ic of instructorCourses) {
      const courseStudents  = await ctx.db.query("students")
                                .withIndex("by_course", 
                                (q) =>q.eq("courseId",ic.courseId))
                                .collect();
      myStudents.push(...courseStudents);
    }
    
    myStudents.sort((a,b) => a._creationnTime - b._creationTime);

    const quiz =  await ctx.db.query("quiz")    
                    .withIndex("by_instructor_id", 
                    (q) => q.eq("instructorId", myDetails._id))
                    .collect();
    
    
    const exams =  await ctx.db.query("exam")    
                    .withIndex("by_instructor_id", 
                    (q) => q.eq("instructorId", myDetails._id))
                    .collect();
    

    const receivedNotifications = await ctx.db
      .query("notification")
      .withIndex("by_recipient", q => q.eq("recipientId", userId))
      .collect();


    const sentNotifications = await ctx.db
      .query("notification")
      .withIndex("by_sender", q => q.eq("senderId", userId))
      .collect();
    
    
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_instructor_id", q => q.eq("recipientId",
         myDetails._id))
      .collect();
    
    
    
    return {
      myStudents,
      quiz,
      exams,
      receivedNotifications,
      sentNotifications,
      claims,
      courses: instructorCourses,
    }as InstructorDashboard;
}
})



//  email

export const enrollInstructor  = mutation({
    args: { enrollee: v.id("users"),
            courseName: v.string(),
            courseCode: v.string(),
    },
    handler: async(ctx , args) =>{
        const userId = await getAuthUserId(ctx);

        if (!userId) throw new Error("Unauthorized");

        const authUser = await ctx.db.get(userId);

        if (!authUser || authUser.role !== "instructor") {
          throw new Error("Unauthorized");
        }

        const newPerson = await ctx.db.get(args.enrollee);
        if (!newPerson) throw new Error("Recipient not found!");

        if (newPerson.role && newPerson.role !== "unallocated") {
           return { message: "Role is already allocated" };
        }

        await ctx.db.patch(args.enrollee, { role: "instructor" });

        await ctx.db.insert("instructors",{
          userId: args.enrollee,
        })

        await ctx.db.insert("courses",{
          courseCode: args.courseCode,
          courseName: args.courseName
        })
      //   find the inserted courseid

      const latestInstructor =  await ctx.db.query("instructors")
                              .withIndex("by_userId",
                              (q)=> q.eq("userId", args.enrollee)).unique();

      const latestCourse =  await ctx.db.query("courses")
                              .withIndex("by_course_code",
                              (q)=> q.eq("courseCode", args.courseCode)).unique();
      
      if(latestCourse  && latestInstructor) {
        await ctx.db.insert("instructorCourses",{
            instructorId: latestInstructor._id,
            courseId: latestCourse?._id,
        
          })
      }

      const updatedReceiver = await ctx.db.get(args.enrollee);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Academix Account Approved!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F9FAFB; color: #111827; line-height: 1.6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px 20px; text-align: center; background-color: #3B82F6; color: #FFFFFF;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Welcome to Academix! 🎉</h1>
        <!-- Optional Logo: <img src="https://yourdomain.com/logo.png" alt="Academix" style="max-width: 120px; height: auto;"> -->
      </td>
    </tr>
    
    <!-- Body -->
    <tr>
      <td style="padding: 30px;">
        <h2 style="margin: 0 0 20px; font-size: 20px; color: #111827;">Hello ${receiver.name},</h2>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #6B7280;">
          Your Academix instructor account has been approved. We're excited to have you on board!
        </p>
        
        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px; font-size: 18px; color: #065F46;">Your Assigned Course</h3>
          <p style="margin: 0 0 5px; font-size: 16px; color: #111827; font-weight: 500;">
            📚 Course: <strong>${args.courseName}</strong>
          </p>
          <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 500;">
            🆔 Code: <strong>${args.courseCode}</strong>
          </p>
        </div>
        
        <p style="margin: 0 0 30px; font-size: 16px; color: #6B7280;">
          Get started by accessing your personalized dashboard to manage students, quizzes, and more.
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
          <tr>
            <td style="background-color: #3B82F6; border-radius: 6px; text-align: center;">
              <a href="${process.env.BASE_URL || 'http://localhost:3000'}/portal/${updatedReceiver?.role}/id/${receiver._id}" 
                 style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px;">
                Go to Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 30px; text-align: center; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #6B7280;">
          Questions? Reply to this email or contact support@academix.com
        </p>
        <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
          © 2025 Academix. All rights reserved. <a href="#" style="color: #6B7280; text-decoration: underline;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
  
  <!-- Responsive Spacer for Mobile -->
  <div style="height: 40px; line-height: 40px; font-size: 40px;">&nbsp;</div>
</body>
</html>
`;

    // 🔥 Call the Node runtime email sender here
    await ctx.scheduler.runAfter(0,api.email.sendEmailAction, {
      to: receiver.email!,
      subject: "Your Academix Account is Approved",
      html: htmlContent,
    });

    return {message:"Email sent to " + receiver?.name}

    }
})


export const enrollStudent = mutation({
  args: {
    studentId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const authUser = await ctx.db.get(userId);
    if (!authUser || authUser.role !== "instructor") {
      throw new Error("Unauthorized");
    }

    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error("Recipient not found!");

    if (student.role && student.role !== "unallocated") {
      return { message: "Role is already allocated" };
    }

    await ctx.db.patch(args.studentId, { role: "student"});
    const updatedStudent = await ctx.db.get(args.studentId);

    
   const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Academix Account Approved!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F9FAFB; color: #111827; line-height: 1.6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px 20px; text-align: center; background-color: #3B82F6; color: #FFFFFF;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Welcome to Academix! 🎉</h1>
        <!-- Optional Logo: <img src="https://yourdomain.com/logo.png" alt="Academix" style="max-width: 120px; height: auto;"> -->
      </td>
    </tr>
    
    <!-- Body -->
    <tr>
      <td style="padding: 30px;">
        <h2 style="margin: 0 0 20px; font-size: 20px; color: #111827;">Hello ${student.name},</h2>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #6B7280;">
          Your Academix instructor account has been approved. We're excited to have you on board!
        </p>
        
        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px; font-size: 18px; color: #065F46;">Your Assigned Course</h3>
          <p style="margin: 0 0 5px; font-size: 16px; color: #111827; font-weight: 500;">
            📚 Course: <strong>${args.courseName}</strong>
          </p>
          <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 500;">
            🆔 Code: <strong>${args.courseCode}</strong>
          </p>
        </div>
        
        <p style="margin: 0 0 30px; font-size: 16px; color: #6B7280;">
          Get started by accessing your personalized dashboard to manage students, quizzes, and more.
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
          <tr>
            <td style="background-color: #3B82F6; border-radius: 6px; text-align: center;">
              <a href="${process.env.BASE_URL || 'http://localhost:3000'}/portal/${updatedStudent?.role}/id/${updatedStudent?._id}" 
                 style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px;">
                Go to Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 30px; text-align: center; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #6B7280;">
          Questions? Reply to this email or contact support@academix.com
        </p>
        <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
          © 2025 Academix. All rights reserved. <a href="#" style="color: #6B7280; text-decoration: underline;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
  
  <!-- Responsive Spacer for Mobile -->
  <div style="height: 40px; line-height: 40px; font-size: 40px;">&nbsp;</div>
</body>
</html>
`;

    // 🔥 Call the Node runtime email sender here
    await ctx.scheduler.runAfter(0,api.email.sendEmailAction, {
      to: student.email!,
      subject: "Your Academix Account is Approved",
      html: htmlContent,
    });

    return { success: true };
  },
});
