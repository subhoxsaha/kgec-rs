export interface FestEvent {
  id: string;
  fest: 'TECHTIX' | 'ZYRO' | 'WORKSHOP';
  title: string;
  tagline: string;
  category: string;
  arenaOrTrack: string;
  prizePool: string;
  teamSize: string;
  duration: string;
  description: string;
  rulesHighlights: string[];
  specsRequirements: string[];
  bannerUrl: string;
  images?: string[];
}

export const TECHTIX_ZYRO_EVENTS: FestEvent[] = [
  // TECHTIX EVENTS
  {
    id: 'tt-robowars-heavy',
    fest: 'TECHTIX',
    title: 'ROBO-CLASH: Heavyweight Robowars',
    tagline: 'Extreme Mechatronics Combat in 60kg Steel Cage',
    category: 'Combat Mechatronics',
    arenaOrTrack: 'Reinforced 8mm Polycarbonate & Steel Arena with Pneumatic Hazards',
    prizePool: '₹60,000+',
    teamSize: '3–6 Engineers',
    duration: '3 Elimination Rounds',
    description:
      'The crowning jewel of TECHTIX. Custom armor plates, high-tensile hardened S7 steel spinning drums, high-torque brushless drive systems, and pneumatic flippers clash in an enclosed bulletproof arena to determine the supreme combat machine.',
    rulesHighlights: [
      'Maximum weight cap: 60.0 kg (including weapon batteries)',
      'Failsafe wireless RC cutoffs with high-current isolation link required',
      'Active weapon mandatory (Spinning bar, vertical disc, pneumatic flipper, lifter)',
      '3-minute match duration with active pit-fall trap at 90 seconds mark',
    ],
    specsRequirements: [
      'Voltage limit: 48V DC max',
      'S7/Hardox 500 armor plating allowed',
      'Dual optical & hardware RF link verification',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'tt-robowars-feather',
    fest: 'TECHTIX',
    title: 'SPARK-ARENA: Featherweight 15kg',
    tagline: 'High-RPM Vertical Spinners & Rapid Wedge Combat',
    category: 'Combat Mechatronics',
    arenaOrTrack: 'Standard 4m x 4m Combat Ring with Pit Trap & Floor Grinders',
    prizePool: '₹35,000+',
    teamSize: '2–4 Members',
    duration: 'Double Elimination Bracket',
    description:
      'Fast-paced, adrenaline-packed featherweight warfare where energy-dense 12,000 RPM titanium beaters and agile planetary gearboxes deliver breathtaking impacts in sub-second maneuvers.',
    rulesHighlights: [
      'Strict 15.0 kg maximum weight limit with 2% margin on calibration scale',
      'Kinetic energy storage weapons capped at standard safety thresholds',
      'Aggression, damage, and arena control scoring rubric for judges',
    ],
    specsRequirements: [
      'Brushless outrunner weapon motors with ESC thermal telemetry',
      'UHMWPE & 6061-T6 Aluminum unibody chassis structures',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'tt-robosoccer',
    fest: 'TECHTIX',
    title: 'KICK-BOT: Autonomous & RC RoboSoccer',
    tagline: 'High-Traction Dribbling, Solenoid Kickers & Tactical Formations',
    category: 'Dynamic Mechatronics',
    arenaOrTrack: '5m x 3m Synthetic AstroTurf Pitch with Electronic Goal Sensors',
    prizePool: '₹25,000+',
    teamSize: '2–4 Members',
    duration: '2 Halves of 5 Minutes',
    description:
      'A thrilling battle of high-traction omni-directional chassis, electromagnetic kickers, and split-second precision steering competing in fast-paced robot soccer showdowns.',
    rulesHighlights: [
      '2 active bots per team on pitch simultaneously (Striker & Goalie)',
      'Max dimensions: 30cm x 30cm x 30cm per bot',
      'No physical entanglements or intentional motor burnout ramming allowed',
    ],
    specsRequirements: [
      'Mecanum or Omni-wheel 360-degree holonomic drive units',
      'High-voltage pulsed solenoid kickers with safe capacitive discharge',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'tt-line-follower',
    fest: 'TECHTIX',
    title: 'TRACK-BLAZE: High-Speed Line Follower Pro',
    tagline: 'Microsecond PID Control with Active Aerodynamic Downforce',
    category: 'Autonomous Systems',
    arenaOrTrack: 'Complex 85m Matte Vinyl Track with Chicanes, 90° Hairpins & Loopings',
    prizePool: '₹20,000+',
    teamSize: '1–3 Members',
    duration: 'Best of 3 Timed Laps',
    description:
      'Ultra-high-speed autonomous buggies executing microsecond PID control algorithms over high-density IR sensor arrays with active ducted-fan suction holding the bots to the asphalt at speeds upwards of 4.5 m/s.',
    rulesHighlights: [
      'Completely autonomous operation after manual gate button press',
      'Track line width: 30mm white line on matte black surface',
      'Zero track damage from fan downforce units',
    ],
    specsRequirements: [
      'STM32 ARM Cortex-M4 or ESP32 dual-core processing units',
      '16-channel array QTR phototransistor reflectance sensors',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'tt-maze-runner',
    fest: 'TECHTIX',
    title: 'MAZE-X: Autonomous Micromouse Solver',
    tagline: 'Flood-fill Pathfinding & Real-time Optical Odometry',
    category: 'Autonomous Robotics',
    arenaOrTrack: '16x16 Modular Maze Grid with Polished Wood Walls',
    prizePool: '₹25,000+',
    teamSize: '1–3 Members',
    duration: 'Exploration + 3 Speed Run Attempts',
    description:
      'Autonomous micro-robots that map an unknown 256-cell labyrinth from scratch using ultrasonic/LiDAR/IR distance odometry and compute the mathematical shortest path using modified flood-fill algorithms in under 10 seconds.',
    rulesHighlights: [
      'Completely self-contained; no wireless telemetry or external compute allowed',
      'Size limit: Must fit inside 25cm x 25cm starting cell',
      'Time bonus awarded for fewest exploration steps before final dash',
    ],
    specsRequirements: [
      'High-resolution magnetic encoders on coreless DC micro-motors',
      'VL53L1X Time-of-Flight laser ranging distance sensors',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'tt-drone-racing',
    fest: 'TECHTIX',
    title: 'AERO-STORM: FPV Drone Obstacle Gauntlet',
    tagline: '5-Inch Carbon Quadcopters Weaving Through Glowing Air Gates',
    category: 'Aerial Robotics',
    arenaOrTrack: 'Indoor Multilevel LED Air Cage with Dive Gates, Rings & Slaloms',
    prizePool: '₹30,000+',
    teamSize: '1–2 Pilots',
    duration: 'Time Attack Qualifying + Head-to-Head Final',
    description:
      'Adrenaline-charged FPV quadcopter pilots donning HD goggles to maneuver 6S LiPo carbon race drones through high-speed tunnel dives, neon air gates, and 180-degree gravity rollbacks.',
    rulesHighlights: [
      '5.8GHz video transmitter with clean power switching channel assignment',
      'Propeller guards recommended; fail-safe throttle zero kill switch required',
      'Penalties for skipped air gates or track boundary collisions',
    ],
    specsRequirements: [
      'Carbon fiber quad frame with 2207/2306 brushless motors',
      'Betaflight / INAV flight controllers running dynamic notch filters',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // ZYRO 36H HACKATHON TRACKS
  {
    id: 'zyro-autonomous-mobility',
    fest: 'ZYRO',
    title: 'ZYRO-TRACK 1: Autonomous AGV & SLAM Systems',
    tagline: '36-Hour Deep Hardware Hack on ROS2, LiDAR & Edge Compute',
    category: 'Flagship AI Hackathon',
    arenaOrTrack: 'Simulated Dynamic Warehouse & Hospital Obstacle Environment',
    prizePool: '₹40,000+',
    teamSize: '3–5 Developers',
    duration: '36 Hours Continuous',
    description:
      'Teams develop real-time Autonomous Guided Vehicles (AGVs) capable of point-cloud 2D/3D SLAM mapping, dynamic human obstacle avoidance, and industrial payload transportation in simulated chaotic environments.',
    rulesHighlights: [
      'Complete repository code and hardware assembly built during the 36-hour sprint',
      'Open hardware integration (Raspberry Pi 5, Jetson Orin Nano, ESP32)',
      'Live demonstration with random floor obstacles and zero human intervention',
    ],
    specsRequirements: [
      'ROS2 Humble / Iron with Nav2 autonomous navigation stack',
      'RPLIDAR A1/A2 or Depth Camera real-time perception pipeline',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'zyro-assistive-biomedical',
    fest: 'ZYRO',
    title: 'ZYRO-TRACK 2: Assistive Mechatronics & Bionics',
    tagline: 'EMG/EEG Signal Controlled Prosthetics & Exoskeletons',
    category: 'Biomedical Robotics',
    arenaOrTrack: 'Ergonomic Task Sandbox with Dexterity Benchmarking',
    prizePool: '₹35,000+',
    teamSize: '3–5 Developers',
    duration: '36 Hours Continuous',
    description:
      'Pioneering low-cost, 3D-printed bio-mechatronic prosthetic hands, limb rehabilitation exoskeletons, or eye-gaze tracking wheelchairs utilizing EMG bio-sensors and edge machine learning.',
    rulesHighlights: [
      'Must incorporate bio-potential signals (EMG, ECG, EEG, or IMU motion)',
      'Focus on real-world affordability, reliability, and human ergonomics',
      'Benchmarking includes grip strength, delicate object handling, and latency',
    ],
    specsRequirements: [
      'MyoWare 2.0 / Custom analog bio-amplifiers with active notch filters',
      'N20 high-torque micro metal gear-motors with tendon cable actuation',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'zyro-disaster-uav',
    fest: 'ZYRO',
    title: 'ZYRO-TRACK 3: Disaster Search & Rescue Swarms',
    tagline: 'Autonomous UAV/UGV Multi-Agent Reconnaissance in Smoke & Rubble',
    category: 'Autonomous Swarms',
    arenaOrTrack: 'Simulated Quake/Flood Rescue Maze with Thermal Hotspots',
    prizePool: '₹35,000+',
    teamSize: '3–5 Developers',
    duration: '36 Hours Continuous',
    description:
      'Coordinated multi-robot reconnaissance where aerial drones and ground rovers share mesh networking telemetry to locate victims, detect toxic gases, and deliver critical medical beacons in GPS-denied environments.',
    rulesHighlights: [
      'GPS-denied localization using visual-inertial odometry (VIO)',
      'Decentralized peer-to-peer LoRa / ESP-NOW wireless mesh communication',
      'Detection and geo-tagging of thermal heat signatures and audio distress calls',
    ],
    specsRequirements: [
      'Thermal FLIR Lepton / MLX90640 radiometric sensor arrays',
      'ESP32 LoRa 868/915MHz telemetry transceivers with custom protocol',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'zyro-industrial-ai',
    fest: 'ZYRO',
    title: 'ZYRO-TRACK 4: Edge-AI & Robotic Manipulation',
    tagline: 'High-Speed Computer Vision Sorting & Kinematic Arm Control',
    category: 'Industrial AI',
    arenaOrTrack: 'Automated Conveyor Cell with 6-DOF Robotic Arms & Defect Sorting',
    prizePool: '₹35,000+',
    teamSize: '3–5 Developers',
    duration: '36 Hours Continuous',
    description:
      'Designing intelligent 6-axis robotic arms and edge-AI visual sorting systems utilizing YOLOv8 defect detection, inverse kinematics, and real-time gripper actuation.',
    rulesHighlights: [
      'Autonomous vision inference pipeline running locally on embedded SBC',
      'Accurate pick-and-place sorting into calibrated reject bins',
      'Real-time collision avoidance and inverse kinematic trajectory planning',
    ],
    specsRequirements: [
      'NVIDIA Jetson Orin / Coral Edge TPU vision accelerator',
      '6-DOF articulated robotic arm chassis with servo closed-loop control',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // WORKSHOPS & BOOTCAMPS
  {
    id: 'ws-ros2-masterclass',
    fest: 'WORKSHOP',
    title: 'ROS2 & Computer Vision Intensive Bootcamp',
    tagline: 'Hands-on Nodes, Topics, SLAM & OpenCV Object Tracking',
    category: 'Makerspace R&D Workshop',
    arenaOrTrack: 'KGEC Robotics Society Hardware Makerspace & Linux Cluster',
    prizePool: 'Certificates & Hardware Kits',
    teamSize: 'Individual / Pairs',
    duration: '2-Day Weekend Sprint',
    description:
      'An intensive hands-on lab workshop guided by senior robotics engineers and alumni. Participants build and program differential drive robots from bare breadboards to full ROS2 navigation nodes with camera tracking.',
    rulesHighlights: [
      'Every participant receives custom hardware development components',
      'Direct peer-to-peer mentorship with 1:4 mentor-to-student ratio',
      'Includes deployment on real physical robots, not just simulation',
    ],
    specsRequirements: [
      'Linux Ubuntu 22.04 LTS / WSL2 environment setup provided',
      'Hands-on with OpenCV Python, PyTorch TinyML, and C++ ROS2 nodes',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  },
];
