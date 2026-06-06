"use client";

import emailjs from "@emailjs/browser";

/**
 * Client-side EmailJS notifier. Sends the owner an email when a booking or
 * enquiry is submitted. No-ops gracefully until the client pastes their
 * EmailJS keys into .env. The booking/message is still saved server-side.
 */

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const TEMPLATES = {
  booking: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BOOKING,
  contact: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT,
};

export type EmailKind = "booking" | "contact";

export async function sendOwnerEmail(
  kind: EmailKind,
  params: Record<string, unknown>
): Promise<boolean> {
  const templateId = TEMPLATES[kind];
  if (!SERVICE_ID || !PUBLIC_KEY || !templateId) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[emailjs] (demo mode) ${kind} notification:`, params);
    }
    return false;
  }
  try {
    await emailjs.send(
      SERVICE_ID,
      templateId,
      { ...params, kind, sent_at: new Date().toLocaleString() },
      { publicKey: PUBLIC_KEY }
    );
    return true;
  } catch (err) {
    console.error("[emailjs] send failed:", err);
    return false;
  }
}
