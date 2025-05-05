import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { type ButtplugClientDevice } from "buttplug";

export function createPistonTools(server: McpServer, device: ButtplugClientDevice) {
    server.tool(
        "Svakom-Sam-Neo-Piston",
        "A tool for operating the Svakom Sam Neo, a device that supports the Buttplug protocol. This tool allows the user to stimulate interactively. This tool allows the user to give piston motion.",
        {
            duration: z.number().min(0).max(10000).describe("Thrust count (duration) — the more frequent the thrusts, the more fervent and passionate the rhythm becomes, like a relentless desire that refuses to fade."),
            steps: z.number().min(1).max(50).default(20).describe("Number of steps per thrust — the more steps it takes, the more deliberate and indulgently drawn-out each motion becomes, oozing with a sticky, aching rhythm."),
            vibrationPower: z.number().min(0).max(1).default(0.5).describe("Vibration power."),
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

                await device.stop();

                return {
                    content: [
                        {
                            type: "text",
                            text: `duration: ${duration}ms, steps: ${steps}, vibrationPower: ${vibrationPower}`,
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
