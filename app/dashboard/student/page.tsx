"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import ResumeBuilder from "@/components/resume/ResumeBuilder"
import {
  Trophy,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  FileText,
  Plus,
  Download,
  Search,
  Bell,
  Settings,
  LogOut,
  Upload,
  Shield,
  BarChart3,
  Eye,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getActivitiesByStudent, getCertificatesByStudent } from "@/lib/data"

const categoryColors = {
  academic: "#3b82f6",
  technical: "#8b5cf6",
  extracurricular: "#10b981",
  sports: "#f59e0b",
  cultural: "#ef4444",
  social: "#06b6d4",
}

const monthlyData = [
  { month: "Jan", activities: 5 },
  { month: "Feb", activities: 8 },
  { month: "Mar", activities: 12 },
  { month: "Apr", activities: 6 },
  { month: "May", activities: 9 },
  { month: "Jun", activities: 15 },
]

export default function StudentDashboard() {
  const [user] = useState(() => getCurrentUser("student"))
  const [activities] = useState(() => getActivitiesByStudent("CS2021001"))
  const [certificates] = useState(() => getCertificatesByStudent("CS2021001"))
  const [showCertificateDialog, setShowCertificateDialog] = useState(false)
  const [showResumeBuilder, setShowResumeBuilder] = useState(false)
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<{html: string, template: any} | null>(null)
  const [certificateForm, setCertificateForm] = useState({
    title: "",
    description: "",
    category: "",
    issuer: "",
    dateIssued: "",
    certificateFile: null as File | null,
  })

  const approvedActivities = activities.filter((a) => a.status === "approved")
  const pendingActivities = activities.filter((a) => a.status === "pending")
  const totalPoints = approvedActivities.reduce((sum, a) => sum + a.points, 0)

  const categoryStats = activities.reduce(
    (acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Certificate submitted:", certificateForm)
    // Reset form and close dialog
    setCertificateForm({
      title: "",
      description: "",
      category: "",
      issuer: "",
      dateIssued: "",
      certificateFile: null,
    })
    setShowCertificateDialog(false)
    // Show success message
    alert("Certificate submitted for approval!")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setCertificateForm(prev => ({ ...prev, certificateFile: file }))
  }

  const handleAddActivity = () => {
    // Navigate to activity creation page or show activity form
    alert("Add Activity feature - would redirect to activity creation form")
    // You could implement this as a dialog similar to certificates or navigate to a separate page
  }

  const handleGenerateResume = () => {
    setShowResumeBuilder(true)
  }

  const handleDownloadPortfolio = () => {
    // Generate and download portfolio PDF
    alert("Generating portfolio PDF... This would download your complete academic portfolio.")
    // In a real app, this would call an API to generate a PDF
  }

  const handleViewResults = () => {
    window.location.href = "/dashboard/student/results"
  }

  const handleViewResumes = () => {
    window.location.href = "/dashboard/student/resumes"
  }

  const handleNavigateToSearch = () => {
    window.location.href = "/search"
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/"
    }
  }

  const approvedCertificates = certificates.filter((c) => c.status === "approved")
  const pendingCertificates = certificates.filter((c) => c.status === "pending")
  const totalCertificatePoints = approvedCertificates.reduce((sum, c) => sum + c.points, 0)

  const pieData = Object.entries(categoryStats).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: categoryColors[category as keyof typeof categoryColors],
  }))

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              <h1 className="text-lg md:text-xl font-bold text-white hidden sm:block">Smart Student Hub</h1>
              <h1 className="text-lg font-bold text-white sm:hidden">SSH</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hidden sm:inline-flex" onClick={handleNavigateToSearch}>
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => alert('Notifications feature - would show recent updates and announcements')}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hidden md:inline-flex" onClick={() => alert('Settings page - would allow profile and preference updates')}>
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar className="h-6 w-6 md:h-8 md:w-8">
              <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-xs md:text-sm">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {user.name}!</h2>
            <p className="text-slate-400 text-sm md:text-base">
              Student ID: {(user as any).studentId} • {(user as any).department}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm" size="sm" onClick={handleAddActivity}>
              <Plus className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Add Activity</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-xs md:text-sm" size="sm">
                  <Upload className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Upload Certificate</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload Certificate</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Submit your certificate for faculty approval
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCertificateSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm md:text-base">Certificate Title</Label>
                    <Input
                      id="title"
                      value={certificateForm.title}
                      onChange={(e) => setCertificateForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white h-10 md:h-11 text-sm md:text-base"
                      placeholder="e.g., AWS Cloud Practitioner"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer" className="text-sm md:text-base">Issuing Organization</Label>
                    <Input
                      id="issuer"
                      value={certificateForm.issuer}
                      onChange={(e) => setCertificateForm(prev => ({ ...prev, issuer: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white h-10 md:h-11 text-sm md:text-base"
                      placeholder="e.g., Amazon Web Services"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm md:text-base">Category</Label>
                    <Select value={certificateForm.category} onValueChange={(value) => setCertificateForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600 text-white">
                        <SelectItem value="academic" className="focus:bg-slate-600 focus:text-white">Academic</SelectItem>
                        <SelectItem value="technical" className="focus:bg-slate-600 focus:text-white">Technical</SelectItem>
                        <SelectItem value="extracurricular" className="focus:bg-slate-600 focus:text-white">Extracurricular</SelectItem>
                        <SelectItem value="sports" className="focus:bg-slate-600 focus:text-white">Sports</SelectItem>
                        <SelectItem value="cultural" className="focus:bg-slate-600 focus:text-white">Cultural</SelectItem>
                        <SelectItem value="social" className="focus:bg-slate-600 focus:text-white">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateIssued">Date Issued</Label>
                    <Input
                      id="dateIssued"
                      type="date"
                      value={certificateForm.dateIssued}
                      onChange={(e) => setCertificateForm(prev => ({ ...prev, dateIssued: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={certificateForm.description}
                      onChange={(e) => setCertificateForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Brief description of the achievement"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificateFile">Certificate File</Label>
                    <Input
                      id="certificateFile"
                      type="file"
                      onChange={handleFileChange}
                      className="bg-slate-700 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <p className="text-xs text-slate-400">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCertificateDialog(false)}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 h-10 md:h-11"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 h-10 md:h-11">
                      Submit for Approval
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent text-xs md:text-sm" size="sm" onClick={handleGenerateResume}>
              <FileText className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Generate Resume</span>
              <span className="sm:hidden">Resume</span>
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent text-xs md:text-sm" size="sm" onClick={handleViewResumes}>
              <Eye className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">View Resumes</span>
              <span className="sm:hidden">Resumes</span>
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent text-xs md:text-sm" size="sm" onClick={handleViewResults}>
              <BarChart3 className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">View Results</span>
              <span className="sm:hidden">Results</span>
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent text-xs md:text-sm" size="sm" onClick={handleDownloadPortfolio}>
              <Download className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Download Portfolio</span>
              <span className="sm:hidden">Portfolio</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Activities</CardTitle>
              <Trophy className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activities.length}</div>
              <p className="text-xs text-slate-400">
                {approvedActivities.length} approved, {pendingActivities.length} pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Achievement Points</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalPoints}</div>
              <p className="text-xs text-slate-400">From verified activities</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">CGPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8.7</div>
              <p className="text-xs text-slate-400">Current semester</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Approval Rate</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {activities.length > 0 ? Math.round((approvedActivities.length / activities.length) * 100) : 0}%
              </div>
              <p className="text-xs text-slate-400">Activities approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Monthly Activity Trend</CardTitle>
              <CardDescription className="text-slate-400">Your activity submissions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="activities" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Activity Categories</CardTitle>
              <CardDescription className="text-slate-400">Distribution of your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activities</CardTitle>
            <CardDescription className="text-slate-400">Your latest submissions and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[activity.category] }}
                    />
                    <div>
                      <h4 className="font-medium text-white">{activity.title}</h4>
                      <p className="text-sm text-slate-400">
                        {activity.category} • {activity.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={activity.status === "approved" ? "default" : "secondary"}
                      className={
                        activity.status === "approved"
                          ? "bg-green-600 hover:bg-green-700"
                          : activity.status === "pending"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-red-600 hover:bg-red-700"
                      }
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-sm font-medium text-blue-400">{activity.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent text-sm" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              My Certificates
            </CardTitle>
            <CardDescription className="text-slate-400">Your uploaded certificates and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No certificates uploaded yet</p>
                  <Button 
                    onClick={() => setShowCertificateDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Certificate
                  </Button>
                </div>
              ) : (
                <>
                  {certificates.slice(0, 3).map((certificate) => (
                    <div key={certificate.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-700/30 rounded-lg gap-3">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: certificate.status === "approved" ? "#10b981" : certificate.status === "pending" ? "#f59e0b" : "#ef4444"
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm md:text-base truncate">{certificate.title}</h4>
                          <p className="text-xs md:text-sm text-slate-400">
                            {certificate.issuer} • {new Date(certificate.dateIssued).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <Badge
                          className={
                            certificate.status === "approved"
                              ? "bg-green-600 hover:bg-green-700"
                              : certificate.status === "pending"
                                ? "bg-yellow-600 hover:bg-yellow-700"
                                : "bg-red-600 hover:bg-red-700"
                          }
                        >
                          {certificate.status}
                        </Badge>
                        {certificate.status === "approved" && (
                          <p className="text-sm text-green-400 mt-1">+{certificate.points} pts</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        {approvedCertificates.length} approved • {pendingCertificates.length} pending • {totalCertificatePoints} total points
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 text-sm" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        View All Certificates
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Towards Goals */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Progress Towards Goals</CardTitle>
            <CardDescription className="text-slate-400">Track your achievement milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Annual Activity Goal</span>
                <span className="text-slate-400">{activities.length}/20</span>
              </div>
              <Progress value={(activities.length / 20) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Achievement Points Goal</span>
                <span className="text-slate-400">{totalPoints}/500</span>
              </div>
              <Progress value={(totalPoints / 500) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Category Diversity</span>
                <span className="text-slate-400">{Object.keys(categoryStats).length}/6</span>
              </div>
              <Progress value={(Object.keys(categoryStats).length / 6) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume Builder */}
      <ResumeBuilder 
        isOpen={showResumeBuilder}
        onClose={() => setShowResumeBuilder(false)}
        studentData={{
          id: "CS2021001",
          name: user?.name || "Arjun Sharma",
          email: user?.email || "arjun.sharma@student.edu",
          phone: "+91 98765 43210",
          department: "Computer Science",
          year: "3rd Year",
          cgpa: "8.7"
        }}
        onResumeGenerated={(resumeHtml, template) => {
          // Handle resume generation - show preview dialog
          console.log("Resume generated:", { resumeHtml, template })
          // Close the builder dialog
          setShowResumeBuilder(false)
          // Store the generated resume and show preview
          setGeneratedResume({ html: resumeHtml, template })
          setShowResumePreview(true)
        }}
      />

      {/* Resume Preview Dialog */}
      <Dialog open={showResumePreview} onOpenChange={setShowResumePreview}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Resume Preview - {generatedResume?.template?.name || 'Generated Resume'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Your resume has been generated successfully. Preview it below and download as PDF.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col lg:flex-row gap-4 h-[75vh]">
            {/* Preview Frame - Takes most of the space */}
            <div className="flex-1 border border-slate-600 rounded-lg overflow-hidden bg-white">
              <div 
                className="w-full h-full overflow-auto p-6 text-black"
                style={{ 
                  fontSize: '14px',
                  lineHeight: '1.4',
                  fontFamily: 'Arial, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: generatedResume?.html || '' }}
              />
            </div>
            
            {/* Action Buttons - Sidebar for desktop, bottom for mobile */}
            <div className="lg:w-64 flex flex-col gap-3">
              <div className="text-sm text-slate-400 hidden lg:block">
                <h3 className="font-medium text-slate-300 mb-2">Download Options</h3>
                <p className="text-xs">Choose how you want to save your resume:</p>
              </div>
              
              <Button
                onClick={() => {
                  // Generate and download PDF
                  const element = document.createElement('a')
                  const file = new Blob([generatedResume?.html || ''], {type: 'text/html'})
                  element.href = URL.createObjectURL(file)
                  element.download = `resume-${generatedResume?.template?.name || 'generated'}-${new Date().toISOString().split('T')[0]}.html`
                  document.body.appendChild(element)
                  element.click()
                  document.body.removeChild(element)
                  alert('Resume downloaded as HTML file. You can open it in a browser and print to PDF.')
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
              
              <Button
                onClick={() => {
                  // Print to PDF functionality
                  const printWindow = window.open('', '_blank')
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Resume - ${generatedResume?.template?.name || 'Generated'}</title>
                          <style>
                            body { 
                              font-family: Arial, sans-serif; 
                              margin: 20px; 
                              line-height: 1.4;
                              font-size: 14px;
                            }
                            @media print { 
                              body { margin: 10mm; }
                              * { print-color-adjust: exact; }
                            }
                          </style>
                        </head>
                        <body>
                          ${generatedResume?.html || ''}
                        </body>
                      </html>
                    `)
                    printWindow.document.close()
                    setTimeout(() => {
                      printWindow.print()
                    }, 250)
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Print to PDF
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedResume?.html || '')
                  alert('Resume HTML copied to clipboard!')
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Copy HTML
              </Button>
              
              <div className="mt-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowResumePreview(false)}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Close Preview
                </Button>
              </div>
              
              <div className="text-xs text-slate-500 hidden lg:block">
                <p>💡 Tip: Use "Print to PDF" for the best quality PDF output with proper formatting.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
