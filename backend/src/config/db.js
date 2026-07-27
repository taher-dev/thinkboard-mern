import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async () => {
  try {
    // Set fallback public DNS servers for SRV record resolution on Windows
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
      // Ignore if setting DNS servers fails
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to mongodb", error);
    process.exit(1);
  }
};

