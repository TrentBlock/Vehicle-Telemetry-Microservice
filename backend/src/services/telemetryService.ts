import { redisService } from "./redisService";
import { Request, Response } from "express";


export async function postTelemetryData(req: Request, res: Response): Promise<void | object> {
    try{
        const {vehicleId, speed, battery, location} = req.body;
        if(!vehicleId){
            return res.status(400).json({ error: "vehicleId is required" });
        }
        
        const telemetry = {vehicleId, speed, battery, location, timestamp: new Date().toISOString()};

        // Set Telemetry Data in Redis
        await redisService.setLatestTelemetry(vehicleId, telemetry);

        // Save to History List (caching)
        await redisService.pushHistory(vehicleId, telemetry);

        // Register Vehicle ID
        await redisService.registerVehicle(vehicleId);

        res.status(200).json({ message: "Telemetry data recorded successfully" });
    } catch (error) { 
        console.error("Error recording telemetry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}