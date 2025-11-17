import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
 
const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    role: v.optional(v.union(
        v.literal("instructor"),
        v.literal("student"),
        v.literal("unallocated")
    )
     ),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // other "users" fields...
  }).index("email",["email"])
  ,

  instructors: defineTable({
    userId: v.id("users"),
    department: v.optional(v.string()),
    specialization: v.optional(v.string()),
    bio: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  courses: defineTable({
    courseName: v.string(),
    courseCode: v.string(),
    description: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }).index("by_course_code", ["courseCode"]),


 instructorCourses: defineTable({
    instructorId: v.id("instructors"),
    courseId: v.id("courses"),
  })
 .index("by_instructor_id", ["instructorId"])
    .index("by_course_id", ["courseId"])
    .index("by_instructor_id_course_id", ["instructorId", "courseId"]),
  
  students: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    createdAt: v.number(),
  })
  .index("by_course", ["courseId"])
    .index("by_userId", ["userId"]),

  quiz: defineTable({
    instructorId: v.id("instructors"),
    title: v.string(),
    description: v.string(),
    written: v.string(),
    attachment: v.optional(v.string()),
    dueDate: v.number(), 
    createdAt: v.number(),
  })
    .index("by_instructor_id", ["instructorId"]),
    
  exam: defineTable({
    instructorId: v.id("instructors"),
    title: v.string(),
    description: v.string(),
    written: v.string(),
    attachment: v.optional(v.string()),
    dueDate: v.number(), 
    createdAt: v.number(),
  })
  .index("by_instructor_id", ["instructorId"]),

  notification: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    description: v.string(),
    createdAt: v.number(),
  })
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientId"]),

  claims: defineTable({
    claimer:v.id("students"),
    description: v.string(),
    recipientId: v.id("instructors"),
    resolved: v.boolean(),

  })
  .index("by_instructor_id", ["recipientId"])
  .index("claimer_id_receiver_id",["claimer","recipientId"])

  // Your other tables...
});
 
export default schema;