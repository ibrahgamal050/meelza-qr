import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("❌ MONGODB_URI is not set");

interface GlobalWithMongoose {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = (global as unknown as GlobalWithMongoose).mongoose;
if (!cached) {
  cached = (global as unknown as GlobalWithMongoose).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
