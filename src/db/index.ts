import { connect } from "mongoose";
import logger from "../utils/logger";

if (!process.env.MONGO_URI) {
    process.exit(-1);
}

export async function connectToDB() {
    try {
        await connect(process.env.MONGO_URI as string);
        logger.info("Connected to MongoDB");
    } catch (error: any) {
        logger.error(`Failed to connect MongoDB: ${error.message}`);
        process.exit(-1);
    }
}
