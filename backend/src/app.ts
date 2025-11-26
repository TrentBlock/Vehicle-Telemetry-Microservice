import express from "express";
import ViteExpress from "vite-express";
import {redisService} from "./services/redisService";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import {rateLimit} from "express-rate-limit";
import {slowDown} from "express-slow-down";
import telemetryRoutes from "./routes/telemetryRoutes";
import vehiclesRoutes from "./routes/vehiclesRoutes";


dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter and Slow Down
app.use(rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(slowDown({
  windowMs: 1 * 60 * 1000, // 1 minute
  delayAfter: 50, // allow 50 requests per minute
  delayMs: () => 500 // 500ms of delay per request above 50:
}));

app.use("/telemetry", telemetryRoutes);
app.use("/vehicles", vehiclesRoutes);

redisService.connect();

const PORT: number = Number(process.env.PORT) || 3000;

ViteExpress.listen(app, PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
