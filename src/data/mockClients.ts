export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: string[]; // Property IDs
  joinDate: string;
  status: "active" | "pending" | "inactive";
  totalRevenue: number;
  preferredContact: "email" | "phone" | "text";
  notes: string;
}

export const mockClients: Client[] = [
  {
    id: "C-01",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(314) 555-0123",
    properties: ["P-01", "P-05"],
    joinDate: "2024-01-15",
    status: "active",
    totalRevenue: 125400,
    preferredContact: "email",
    notes:
      "Excellent client - always responsive. Owns premium properties in CWE and Dogtown.",
  },
  {
    id: "C-02",
    name: "Michael Chen",
    email: "mchen@email.com",
    phone: "(314) 555-0456",
    properties: ["P-02"],
    joinDate: "2023-08-22",
    status: "active",
    totalRevenue: 87600,
    preferredContact: "text",
    notes: "Prefers minimal communication. Automated systems work best.",
  },
  {
    id: "C-03",
    name: "Jennifer Martinez",
    email: "jmartinez@email.com",
    phone: "(314) 555-0789",
    properties: ["P-03", "P-06"],
    joinDate: "2025-02-10",
    status: "active",
    totalRevenue: 45200,
    preferredContact: "phone",
    notes: "New investor - requires frequent updates and hand-holding.",
  },
  {
    id: "C-04",
    name: "Robert Williams",
    email: "rwilliams@email.com",
    phone: "(314) 555-0321",
    properties: ["P-04"],
    joinDate: "2022-11-05",
    status: "active",
    totalRevenue: 156800,
    preferredContact: "email",
    notes:
      "Long-term client. High-volume property on The Hill. Experienced investor.",
  },
  {
    id: "C-05",
    name: "Emily Thompson",
    email: "ethompson@email.com",
    phone: "(314) 555-0654",
    properties: [],
    joinDate: "2026-03-15",
    status: "pending",
    totalRevenue: 0,
    preferredContact: "email",
    notes:
      "Onboarding in progress. Property inspection scheduled for next week.",
  },
  {
    id: "C-06",
    name: "David Anderson",
    email: "danderson@email.com",
    phone: "(314) 555-0987",
    properties: [],
    joinDate: "2024-06-20",
    status: "inactive",
    totalRevenue: 34500,
    preferredContact: "phone",
    notes:
      "Property sold in Q4 2025. Maintaining relationship for future opportunities.",
  },
];
