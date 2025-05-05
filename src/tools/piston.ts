import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { type ButtplugClientDevice } from "buttplug";

export function createPistonTools(server: McpServer, device: ButtplugClientDevice) {
    server.tool(
        "Piston",
        "Masterbator was move in and out.",
        { time: z.number().min(0).max(10000) },
        async ({ time }) => {
            try {
                await device.vibrate([0.0, 1.0]);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Slowly move in and out for ${time}ms`,
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
