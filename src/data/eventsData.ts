import { EventPhoto } from '../types';

export const DEFAULT_TECHFEST_PHOTOS: EventPhoto[] = [
  {
    id: 'tt-1',
    title: 'Robo-Soccer Agility Match',
    category: 'Arena Combat & Sport',
    imageUrl: '/events/tt-1.jpg',
    description: 'High-torque differential drive robots battling for ball possession on the stadium pitch.',
  },
  {
    id: 'tt-2',
    title: 'Precision Soldering & Chassis Fab',
    category: 'Hardware Prototyping',
    imageUrl: '/events/tt-2.jpg',
    description: 'Angle grinder sparks, custom chassis welding, and PCB component soldering during maker trials.',
  },
  {
    id: 'tt-3',
    title: 'Competitive Coding & Algorithmic Chess',
    category: 'Mind Sports & Logic',
    imageUrl: '/events/tt-3.png',
    description: 'Developers tackling algorithmic optimization problems and strategic blitz chess matches.',
  },
  {
    id: 'tt-4',
    title: 'Water Rocketry Field Launch',
    category: 'Aerodynamics Trial',
    imageUrl: '/events/tt-4.png',
    description: 'Pneumatic pressurized water rocket launches measuring max apogee and parachute deployment.',
  },
  {
    id: 'tt-5',
    title: 'Speedcubing Championship',
    category: 'Dexterity Championship',
    imageUrl: '/events/tt-5.jpeg',
    description: 'Sub-15 second CFOP method Rubik’s cube speedsolving showdowns before a cheering crowd.',
  },
  {
    id: 'tt-6',
    title: 'Line Follower & Micro-Maze Racing',
    category: 'Autonomous Track',
    imageUrl: '/events/tt-6.jpeg',
    description: 'Ultra-fast optical sensor micro-mouse rovers navigating high-speed hairpin turns.',
  },
];

export const DEFAULT_OTHER_ACTIVITIES_PHOTOS: EventPhoto[] = [
  {
    id: 'ot-1',
    title: 'Hands-on Arduino & Robotics Bootcamp',
    category: 'Workshops & Training',
    imageUrl: '/events/tt-7.jpeg',
    description: 'Freshmen and junior engineers wiring microcontrollers, motor drivers, and ultrasonic sensors.',
  },
  {
    id: 'ot-2',
    title: '3D CAD & Carbon Chassis Fabrication',
    category: 'Makerspace R&D',
    imageUrl: '/events/tt-8.jpeg',
    description: 'Rapid additive manufacturing, laser cutting acrylic mounts, and CNC milling lightweight robot frames.',
  },
  {
    id: 'ot-3',
    title: 'Drone FPV Tuning & Waypoint Trials',
    category: 'Aeromodelling & Flight',
    imageUrl: '/events/tt-9.jpeg',
    description: 'Tuning PID coefficients, ESC telemetry, and telemetry links on carbon-fiber quadcopters.',
  },
  {
    id: 'ot-4',
    title: 'Electronics Lab & Oscilloscope Signal Tuning',
    category: 'Circuit Diagnostics',
    imageUrl: '/events/tt-10.jpg',
    description: 'Analyzing PWM waveforms, ripple noise filtering, and power supply stabilization for motor rails.',
  },
  {
    id: 'ot-5',
    title: 'School STEM Outreach & Maker Demos',
    category: 'Community & Mentorship',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    description: 'Inspiring young school students through live robot demos, rocketry fundamentals, and coding games.',
  },
  {
    id: 'ot-6',
    title: 'Collaborative Open-Source Sprint',
    category: 'Software & ROS Labs',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    description: 'Collaborative pair programming on ROS2 nodes, simulation in Gazebo, and Git workflow reviews.',
  },
];

export const DEFAULT_HACKATHON_PHOTOS: EventPhoto[] = [
  {
    id: 'zr-1',
    title: '36-Hour Robotics & AI Sprint',
    category: 'Non-Stop Hackathon',
    imageUrl: '/events/zr-1.webp',
    description: 'Full-stack engineering teams developing computer vision models and robot firmware under the clock.',
  },
  {
    id: 'zr-2',
    title: 'Embedded IoT & Edge Telemetry',
    category: 'IoT & Firmware',
    imageUrl: '/events/zr-2.webp',
    description: 'Microcontroller programming, sensor fusion arrays, and real-time edge telemetry pipelines.',
  },
  {
    id: 'zr-3',
    title: 'Autonomous LiDAR SLAM Navigation',
    category: 'Computer Vision & AI',
    imageUrl: '/events/zr-3.webp',
    description: 'Real-time point-cloud mapping, obstacle avoidance heuristics, and path planning on custom rovers.',
  },
  {
    id: 'zr-4',
    title: 'Midnight Prototyping & Mentor Review',
    category: 'Makerspace Sprints',
    imageUrl: '/events/zr-4.webp',
    description: 'Overnight oscilloscope debugging, circuit testing, and 1-on-1 industry mentor sessions.',
  },
  {
    id: 'zr-5',
    title: 'Live Arena Demos & Grand Podium',
    category: 'Pitch & Awards',
    imageUrl: '/events/zr-5.webp',
    description: 'Presenting live working prototypes before academic and industry jury panels for championship honors.',
  },
  {
    id: 'zr-6',
    title: 'Edge AI & Neural Inference Sprints',
    category: 'Embedded Machine Learning',
    imageUrl: '/events/zr-6.webp',
    description: 'Compiling TensorFlow Lite and TensorRT models for real-time edge obstacle avoidance.',
  },
];
