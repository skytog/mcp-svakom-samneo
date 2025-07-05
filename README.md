# Svakom Sam Neo Control Tools

This document describes how to use the available tools for controlling Svakom Sam Neo devices.

## Device Support

The tools automatically detect your device type and use the appropriate API:

### Original Sam Neo
- **Use `Svakom-Sam-Neo-Piston`** - This is all you need!
- Provides complete vibration and vacuum control through 2 synchronized vibrators
- One tool handles all functionality (vibration and vacuum)

### Sam Neo 2 / Sam Neo 2 Pro  
- **Use `Svakom-Sam-Neo-Combo`** for simultaneous vibration and vacuum control
- **Use `Svakom-Sam-Neo-Vacuum`** for vacuum-only control
- Has separate actuators for independent vibration and vacuum control

## Available Tools

### Svakom-Sam-Neo-Piston

**For Original Sam Neo users - This is your main tool!**

Controls vibration and vacuum functionality with coordinated patterns.

**Device compatibility:**
- **Original Sam Neo**: ✅ **Complete control** - handles vibration and vacuum
- **Sam Neo 2/2 Pro**: ⚠️ Vibration-only (use Combo tool instead for full functionality)

**Parameters:**
- `duration`: Duration in milliseconds (1000-100000)
- `steps`: Number of steps per cycle (20-1000, default: 20)
- `vibrationPower`: Vibration intensity (0-1, default: 0.5)

**Usage:**
```
Use the Svakom-Sam-Neo-Piston tool with duration 5000ms, 50 steps, and vibration power 0.7
```

### Svakom-Sam-Neo-Vacuum

**For Sam Neo 2/2 Pro users - Vacuum-only control**

Controls vacuum/suction functionality using dedicated Constrict actuator.

**Device compatibility:**
- **Original Sam Neo**: ❌ Not needed (use Piston tool for everything)
- **Sam Neo 2/2 Pro**: ✅ **Vacuum-only control** - dedicated suction patterns and intensity

**Parameters:**
- `intensity`: Suction power (0-1, default: 0.5)
- `duration`: Duration in milliseconds (100-30000, default: 1000)
- `pattern`: Pattern type ("constant" | "pulse" | "wave", default: "constant")
- `pulseInterval`: Pulse timing in milliseconds (100-2000, default: 500, optional)

**Patterns:**
- **constant**: Steady suction
- **pulse**: On/off alternating pattern
- **wave**: Gradual intensity changes

**Usage:**
```
Use the Svakom-Sam-Neo-Vacuum tool with intensity 0.8, duration 3000ms, and wave pattern
```

### Svakom-Sam-Neo-Combo

**For Sam Neo 2/2 Pro users - Main tool for combined control**

Controls both vibration and vacuum simultaneously with advanced coordination.

**Device compatibility:**
- **Original Sam Neo**: ✅ Alternative option for advanced patterns (Piston tool is simpler)
- **Sam Neo 2/2 Pro**: ✅ **Main tool** - independent vibration and vacuum control with sync modes

**Parameters:**
- `duration`: Total duration in milliseconds (1000-100000)
- `steps`: Steps for motion pattern (20-1000, default: 20)
- `vibrationPower`: Vibration intensity (0-1, default: 0.5)
- `vacuumIntensity`: Vacuum intensity (0-1, default: 0.5)
- `syncMode`: Coordination mode ("synchronized" | "alternating" | "independent", default: "synchronized")
- `vacuumPattern`: Vacuum pattern for independent mode ("constant" | "pulse" | "wave", default: "constant")

**Sync Modes:**
- **synchronized**: Both follow same pattern
- **alternating**: Opposite patterns (when one is high, other is low)
- **independent**: Separate simultaneous patterns (Note: Original Sam Neo falls back to synchronized mode)

**Usage:**
```
Use the Svakom-Sam-Neo-Combo tool with duration 10000ms, 30 steps, vibration power 0.8, vacuum intensity 0.6, and synchronized mode
```

### Svakom-Sam-Neo-ExtendedO

**For Sam Neo 2/2 Pro users - Extended O mode for climax control**

Simulates the device's Extended O function that instantly reduces both vibration and suction to their lowest intensity to prolong and intensify climax.

**Device compatibility:**
- **Original Sam Neo**: ✅ Works with synchronized dual vibrator control
- **Sam Neo 2/2 Pro**: ✅ **Full support** - independent control of vibration and vacuum reduction

**Parameters:**
- `currentVibration`: Current vibration intensity to reduce from (0-1)
- `currentVacuum`: Current vacuum intensity to reduce from (0-1)
- `holdDuration`: Time to hold at minimum intensity in milliseconds (1000-60000, default: 10000)
- `minimumLevel`: Minimum intensity level during Extended O (0-0.3, default: 0.1)
- `restoreDuration`: Time to restore original intensity in milliseconds (0-5000, default: 500, 0 for instant)

**How it works:**
1. Instantly reduces both vibration and vacuum to minimum level
2. Holds at minimum for specified duration
3. Restores to original intensity (instantly or gradually)

**Usage:**
```
Use the Svakom-Sam-Neo-ExtendedO tool with current vibration 0.8, current vacuum 0.7, hold duration 15000ms, and minimum level 0.1
```

## Quick Reference

### 🎯 Simple Usage Guide

**Original Sam Neo users:**
- **Just use `Svakom-Sam-Neo-Piston`** - That's it! Everything is included.

**Sam Neo 2/2 Pro users:**
- **Use `Svakom-Sam-Neo-Combo`** for vibration + vacuum combined
- **Use `Svakom-Sam-Neo-Vacuum`** for vacuum-only control
- **Use `Svakom-Sam-Neo-ExtendedO`** for Extended O climax control feature

### 🔄 Device Auto-Detection
The tools automatically detect your device and use the appropriate control methods. No manual configuration needed!

