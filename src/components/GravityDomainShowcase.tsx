import React, { useEffect, useRef, useState } from 'react';
import {
  Cpu,
  Brain,
  Radio,
  Globe,
  FileText,
  Palette,
} from 'lucide-react';
import { RobotMascot } from './RobotMascot';
import { useRobotMascotStore } from '../store/useRobotMascotStore';

interface DomainItem {
  id: string;
  name: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  pullInX: number; // positive = pulls closer towards the central robot
  arcY: number; // vertical spacing offset
  tiltMultiplier: number;
  message: string;
}

const LEFT_DOMAINS: DomainItem[] = [
  {
    id: 'ai_ml_cv',
    name: 'AI, ML & CV',
    title: 'AI, ML and CV',
    icon: Brain,
    pullInX: 16,
    arcY: -2.5,
    tiltMultiplier: 1.1,
    message:
      'The ML and OpenCV specialists make sure their models make extremely precise predictions and detect extensive arenas.',
  },
  {
    id: 'mechatronics_robot',
    name: 'Mechatronics & Robot',
    title: 'Mechatronics and Robot',
    icon: Cpu,
    pullInX: 10,
    arcY: 0,
    tiltMultiplier: 1.2,
    message:
      'The Mechatronics and the Robot Design Team are the ones who make sure that our robots have been designed with utmost precision and also thought has been put for further upgradations.',
  },
  {
    id: 'electronics_iot',
    name: 'Electronics & IoT',
    title: 'Electronics and IoT',
    icon: Radio,
    pullInX: 16,
    arcY: 2.5,
    tiltMultiplier: 1.0,
    message:
      'The Electronics and IoT team take care of all the connections and Communications a Robot might need to work efficiently.',
  },
];

const RIGHT_DOMAINS: DomainItem[] = [
  {
    id: 'graphics_video',
    name: 'Graphics & Video',
    title: 'Graphics Designing and Video Editing',
    icon: Palette,
    pullInX: 16,
    arcY: -2.5,
    tiltMultiplier: 1.1,
    message:
      'The posters that we release regularly are the hard work of our Graphics Team.',
  },
  {
    id: 'web_cloud',
    name: 'Web Dev & Cloud',
    title: 'Web Development and Cloud Computing',
    icon: Globe,
    pullInX: 10,
    arcY: 0,
    tiltMultiplier: 1.2,
    message:
      'This very website has been put together by our web team and they will keep updating and upgrading it.',
  },
  {
    id: 'content_writing',
    name: 'Content Writing',
    title: 'Content Writing',
    icon: FileText,
    pullInX: 16,
    arcY: 2.5,
    tiltMultiplier: 1.0,
    message:
      'The Content Team is responsible for All documentations and Content required.',
  },
];

interface GravityDomainShowcaseProps {
  className?: string;
}

export const GravityDomainShowcase: React.FC<GravityDomainShowcaseProps> = ({
  className = '',
}) => {
  // Zustand store bindings for domain selection and physics impulses
  const selectedDomainId = useRobotMascotStore((state) => state.selectedDomainId);
  const activeImpulse = useRobotMascotStore((state) => state.activeImpulse);
  const selectDomain = useRobotMascotStore((state) => state.selectDomain);
  const triggerImpulse = useRobotMascotStore((state) => state.triggerImpulse);

  // Normalized motion vector (-1 to +1)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const isGyroActiveRef = useRef(false);

  // Smooth Gyroscope & Desktop pointer physics loop
  useEffect(() => {
    // 1. Mobile Gyroscope Listener
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (
        event.gamma !== null &&
        event.beta !== null &&
        (Math.abs(event.gamma) > 0.05 || Math.abs(event.beta) > 0.05)
      ) {
        isGyroActiveRef.current = true;
        // gamma: left-to-right roll (-90 to +90). Normalize around +/- 20 deg
        const clampedGamma = Math.max(-25, Math.min(25, event.gamma));
        // beta: front-to-back pitch (natural mobile phone pitch is ~45 deg)
        const clampedBeta = Math.max(15, Math.min(75, event.beta));
        const deltaBeta = clampedBeta - 45;

        const rawX = clampedGamma / 20;
        const rawY = deltaBeta / 20;

        targetTiltRef.current = {
          x: Math.max(-1.4, Math.min(1.4, rawX)),
          y: Math.max(-1.2, Math.min(1.2, rawY)),
        };
      }
    };

    // 2. Desktop pointer move fallback
    const handlePointerMove = (event: PointerEvent) => {
      if (!isGyroActiveRef.current) {
        const { innerWidth, innerHeight } = window;
        const normX = (event.clientX / innerWidth - 0.5) * 2;
        const normY = (event.clientY / innerHeight - 0.5) * 2;
        targetTiltRef.current = {
          x: Math.max(-1.2, Math.min(1.2, normX)),
          y: Math.max(-1.0, Math.min(1.0, normY)),
        };
      }
    };

    const handlePointerLeave = () => {
      if (!isGyroActiveRef.current) {
        targetTiltRef.current = { x: 0, y: 0 };
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Smooth 60fps orbital physics interpolation with exponential damping
    let animId: number;
    let lastRenderedX = 0;
    let lastRenderedY = 0;

    const updatePhysics = () => {
      const lerpSpeed = 0.085; // Silky-smooth responsive damping
      currentTiltRef.current.x +=
        (targetTiltRef.current.x - currentTiltRef.current.x) * lerpSpeed;
      currentTiltRef.current.y +=
        (targetTiltRef.current.y - currentTiltRef.current.y) * lerpSpeed;

      const nextX = Number(currentTiltRef.current.x.toFixed(3));
      const nextY = Number(currentTiltRef.current.y.toFixed(3));

      // Filter micro-jitter to prevent redundant component re-renders
      if (
        Math.abs(nextX - lastRenderedX) > 0.003 ||
        Math.abs(nextY - lastRenderedY) > 0.003
      ) {
        lastRenderedX = nextX;
        lastRenderedY = nextY;
        setTilt({ x: nextX, y: nextY });
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Click/tap impulse on pill & trigger Zustand robot domain action
  const handleDomainClick = (domain: DomainItem) => {
    triggerImpulse(domain.id);
    selectDomain(domain.id, domain.name, domain.message);
  };

  /**
   * Orbital position transform:
   * Combines base inward offset (hugging the mascot) with mobile rotation physics
   */
  const getOrbitalStyle = (domain: DomainItem, side: 'left' | 'right') => {
    const isLeft = side === 'left';
    const baseArcX = isLeft ? domain.pullInX : -domain.pullInX;
    const baseArcY = domain.arcY;

    // Mobile rotation & tilt motion
    const dynamicX = tilt.x * domain.tiltMultiplier * 6.5;
    const dynamicY = tilt.y * domain.tiltMultiplier * 4.5;
    const dynamicRot = tilt.x * domain.tiltMultiplier * 2.2 + (isLeft ? 0.8 : -0.8);

    const isImpulsed = activeImpulse === domain.id;
    const impulseY = isImpulsed ? -5 : 0;
    const impulseScale = isImpulsed ? 1.06 : 1;

    return {
      transform: `translate3d(${baseArcX + dynamicX}px, ${baseArcY + dynamicY + impulseY}px, 0px) rotate(${dynamicRot}deg) scale(${impulseScale})`,
    };
  };

  return (
    <div className={`relative w-full flex flex-col items-center select-none py-1 overflow-visible ${className}`}>
      {/* Main Orbit Stage:
          [Left 3 Orbital Pills (flex-1)] <--- [Central Robot Mascot (dead-center)] ---> [Right 3 Orbital Pills (flex-1)]
      */}
      <div className="w-full max-w-xl sm:max-w-2xl mx-auto flex items-center justify-center gap-0.5 sm:gap-1.5 md:gap-2 relative z-10 px-1 sm:px-2">
        {/* Subtle Orbital Ellipse Background Track centered directly on the Robot */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-35 dark:opacity-25"
          style={{
            transform: `perspective(600px) rotateX(${tilt.y * 10 + 20}deg) rotateY(${tilt.x * 12}deg)`,
            transition: 'transform 120ms ease-out',
          }}
        >
          <ellipse
            cx="50%"
            cy="50%"
            rx="36%"
            ry="40%"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className="text-emerald-500/50 dark:text-emerald-400/50"
          />
          <ellipse
            cx="50%"
            cy="50%"
            rx="24%"
            ry="28%"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 5"
            className="text-emerald-500/30 dark:text-emerald-400/30"
          />
        </svg>

        {/* LEFT ORBIT ARC: 3 Pills shrunk to exact visibility width, pulled snug to robot */}
        <div className="flex-1 flex flex-col items-end gap-2 sm:gap-2.5 md:gap-3 z-10">
          {LEFT_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const style = getOrbitalStyle(domain, 'left');
            const isSelected = selectedDomainId === domain.id;

            return (
              <div
                key={domain.id}
                style={style}
                onClick={() => handleDomainClick(domain)}
                className="w-fit will-change-transform transition-transform duration-75 ease-out cursor-pointer group"
                title={`${domain.name}: ${domain.message}`}
              >
                <div
                  className={`w-fit inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-[#182a17] border border-emerald-500/80 dark:border-emerald-400/80 shadow-sm ring-2 ring-emerald-500/25'
                      : 'bg-white/95 dark:bg-[#152215]/95 border border-[#243324]/12 dark:border-white/12 shadow-xs group-hover:shadow-md group-hover:border-emerald-500/70 group-active:scale-95'
                  }`}
                >
                  <span
                    className={`text-[10px] sm:text-xs font-medium whitespace-nowrap tracking-tight ${
                      isSelected
                        ? 'text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'text-[#243324] dark:text-[#E0E7DE]'
                    }`}
                  >
                    {domain.name}
                  </span>
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-emerald-950 scale-105 shadow-xs'
                        : 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-110'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER: Robot Mascot using Zustand */}
        <div
          className="shrink-0 flex items-center justify-center z-20 will-change-transform transition-transform duration-100 ease-out px-0"
          style={{
            transform: `translate3d(${tilt.x * 4}px, ${tilt.y * 2.5}px, 0px) rotate(${tilt.x * 1.5}deg)`,
          }}
        >
          <RobotMascot size="sm" showBadge={false} />
        </div>

        {/* RIGHT ORBIT ARC: 3 Pills shrunk to exact visibility width, pulled snug to robot */}
        <div className="flex-1 flex flex-col items-start gap-2 sm:gap-2.5 md:gap-3 z-10">
          {RIGHT_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const style = getOrbitalStyle(domain, 'right');
            const isSelected = selectedDomainId === domain.id;

            return (
              <div
                key={domain.id}
                style={style}
                onClick={() => handleDomainClick(domain)}
                className="w-fit will-change-transform transition-transform duration-75 ease-out cursor-pointer group"
                title={`${domain.name}: ${domain.message}`}
              >
                <div
                  className={`w-fit inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-[#182a17] border border-emerald-500/80 dark:border-emerald-400/80 shadow-sm ring-2 ring-emerald-500/25'
                      : 'bg-white/95 dark:bg-[#152215]/95 border border-[#243324]/12 dark:border-white/12 shadow-xs group-hover:shadow-md group-hover:border-emerald-500/70 group-active:scale-95'
                  }`}
                >
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-emerald-950 scale-105 shadow-xs'
                        : 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-110'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium whitespace-nowrap tracking-tight ${
                      isSelected
                        ? 'text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'text-[#243324] dark:text-[#E0E7DE]'
                    }`}
                  >
                    {domain.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Under the robot: "Our" in one line, "Domains" in second line */}
      <div
        className="flex flex-col items-center mt-1 sm:mt-1.5 select-none pointer-events-none text-center relative z-10"
        style={{
          transform: `translate3d(${tilt.x * 3}px, 0px, 0px)`,
        }}
      >
        <span className="font-display tracking-[0.26em] text-[11px] sm:text-xs font-semibold uppercase text-emerald-800/80 dark:text-emerald-300/80 leading-none">
          Our
        </span>
        <span className="font-display tracking-[0.22em] text-[15px] sm:text-[17px] font-bold uppercase text-emerald-800 dark:text-emerald-300 leading-none mt-1">
          Domains
        </span>
        <div className="w-8 h-0.5 rounded-full bg-emerald-500/50 dark:bg-emerald-400/50 mt-1.5" />
      </div>
    </div>
  );
};
