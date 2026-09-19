import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Compass,
  Plane,
  Zap,
  SlidersHorizontal,
  BatteryCharging,
  Gauge,
  Timer,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

interface BotArchetype {
  id: string;
  name: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  nominalVoltage: number; // Volts
  baseCurrentDraw: number; // Amps
  torqueFactor: number;
  topSpeedFactor: number;
  armorYieldFactor: number;
  highlightInsight: string;
}

const ARCHETYPES: BotArchetype[] = [
  {
    id: 'combat-heavy',
    name: '30kg Heavyweight Combat Bot',
    shortLabel: 'RoboWars 30kg',
    icon: ShieldAlert,
    description: 'High-kinetic weapon drum with Hardox 500 welded monocoque armor and 8S high-discharge LiPo battery.',
    nominalVoltage: 29.6, // 8S
    baseCurrentDraw: 65, // Amps average
    torqueFactor: 1.8,
    topSpeedFactor: 0.85,
    armorYieldFactor: 95,
    highlightInsight: 'Weapon drum stores up to 18.5 kJ kinetic energy; requires 120A continuous ESC and active heat-sink venting.',
  },
  {
    id: 'autonomous-rover',
    name: 'Autonomous Mars Rover (URC Class)',
    shortLabel: 'Mars Rover',
    icon: Compass,
    description: '6-wheel rocker-bogie all-terrain chassis with high-reduction planetary gearmotors and LiDAR SLAM navigation.',
    nominalVoltage: 22.2, // 6S
    baseCurrentDraw: 24,
    torqueFactor: 2.4,
    topSpeedFactor: 0.45,
    armorYieldFactor: 45,
    highlightInsight: 'Optimized for extreme torque and sub-5cm navigation precision across loose sand and 45° rocky inclines.',
  },
  {
    id: 'fpv-drone',
    name: 'Autonomous Search UAV Drone',
    shortLabel: 'Aerial UAV',
    icon: Plane,
    description: 'Carbon fiber quadcopter equipped with Pixhawk 6C autopilot, optical flow positioning, and high-KV brushless motors.',
    nominalVoltage: 14.8, // 4S
    baseCurrentDraw: 38,
    torqueFactor: 0.9,
    topSpeedFactor: 2.2,
    armorYieldFactor: 30,
    highlightInsight: 'Cruises at up to 85 km/h with 4K telemetry downlink and autonomous GPS-denied failsafe return-to-home.',
  },
  {
    id: 'micromouse-lfr',
    name: 'Precision High-Speed LFR',
    shortLabel: 'High-Speed LFR',
    icon: Zap,
    description: 'Ultra-lightweight racer with 16-channel IR reflection sensor array, coreless DC motors, and high-G suction fan.',
    nominalVoltage: 11.1, // 3S
    baseCurrentDraw: 12,
    torqueFactor: 0.6,
    topSpeedFactor: 1.9,
    armorYieldFactor: 15,
    highlightInsight: 'Reaches speeds exceeding 3.5 m/s with microsecond loop response and active aerodynamic downforce.',
  },
];

export const RooftopCalculator: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('combat-heavy');
  const [weightKg, setWeightKg] = useState<number>(30);
  const [batteryMah, setBatteryMah] = useState<number>(5000);
  const [throttlePercent, setThrottlePercent] = useState<number>(80);

  const currentArchetype = ARCHETYPES.find((a) => a.id === selectedId) || ARCHETYPES[0];

  // Dynamic calculations based on hardware physics
  const effectiveCurrentAmps =
    currentArchetype.baseCurrentDraw * (throttlePercent / 100) * (weightKg / 20 + 0.5);

  const batteryHours = (batteryMah / 1000) / Math.max(1, effectiveCurrentAmps);
  const batteryMinutes = Math.max(1.5, Math.round(batteryHours * 60 * 10) / 10);

  const calculatedTorqueNm = Math.round((weightKg * currentArchetype.torqueFactor * 0.45) * 10) / 10;
  const calculatedTopSpeedKmh = Math.round(
    (currentArchetype.topSpeedFactor * (throttlePercent / 100) * 32) * 10
  ) / 10;
  const recommendedEscAmps = Math.round(effectiveCurrentAmps * 1.5);
  const estimatedPrototypingWeeks = Math.max(2, Math.round(weightKg * 0.2 + 2));

  return (
    <div className="w-full rounded-[2rem] bg-[#EFECE4] dark:bg-[#1E2D1D] border border-[#243324]/10 dark:border-white/10 p-5 sm:p-7 shadow-lg transition-colors duration-400">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#243324]/10 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#526340] dark:text-[#A3B59E]">
              Interactive Hardware Configurator
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6]">
            Robot Power & Drive Estimator
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light">
            Simulate motor torque, battery endurance, and ESC requirements for your next KRS bot build.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Left: Input Controls & Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Bot Category Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#526340] dark:text-[#A3B59E]">
              Select Robot Archetype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ARCHETYPES.map((arch) => {
                const isSelected = arch.id === selectedId;
                const Icon = arch.icon;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(arch.id);
                      if (arch.id === 'combat-heavy') setWeightKg(30);
                      else if (arch.id === 'autonomous-rover') setWeightKg(25);
                      else if (arch.id === 'fpv-drone') setWeightKg(3);
                      else if (arch.id === 'micromouse-lfr') setWeightKg(1);
                    }}
                    className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-white dark:bg-[#283C27] border-emerald-500 shadow-sm'
                        : 'bg-white/50 dark:bg-[#192618]/50 hover:bg-white/80 dark:hover:bg-[#20301F] border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#4A5D44] dark:text-[#9FB19A]'
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold leading-tight ${
                        isSelected ? 'text-[#1F2B1D] dark:text-[#F4EFE6]' : 'text-[#4A5D44] dark:text-[#CBD7C7]'
                      }`}
                    >
                      {arch.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider 1: Weight Target */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/70 dark:bg-[#182618]/70 border border-[#243324]/5 dark:border-white/5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#526340] dark:text-[#A3B59E] uppercase">Target Bot Mass</span>
              <span className="font-bold text-[#1F2B1D] dark:text-white">{weightKg} kg</span>
            </div>
            <input
              type="range"
              min={1}
              max={45}
              step={1}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-1.5 bg-[#243324]/20 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Slider 2: Battery Capacity */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/70 dark:bg-[#182618]/70 border border-[#243324]/5 dark:border-white/5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#526340] dark:text-[#A3B59E] uppercase">LiPo Battery Capacity</span>
              <span className="font-bold text-[#1F2B1D] dark:text-white">{batteryMah} mAh</span>
            </div>
            <input
              type="range"
              min={1000}
              max={12000}
              step={500}
              value={batteryMah}
              onChange={(e) => setBatteryMah(Number(e.target.value))}
              className="w-full h-1.5 bg-[#243324]/20 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Slider 3: Operating Duty Cycle */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/70 dark:bg-[#182618]/70 border border-[#243324]/5 dark:border-white/5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#526340] dark:text-[#A3B59E] uppercase">Average Arena Throttle</span>
              <span className="font-bold text-[#1F2B1D] dark:text-white">{throttlePercent}% Duty</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={throttlePercent}
              onChange={(e) => setThrottlePercent(Number(e.target.value))}
              className="w-full h-1.5 bg-[#243324]/20 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Right: Real-Time Calculated Performance Benchmarks */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#20301F] border border-[#243324]/10 dark:border-white/10 shadow-md space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400">
                Simulated Output
              </span>
              <h4 className="font-display text-xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                {currentArchetype.name}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-center">
              <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#172316] border border-[#243324]/5 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#526340] dark:text-[#A3B59E]">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Run-Time</span>
                </div>
                <span className="block text-2xl font-bold text-[#1F2B1D] dark:text-white">
                  {batteryMinutes} min
                </span>
                <span className="text-[10px] text-[#657351] dark:text-[#8E9F89]">At {throttlePercent}% throttle</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#172316] border border-[#243324]/5 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#526340] dark:text-[#A3B59E]">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Stall Torque</span>
                </div>
                <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {calculatedTorqueNm} Nm
                </span>
                <span className="text-[10px] text-[#657351] dark:text-[#8E9F89]">Drive Shaft Output</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#172316] border border-[#243324]/5 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#526340] dark:text-[#A3B59E]">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Top Speed</span>
                </div>
                <span className="block text-2xl font-bold text-[#1F2B1D] dark:text-white">
                  {calculatedTopSpeedKmh} km/h
                </span>
                <span className="text-[10px] text-[#657351] dark:text-[#8E9F89]">Linear Max Velocity</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F2EB] dark:bg-[#172316] border border-[#243324]/5 dark:border-white/5 space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#526340] dark:text-[#A3B59E]">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  <span>Min ESC</span>
                </div>
                <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {recommendedEscAmps} A
                </span>
                <span className="text-[10px] text-[#657351] dark:text-[#8E9F89]">Continuous Rating</span>
              </div>
            </div>

            {/* Spec insight */}
            <div className="p-3.5 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-900 dark:text-emerald-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Lab Prototyping Advisory:
              </span>
              <p className="font-sans leading-relaxed text-[11px] text-[#3D4F38] dark:text-[#CBD7C7]">
                {currentArchetype.highlightInsight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
