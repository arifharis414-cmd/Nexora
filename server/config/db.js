import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // serverSelectionTimeoutMS: fail fast (10s) instead of hanging forever
    // if DNS/network/credentials/IP-allowlist are wrong.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error(
      "   Check: 1) MONGO_URI is correct  2) Atlas Network Access allows your IP (or 0.0.0.0/0)  " +
      "3) the cluster isn't paused  4) your network allows outbound DNS/TCP to MongoDB Atlas."
    );
    return false;
    // NOTE: we intentionally do NOT call process.exit() here.
    // Killing the process on a DB error means the whole API disappears,
    // which is exactly the "backend not running" symptom you were seeing.
    // Better to keep the server up so you get real error messages instead of silence.
  }
};

export default connectDB;