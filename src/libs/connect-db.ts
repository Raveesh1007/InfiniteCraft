import mongoose from "mongoose";

const connectDB = async () => {
    // Enable strict query mode
    mongoose.set("strictQuery", true);

    // Check for MONGO_URI in environment variables
    if (!process.env.MONGO_URI) {
        throw new Error("Please define the MONGO_URI environment variable");
    }

    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB.");
        return mongoose.connection;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
        return connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("MongoDB connection failed");
    }
};

export default connectDB;
