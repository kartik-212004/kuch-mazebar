// Mock authentication system - can be easily replaced with real auth later
export interface User {
  id: string
  email: string
  name: string
  role: "student" | "faculty" | "admin"
  department?: string
  studentId?: string
  profileImage?: string
}

export interface Student extends User {
  role: "student"
  studentId: string
  year: number
  department: string
  cgpa: number
  totalActivities: number
  verifiedActivities: number
}

export interface Faculty extends User {
  role: "faculty"
  department: string
  designation: string
}

export interface Admin extends User {
  role: "admin"
}

// Mock data
export const mockUsers: Record<string, User> = {
  student: {
    id: "1",
    email: "student@university.edu",
    name: "Arjun Sharma",
    role: "student",
    studentId: "CS2021001",
    department: "Computer Science",
    profileImage: "/diverse-student-profiles.png",
  } as Student,
  faculty: {
    id: "2",
    email: "faculty@university.edu",
    name: "Dr. Priya Patel",
    role: "faculty",
    department: "Computer Science",
    designation: "Associate Professor",
  } as Faculty,
  admin: {
    id: "3",
    email: "admin@university.edu",
    name: "Rajesh Kumar",
    role: "admin",
  } as Admin,
}

export const getCurrentUser = (role: string): User | null => {
  return mockUsers[role] || null
}

export const isAuthenticated = (): boolean => {
  // Mock authentication check
  return true
}
