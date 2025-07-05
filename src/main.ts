#!/usr/bin/env node

import {
  ButtplugClient,
  ButtplugNodeWebsocketClientConnector,
  ButtplugClientDevice,
} from "buttplug";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPistonTools } from "./tools/piston.js";
import { createVacuumTools } from "./tools/vacuum.js";
import { createComboTools } from "./tools/combo.js";
import { createExtendedOTools } from "./tools/extendedO.js";

// Sam Neo device version enum
export enum SamNeoVersion {
  ORIGINAL = "original",
  NEO2_SERIES = "neo2_series", // Covers both Neo2 and Neo2 Pro (same capabilities)
}

// Detect Sam Neo device version based on capabilities
function detectSamNeoVersion(device: ButtplugClientDevice): SamNeoVersion {
  const scalarCmds = device.messageAttributes.ScalarCmd;

  if (!scalarCmds || !Array.isArray(scalarCmds)) {
    console.error(`⚠️ No ScalarCmd found, defaulting to original Sam Neo`);
    return SamNeoVersion.ORIGINAL;
  }

  // Count ActuatorTypes
  const actuatorTypes = scalarCmds.map((cmd) => cmd.ActuatorType);
  const hasConstrict = actuatorTypes.includes("Constrict" as any);
  const vibrateCount = actuatorTypes.filter(
    (type) => type === "Vibrate",
  ).length;

  console.error(`🔍 Device ActuatorTypes: ${JSON.stringify(actuatorTypes)}`);
  console.error(
    `🔍 Vibrate count: ${vibrateCount}, Has Constrict: ${hasConstrict}`,
  );

  if (hasConstrict && vibrateCount === 1) {
    console.error(
      `✅ Detected: Sam Neo 2 Series (Vibrate + Constrict) - covers Neo2 and Neo2 Pro`,
    );
    return SamNeoVersion.NEO2_SERIES;
  } else if (vibrateCount >= 2) {
    console.error(`✅ Detected: Original Sam Neo (Multiple Vibrators)`);
    return SamNeoVersion.ORIGINAL;
  } else {
    console.error(`⚠️ Unknown configuration, defaulting to original Sam Neo`);
    return SamNeoVersion.ORIGINAL;
  }
}

export const server = new McpServer({
  name: "Svakom Samneo",
  version: "1.0.0",
});

const connector = new ButtplugNodeWebsocketClientConnector(
  "ws://localhost:12345",
);

function isSamNeoDevice(deviceName: string): boolean {
  const normalizedName = deviceName.toLowerCase();
  console.error(`🔍 checking device: "${deviceName}" -> "${normalizedName}"`);

  const patterns = ["svakom sam neo", "sam neo", "samneo"];

  const matches = patterns.some((pattern) => normalizedName.includes(pattern));
  console.error(`✨ pattern match result: ${matches}`);

  return matches;
}

async function main() {
  const client = new ButtplugClient("mcp-svakom-samneo");
  await client.connect(connector);

  console.error("🔎 scanning…");
  await client.startScanning();

  // Log existing devices
  const existingDevices = client.devices;
  console.error(`📋 existing devices: ${existingDevices.length}`);
  existingDevices.forEach((device) => {
    console.error(`  - ${device.name}`);
  });

  // Check if Sam Neo device already exists
  const existingSamNeo = existingDevices.find((device) =>
    isSamNeoDevice(device.name),
  );

  let device: ButtplugClientDevice;

  if (existingSamNeo) {
    console.error(`🎯 Found existing Sam Neo device: ${existingSamNeo.name}`);
    device = existingSamNeo;
  } else {
    console.error(`⏳ Waiting for new Sam Neo device...`);
    device = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject("Sam Neo device is not found"),
        15000,
      );
      client.on("deviceadded", (d) => {
        console.error(`📱 device found: ${d.name}`);
        if (isSamNeoDevice(d.name)) {
          console.error(`🎯 Sam Neo device matched!`);
          clearTimeout(timer);
          resolve(d);
        } else {
          console.error(`❌ Device not a Sam Neo variant, continuing scan...`);
        }
      });
    });
  }

  if (!isSamNeoDevice(device.name))
    throw new Error(`Device found (${device.name}) but not a Sam Neo variant`);

  // Log device capabilities for debugging
  console.error(`🔧 Device capabilities for ${device.name}:`);
  console.error(`  Messages: ${JSON.stringify(device.messageAttributes)}`);

  // Detect device version
  const deviceVersion = detectSamNeoVersion(device);
  console.error(`🎯 Device version: ${deviceVersion}`);

  createPistonTools(server, device, deviceVersion);
  createVacuumTools(server, device, deviceVersion);
  createComboTools(server, device, deviceVersion);
  createExtendedOTools(server, device, deviceVersion);
  console.error(`✅ connected: ${device.name} (${deviceVersion})`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
