import mongoose from "mongoose";

try {
  await mongoose.connect(
    "mongodb+srv://o2herbaladmin:o2herbal123@cluster0.9wk7wpa.mongodb.net/o2herbal"
  );
  console.log("MongoDB connected");
  process.exit(0);
} catch (err) {
  console.error("Connection error:", err.message);
  process.exit(1);
}
