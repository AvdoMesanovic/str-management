export interface ActivityLogEntry {
  timestamp: string;
  type: "automated" | "manual" | "alert";
  message: string;
}

export interface AccessCode {
  guest: string;
  code: string;
  checkin: string;
  checkout: string;
  status: "active" | "expired";
}

export interface UpcomingEvent {
  name: string;
  date: string;
  manualOverride: boolean;
}

export interface PropertyOwner {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskReason: string;
  noiseData: number[];
  tempData: number[];
  complianceProgress: number; // 0-100
  monthlyROI: number;
  safetyScore: number; // 0-100
  activityLog: ActivityLogEntry[];

  // Extended detail view data
  owner: PropertyOwner;
  financial: {
    grossRent: number;
    taxLiability: number;
    taxReadiness: number;
    lastSync: string;
    remittanceDays: number;
    remittancePeriod: string;
  };
  security: {
    lockStatus: "online" | "offline";
    accessCodes: AccessCode[];
    heartbeatData: number[];
  };
  safety: {
    decibelData12h: number[];
    alarmBattery: number;
    lastTested: string;
    smsEnabled: boolean;
  };
  environmental: {
    leakStatus: "clear" | "critical";
    mainValve: "open" | "closed";
    historicalUtils: number[];
    currentUtils: number[];
    monthlySavings: number;
    avgTempAdj: number;
    occupiedTemp: number;
    emptyTemp: number;
  };
  revenue: {
    listingActive: boolean;
    pricelabsSynced: boolean;
    lastUpdate: string;
    events: UpcomingEvent[];
    description: string;
    listingPhotos: number;
    gapOpportunities: string[];
  };
}

// Deterministic PRNG (mulberry32) to avoid SSR/client hydration mismatches
function seededRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const generateNoiseData = (seed: number) => {
  const rng = seededRng(seed);
  const base = 35 + rng() * 15;
  return Array.from({ length: 24 }, (_, i) => {
    const timeOfDay = i % 24;
    const dayVariation = timeOfDay >= 18 && timeOfDay <= 23 ? 15 : 0;
    return Math.round(base + dayVariation + (rng() - 0.5) * 10);
  });
};

const generateTempData = (seed: number) => {
  const rng = seededRng(seed);
  const base = 70 + rng() * 5;
  return Array.from({ length: 24 }, () => {
    return Math.round(base + (rng() - 0.5) * 4);
  });
};

const generateHeartbeatData = (seed: number) => {
  const rng = seededRng(seed);
  return Array.from({ length: 24 }, (_, i) => {
    const dip = i === 3 || i === 14 ? rng() * 15 : 0;
    return Math.round(Math.max(80, 98 - dip + (rng() - 0.5) * 3));
  });
};

const generateDecibelData12h = (riskLevel: string, seed: number) => {
  const rng = seededRng(seed);
  const isHighRisk = riskLevel === "high" || riskLevel === "critical";
  return Array.from({ length: 12 }, (_, i) => {
    const hour = i + 12;
    const isEvening = hour >= 18;
    const base = isEvening ? (isHighRisk ? 68 : 52) : isHighRisk ? 55 : 40;
    return Math.round(base + (rng() - 0.4) * 18);
  });
};

const generateUtilData = (seed: number) => {
  const rng = seededRng(seed);
  return {
    historicalUtils: Array.from({ length: 6 }, () =>
      Math.round(185 + rng() * 45),
    ),
    currentUtils: Array.from({ length: 6 }, () =>
      Math.round(142 + rng() * 32),
    ),
  };
};

export const mockProperties: Property[] = [
  {
    id: "P-01",
    name: "63139 Dogtown House A",
    address: "1234 Tamm Ave, St. Louis, MO 63139",
    riskLevel: "high",
    riskReason: "Cardinals Home Game tonight + High Historic Volume",
    noiseData: generateNoiseData(101),
    tempData: generateTempData(102),
    complianceProgress: 85,
    monthlyROI: 18.5,
    safetyScore: 92,
    activityLog: [
      {
        timestamp: "14:02",
        type: "automated",
        message: "AC set-point limited to 72° (Energy Saving)",
      },
      {
        timestamp: "16:45",
        type: "automated",
        message: "Sent automated check-in code via Schlage API",
      },
      {
        timestamp: "19:12",
        type: "alert",
        message: "Proactive noise warning sent to guest (dB spike detected)",
      },
      {
        timestamp: "20:05",
        type: "manual",
        message: "Manager reviewed guest profile - flagged for follow-up",
      },
      {
        timestamp: "22:30",
        type: "automated",
        message: "Noise level normalized - auto-cleared alert",
      },
    ],
    owner: {
      name: "Sarah Johnson",
      phone: "(314) 555-0123",
      email: "sarah.johnson@email.com",
      notes:
        "Excellent client — always responsive. Prefers email for non-urgent matters. Schedule monthly revenue calls on the 1st.",
    },
    financial: {
      grossRent: 4250,
      taxLiability: 127.5,
      taxReadiness: 85,
      lastSync: "5 mins ago",
      remittanceDays: 90,
      remittancePeriod: "Q2 Filing",
    },
    security: {
      lockStatus: "online",
      accessCodes: [
        {
          guest: "Marcus T.",
          code: "4829",
          checkin: "Apr 1, 3:00 PM",
          checkout: "Apr 3, 11:00 AM",
          status: "active",
        },
        {
          guest: "Priya K.",
          code: "7341",
          checkin: "Mar 28, 3:00 PM",
          checkout: "Apr 1, 11:00 AM",
          status: "expired",
        },
        {
          guest: "James R.",
          code: "1056",
          checkin: "Mar 24, 4:00 PM",
          checkout: "Mar 28, 10:00 AM",
          status: "expired",
        },
      ],
      heartbeatData: generateHeartbeatData(103),
    },
    safety: {
      decibelData12h: generateDecibelData12h("high", 104),
      alarmBattery: 87,
      lastTested: "Mar 15, 2026",
      smsEnabled: true,
    },
    environmental: {
      leakStatus: "clear",
      mainValve: "open",
      ...generateUtilData(105),
      monthlySavings: 48,
      avgTempAdj: 3,
      occupiedTemp: 70,
      emptyTemp: 65,
    },
    revenue: {
      listingActive: true,
      pricelabsSynced: true,
      lastUpdate: "2 days ago",
      events: [
        {
          name: "Cardinals Opening Day",
          date: "Apr 4, 2026",
          manualOverride: true,
        },
        {
          name: "St. Pat's Dogtown Parade",
          date: "Apr 5, 2026",
          manualOverride: true,
        },
        {
          name: "Blues Playoff Game 1",
          date: "Apr 18, 2026",
          manualOverride: false,
        },
        {
          name: "St. Louis Marathon",
          date: "Apr 5, 2026",
          manualOverride: false,
        },
      ],
      description:
        "Charming Dogtown bungalow steps from iconic Tamm Ave bars and restaurants. Perfect for Cardinals fans — walk to Busch Stadium. Modern amenities, original hardwoods.",
      listingPhotos: 18,
      gapOpportunities: ["Apr 4–5 (1 night)", "Apr 12–14 (2 nights)"],
    },
  },
  {
    id: "P-02",
    name: "63108 Soulard Loft B",
    address: "567 Russell Blvd, St. Louis, MO 63108",
    riskLevel: "low",
    riskReason: "Normal operations - Low occupancy period",
    noiseData: generateNoiseData(201),
    tempData: generateTempData(202),
    complianceProgress: 100,
    monthlyROI: 22.3,
    safetyScore: 98,
    activityLog: [
      {
        timestamp: "08:15",
        type: "automated",
        message: "Smart lock battery check: 87% remaining",
      },
      {
        timestamp: "10:30",
        type: "automated",
        message: "Guest check-out completed - cleaning scheduled",
      },
      {
        timestamp: "14:22",
        type: "automated",
        message: "Cleaning verified via photo upload",
      },
      {
        timestamp: "15:45",
        type: "automated",
        message: "New guest check-in code generated",
      },
    ],
    owner: {
      name: "Michael Chen",
      phone: "(314) 555-0456",
      email: "mchen@email.com",
      notes:
        "Prefers minimal communication. Automated systems work best. Send monthly performance digest on the 5th.",
    },
    financial: {
      grossRent: 5800,
      taxLiability: 174,
      taxReadiness: 100,
      lastSync: "2 mins ago",
      remittanceDays: 90,
      remittancePeriod: "Q2 Filing",
    },
    security: {
      lockStatus: "online",
      accessCodes: [
        {
          guest: "Laura M.",
          code: "3314",
          checkin: "Apr 2, 3:00 PM",
          checkout: "Apr 6, 11:00 AM",
          status: "active",
        },
        {
          guest: "David W.",
          code: "9902",
          checkin: "Mar 30, 4:00 PM",
          checkout: "Apr 2, 10:00 AM",
          status: "expired",
        },
      ],
      heartbeatData: generateHeartbeatData(203),
    },
    safety: {
      decibelData12h: generateDecibelData12h("low", 204),
      alarmBattery: 94,
      lastTested: "Mar 20, 2026",
      smsEnabled: true,
    },
    environmental: {
      leakStatus: "clear",
      mainValve: "open",
      ...generateUtilData(205),
      monthlySavings: 62,
      avgTempAdj: 4,
      occupiedTemp: 71,
      emptyTemp: 66,
    },
    revenue: {
      listingActive: true,
      pricelabsSynced: true,
      lastUpdate: "1 day ago",
      events: [
        {
          name: "Cinco de Mayo - Soulard",
          date: "May 3, 2026",
          manualOverride: true,
        },
        {
          name: "Mardi Gras Soulard (post)",
          date: "Apr 8, 2026",
          manualOverride: false,
        },
        {
          name: "Blues Playoff Game 2",
          date: "Apr 20, 2026",
          manualOverride: false,
        },
      ],
      description:
        "Gorgeous renovated loft in the heart of Soulard. Steps from the Soulard Farmers Market. Exposed brick, soaring ceilings, and a rooftop deck with city views.",
      listingPhotos: 24,
      gapOpportunities: ["Apr 6–9 (3 nights)"],
    },
  },
  {
    id: "P-03",
    name: "63104 Tower Grove Suite",
    address: "890 S Grand Blvd, St. Louis, MO 63104",
    riskLevel: "medium",
    riskReason: "First-time guest + Weekend booking",
    noiseData: generateNoiseData(301),
    tempData: generateTempData(302),
    complianceProgress: 72,
    monthlyROI: 16.8,
    safetyScore: 88,
    activityLog: [
      {
        timestamp: "11:20",
        type: "manual",
        message: "Sent personalized welcome message with local recommendations",
      },
      {
        timestamp: "13:40",
        type: "automated",
        message: "HVAC optimization: Adjusted to guest preference profile",
      },
      {
        timestamp: "17:15",
        type: "alert",
        message: "First-time guest reminder: Check-in instructions sent",
      },
      {
        timestamp: "18:50",
        type: "automated",
        message: "Guest successfully checked in - no issues reported",
      },
    ],
    owner: {
      name: "Jennifer Martinez",
      phone: "(314) 555-0789",
      email: "jmartinez@email.com",
      notes:
        "New investor — requires frequent updates. Review tax compliance progress. Schedule bi-weekly check-in calls.",
    },
    financial: {
      grossRent: 3100,
      taxLiability: 93,
      taxReadiness: 72,
      lastSync: "8 mins ago",
      remittanceDays: 90,
      remittancePeriod: "Q2 Filing",
    },
    security: {
      lockStatus: "online",
      accessCodes: [
        {
          guest: "Samantha B.",
          code: "6671",
          checkin: "Apr 1, 4:00 PM",
          checkout: "Apr 4, 11:00 AM",
          status: "active",
        },
        {
          guest: "Kevin O.",
          code: "2248",
          checkin: "Mar 27, 3:00 PM",
          checkout: "Apr 1, 10:00 AM",
          status: "expired",
        },
      ],
      heartbeatData: generateHeartbeatData(303),
    },
    safety: {
      decibelData12h: generateDecibelData12h("medium", 304),
      alarmBattery: 71,
      lastTested: "Feb 28, 2026",
      smsEnabled: true,
    },
    environmental: {
      leakStatus: "clear",
      mainValve: "open",
      ...generateUtilData(305),
      monthlySavings: 35,
      avgTempAdj: 3,
      occupiedTemp: 69,
      emptyTemp: 64,
    },
    revenue: {
      listingActive: true,
      pricelabsSynced: true,
      lastUpdate: "3 days ago",
      events: [
        {
          name: "Earth Day Festival - Tower Grove",
          date: "Apr 19, 2026",
          manualOverride: true,
        },
        {
          name: "S. Grand International Food Festival",
          date: "May 10, 2026",
          manualOverride: false,
        },
        {
          name: "Cardinals Home Series",
          date: "Apr 8–10, 2026",
          manualOverride: false,
        },
      ],
      description:
        "Modern suite steps from the S. Grand restaurant corridor and Tower Grove Park. Ideal for foodies, walkers, and culture seekers. Fully equipped kitchen, fast WiFi.",
      listingPhotos: 14,
      gapOpportunities: ["Apr 5–7 (2 nights)", "Apr 15–18 (3 nights)"],
    },
  },
  {
    id: "P-04",
    name: "63118 The Hill Villa C",
    address: "2345 Shaw Ave, St. Louis, MO 63118",
    riskLevel: "critical",
    riskReason:
      "Multiple concurrent events: Blues game + Convention + Large group booking",
    noiseData: generateNoiseData(401),
    tempData: generateTempData(402),
    complianceProgress: 45,
    monthlyROI: 25.7,
    safetyScore: 75,
    activityLog: [
      {
        timestamp: "09:00",
        type: "automated",
        message: "Group booking confirmed: 8 guests",
      },
      {
        timestamp: "12:30",
        type: "alert",
        message: "Pre-emptive noise policy reminder sent to guests",
      },
      {
        timestamp: "15:45",
        type: "manual",
        message: "Manager note: Monitoring closely - high-risk night",
      },
      {
        timestamp: "19:00",
        type: "automated",
        message: "Smart noise sensor: Currently 68dB (within limits)",
      },
      {
        timestamp: "21:15",
        type: "alert",
        message: "Noise threshold breach detected - automated warning sent",
      },
      {
        timestamp: "21:20",
        type: "manual",
        message: "Manager called guest - situation resolved amicably",
      },
    ],
    owner: {
      name: "Robert Williams",
      phone: "(314) 555-0321",
      email: "rwilliams@email.com",
      notes:
        "Long-term client. Experienced investor. Aware of compliance gaps — action plan in progress. Monthly revenue call every 3rd Thursday.",
    },
    financial: {
      grossRent: 7200,
      taxLiability: 216,
      taxReadiness: 45,
      lastSync: "12 mins ago",
      remittanceDays: 90,
      remittancePeriod: "Q2 Filing",
    },
    security: {
      lockStatus: "offline",
      accessCodes: [
        {
          guest: "Group Booking (8)",
          code: "0088",
          checkin: "Apr 1, 2:00 PM",
          checkout: "Apr 3, 10:00 AM",
          status: "active",
        },
        {
          guest: "Connor F.",
          code: "5512",
          checkin: "Mar 26, 4:00 PM",
          checkout: "Apr 1, 11:00 AM",
          status: "expired",
        },
      ],
      heartbeatData: generateHeartbeatData(403),
    },
    safety: {
      decibelData12h: generateDecibelData12h("critical", 404),
      alarmBattery: 45,
      lastTested: "Jan 10, 2026",
      smsEnabled: true,
    },
    environmental: {
      leakStatus: "critical",
      mainValve: "open",
      ...generateUtilData(405),
      monthlySavings: 28,
      avgTempAdj: 2,
      occupiedTemp: 72,
      emptyTemp: 67,
    },
    revenue: {
      listingActive: true,
      pricelabsSynced: false,
      lastUpdate: "5 days ago",
      events: [
        {
          name: "Blues Playoff Game 1",
          date: "Apr 18, 2026",
          manualOverride: true,
        },
        {
          name: "MedTech Convention Downtown",
          date: "Apr 7–9, 2026",
          manualOverride: true,
        },
        {
          name: "Italian Heritage Festival - The Hill",
          date: "Apr 26, 2026",
          manualOverride: true,
        },
        {
          name: "Cardinals Weekend Series",
          date: "Apr 11–13, 2026",
          manualOverride: false,
        },
      ],
      description:
        "Spacious Italian-American villa on the historic Hill neighborhood. Sleeps 10, full chef's kitchen, private courtyard. Walk to award-winning restaurants. Perfect for groups.",
      listingPhotos: 22,
      gapOpportunities: ["Apr 3–7 (4 nights)", "Apr 13–18 (5 nights)"],
    },
  },
  {
    id: "P-05",
    name: "63110 Central West End Penthouse",
    address: "456 Maryland Ave, St. Louis, MO 63110",
    riskLevel: "low",
    riskReason: "Verified repeat guest - Excellent history",
    noiseData: generateNoiseData(501),
    tempData: generateTempData(502),
    complianceProgress: 95,
    monthlyROI: 28.2,
    safetyScore: 99,
    activityLog: [
      {
        timestamp: "07:30",
        type: "automated",
        message: "Repeat guest recognition: VIP amenities prepared",
      },
      {
        timestamp: "14:00",
        type: "automated",
        message: "Early check-in approved - unit ready",
      },
      {
        timestamp: "16:20",
        type: "automated",
        message: "Guest satisfaction survey sent (auto-timed)",
      },
    ],
    owner: {
      name: "Sarah Johnson",
      phone: "(314) 555-0123",
      email: "sarah.johnson@email.com",
      notes:
        "Premium flagship property. Maintain 5-star status. Coordinate with Sarah on seasonal luxury upgrades. White-glove service standard required.",
    },
    financial: {
      grossRent: 8500,
      taxLiability: 255,
      taxReadiness: 95,
      lastSync: "1 min ago",
      remittanceDays: 90,
      remittancePeriod: "Q2 Filing",
    },
    security: {
      lockStatus: "online",
      accessCodes: [
        {
          guest: "Rachel & Tom B.",
          code: "9921",
          checkin: "Mar 31, 3:00 PM",
          checkout: "Apr 5, 12:00 PM",
          status: "active",
        },
        {
          guest: "Corporate Guest - Apex LLC",
          code: "4477",
          checkin: "Mar 25, 4:00 PM",
          checkout: "Mar 31, 10:00 AM",
          status: "expired",
        },
      ],
      heartbeatData: generateHeartbeatData(503),
    },
    safety: {
      decibelData12h: generateDecibelData12h("low", 504),
      alarmBattery: 98,
      lastTested: "Mar 28, 2026",
      smsEnabled: true,
    },
    environmental: {
      leakStatus: "clear",
      mainValve: "open",
      ...generateUtilData(505),
      monthlySavings: 74,
      avgTempAdj: 5,
      occupiedTemp: 70,
      emptyTemp: 64,
    },
    revenue: {
      listingActive: true,
      pricelabsSynced: true,
      lastUpdate: "18 hours ago",
      events: [
        {
          name: "CWE Spring Art Fair",
          date: "Apr 26–27, 2026",
          manualOverride: true,
        },
        {
          name: "Forest Park Hot Chocolate 15k",
          date: "Apr 12, 2026",
          manualOverride: true,
        },
        {
          name: "Symphony at Powell Hall",
          date: "Apr 18, 2026",
          manualOverride: false,
        },
        {
          name: "Blues Playoff Game 2",
          date: "Apr 20, 2026",
          manualOverride: false,
        },
      ],
      description:
        "Luxurious top-floor penthouse in the heart of CWE. Panoramic city views, Bose sound system, chef's kitchen, and concierge-style amenities. Walk to Whole Foods, Barnes-Jewish area.",
      listingPhotos: 31,
      gapOpportunities: [],
    },
  },
  {
    id: "P-06",
    name: "63130 University City Studio",
    address: "789 Delmar Loop, St. Louis, MO 63130",
    riskLevel: "medium",
    riskReason: "Extended stay booking - Week 2 of 4",
    noiseData: generateNoiseData(601),
    tempData: generateTempData(602),
    complianceProgress: 88,
    monthlyROI: 14.5,
    safetyScore: 91,
    activityLog: [
      {
        timestamp: "10:15",
        type: "automated",
        message: "Mid-stay maintenance check scheduled",
      },
      {
        timestamp: "11:45",
        type: "manual",
        message: "Housekeeping completed mid-stay refresh",
      },
      {
        timestamp: "13:00",
        type: "automated",
        message: "Guest feedback: 5-star rating received",
      },
      {
        timestamp: "20:30",
        type: "automated",
        message: "Energy usage tracking: On target for month",
      },
    ],
    owner: {
      name: "Jennifer Martinez",
      phone: "(314) 555-0789",
      email: "jmartinez@email.com",
      notes:
        "Good ROI on extended stays. Explore academic/corporate lease options near WashU. Jennifer open to interior upgrade investment.",
    },
    financial: {
      grossRent: 2400,
      taxLiability: 72,
      taxReadiness: 88,
      lastSync: "15 mins ago",
      remittanceDays: 90,
      remittancePeriod: "Q2 Filing",
    },
    security: {
      lockStatus: "online",
      accessCodes: [
        {
          guest: "Dr. Aisha P. (WashU)",
          code: "7766",
          checkin: "Mar 22, 3:00 PM",
          checkout: "Apr 19, 11:00 AM",
          status: "active",
        },
      ],
      heartbeatData: generateHeartbeatData(603),
    },
    safety: {
      decibelData12h: generateDecibelData12h("medium", 604),
      alarmBattery: 82,
      lastTested: "Mar 10, 2026",
      smsEnabled: false,
    },
    environmental: {
      leakStatus: "clear",
      mainValve: "open",
      ...generateUtilData(605),
      monthlySavings: 29,
      avgTempAdj: 3,
      occupiedTemp: 68,
      emptyTemp: 63,
    },
    revenue: {
      listingActive: true,
      pricelabsSynced: true,
      lastUpdate: "4 days ago",
      events: [
        {
          name: "WashU Commencement Weekend",
          date: "May 15–17, 2026",
          manualOverride: true,
        },
        {
          name: "Delmar Loop Block Party",
          date: "Apr 25, 2026",
          manualOverride: false,
        },
        {
          name: "Jazz at the Pageant",
          date: "Apr 11, 2026",
          manualOverride: false,
        },
      ],
      description:
        "Stylish studio on the vibrant Delmar Loop. Walk to 50+ restaurants, live music venues, and Blueberry Hill. Perfect for WashU/SLU visitors, academics, and urban explorers. Forest Park: Hot Chocolate recommendations added.",
      listingPhotos: 11,
      gapOpportunities: ["Apr 19–24 (5 nights)"],
    },
  },
];
