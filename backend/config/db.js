import mongoose from "mongoose"

/**
 * connects to MongoDB Atlas using the URI from .env; exits the process if it fails
 * since the server shouldn't run without a working DB connection
 */
export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI is not defined");
        const connection = await mongoose.connect(uri);
        console.log(`MongoDB connected ${connection.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};