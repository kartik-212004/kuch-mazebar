"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Users, Award, FileText, Download, BarChart3, Settings, Bell, LogOut, CheckCircle, Target, Shield } from "lucide-react"
import { getAnalytics, mockActivities, getPendingCertificates } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]

export default function AdminDashboard() {
  const [user] = useState(() => getCurrentUser("admin"))
  const [analytics] = useState(() => getAnalytics())
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [pendingCertificates] = useState(() => getPendingCertificates())

  const departmentData = Object.entries(analytics.departmentStats).map(([dept, count]) => ({
    name: dept,
    activities: count,
    students: Math.floor(count / 2.7), // Mock student count
  }))

  const categoryData = Object.entries(analytics.categoryStats).map(([category, count], index) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: COLORS[index % COLORS.length],
  }))

  const approvalRateData = [
    { month: "Jan", approved: 220, rejected: 60, pending: 45 },
    { month: "Feb", approved: 250, rejected: 70, pending: 55 },
    { month: "Mar", approved: 300, rejected: 80, pending: 65 },
    { month: "Apr", approved: 230, rejected: 60, pending: 40 },
    { month: "May", approved: 195, rejected: 55, pending: 35 },
    { month: "Jun", approved: 245, rejected: 65, pending: 50 },
  ]

  const performanceMetrics = [
    { title: "Average Review Time", value: "2.3 days", change: "-12%", trend: "down", color: "text-green-400" },
    { title: "Student Engagement", value: "78.5%", change: "+5.2%", trend: "up", color: "text-green-400" },
    { title: "Faculty Participation", value: "92.1%", change: "+2.1%", trend: "up", color: "text-green-400" },
    { title: "Portfolio Generation", value: "156", change: "+23%", trend: "up", color: "text-green-400" },
  ]

  const recentActivities = mockActivities.slice(0, 5)

  const handleApproveCertificate = (certificateId: string, title: string) => {
    // In a real app, this would call an API to approve the certificate
    alert(`Certificate "${title}" approved successfully!`)
    // You would then update the state to reflect the change
  }

  const handleRejectCertificate = (certificateId: string, title: string) => {
    // In a real app, this would call an API to reject the certificate
    const reason = prompt("Please provide a reason for rejection:")
    if (reason) {
      alert(`Certificate "${title}" rejected. Reason: ${reason}`)
      // You would then update the state to reflect the change
    }
  }

  const handleViewCertificate = (certificateFile: string) => {
    // In a real app, this would open the certificate file
    alert(`Opening certificate file: ${certificateFile}`)
    // window.open(certificateFile, '_blank')
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/"
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => alert('Admin notifications - would show system alerts and pending reviews')}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => alert('Admin settings - would allow system configuration')}>
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}</h2>
            <p className="text-slate-400">System Administrator • Smart Student Hub</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate NAAC Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Active participants</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Activities</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.totalActivities.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Submitted this year</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.approvalRate}%</div>
              <p className="text-xs text-slate-400">Activities approved</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Avg Points/Student</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {Math.round((analytics.totalActivities * 45) / analytics.totalStudents)}
              </div>
              <p className="text-xs text-slate-400">Achievement points</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{metric.title}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${metric.color}`}>{metric.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Department Performance</CardTitle>
              <CardDescription className="text-slate-400">Activity submissions by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
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

          {/* Activity Categories */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Activity Categories</CardTitle>
              <CardDescription className="text-slate-400">Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
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
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-slate-300">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Monthly Activity Trends</CardTitle>
            <CardDescription className="text-slate-400">Submission and approval patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.monthlyTrends}>
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
                <Area
                  type="monotone"
                  dataKey="activities"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="approvals"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activities</CardTitle>
              <CardDescription className="text-slate-400">Latest student submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{activity.title}</h4>
                      <p className="text-xs text-slate-400">
                        {activity.studentId} • {activity.category} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
              <CardDescription className="text-slate-400">Platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Database Status</span>
                <Badge className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Active Users</span>
                <span className="text-white font-medium">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pending Reviews</span>
                <span className="text-yellow-400 font-medium">{mockActivities.filter(a => a.status === "pending").length + pendingCertificates.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pending Certificates</span>
                <span className="text-yellow-400 font-medium">{pendingCertificates.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Storage Used</span>
                <span className="text-white font-medium">2.3 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Uptime</span>
                <span className="text-green-400 font-medium">99.9%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Certificate Approvals */}
        {pendingCertificates.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-yellow-500" />
                Pending Certificate Approvals
                <Badge className="ml-2 bg-yellow-600 hover:bg-yellow-700">
                  {pendingCertificates.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400">Certificates awaiting faculty review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCertificates.map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-white">{certificate.title}</h4>
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">
                          {certificate.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        {certificate.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>Student: {certificate.studentId}</span>
                        <span>Issuer: {certificate.issuer}</span>
                        <span>Date: {new Date(certificate.dateIssued).toLocaleDateString()}</span>
                        <span>Submitted: {new Date(certificate.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveCertificate(certificate.id, certificate.title)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() => handleRejectCertificate(certificate.id, certificate.title)}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => handleViewCertificate(certificate.certificateFile)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
