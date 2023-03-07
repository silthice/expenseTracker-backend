import app from "./app";
import env from "./utils/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

const portListening = () => {
    app.listen(port, () => {
        console.log("Server is running on port: ", port);
    });
};

async function connectMongoDB() {
    mongoose.set("strictQuery", false);
    try {
        await mongoose.connect(env.MONGO_CONNECTION_STRING);
        console.log("Connected to MongoDB");
        await portListening();
    } catch (error) {
        console.error(error);
    }
}

connectMongoDB();
