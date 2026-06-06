import mongoose, { Schema, model, models } from "mongoose";

/* ----------------------------- Booking ----------------------------- */
export type BookingStatus = "pending" | "confirmed" | "seated" | "cancelled";

const BookingSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true }, // ISO yyyy-mm-dd
    time: { type: String, required: true },
    partySize: { type: Number, required: true },
    occasion: { type: String, default: "Casual Dining" },
    notes: { type: String, default: "" },
    tables: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "confirmed", "booked", "seated", "cancelled"],
      default: "pending",
    },
    source: { type: String, default: "website" }, // website | phone | walk-in | physical
  },
  { timestamps: true }
);

/* ------------------------- Contact message ------------------------- */
const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "General Enquiry" },
    message: { type: String, required: true },
    type: { type: String, default: "contact" }, // contact | catering | banquet
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ------------------------ Site content (CMS) ----------------------- */
const SiteContentSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

/* ----------------------------- Chat log ---------------------------- */
const ChatLogSchema = new Schema(
  {
    sessionId: { type: String, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Booking =
  models.Booking || model("Booking", BookingSchema);
export const Message =
  models.Message || model("Message", MessageSchema);
export const SiteContentModel =
  models.SiteContent || model("SiteContent", SiteContentSchema);
export const ChatLog =
  models.ChatLog || model("ChatLog", ChatLogSchema);

export type BookingDoc = mongoose.InferSchemaType<typeof BookingSchema> & {
  _id: string;
  createdAt: string;
};
