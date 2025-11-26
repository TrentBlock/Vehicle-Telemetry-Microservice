import { createClient, RedisClientType } from "redis";

interface RedisOptions {
    url?: string;
    host?: string;
    port?: number;
    password?: string;
}

export class RedisService {
    private client: RedisClientType;
    private connected = false;

    constructor(opts: RedisOptions = {}) {
        const url = opts.url ?? process.env.REDIS_URL;
        if (url) {
            this.client = createClient({ url });
        } else {
            const host = opts.host ?? process.env.REDIS_HOST ?? "localhost";
            const port = (opts.port ?? Number(process.env.REDIS_PORT)) || 6379;
            const password = (opts.password ?? process.env.REDIS_PASSWORD ) || undefined;
            this.client = createClient({
                socket: { host, port },
                password,
            });
        }

        this.client.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }

    async connect(): Promise<void> {
        if (!this.connected) {
            await this.client.connect();
            this.connected = true;
            console.log("Connected to Redis");
        }
    }

    async disconnect(): Promise<void> {
        if (this.connected) {
            await this.client.quit();
            this.connected = false;
        }
    }
    // set latest telemetry data
    async setLatestTelemetry(vehicleId: string, data: object) : Promise<void> {
        const key = `vehicle:${vehicleId}:latest`;
        await this.client.set(key, JSON.stringify(data));
    }

    // get latest telemetry data
    async getLatestTelemetry(vehicleId: string) : Promise<object | null> {
        const key = `vehicle:${vehicleId}:latest`;
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    // push telemetry data to history list
    async pushHistory(vehicleId: string, data: object) : Promise<void> {
        const key = `vehicle:${vehicleId}:history`;
        await this.client.lPush(key, JSON.stringify(data));
        await this.client.lTrim(key, 0, 50); // Keep only the latest 50 entries
    }

    // get historical telemetry data (last 50 entries)
    async getHistory(vehicleId:string) : Promise<object[]> {
        const key = `vehicle:${vehicleId}:history`;
        const list = await this.client.lRange(key, 0, 50); // Get latest 50 entries
        return list.map(item => JSON.parse(item));
    }

    // register a vehicle ID
    async registerVehicle(vehicleId: string) : Promise<void> {
        await this.client.sAdd("vehicles", vehicleId);
    }

    // Retrieve all registered vehicle IDs
    async getAllVehicles() : Promise<string[]> {
        const vehicles = await this.client.sMembers("vehicles");
        return vehicles;
    }

    // Simple ping method to check connectivity
    async ping(): Promise<string> {
        return this.client.ping();
    }
}

// Export a singleton initialized with environment vars by default
export const redisService = new RedisService();