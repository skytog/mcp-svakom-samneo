import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { type ButtplugClientDevice } from "buttplug";

export function createPistonTools(server: McpServer, device: ButtplugClientDevice) {
    server.tool(
        "Piston",
        "Piston",
        {
            duration: z.number().min(0).max(10000).describe(""),
            steps: z.number().min(1).max(50).default(20).describe(""),
            vibrationPower: z.number().min(0).max(1).default(0.5).describe(""),
        },
        
        async ({ duration, steps, vibrationPower }) => {
            try {
                const diff = 1 / steps;
                const delay = duration / steps;

                for (let i = 0; i < steps; i++) {
                    const intensity = diff * i;
                    await device.vibrate([vibrationPower, intensity]);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                return {
                    content: [
                        {
                            type: "text",
                            text: `Slowly move in and out for ${duration}ms`,
                        },
                    ]
                }
            }
            catch (e) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${e}`,
                        },
                    ]
                }
            }
        }
    )
}
