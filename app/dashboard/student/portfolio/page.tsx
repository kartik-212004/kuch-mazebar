"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, FileText, Eye, Settings, Award, ArrowLeft, CheckCircle } from "lucide-react"
import { getActivitiesByStudent } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

const templateOptions = [
  { value: "professional", label: "Professional", description: "Clean, formal layout for job applications" },
  { value: "academic", label: "Academic", description: "Detailed format for university submissions" },
  { value: "creative", label: "Creative", description: "Modern design with visual elements" },
  { value: "minimal", label: "Minimal", description: "Simple, focused on content" },
]

const categoryOptions = [
  { value: "academic", label: "Academic", color: "bg-blue-500" },
  { value: "technical", label: "Technical", color: "bg-purple-500" },
  { value: "extracurricular", label: "Extracurricular", color: "bg-green-500" },
  { value: "sports", label: "Sports", color: "bg-yellow-500" },
  { value: "cultural", label: "Cultural", color: "bg-red-500" },
  { value: "social", label: "Social", color: "bg-cyan-500" },
]

export default function PortfolioGenerator() {
  const [user] = useState(() => getCurrentUser("student"))
  const [activities] = useState(() => getActivitiesByStudent("CS2021001"))
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [portfolioConfig, setPortfolioConfig] = useState({
    template: "professional",
    includePersonalInfo: true,
    includeAcademicInfo: true,
    includeCGPA: true,
    includeSkills: true,
    customTitle: "",
    customIntro: "",
    sortBy: "date",
    filterByCategory: "all",
    includeDocuments: false,
  })

  const approvedActivities = activities.filter((a) => a.status === "approved")
  const totalPoints = approvedActivities.reduce((sum, a) => sum + a.points, 0)

  const filteredActivities = approvedActivities.filter((activity) => {
    if (portfolioConfig.filterByCategory === "all") return true
    return activity.category === portfolioConfig.filterByCategory
  })

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (portfolioConfig.sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (portfolioConfig.sortBy === "points") {
      return b.points - a.points
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const handleSelectAll = () => {
    if (selectedActivities.length === sortedActivities.length) {
      setSelectedActivities([])
    } else {
      setSelectedActivities(sortedActivities.map((a) => a.id))
    }
  }

  const handleGeneratePortfolio = async () => {
    setIsGenerating(true)

    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false)
      // In a real implementation, this would generate and download a PDF
      const blob = new Blob(["Mock PDF content"], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${user?.name?.replace(/\s+/g, "_")}_Portfolio.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 3000)
  }

  if (!user) return <div>Loading...</div>

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
              <FileText className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Portfolio Generator</h1>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleGeneratePortfolio}
              disabled={isGenerating || selectedActivities.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Portfolio Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Customize your portfolio appearance and content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Template</Label>
                  <Select
                    value={portfolioConfig.template}
                    onValueChange={(value) => setPortfolioConfig({ ...portfolioConfig, template: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {templateOptions.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          <div>
                            <div className="font-medium">{template.label}</div>
                            <div className="text-xs text-slate-400">{template.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Custom Title</Label>
                  <Input
                    placeholder="e.g., Academic Achievement Portfolio"
                    value={portfolioConfig.customTitle}
                    onChange={(e) => setPortfolioConfig({ ...portfolioConfig, customTitle: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Introduction</Label>
                  <Textarea
                    placeholder="Brief introduction about yourself..."
                    value={portfolioConfig.customIntro}
                    onChange={(e) => setPortfolioConfig({ ...portfolioConfig, customIntro: e.target.value })}
                    className="bg-slate-700 border-slate-600 min-h-[80px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-300">Include Sections</Label>
                  <div className="space-y-2">
                    {[
                      { key: "includePersonalInfo", label: "Personal Information" },
                      { key: "includeAcademicInfo", label: "Academic Details" },
                      { key: "includeCGPA", label: "CGPA & Grades" },
                      { key: "includeSkills", label: "Skills & Competencies" },
                      { key: "includeDocuments", label: "Supporting Documents" },
                    ].map((option) => (
                      <div key={option.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.key}
                          checked={portfolioConfig[option.key as keyof typeof portfolioConfig] as boolean}
                          onCheckedChange={(checked) =>
                            setPortfolioConfig({ ...portfolioConfig, [option.key]: checked })
                          }
                        />
                        <Label htmlFor={option.key} className="text-sm text-slate-300">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Sort By</Label>
                    <Select
                      value={portfolioConfig.sortBy}
                      onValueChange={(value) => setPortfolioConfig({ ...portfolioConfig, sortBy: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Filter Category</Label>
                    <Select
                      value={portfolioConfig.filterByCategory}
                      onValueChange={(value) => setPortfolioConfig({ ...portfolioConfig, filterByCategory: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Selected Activities</span>
                  <span className="text-white font-medium">{selectedActivities.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Total Points</span>
                  <span className="text-blue-400 font-medium">
                    {sortedActivities
                      .filter((a) => selectedActivities.includes(a.id))
                      .reduce((sum, a) => sum + a.points, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Categories</span>
                  <span className="text-white font-medium">
                    {
                      new Set(sortedActivities.filter((a) => selectedActivities.includes(a.id)).map((a) => a.category))
                        .size
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Select Activities</CardTitle>
                    <CardDescription className="text-slate-400">
                      Choose which verified activities to include in your portfolio
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    {selectedActivities.length === sortedActivities.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sortedActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No approved activities</h3>
                    <p className="text-slate-400">
                      You need approved activities to generate a portfolio. Submit some activities for faculty review.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                          selectedActivities.includes(activity.id)
                            ? "bg-blue-600/20 border-blue-500"
                            : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                        }`}
                        onClick={() => handleActivityToggle(activity.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedActivities.includes(activity.id)}
                            onChange={() => handleActivityToggle(activity.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  categoryOptions.find((c) => c.value === activity.category)?.color || "bg-gray-500"
                                }`}
                              />
                              <h4 className="font-medium text-white">{activity.title}</h4>
                              <Badge className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300 mb-2 line-clamp-2">{activity.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-slate-400">
                              <span>{new Date(activity.date).toLocaleDateString()}</span>
                              <span className="capitalize">{activity.category}</span>
                              <span className="text-blue-400 font-medium">{activity.points} points</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Portfolio Preview</DialogTitle>
            <DialogDescription className="text-slate-400">
              Preview how your portfolio will look before generating the PDF
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-6 bg-white text-black rounded-lg">
            {/* Mock PDF Preview */}
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold">
                  {portfolioConfig.customTitle || `${user?.name} - Academic Portfolio`}
                </h1>
                <p className="text-gray-600 mt-2">Student ID: {(user as any)?.studentId}</p>
                <p className="text-gray-600">{(user as any)?.department} Department</p>
              </div>

              {portfolioConfig.customIntro && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Introduction</h2>
                  <p className="text-gray-700">{portfolioConfig.customIntro}</p>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold mb-3">Academic Achievements</h2>
                <div className="space-y-3">
                  {sortedActivities
                    .filter((a) => selectedActivities.includes(a.id))
                    .slice(0, 3)
                    .map((activity) => (
                      <div key={activity.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()} • {activity.points} points
                        </div>
                      </div>
                    ))}
                  {selectedActivities.length > 3 && (
                    <p className="text-sm text-gray-500 italic">
                      ... and {selectedActivities.length - 3} more activities
                    </p>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 border-t pt-4">
                Generated by Smart Student Hub • {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
