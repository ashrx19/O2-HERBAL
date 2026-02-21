import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      writeConcern: { w: 1 }, // Use w=1 instead of w=majority
      retryWrites: false, // Disable retryWrites if it causes issues
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.warn("⚠️  Continuing without database connection...");
    // Don't throw - allow app to run without DB
  }
};

export default connectDB;