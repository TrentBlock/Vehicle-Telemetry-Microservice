import { redisService } from "./redisService";
import { Request, Response } from "express";

async function getAllVehicles(req: Request, res: Response): Promise<void> {
 try{
        const vehicles = await redisService.getAllVehicles();
        res.status(200).json(vehicles);
    } catch(error){
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

async function getVehicleById(req: Request, res: Response): Promise<void> {
 try{
        const id = req.params.id;
        const vehicleData = await redisService.getLatestTelemetry(id);
        if(!vehicleData){
             res.status(404).json({ error: "Vehicle not found" });
             return;
        }
        res.status(200).json(vehicleData);
    } catch (error){
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export { getAllVehicles, getVehicleById };