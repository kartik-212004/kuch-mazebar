"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Upload,
  FileText,
  Calendar,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  BookOpen,
  ArrowLeft,
} from "lucide-react"
import { getActivitiesByStudent, type Activity } from "@/lib/data"

const categoryOptions = [
  { value: "academic", label: "Academic", color: "bg-blue-500" },
  { value: "technical", label: "Technical", color: "bg-purple-500" },
  { value: "extracurricular", label: "Extracurricular", color: "bg-green-500" },
  { value: "sports", label: "Sports", color: "bg-yellow-500" },
  { value: "cultural", label: "Cultural", color: "bg-red-500" },
  { value: "social", label: "Social", color: "bg-cyan-500" },
]

export default function ActivityTracker() {
  const [activities, setActivities] = useState<Activity[]>(() => getActivitiesByStudent("CS2021001"))
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    documents: [] as File[],
  })

  const filteredActivities = activities.filter((activity) => {
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus
    const matchesCategory = filterCategory === "all" || activity.category === filterCategory
    const matchesSearch =
      searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.category || !newActivity.date) return

    const activity: Activity = {
      id: Date.now().toString(),
      studentId: "CS2021001",
      title: newActivity.title,
      description: newActivity.description,
      category: newActivity.category as any,
      date: newActivity.date,
      status: "pending",
      documents: newActivity.documents.map((file) => file.name),
      points: 0,
      createdAt: new Date().toISOString(),
    }

    setActivities([activity, ...activities])
    setNewActivity({ title: "", description: "", category: "", date: "", documents: [] })
    setIsAddDialogOpen(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setNewActivity({ ...newActivity, documents: [...newActivity.documents, ...files] })
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Activity Tracker</h1>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Submit your achievement or activity for faculty review and verification.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Won First Prize in Hackathon"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newActivity.category}
                    onValueChange={(value) => setNewActivity({ ...newActivity, category: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${option.color}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about your achievement..."
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 mb-2">Upload certificates, photos, or other proof</p>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  {newActivity.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-400 mb-2">Selected files:</p>
                      <div className="space-y-1">
                        {newActivity.documents.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-slate-300">
                            <FileText className="h-4 w-4" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-slate-600">
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">
                    Submit Activity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6">
        {/* Filters and Search */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
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
                <p className="text-slate-400 mb-4">
                  {searchQuery || filterStatus !== "all" || filterCategory !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "Start by adding your first activity or achievement."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Activity
                </Button>
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
                      <p className="text-slate-300 mb-3 line-clamp-2">{activity.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
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
                            <strong>Faculty Remarks:</strong> {activity.facultyRemarks}
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
                          <>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {activities.filter((a) => a.status === "pending").length}
              </div>
              <p className="text-sm text-slate-400">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {activities.filter((a) => a.status === "approved").length}
              </div>
              <p className="text-sm text-slate-400">Approved</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {activities.filter((a) => a.status === "approved").reduce((sum, a) => sum + a.points, 0)}
              </div>
              <p className="text-sm text-slate-400">Total Points</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
