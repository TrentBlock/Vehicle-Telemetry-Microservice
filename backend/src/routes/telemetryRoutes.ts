import { Router } from "express";
import { postTelemetryData } from "../services/telemetryService";


const router = Router();

router.post("/", postTelemetryData);

export default router;