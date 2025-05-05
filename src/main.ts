import {
    ButtplugClient,
    ButtplugNodeWebsocketClientConnector,
    ButtplugClientDevice,
} from "buttplug";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPistonTools } from "./tools/piston.js";

export const server = new McpServer({
    name: "Svakom Samneo",
    version: "0.0.1",
});

const connector = new ButtplugNodeWebsocketClientConnector(
    "ws://localhost:12345",
);

async function main() {
    const client = new ButtplugClient("mcp-svakom-samneo");
    await client.connect(connector);

    console.error("🔎 scanning…");
    await client.startScanning();

    const device: ButtplugClientDevice = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject("Svakom Sam Neo is not found"), 15000);
        client.on("deviceadded", d => {
            clearTimeout(timer);
            resolve(d);
        });
    });

    if (device.name !== "Svakom Sam Neo") throw new Error("Device is found but not Svakom Sam Neo");

    createPistonTools(server, device);
    console.error(`✅ connected: ${device.name}`);

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
})
