"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Calendar,
  Tag,
  User,
  TrendingUp,
  Search,
  GraduationCap,
  Bell,
  Settings,
  LogOut,
  Download,
} from "lucide-react"
import { mockActivities, type Activity } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

const categoryOptions = [
  { value: "academic", label: "Academic", color: "bg-blue-500" },
  { value: "technical", label: "Technical", color: "bg-purple-500" },
  { value: "extracurricular", label: "Extracurricular", color: "bg-green-500" },
  { value: "sports", label: "Sports", color: "bg-yellow-500" },
  { value: "cultural", label: "Cultural", color: "bg-red-500" },
  { value: "social", label: "Social", color: "bg-cyan-500" },
]

const pointsMapping = {
  academic: { min: 50, max: 100 },
  technical: { min: 30, max: 80 },
  extracurricular: { min: 20, max: 60 },
  sports: { min: 25, max: 70 },
  cultural: { min: 15, max: 50 },
  social: { min: 10, max: 40 },
}

export default function FacultyDashboard() {
  const [user] = useState(() => getCurrentUser("faculty"))
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewData, setReviewData] = useState({
    status: "",
    points: 0,
    remarks: "",
  })
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredActivities = activities.filter((activity) => {
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus
    const matchesCategory = filterCategory === "all" || activity.category === filterCategory
    const matchesSearch =
      searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const pendingCount = activities.filter((a) => a.status === "pending").length
  const approvedCount = activities.filter((a) => a.status === "approved").length
  const rejectedCount = activities.filter((a) => a.status === "rejected").length
  const totalReviewed = approvedCount + rejectedCount

  const handleNavigateToSearch = () => {
    window.location.href = "/search"
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/"
    }
  }

  const handleReviewSubmit = () => {
    if (!selectedActivity || !reviewData.status) return

    const updatedActivities = activities.map((activity) =>
      activity.id === selectedActivity.id
        ? {
            ...activity,
            status: reviewData.status as "approved" | "rejected",
            points: reviewData.status === "approved" ? reviewData.points : 0,
            facultyRemarks: reviewData.remarks,
            approvedBy: user?.name,
            approvedAt: new Date().toISOString(),
          }
        : activity,
    )

    setActivities(updatedActivities)
    setIsReviewDialogOpen(false)
    setSelectedActivity(null)
    setReviewData({ status: "", points: 0, remarks: "" })
  }

  const openReviewDialog = (activity: Activity) => {
    setSelectedActivity(activity)
    const categoryPoints = pointsMapping[activity.category] || { min: 10, max: 50 }
    setReviewData({
      status: "",
      points: Math.round((categoryPoints.min + categoryPoints.max) / 2),
      remarks: "",
    })
    setIsReviewDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600 hover:bg-green-700"
      case "rejected":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-yellow-600 hover:bg-yellow-700"
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
              <GraduationCap className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Faculty Review Panel</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={handleNavigateToSearch}>
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white relative" onClick={() => alert(`You have ${pendingCount} pending reviews to complete`)}>
              <Bell className="h-4 w-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => alert('Faculty settings - would allow review preferences and profile updates')}>
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
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={handleLogout}>
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
            <p className="text-slate-400">
              {(user as any).designation} • {(user as any).department} Department
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pendingCount}</div>
              <p className="text-xs text-slate-400">Awaiting your review</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{approvedCount}</div>
              <p className="text-xs text-slate-400">Activities approved</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{rejectedCount}</div>
              <p className="text-xs text-slate-400">Activities rejected</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Review Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {activities.length > 0 ? Math.round((totalReviewed / activities.length) * 100) : 0}%
              </div>
              <p className="text-xs text-slate-400">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No activities found</h3>
                <p className="text-slate-400">
                  {searchQuery || filterStatus !== "all" || filterCategory !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "No student activities to review at the moment."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            categoryOptions.find((c) => c.value === activity.category)?.color || "bg-gray-500"
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-slate-300 mb-3">{activity.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Student ID: {activity.studentId}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4" />
                          <span className="capitalize">{activity.category}</span>
                        </div>
                        {activity.documents.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{activity.documents.length} document(s)</span>
                          </div>
                        )}
                      </div>
                      {activity.facultyRemarks && (
                        <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-slate-300">
                            <strong>Your Remarks:</strong> {activity.facultyRemarks}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Reviewed on {new Date(activity.approvedAt || "").toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                      {activity.status === "approved" && (
                        <span className="text-sm font-medium text-blue-400">{activity.points} pts</span>
                      )}
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {activity.status === "pending" && (
                          <Button
                            onClick={() => openReviewDialog(activity)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            Review
                          </Button>
                        )}
                        {activity.status !== "pending" && (
                          <Button
                            onClick={() => openReviewDialog(activity)}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            Edit Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Activity</DialogTitle>
            <DialogDescription className="text-slate-400">
              Evaluate the student's activity submission and provide feedback.
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">{selectedActivity.title}</h4>
                <p className="text-slate-300 text-sm mb-2">{selectedActivity.description}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Student: {selectedActivity.studentId}</span>
                  <span>Category: {selectedActivity.category}</span>
                  <span>Date: {new Date(selectedActivity.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Decision</Label>
                  <Select
                    value={reviewData.status}
                    onValueChange={(value) => setReviewData({ ...reviewData, status: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select decision" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="approved">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Approve</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Reject</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reviewData.status === "approved" && (
                  <div className="space-y-2">
                    <Label htmlFor="points">Points to Award</Label>
                    <Input
                      id="points"
                      type="number"
                      min="0"
                      max="100"
                      value={reviewData.points}
                      onChange={(e) => setReviewData({ ...reviewData, points: Number.parseInt(e.target.value) || 0 })}
                      className="bg-slate-700 border-slate-600"
                    />
                    <p className="text-xs text-slate-400">
                      Suggested range: {pointsMapping[selectedActivity.category]?.min || 10}-
                      {pointsMapping[selectedActivity.category]?.max || 50} points
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Faculty Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Provide feedback to the student..."
                  value={reviewData.remarks}
                  onChange={(e) => setReviewData({ ...reviewData, remarks: e.target.value })}
                  className="bg-slate-700 border-slate-600 min-h-[100px]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} className="border-slate-600">
                  Cancel
                </Button>
                <Button onClick={handleReviewSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Submit Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
