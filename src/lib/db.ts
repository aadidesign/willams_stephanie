import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse the connection across hot-reloads / serverless invocations.
const globalForMongoose = globalThis as unknown as { _mongoose?: Cached };
const cached: Cached = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cached;

/**
 * Connect to MongoDB. Returns null (instead of throwing) when no URI is
 * configured, so the app runs in "demo mode" before the client pastes keys.
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) return null;
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false, dbName: "bellavita" })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("[db] MongoDB connection failed:", err);
    return null;
  }
}

export const isDbConfigured = () => Boolean(MONGODB_URI);
