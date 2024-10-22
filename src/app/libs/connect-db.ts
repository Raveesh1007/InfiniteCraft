import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.set("strictQuery", true);

    if(!process.env.MONGO_URI){
        throw new Error(
            "Please define the MONGO_URI enviornment"
        );
    }
    const connect = await mongoose.connect(process.env.MONGO_URI);
};

export default connectDB;
