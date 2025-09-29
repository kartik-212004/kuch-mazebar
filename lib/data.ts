// Mock data structures for the Smart Student Hub

export interface Activity {
  id: string
  studentId: string
  title: string
  description: string
  category: "academic" | "extracurricular" | "sports" | "cultural" | "technical" | "social"
  date: string
  status: "pending" | "approved" | "rejected"
  documents: string[]
  points: number
  facultyRemarks?: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
}

export interface Certificate {
  id: string
  studentId: string
  title: string
  description: string
  category: "academic" | "extracurricular" | "sports" | "cultural" | "technical" | "social"
  issuer: string
  dateIssued: string
  status: "pending" | "approved" | "rejected"
  certificateFile: string // URL or path to the certificate file
  points: number
  facultyRemarks?: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
}

export interface AnalyticsData {
  totalStudents: number
  totalActivities: number
  totalCertificates: number
  approvalRate: number
  departmentStats: Record<string, number>
  categoryStats: Record<string, number>
  monthlyTrends: Array<{ month: string; activities: number; approvals: number }>
}

// Mock activities data
export const mockActivities: Activity[] = [
  {
    id: "1",
    studentId: "CS2021001",
    title: "Won First Prize in Hackathon",
    description: "Developed an AI-powered study assistant app and won first prize in the university hackathon.",
    category: "technical",
    date: "2024-03-15",
    status: "approved",
    documents: ["/hackathon-certificate.jpg"],
    points: 50,
    facultyRemarks: "Excellent technical innovation and presentation.",
    approvedBy: "Dr. Priya Patel",
    approvedAt: "2024-03-18",
    createdAt: "2024-03-16",
  },
  {
    id: "2",
    studentId: "CS2021001",
    title: "Volunteer at Blood Donation Camp",
    description: "Organized and volunteered at the annual blood donation camp, helping coordinate 100+ donations.",
    category: "social",
    date: "2024-02-20",
    status: "pending",
    documents: ["/volunteer-certificate.jpg"],
    points: 30,
    createdAt: "2024-02-22",
  },
  {
    id: "3",
    studentId: "CS2021001",
    title: "Research Paper Publication",
    description:
      "Co-authored a research paper on machine learning applications in education, published in IEEE conference.",
    category: "academic",
    date: "2024-01-10",
    status: "approved",
    documents: ["/research-paper-stack.png"],
    points: 80,
    facultyRemarks: "Outstanding research contribution.",
    approvedBy: "Dr. Priya Patel",
    approvedAt: "2024-01-15",
    createdAt: "2024-01-12",
  },
]

// Mock certificates data
export const mockCertificates: Certificate[] = [
  {
    id: "cert1",
    studentId: "CS2021001",
    title: "AWS Cloud Practitioner Certification",
    description: "Successfully completed AWS Cloud Practitioner certification with 90% score",
    category: "technical",
    issuer: "Amazon Web Services",
    dateIssued: "2024-03-10",
    status: "pending",
    certificateFile: "/aws-certificate.pdf",
    points: 60,
    createdAt: "2024-03-12",
  },
  {
    id: "cert2",
    studentId: "CS2021001",
    title: "Google Analytics Certified",
    description: "Completed Google Analytics Individual Qualification (IQ) certification",
    category: "technical",
    issuer: "Google",
    dateIssued: "2024-02-15",
    status: "approved",
    certificateFile: "/google-analytics-cert.pdf",
    points: 40,
    facultyRemarks: "Excellent additional skill for data analysis.",
    approvedBy: "Dr. Priya Patel",
    approvedAt: "2024-02-18",
    createdAt: "2024-02-16",
  },
  {
    id: "cert3",
    studentId: "EC2021045",
    title: "NPTEL Electronics Course Certificate",
    description: "Completed Advanced Digital Signal Processing course with Elite grade",
    category: "academic",
    issuer: "NPTEL",
    dateIssued: "2024-01-20",
    status: "approved",
    certificateFile: "/nptel-certificate.pdf",
    points: 50,
    facultyRemarks: "High-quality academic achievement.",
    approvedBy: "Dr. Priya Patel",
    approvedAt: "2024-01-25",
    createdAt: "2024-01-22",
  },
]

// Mock analytics data
export const mockAnalytics: AnalyticsData = {
  totalStudents: 1250,
  totalActivities: 3420,
  totalCertificates: 245,
  approvalRate: 78.5,
  departmentStats: {
    "Computer Science": 890,
    Electronics: 650,
    Mechanical: 720,
    Civil: 580,
    Chemical: 580,
  },
  categoryStats: {
    academic: 1200,
    technical: 850,
    extracurricular: 600,
    sports: 400,
    cultural: 250,
    social: 120,
  },
  monthlyTrends: [
    { month: "Jan", activities: 280, approvals: 220 },
    { month: "Feb", activities: 320, approvals: 250 },
    { month: "Mar", activities: 380, approvals: 300 },
    { month: "Apr", activities: 290, approvals: 230 },
    { month: "May", activities: 250, approvals: 195 },
    { month: "Jun", activities: 310, approvals: 245 },
  ],
}

export const getActivitiesByStudent = (studentId: string): Activity[] => {
  return mockActivities.filter((activity) => activity.studentId === studentId)
}

export const getPendingActivities = (): Activity[] => {
  return mockActivities.filter((activity) => activity.status === "pending")
}

export const getCertificatesByStudent = (studentId: string): Certificate[] => {
  return mockCertificates.filter((certificate) => certificate.studentId === studentId)
}

export const getPendingCertificates = (): Certificate[] => {
  return mockCertificates.filter((certificate) => certificate.status === "pending")
}

export const getAnalytics = (): AnalyticsData => {
  return mockAnalytics
}
