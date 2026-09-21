export interface BotFollowUpOption {
  id: string;
  label: string;
  answer: string;
  navTarget?: string;
  navLabel?: string;
  followUps?: BotFollowUpOption[];
}

export interface BotQuickQuestion {
  id: string;
  label: string;
  title: string;
  category: string;
  answer: string;
  navTarget?: string;
  navLabel?: string;
  keywords?: string[];
  followUps?: BotFollowUpOption[];
}

export const BOT_QUICK_QUESTIONS: BotQuickQuestion[] = [
  {
    id: 'what-is-krs',
    label: 'What is KRS?',
    category: 'About',
    title: 'Kalyani Government Engineering College Robotics Society',
    answer: 'KRS is the official premier robotics and innovation society of KGEC, fostering robotics, AI, embedded systems, and competitive engineering excellence.',
    navTarget: '#overview-section',
    navLabel: 'Learn More in Overview & About →',
    keywords: ['krs', 'about', 'society', 'robotics', 'club', 'college', 'kgec'],
    followUps: [
      {
        id: 'krs-join-how',
        label: 'How to join?',
        answer: 'Recruitments open annually across Hardware, Software, IoT, and Design wings through trial bootcamps and hands-on workshops.',
        navTarget: '#leadership-team-section',
        navLabel: 'View Recruitment & Team →',
      },
      {
        id: 'krs-achievements',
        label: 'Achievements',
        answer: 'Over 48+ national podiums in IIT Techfests, 26 autonomous bots built, and an active community of 180+ student engineers.',
        navTarget: '#projects-section',
        navLabel: 'Explore Flagship Bot Fleet →',
      },
      {
        id: 'krs-lab-loc',
        label: 'Lab Location',
        answer: 'Visit us at the Robotics Lab, 2nd Floor Old IT Building in KGEC campus, active every weekday evening.',
        navTarget: '#overview-section',
        navLabel: 'Check Makerspace Lab Details →',
      },
    ],
  },
  {
    id: 'how-to-join',
    label: 'How to Join?',
    category: 'Recruitment',
    title: 'Joining the KRS Squad',
    answer: 'Recruitments open every academic session across Hardware, Software, Design, and Research wings through hands-on bootcamps and workshops.',
    navTarget: '#leadership-team-section',
    navLabel: 'Explore Teams & Society Mentors →',
    keywords: ['join', 'recruitment', 'apply', 'selection', 'interview', 'member', 'admission'],
    followUps: [
      {
        id: 'join-prereq',
        label: 'Any prerequisites?',
        answer: 'No prior robotics experience needed! We teach everything from breadboards to ROS in our beginner bootcamps.',
        navTarget: '#overview-section',
        navLabel: 'See Educational Approach →',
      },
      {
        id: 'join-wings',
        label: 'Which domains can I join?',
        answer: 'You can choose Autonomous Hardware, Software & AI, Drone Labs, or Creative Operations & Design.',
        navTarget: '#projects-section',
        navLabel: 'Explore Projects & Tech Fleet →',
      },
      {
        id: 'join-timeline',
        label: 'Selection timeline',
        answer: 'Selections happen shortly after 1st-year orientation, followed by a week-long trial project task.',
        navTarget: '#overview-section',
        navLabel: 'Learn More in Overview →',
      },
    ],
  },
  {
    id: 'domains',
    label: 'Core Domains',
    category: 'Domains',
    title: 'Multi-Disciplinary Tech Disciplines',
    answer: 'We specialize in Autonomous Robotics, Embedded Systems, Web & App Development, AI/ML, Drone Tech, and Mechanical Prototyping.',
    navTarget: '#projects-section',
    navLabel: 'View Active Project Fleet →',
    keywords: ['domains', 'wings', 'ai', 'ml', 'iot', 'hardware', 'software', 'drone', 'mechanical'],
    followUps: [
      {
        id: 'domain-ai',
        label: 'AI & Vision',
        answer: 'YOLO object detection, Jetson Nano edge models, and gesture recognition for robotic manipulators.',
        navTarget: '#projects-section',
        navLabel: 'See AI Bots in Action →',
      },
      {
        id: 'domain-drones',
        label: 'Drones & UAV',
        answer: 'Custom quadcopters with GPS waypoint navigation, optical flow sensors, and autonomous flight controllers.',
        navTarget: '#projects-section',
        navLabel: 'Explore Aerial Bots →',
      },
      {
        id: 'domain-embedded',
        label: 'IoT & Embedded',
        answer: 'Custom PCB design in KiCAD, ESP32 telemetry, multi-sensor fusion, and wireless motor controllers.',
        navTarget: '#projects-section',
        navLabel: 'Explore Embedded Projects →',
      },
    ],
  },
  {
    id: 'techtix-zyro',
    label: 'TECHTIX vs ZYRO',
    category: 'Arenas',
    title: 'TECHTIX Fest & ZYRO Hackathon',
    answer: 'TECHTIX is the annual inter-college tech fest featuring robot battles and innovation arenas, while ZYRO is our flagship 36-hour hackathon.',
    navTarget: '#techtix-zyro',
    navLabel: 'Open TECHTIX & ZYRO Portal →',
    keywords: ['techtix', 'zyro', 'hackathon', 'fest', 'events', 'battles', 'robo-war'],
    followUps: [
      {
        id: 'fest-battles',
        label: 'Robo-Clash Arena',
        answer: '15kg and 30kg remote combat robots clash in a reinforced polycarbonate arena with spinning blades & flippers.',
        navTarget: '#techtix-zyro',
        navLabel: 'View TECHTIX Battle Tracks →',
      },
      {
        id: 'fest-zyro-hack',
        label: 'ZYRO Hackathon',
        answer: 'A 36-hour sprint solving challenges in Smart Automation, Edge AI, and Robotics with mentor support.',
        navTarget: '#techtix-zyro',
        navLabel: 'Explore ZYRO Hackathon Tracks →',
      },
      {
        id: 'fest-rewards',
        label: 'Cash & Prizes',
        answer: '₹1,50,000+ total prize pool, winner trophies, sponsor merchandise, and direct incubation opportunities.',
        navTarget: '#techtix-zyro',
        navLabel: 'Check Prize Breakdown →',
      },
    ],
  },
  {
    id: 'prize-pool',
    label: 'Prize Pool & Perks',
    category: 'Rewards',
    title: 'Grand Tech Arenas & Rewards',
    answer: 'Competitions offer 1.5L+ INR in cumulative prize pools, direct sponsor internships, project funding, and national credentials.',
    navTarget: '#techtix-zyro',
    navLabel: 'View Prizes & Tracks →',
    keywords: ['prize', 'pool', 'money', 'cash', 'reward', 'certificate', 'internship', 'perks'],
    followUps: [
      {
        id: 'prize-breakdown',
        label: 'Prize breakdown',
        answer: 'Cash prizes are split across Robo-War, Maze Runner, Line Follower, and Hackathon winners.',
        navTarget: '#techtix-zyro',
        navLabel: 'Explore Arena Tracks →',
      },
      {
        id: 'prize-internships',
        label: 'Internships',
        answer: 'Top teams receive referral fast-tracks and interview slots with sponsor tech startups.',
        navTarget: '#techtix-zyro',
        navLabel: 'See Sponsor Perks →',
      },
      {
        id: 'prize-certs',
        label: 'Certificates',
        answer: 'All participants receive verified credentials authenticated by KGEC and society heads.',
        navTarget: '#overview-section',
        navLabel: 'About KGEC Credibility →',
      },
    ],
  },
  {
    id: 'workshops-training',
    label: 'Workshops & Training',
    category: 'Education',
    title: 'Hands-on Technical Bootcamps',
    answer: 'We conduct regular hands-on sessions on Arduino, ESP32, ROS (Robot Operating System), Computer Vision, CAD modeling, and PCB designing.',
    navTarget: '#overview-section',
    navLabel: 'Check STEM Bootcamps →',
    keywords: ['workshop', 'training', 'bootcamp', 'learn', 'arduino', 'esp32', 'ros', 'cad', 'pcb'],
    followUps: [
      {
        id: 'ws-arduino',
        label: 'Arduino & Sensors',
        answer: 'Hands-on hardware wiring, PWM motor drivers, ultrasonic sensors, and practical circuit troubleshooting.',
        navTarget: '#projects-section',
        navLabel: 'View Hardware Projects →',
      },
      {
        id: 'ws-ros',
        label: 'ROS & Simulation',
        answer: 'Linux terminal basics, Gazebo 3D simulation, and ROS2 node messaging architectures.',
        navTarget: '#projects-section',
        navLabel: 'View Autonomous Bots →',
      },
      {
        id: 'ws-pcb',
        label: 'PCB Designing',
        answer: 'Hands-on KiCAD schematic drafting, routing dual-layer boards, and component soldering in the lab.',
        navTarget: '#overview-section',
        navLabel: 'View Makerspace Lab →',
      },
    ],
  },
  {
    id: 'projects-built',
    label: 'Flagship Projects',
    category: 'Projects',
    title: 'Engineered Prototypes & Robots',
    answer: 'Our creations include All-Terrain Rovers, Autonomous Maze Solvers, Gesture Controlled Arms, Hexapods, and Drone Surveillance platforms.',
    navTarget: '#projects-section',
    navLabel: 'Explore Robotic Fleet Roster →',
    keywords: ['projects', 'rover', 'maze', 'drone', 'hexapod', 'arm', 'hardware', 'builds'],
    followUps: [
      {
        id: 'proj-rover',
        label: 'Rocker Rover',
        answer: 'A 6-wheeled rocker-bogie Mars-style rover with real-time video telemetry and suspension articulation.',
        navTarget: '#projects-section',
        navLabel: 'See Rover Project Specs →',
      },
      {
        id: 'proj-arm',
        label: 'Gesture Arm',
        answer: 'A 5-DOF robotic manipulator controlled in real time using wearable sensor gloves.',
        navTarget: '#projects-section',
        navLabel: 'See Manipulator Specs →',
      },
      {
        id: 'proj-drone',
        label: 'Autonomous Drone',
        answer: 'GPS-guided quadcopter with fail-safe return-to-home and optical flow precision hovering.',
        navTarget: '#projects-section',
        navLabel: 'See UAV Drone Specs →',
      },
    ],
  },
  {
    id: 'prerequisites',
    label: 'Prerequisites to Join?',
    category: 'FAQ',
    title: 'Eligibility & Prior Knowledge',
    answer: 'No prior robotics experience is mandatory! We value curiosity, passion to build, and consistency. Everything is taught from the fundamentals.',
    navTarget: '#overview-section',
    navLabel: 'Read About Us & Ethos →',
    keywords: ['prerequisites', 'experience', 'eligible', 'beginner', 'first year', 'freshers'],
    followUps: [
      {
        id: 'pre-branch',
        label: 'Branch restrictions?',
        answer: 'None! Students from CSE, ECE, ME, IT, and EE are equally encouraged to join and collaborate.',
        navTarget: '#leadership-team-section',
        navLabel: 'Meet Society Members →',
      },
      {
        id: 'pre-time',
        label: 'Time commitment',
        answer: 'Typically 4-6 hours per week during bootcamps, flexible around exams and academic schedules.',
        navTarget: '#overview-section',
        navLabel: 'Read About Us →',
      },
    ],
  },
  {
    id: 'contact-connect',
    label: 'How to Contact?',
    category: 'Contact',
    title: 'Connect with KRS Team',
    answer: 'Reach out via our social channels, email us at robotics@kgec.edu.in, or visit our Robotics Lab in the KGEC campus.',
    navTarget: '#overview-section',
    navLabel: 'View Contact & Details →',
    keywords: ['contact', 'email', 'social', 'location', 'lab', 'reach', 'query'],
    followUps: [
      {
        id: 'contact-socials',
        label: 'Instagram & Socials',
        answer: 'Follow @krs_kgec on Instagram for project reels, event photos, and announcements.',
      },
      {
        id: 'contact-mail',
        label: 'Direct Email',
        answer: 'Drop an email to robotics@kgec.edu.in for sponsorships, collaborations, and queries.',
      },
    ],
  },
];
