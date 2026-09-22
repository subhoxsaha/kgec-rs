import {
  RoboticsWing,
  BotCategoryImpact,
  StrategicGoal,
  InnovationStory,
  SocietyMetadata,
} from '../types';

export const DEFAULT_KGEC_LOGO_DARK = '/logos/kgec-logo-dark.svg';
export const DEFAULT_KGEC_LOGO_LIGHT = '/logos/kgec-logo-light.svg';
export const DEFAULT_KGEC_LOGO = DEFAULT_KGEC_LOGO_DARK;

export const DEFAULT_KRS_LOGO_DARK = '/logos/krs-logo-dark.svg';
export const DEFAULT_KRS_LOGO_LIGHT = '/logos/krs-logo-light.svg';
export const DEFAULT_KRS_LOGO = DEFAULT_KRS_LOGO_DARK;

export const REPORT_METADATA: SocietyMetadata = {
  academicYear: '2025 - 2026',
  establishedYear: '2012',
  organization: 'KGEC Robotics Society (RS)',
  college: 'Kalyani Government Engineering College',
  location: 'Kalyani, Nadia, West Bengal 741235, India',
  advisor: 'Dr. S. Bhattacharya',
  advisorTitle: 'Faculty Advisor & Professor, Dept. of Mechanical & Mechatronics',
  president: 'Ayan Mukherjee',
  presidentTitle: 'President & Lead Systems Architect, RS',
  leadershipQuote:
    'At KGEC Robotics Society, we do not merely assemble components—we engineer autonomous intelligence and push mechanical endurance to its absolute physical limits. From sleepless prototyping nights in the Kalyani lab to champion podiums at national arenas across India, our members prove that world-class robotics is born from relentless passion, peer mentorship, and engineering grit.',
  totalMembers: 184,
  nationalPodiums: 48,
  activeProjects: 26,
  labAreaSqFt: 3600,
  prototypingHours: 2850,
  competitionsAttended: 38,
  workshopsHosted: 32,
  studentsTrained: 5400,
  sponsoredFundsInr: 1850000,
  stemKitsDistributed: 1250,
  schoolStudentsMentored: 3800,
  logo1: DEFAULT_KGEC_LOGO_DARK,
  logo2: DEFAULT_KRS_LOGO_DARK,
  logo1Light: DEFAULT_KGEC_LOGO_LIGHT,
  logo1Dark: DEFAULT_KGEC_LOGO_DARK,
  logo2Light: DEFAULT_KRS_LOGO_LIGHT,
  logo2Dark: DEFAULT_KRS_LOGO_DARK,
  footerLogoLight: DEFAULT_KRS_LOGO_LIGHT,
  footerLogoDark: DEFAULT_KRS_LOGO_DARK,
  logo1Alt: 'Kalyani Government Engineering College Emblem',
  logo2Alt: 'KGEC Robotics Society Official Emblem',

  // Compatibility bindings
  totalBees: 184, // active student members
  totalHives: 48, // national podiums & trophies
  totalSites: 26, // active projects & bot builds
  meadowAreaSqM: 3600, // lab prototyping square footage
  speciesPerSite: 14.5, // sensors & microcontrollers per system
  stormwaterLitres: 12500, // high-speed motor RPM benchmark
  fieldTrips: 32, // workshops hosted
  attendees: 5400, // students trained
  volunteerHours: 2850, // hands-on lab hours
  honeyHarvestKg: 850, // total fabricated robot mass (kg)
  jarsDonated: 1250, // free STEM & Arduino kits distributed
  charityNumber: 'Govt. Affiliated WBUT/MAKAUT Society Reg.',
  founder: 'Ayan Mukherjee',
  founderTitle: 'President, KGEC Robotics Society (2025-26)',
  founderQuote:
    'At KGEC Robotics Society, we do not merely assemble components—we engineer autonomous intelligence and push mechanical endurance to its absolute physical limits. From sleepless prototyping nights in the Kalyani lab to champion podiums at national arenas across India, our members prove that world-class robotics is born from relentless passion, peer mentorship, and engineering grit.',
};

export const ROBOTICS_WINGS: RoboticsWing[] = [
  {
    id: 'combat',
    name: 'Combat Robotics (RoboWars)',
    leadSpecialty: 'High-Impact Weaponry & Armor Stress Mechanics',
    members: 34,
    projectsCount: 8,
    podiums: 18,
    description: 'Specializes in 30kg and 15kg combat machines featuring Hardox 500 armor, high-RPM brushless weapon drums, pneumatic flippers, and custom telemetry fail-safes.',
    focusAreas: ['30kg Heavyweight Bots', '15kg Spinner Drums', 'Pneumatic Flippers', 'Hardox Stress FEA'],
    flagshipBot: 'Vajra-30 & Garuda-15',
    hardwareStack: 'Castle Creations 8S ESC, Hardox 500, Custom 7075-T6 Billet Wheel Hubs',
    labLocation: 'Heavy Machining & Welding Bay, Hall B',
    // Compatibility fields
    borough: 'Combat Robotics (RoboWars)',
    hives: 18,
    sites: 8,
  },
  {
    id: 'autonomous-ai',
    name: 'Autonomous Systems & Computer Vision',
    leadSpecialty: 'ROS2, SLAM Navigation & Neural Edge Computing',
    members: 28,
    projectsCount: 6,
    podiums: 11,
    description: 'Engineers self-navigating mobile robots utilizing 3D LiDAR, stereo-depth cameras, real-time SLAM, and TensorRT inference for dynamic obstacle avoidance.',
    focusAreas: ['ROS2 Humble Core', '3D LiDAR SLAM', 'YOLOv10 Edge Vision', 'Sensor Fusion EKF'],
    flagshipBot: 'Apex-Rover v3 (Autonomous Pathfinder)',
    hardwareStack: 'NVIDIA Jetson Orin Nano, RPLiDAR S2, Intel RealSense D435i',
    labLocation: 'Embedded AI & Vision Lab, Room 204',
    borough: 'Autonomous Systems & Computer Vision',
    hives: 11,
    sites: 6,
  },
  {
    id: 'uav-aerial',
    name: 'Unmanned Aerial Systems (UAV & Drones)',
    leadSpecialty: 'Autonomous Flight Control, Aerodynamics & Payload Drops',
    members: 22,
    projectsCount: 5,
    podiums: 7,
    description: 'Develops carbon-fiber racing quadcopters, long-range VTOL platforms, and autonomous GPS-denied indoor search & rescue drone networks.',
    focusAreas: ['PX4 Autopilot', 'GPS-Denied Optical Flow', 'Custom Carbon Monocoques', 'Telemetry LoRa 915MHz'],
    flagshipBot: 'Garud-X4 Autonomous Drone',
    hardwareStack: 'Holybro Pixhawk 6C, T-Motor F90 Pro, Matek PDB & ExpressLRS',
    labLocation: 'Aero Dynamics & Flight Test Terrace',
    borough: 'Unmanned Aerial Systems (UAV & Drones)',
    hives: 7,
    sites: 5,
  },
  {
    id: 'rovers-space',
    name: 'Planetary & Terrestrial Rovers',
    leadSpecialty: 'Rocker-Bogie Dynamics, Soil Telemetry & Robotic Manipulators',
    members: 25,
    projectsCount: 4,
    podiums: 5,
    description: 'Prepares flagship entry for the University Rover Challenge (URC), engineering a 6-wheel rocker-bogie chassis with a 6-DOF robotic manipulator arm.',
    focusAreas: ['Rocker-Bogie Chassis', '6-DOF Harmonic Arm', 'Autonomous Waypoint Following', 'Bio-Sample Spectrometry'],
    flagshipBot: 'KRS Agastya Mars Rover Prototype',
    hardwareStack: 'Planetary Gearboxes, ODrive Dual Motor Controllers, STM32H7 Core',
    labLocation: 'Mechatronics Integration Floor',
    borough: 'Planetary & Terrestrial Rovers',
    hives: 5,
    sites: 4,
  },
  {
    id: 'microrobotics-lfr',
    name: 'High-Speed LFR & Micromouse',
    leadSpecialty: 'Ultra-Fast Sensor Arrays & Precision PID Motor Loops',
    members: 26,
    projectsCount: 7,
    podiums: 14,
    description: 'Engineers lightning-fast line trackers navigating complex tracks at over 3.2 m/s with custom IR reflectance matrices and flood-fill maze solving algorithms.',
    focusAreas: ['16-Channel IR Array', 'Discrete Flood-Fill Algorithm', 'Coreless DC Motors', 'High-G Traction Fans'],
    flagshipBot: 'Turbosprint-X & MazeMaster 4',
    hardwareStack: 'Teensy 4.1, Pololu High-Power Metal Gearmotors, DRV8833 Dual Drivers',
    labLocation: 'Precision Circuit Prototyping Bench',
    borough: 'High-Speed LFR & Micromouse',
    hives: 14,
    sites: 7,
  },
  {
    id: 'embedded-iot',
    name: 'Embedded Firmware & Custom PCB Design',
    leadSpecialty: 'High-Speed Altium Routing, CAN-Bus & Power Electronics',
    members: 24,
    projectsCount: 9,
    podiums: 6,
    description: 'Designs custom 4-layer power distribution boards, brushless motor speed controllers, wireless telemetry transceivers, and robust CAN-bus network nodes.',
    focusAreas: ['Custom 4-Layer PCBs', 'CAN-Bus Telemetry', 'High-Amp MOSFET Switching', 'Firmware in Rust/C++'],
    flagshipBot: 'KRS Quantum-PDB & Telemetry Node v2',
    hardwareStack: 'STM32 Microcontrollers, Altium Designer, TI Gate Drivers',
    labLocation: 'Electronics Surface-Mount Soldering Bay',
    borough: 'Embedded Firmware & Custom PCB Design',
    hives: 6,
    sites: 9,
  },
  {
    id: 'underwater-auv',
    name: 'Marine & Autonomous Underwater Vehicles (AUV)',
    leadSpecialty: 'Buoyancy Engines, Hydrodynamics & Acoustic Sonar',
    members: 15,
    projectsCount: 3,
    podiums: 2,
    description: 'Pioneering submersible hull hydrodynamics, magnetic waterproofing couplers, vector thruster stabilization, and acoustic transponder tracking.',
    focusAreas: ['IP68 Hull Waterproofing', 'Magnetic Coupler Pods', '6-Thruster Vectoring', 'Acoustic Depth Profiling'],
    flagshipBot: 'Varun AUV Submersible',
    hardwareStack: 'Blue Robotics T200 Thrusters, Acrylic Enclosures, Bar30 Pressure Sensor',
    labLocation: 'Hydrodynamics Testing Tank Basin',
    borough: 'Marine & Autonomous Underwater Vehicles (AUV)',
    hives: 2,
    sites: 3,
  },
  {
    id: 'mechanical-cad',
    name: 'Mechanical CAD, FEA & Additive Manufacturing',
    leadSpecialty: 'Generative Design, Structural ANSYS Simulation & CNC Machining',
    members: 20,
    projectsCount: 6,
    podiums: 4,
    description: 'Conducts non-linear impact simulations, topology optimization for weight reduction, precision lathe/milling operations, and continuous carbon-fiber 3D printing.',
    focusAreas: ['ANSYS FEA Crash Impact', 'SolidWorks Generative Design', 'Continuous Carbon Fiber Layup', 'Precision Lathe & Milling'],
    flagshipBot: 'Custom Chassis & Titanium Weapon Shafts',
    hardwareStack: 'Bambu Lab X1-Carbon, CNC 3-Axis Mill, SolidWorks Simulation',
    labLocation: 'Central Mechanical Fabrication Workshop',
    borough: 'Mechanical CAD, FEA & Additive Manufacturing',
    hives: 4,
    sites: 6,
  },
];

// Alias for backwards compatibility
export const BOROUGHS_DATA = ROBOTICS_WINGS;

export const BOT_SQUADS_DATA: BotCategoryImpact[] = [
  {
    category: 'Combat RoboWars (30kg & 15kg)',
    squadSize: 32,
    botsBuilt: 10,
    weightClass: 'Heavyweight & Middleweight',
    podiumsWon: 18,
    sponsoredFundsInr: 450000,
    primaryRole: 'Flagship arena battle machines designed for extreme destructive force and survivability.',
    keySpecs: 'Hardox 500 armor, 14,000 RPM weapon drum, 2.4 GHz dual-receiver fail-safe.',
  },
  {
    category: 'Autonomous Mobile Robots (AMR / SLAM)',
    squadSize: 26,
    botsBuilt: 7,
    weightClass: 'Medium Autonomous (20-40kg)',
    podiumsWon: 11,
    sponsoredFundsInr: 520000,
    primaryRole: 'Intelligent warehouse and research navigation with real-time mapping and obstacle avoidance.',
    keySpecs: 'ROS2 Humble, 3D LiDAR, NVIDIA Jetson edge inference, sub-5cm positional accuracy.',
  },
  {
    category: 'Planetary Mars Rover Squad',
    squadSize: 24,
    botsBuilt: 3,
    weightClass: 'Heavy Exploration (45kg)',
    podiumsWon: 5,
    sponsoredFundsInr: 380000,
    primaryRole: 'University Rover Challenge contender capable of extreme terrain navigation and sample collection.',
    keySpecs: '6-wheel rocker-bogie, 6-DOF robotic manipulator, 1.5km non-line-of-sight wireless link.',
  },
  {
    category: 'High-Speed Line Follower & Maze Solvers',
    squadSize: 22,
    botsBuilt: 14,
    weightClass: 'Micro / Featherweight (<1kg)',
    podiumsWon: 14,
    sponsoredFundsInr: 180000,
    primaryRole: 'Precision competition racers reaching speeds over 3.2 m/s with microsecond loop control.',
    keySpecs: '16-channel sensor array, custom high-downforce vacuum fan, 32-bit Cortex M7.',
  },
  {
    category: 'Aerial UAV & FPV Search Drones',
    squadSize: 18,
    botsBuilt: 6,
    weightClass: 'Carbon Quad / Octocopter (2-5kg)',
    podiumsWon: 7,
    sponsoredFundsInr: 240000,
    primaryRole: 'Aerial reconnaissance, autonomous GPS-denied inspection, and high-speed precision navigation.',
    keySpecs: 'Pixhawk 6C autopilot, optical flow positioning, 4K gimbal stabilization, 25-min flight time.',
  },
  {
    category: 'Bio-Inspired & Assistive Mechatronics',
    squadSize: 14,
    botsBuilt: 4,
    weightClass: 'Wearable & Bio-Mimetic',
    podiumsWon: 3,
    sponsoredFundsInr: 160000,
    primaryRole: 'Rehabilitation exoskeletons, bionic prosthetic arms, and smart assistive technologies.',
    keySpecs: 'EMG muscle sensors, compliant 3D-printed flexure joints, low-latency haptic feedback.',
  },
];

// Alias for compatibility
export const SECTOR_DATA = BOT_SQUADS_DATA.map((s) => ({
  buildingType: s.category,
  sites: s.botsBuilt,
  hives: s.podiumsWon,
  wildflowerArea: s.squadSize * 80,
  honeyHarvestKg: s.botsBuilt * 35,
  jarsDonated: s.squadSize * 25,
  corporateSponsorship: s.sponsoredFundsInr,
  primaryRole: s.primaryRole,
  keySpecs: s.keySpecs,
}));

export const NARRATIVE_STORIES: InnovationStory[] = [
  {
    title: 'Vajra-30: Conquering the 30kg National RoboWars Arena',
    arena: 'IIT Kharagpur Kshitij & IIT Bombay Techfest',
    division: 'Combat Robotics Wing',
    heroStat: '14,200 RPM',
    statLabel: 'Weapon drum speed generating 18.5 kJ kinetic impact',
    body: 'Machined from a solid billet of aerospace-grade alloy and shielded with 6mm Hardox 500 plates, Vajra-30 endured direct pneumatic flipper impacts and devastating spinner collisions. Over three gruelling days of high-voltage arena warfare, the robot claimed 1st Place National Champions without a single chassis puncture.',
    quote: 'When the drum spins up, the entire arena hums. The mechanical reliability under pure shock was a testament to hundreds of simulation hours.',
    quoteAuthor: 'Lead Mechanical Engineer, Vajra Combat Squad',
  },
  {
    title: 'Project Garud: Autonomous Vision-Guided Disaster Scouting',
    arena: 'National Innovation Challenge & Maker Expo',
    division: 'UAV & Autonomous Aerial Systems',
    heroStat: 'sub-25ms',
    statLabel: 'Edge obstacle detection latency via on-board neural vision',
    body: 'Designed for collapsed building and earthquake response scenarios where GPS signals are jammed or unavailable. Equipped with dual stereo depth sensors and lightweight custom neural models running on a localized edge board, Garud successfully mapped unknown corridors and beamed real-time point-clouds to ground rescue teams.',
    quote: 'Building drones that can navigate completely disconnected from satellites or human controllers is the future of humanitarian robotics.',
    quoteAuthor: 'Autonomous Flight Lead, KRS',
  },
  {
    title: 'Eklavya STEM Drive: Bringing Hands-on Robotics to Rural Schools',
    arena: 'Nadia, Murshidabad & 24 Parganas Districts',
    division: 'Community Outreach & Mentorship Division',
    heroStat: '3,800+',
    statLabel: 'High school students mentored across 24 rural schools',
    body: 'Believing that technical knowledge should never be locked behind university gates, KRS members traveled to government schools across Bengal, conducting hands-on workshops with free Arduino microcontrollers, IR sensors, and motor drivers designed and assembled inside the KGEC lab.',
    quote: 'Seeing a 9th-grade student write their very first line of code to make a robot turn toward light is the greatest victory our society can achieve.',
    quoteAuthor: 'Outreach Coordinator, KGEC Robotics Society',
  },
];

export const STRATEGIC_ROADMAP: StrategicGoal[] = [
  {
    title: 'University Rover Challenge (URC) Global Finals',
    pillar: 'International Field Competitions',
    metric: 'Global Top 15',
    description: 'Fielding India’s premier student Mars rover at the Hanksville, Utah Mars Desert Research Station, featuring autonomous traverse and life-detection science payloads.',
    targetDate: 'Summer 2027',
  },
  {
    title: 'KGEC Advanced Centre of Excellence in Robotics',
    pillar: 'Campus Infrastructure & Research',
    metric: '₹25L Lab Grant',
    description: 'Expanding our on-campus facility with a 5-axis CNC machining centre, industrial robotic arm testing cell, and an optical motion-capture telemetry flight cage.',
    targetDate: 'Winter 2026',
  },
  {
    title: 'Indigenous Quadruped & Bipedal Walking Platform',
    pillar: 'Dynamic Locomotion & AI',
    metric: '12-DOF Gait Engine',
    description: 'Developing a fully custom open-hardware quadruped robot utilizing torque-controlled quasi-direct-drive actuators and reinforcement learning locomotion.',
    targetDate: 'Autumn 2027',
  },
  {
    title: 'Deep-Tech Hardware Startup Incubation Cell',
    pillar: 'Entrepreneurship & Innovation',
    metric: '3 Student Startups',
    description: 'Formalizing a fast-track hardware incubation pipeline providing seed prototyping grants, patent filing assistance, and industry mentor networks for graduating teams.',
    targetDate: 'Ongoing Initiative',
  },
];
