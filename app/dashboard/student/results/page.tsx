"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  GraduationCap,
  Award,
  TrendingUp,
  BookOpen,
  Calendar,
  Download,
  Share2,
  Trophy,
  Target,
  BarChart3,
  ArrowLeft,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

// Subject data structure
interface Subject {
  code: string
  name: string
  faculty: string
  credits: number
  type: "Theory" | "Lab" | "Project"
  marksObtained: number
  totalMarks: number
  grade: string
  gradePoints: number
}

// Mock semester results data
const semesterSubjects: Subject[] = [
  {
    code: "DAA",
    name: "Design and Analysis of Algorithms",
    faculty: "Dr. Shailesh Singh Panwar",
    credits: 4,
    type: "Theory",
    marksObtained: 85,
    totalMarks: 100,
    grade: "A",
    gradePoints: 9
  },
  {
    code: "CD",
    name: "Compiler Design", 
    faculty: "Mr. Sushil Singh Rauthan",
    credits: 4,
    type: "Theory",
    marksObtained: 78,
    totalMarks: 100,
    grade: "B+",
    gradePoints: 8
  },
  {
    code: "DBMS",
    name: "Database Management System",
    faculty: "Mr. Gajendra Singh Rai", 
    credits: 4,
    type: "Theory",
    marksObtained: 92,
    totalMarks: 100,
    grade: "A+",
    gradePoints: 10
  },
  {
    code: "FL",
    name: "Fuzzy Logic",
    faculty: "Dr. Shailesh Singh Panwar",
    credits: 3,
    type: "Theory", 
    marksObtained: 82,
    totalMarks: 100,
    grade: "A",
    gradePoints: 9
  },
  {
    code: "DAA Lab",
    name: "Design and Analysis of Algorithms Lab",
    faculty: "Dr. Shailesh Singh Panwar",
    credits: 2,
    type: "Lab",
    marksObtained: 88,
    totalMarks: 100,
    grade: "A",
    gradePoints: 9
  },
  {
    code: "CD Lab", 
    name: "Compiler Design Lab",
    faculty: "Mr. Sushil Singh Rauthan",
    credits: 2,
    type: "Lab",
    marksObtained: 85,
    totalMarks: 100,
    grade: "A",
    gradePoints: 9
  },
  {
    code: "DBMS Lab",
    name: "Database Management System Lab", 
    faculty: "Mr. Gajendra Singh Rai",
    credits: 2,
    type: "Lab",
    marksObtained: 90,
    totalMarks: 100,
    grade: "A+",
    gradePoints: 10
  },
  {
    code: "SE",
    name: "Software Engineering",
    faculty: "Mr. Abhilaash Maithani",
    credits: 3,
    type: "Theory",
    marksObtained: 79,
    totalMarks: 100, 
    grade: "B+",
    gradePoints: 8
  },
  {
    code: "CSI",
    name: "Constitution of India",
    faculty: "Dr. Anshul Singh",
    credits: 2,
    type: "Theory",
    marksObtained: 87,
    totalMarks: 100,
    grade: "A",
    gradePoints: 9
  },
  {
    code: "MP-II",
    name: "Mini Project - II",
    faculty: "Faculty Coordinator",
    credits: 2,
    type: "Project",
    marksObtained: 94,
    totalMarks: 100,
    grade: "A+", 
    gradePoints: 10
  }
]

// Calculate SGPA
const calculateSGPA = (subjects: Subject[]) => {
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
  const totalGradePoints = subjects.reduce((sum, subject) => sum + (subject.gradePoints * subject.credits), 0)
  return (totalGradePoints / totalCredits).toFixed(2)
}

// Calculate percentage
const calculatePercentage = (subjects: Subject[]) => {
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.totalMarks, 0)
  const obtainedMarks = subjects.reduce((sum, subject) => sum + subject.marksObtained, 0)
  return ((obtainedMarks / totalMarks) * 100).toFixed(2)
}

// Grade distribution data for chart
const gradeDistribution = [
  { grade: "A+", count: semesterSubjects.filter(s => s.grade === "A+").length, color: "#10b981" },
  { grade: "A", count: semesterSubjects.filter(s => s.grade === "A").length, color: "#3b82f6" },
  { grade: "B+", count: semesterSubjects.filter(s => s.grade === "B+").length, color: "#f59e0b" },
  { grade: "B", count: semesterSubjects.filter(s => s.grade === "B").length, color: "#ef4444" },
]

// Subject performance data for bar chart
const subjectPerformance = semesterSubjects.map(subject => ({
  subject: subject.code,
  marks: subject.marksObtained,
  percentage: (subject.marksObtained / subject.totalMarks) * 100
}))

export default function ResultsPage() {
  const user = getCurrentUser("student")
  const [selectedSemester, setSelectedSemester] = useState("Semester 6")
  
  const sgpa = calculateSGPA(semesterSubjects)
  const percentage = calculatePercentage(semesterSubjects)
  const totalCredits = semesterSubjects.reduce((sum, subject) => sum + subject.credits, 0)

  const handleGoBack = () => {
    window.location.href = "/dashboard/student"
  }

  const handleDownloadResult = () => {
    alert("Downloading semester result PDF...")
  }

  const handleShareResult = () => {
    alert("Sharing result via email...")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGoBack}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Academic Results</h1>
              <p className="text-slate-400">Semester 6 - Computer Science & Engineering</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={handleDownloadResult}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShareResult}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Overall Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">SGPA</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{sgpa}</div>
              <p className="text-xs text-slate-400">
                Out of 10.0
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Overall Percentage</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{percentage}%</div>
              <p className="text-xs text-slate-400">
                Total {semesterSubjects.reduce((sum, s) => sum + s.marksObtained, 0)}/{semesterSubjects.reduce((sum, s) => sum + s.totalMarks, 0)} marks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Credits</CardTitle>
              <BookOpen className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalCredits}</div>
              <p className="text-xs text-slate-400">
                {semesterSubjects.length} subjects completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Grade Status</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Passed</div>
              <p className="text-xs text-slate-400">
                All subjects cleared
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="subjects" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              Subject Details
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            >
              Performance Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grade Distribution Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Grade Distribution</CardTitle>
                  <CardDescription className="text-slate-400">
                    Distribution of grades across all subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ grade, count }) => `${grade}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Performance Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Subject Performance</CardTitle>
                  <CardDescription className="text-slate-400">
                    Marks obtained in each subject
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="subject" 
                        stroke="#9ca3af" 
                        fontSize={12}
                      />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '6px'
                        }}
                      />
                      <Bar dataKey="marks" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subject Details Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Subject-wise Results</CardTitle>
                <CardDescription className="text-slate-400">
                  Detailed marks and grades for Semester 6
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Subject Code</TableHead>
                      <TableHead className="text-slate-300">Subject Name</TableHead>
                      <TableHead className="text-slate-300">Faculty</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Credits</TableHead>
                      <TableHead className="text-slate-300">Marks</TableHead>
                      <TableHead className="text-slate-300">Grade</TableHead>
                      <TableHead className="text-slate-300">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semesterSubjects.map((subject, index) => (
                      <TableRow key={index} className="border-slate-700 hover:bg-slate-800/30">
                        <TableCell className="font-medium text-slate-200">{subject.code}</TableCell>
                        <TableCell className="text-slate-300">{subject.name}</TableCell>
                        <TableCell className="text-slate-400">{subject.faculty}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${subject.type === 'Theory' ? 'border-blue-500 text-blue-400' : ''}
                              ${subject.type === 'Lab' ? 'border-green-500 text-green-400' : ''}
                              ${subject.type === 'Project' ? 'border-purple-500 text-purple-400' : ''}
                            `}
                          >
                            {subject.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{subject.credits}</TableCell>
                        <TableCell className="text-slate-300">
                          {subject.marksObtained}/{subject.totalMarks}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`
                              ${subject.grade === 'A+' ? 'bg-green-600' : ''}
                              ${subject.grade === 'A' ? 'bg-blue-600' : ''}
                              ${subject.grade === 'B+' ? 'bg-yellow-600' : ''}
                              ${subject.grade === 'B' ? 'bg-orange-600' : ''}
                            `}
                          >
                            {subject.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{subject.gradePoints}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Highest Marks:</span>
                    <span className="text-green-400 font-medium">94/100 (MP-II)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Lowest Marks:</span>
                    <span className="text-yellow-400 font-medium">78/100 (CD)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Average Marks:</span>
                    <span className="text-blue-400 font-medium">{(semesterSubjects.reduce((sum, s) => sum + s.marksObtained, 0) / semesterSubjects.length).toFixed(1)}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Theory Avg:</span>
                    <span className="text-slate-300">{(semesterSubjects.filter(s => s.type === 'Theory').reduce((sum, s) => sum + s.marksObtained, 0) / semesterSubjects.filter(s => s.type === 'Theory').length).toFixed(1)}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Lab Avg:</span>
                    <span className="text-slate-300">{(semesterSubjects.filter(s => s.type === 'Lab').reduce((sum, s) => sum + s.marksObtained, 0) / semesterSubjects.filter(s => s.type === 'Lab').length).toFixed(1)}/100</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Academic Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Current SGPA</span>
                      <span className="text-slate-300">{sgpa}/10.0</span>
                    </div>
                    <Progress value={parseFloat(sgpa) * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Overall Percentage</span>
                      <span className="text-slate-300">{percentage}%</span>
                    </div>
                    <Progress value={parseFloat(percentage)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Credits Completed</span>
                      <span className="text-slate-300">{totalCredits}/28</span>
                    </div>
                    <Progress value={(totalCredits / 28) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}