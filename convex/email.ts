"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter; // Lazy init to avoid early env checks

const initTransporter = async () => {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error("Missing SMTP env vars: Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
    }

    transporter = nodemailer.createTransporter({
      host,
      port,
      secure: port === 465, // true for 465, false for 587/25
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // For self-signed certs; remove in prod
      },
    });

    // Test connection on init (optional, but helpful for onboarding)
    transporter.verify((error, success) => {
      if (error) console.error("SMTP Connection failed:", error);
      else console.log("SMTP ready for onboarding emails");
    });
  }
  return transporter;
};

export const sendEmailAction = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (_, { to, subject, html }) => {
    try {
      initTransporter(); // Ensure setup

      if (!to.includes('@')) {
        throw new Error(`Invalid onboarding email: ${to}`);
      }

      console.log(`Sending onboarding email to ${to} (Subject: ${subject})`);

      const result = await transporter.sendMail({
        from: `"Academix Onboarding" <${process.env.SMTP_USER}>`, // Friendly name
        to,
        subject,
        html: `<div style="font-family: Arial, sans-serif;">${html}</div>`, // Basic inline styles for better render
      });

      console.log(`Onboarding email sent successfully to ${to}: ${result.messageId}`);

      return { success: true, messageId: result.messageId };
    } catch (error:any) {
      console.error(`Onboarding email failed for ${to}:`, error.message || error);
      // Optional: Insert to a "failedOnboardingEmails" table for retry dashboard
      throw new Error(`Email send failed: ${error.message}`); // Bubbles to mutation for client error
    }
  },
});