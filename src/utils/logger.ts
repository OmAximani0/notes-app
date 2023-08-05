import {
    Logger,
    LoggerOptions,
    createLogger,
    format,
    transports,
} from "winston";

const loggerOptions: LoggerOptions = {
    level: process.env.LOG_LEVEL || "info",
    format: format.cli(),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log" }),
    ],
};

const logger: Logger = createLogger(loggerOptions);

export default logger;
