
export type CaseStatus = 'pending' | 'ongoing' | 'resolved' | 'dismissed';

export type CaseType = 
  | 'dispute' 
  | 'domestic' 
  | 'property' 
  | 'noise' 
  | 'theft' 
  | 'vandalism' 
  | 'harassment'
  | 'other';

export interface Case {
  id: string;
  title: string;
  description: string;
  complainant: string;
  respondent: string;
  type: CaseType;
  status: CaseStatus;
  filedDate: string;
  resolvedDate?: string;
  tags: string[];
  updatedAt: string;
}

export const sampleCases: Case[] = [
  {
    id: "CASE-2023-001",
    title: "Property Boundary Dispute",
    description: "Dispute over the fence boundary between adjacent properties",
    complainant: "Juan Dela Cruz",
    respondent: "Maria Santos",
    type: "property",
    status: "resolved",
    filedDate: "2023-06-12",
    resolvedDate: "2023-07-20",
    tags: ["property", "boundary", "resolved"],
    updatedAt: "2023-07-20"
  },
  {
    id: "CASE-2023-002",
    title: "Excessive Noise Complaint",
    description: "Complaint about loud music and gatherings during late hours",
    complainant: "Ricardo Dalisay",
    respondent: "James Reyes",
    type: "noise",
    status: "ongoing",
    filedDate: "2023-07-05",
    tags: ["noise", "disturbance"],
    updatedAt: "2023-08-18"
  },
  {
    id: "CASE-2023-003",
    title: "Domestic Dispute",
    description: "Family conflict requiring mediation",
    complainant: "Elena Mercado",
    respondent: "Roberto Mercado",
    type: "domestic",
    status: "pending",
    filedDate: "2023-08-10",
    tags: ["domestic", "family"],
    updatedAt: "2023-08-10"
  },
  {
    id: "CASE-2023-004",
    title: "Harassment Claim",
    description: "Verbal harassment in public spaces",
    complainant: "Anna Lim",
    respondent: "Pedro Tan",
    type: "harassment",
    status: "ongoing",
    filedDate: "2023-08-01",
    tags: ["harassment", "verbal"],
    updatedAt: "2023-08-15"
  },
  {
    id: "CASE-2023-005",
    title: "Theft Report",
    description: "Theft of personal belongings from residence",
    complainant: "Miguel Torres",
    respondent: "Unknown",
    type: "theft",
    status: "ongoing",
    filedDate: "2023-08-05",
    tags: ["theft", "residence"],
    updatedAt: "2023-08-08"
  },
  {
    id: "CASE-2023-006",
    title: "Vandalism Report",
    description: "Graffiti on community center wall",
    complainant: "Barangay Official",
    respondent: "Unknown Youth Group",
    type: "vandalism",
    status: "dismissed",
    filedDate: "2023-07-15",
    resolvedDate: "2023-07-30",
    tags: ["vandalism", "public property"],
    updatedAt: "2023-07-30"
  },
  {
    id: "CASE-2023-007",
    title: "Unpaid Debt Dispute",
    description: "Claim for unpaid personal loan",
    complainant: "Carlos Reyes",
    respondent: "Andres Lopez",
    type: "dispute",
    status: "resolved",
    filedDate: "2023-06-20",
    resolvedDate: "2023-08-02",
    tags: ["financial", "debt", "resolved"],
    updatedAt: "2023-08-02"
  },
  {
    id: "CASE-2023-008",
    title: "Water Drainage Issue",
    description: "Improper drainage affecting neighboring properties",
    complainant: "Teresa Garcia",
    respondent: "Fernando Cruz",
    type: "property",
    status: "pending",
    filedDate: "2023-08-12",
    tags: ["property", "drainage", "environmental"],
    updatedAt: "2023-08-12"
  },
  {
    id: "CASE-2023-009",
    title: "Pet Disturbance",
    description: "Uncontrolled pets causing disturbance in the neighborhood",
    complainant: "Sophia Reyes",
    respondent: "David Tan",
    type: "noise",
    status: "ongoing",
    filedDate: "2023-08-03",
    tags: ["pets", "noise", "disturbance"],
    updatedAt: "2023-08-20"
  },
  {
    id: "CASE-2023-010",
    title: "Child Support Dispute",
    description: "Request for child support mediation",
    complainant: "Lucia Fernandez",
    respondent: "Martin Cruz",
    type: "domestic",
    status: "ongoing",
    filedDate: "2023-07-28",
    tags: ["domestic", "child support", "family"],
    updatedAt: "2023-08-16"
  },
  {
    id: "CASE-2023-011",
    title: "Business Permit Violation",
    description: "Operating business without proper barangay permits",
    complainant: "Barangay Official",
    respondent: "Local Shop Owner",
    type: "other",
    status: "pending",
    filedDate: "2023-08-08",
    tags: ["business", "permit", "violation"],
    updatedAt: "2023-08-08"
  },
  {
    id: "CASE-2023-012",
    title: "Trespassing Complaint",
    description: "Unauthorized entry into private property",
    complainant: "Isabella Santos",
    respondent: "Unknown Individuals",
    type: "property",
    status: "dismissed",
    filedDate: "2023-07-02",
    resolvedDate: "2023-07-20",
    tags: ["trespassing", "property"],
    updatedAt: "2023-07-20"
  }
];

export const getCaseStats = () => {
  const total = sampleCases.length;
  
  // Status counts
  const pending = sampleCases.filter(c => c.status === 'pending').length;
  const ongoing = sampleCases.filter(c => c.status === 'ongoing').length;
  const resolved = sampleCases.filter(c => c.status === 'resolved').length;
  const dismissed = sampleCases.filter(c => c.status === 'dismissed').length;
  
  // Type counts
  const byType: Record<CaseType, number> = {
    dispute: 0,
    domestic: 0,
    property: 0,
    noise: 0,
    theft: 0,
    vandalism: 0,
    harassment: 0,
    other: 0
  };
  
  sampleCases.forEach(c => {
    byType[c.type]++;
  });
  
  // Monthly data for charts
  const monthlyData = Array(12).fill(0);
  const resolvedMonthlyData = Array(12).fill(0);
  
  sampleCases.forEach(c => {
    const filedMonth = new Date(c.filedDate).getMonth();
    monthlyData[filedMonth]++;
    
    if (c.resolvedDate) {
      const resolvedMonth = new Date(c.resolvedDate).getMonth();
      resolvedMonthlyData[resolvedMonth]++;
    }
  });
  
  return {
    total,
    byStatus: { pending, ongoing, resolved, dismissed },
    byType,
    monthlyFiled: monthlyData,
    monthlyResolved: resolvedMonthlyData
  };
};

export const getRecentCases = (limit = 5) => {
  return [...sampleCases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};

export const getCaseById = (id: string) => {
  return sampleCases.find(c => c.id === id);
};

export const getMonthName = (index: number) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[index];
};
