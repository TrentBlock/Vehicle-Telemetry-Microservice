import { Router } from "express";
import { getAllVehicles, getVehicleById } from "../services/vehicleService";

const router = Router();

router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);

export default router;

