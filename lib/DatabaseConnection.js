import mongoose from "mongoose";
const cache = (global.mongooseCache ||= { connection: null, promise: null });
export async function ConnectDB() {
  if (cache.connection) return cache.connection;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing");
  cache.promise ||= mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
  });
  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (e) {
    cache.promise = null;
    throw e;
  }
}
