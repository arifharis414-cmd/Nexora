import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI is not set. Add it in Railway Variables to connect to MongoDB.");
    return false;
  }

  try {
    // serverSelectionTimeoutMS: fail fast (10s) instead of hanging forever
    // if DNS/network/credentials/IP-allowlist are wrong.
    const conn = await mongoose.connect(mongoUri, {
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
  }
};

export default connectDB;