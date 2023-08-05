import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";

if (!process.env.PORT) {
    process.exit(-1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Express = express();

// Middleware section
app.use(helmet());

app.use(cors());

app.use(express.json());

app.listen(PORT, (): void => {
    console.log(`[SERVER] Listening on port: http://localhost:${PORT}/`);
});
