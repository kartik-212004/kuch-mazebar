"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  FileText,
  Download,
  Share2,
  Eye,
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  ExternalLink,
  Star,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

// Mock resume data
const mockResumes = [
  {
    id: "resume-1",
    title: "Software Engineering Resume",
    template: "Modern",
    createdAt: "2024-09-28T10:30:00Z",
    status: "Generated",
    downloadCount: 12,
    rating: 4.8
  },
  {
    id: "resume-2",
    title: "Academic Portfolio Resume",
    template: "Classic",
    createdAt: "2024-09-25T14:20:00Z",
    status: "Generated",
    downloadCount: 8,
    rating: 4.6
  },
  {
    id: "resume-3",
    title: "Technical Skills Resume",
    template: "Creative",
    createdAt: "2024-09-20T09:15:00Z", 
    status: "Generated",
    downloadCount: 15,
    rating: 4.9
  },
  {
    id: "resume-4",
    title: "Internship Application Resume",
    template: "Professional",
    createdAt: "2024-09-18T16:45:00Z",
    status: "Generated",
    downloadCount: 6,
    rating: 4.7
  }
]

const templateStats = [
  { template: "Modern", count: 15, color: "#3b82f6" },
  { template: "Classic", count: 8, color: "#10b981" },
  { template: "Creative", count: 5, color: "#f59e0b" },
  { template: "Professional", count: 12, color: "#8b5cf6" },
]

const monthlyGeneration = [
  { month: "Jul", count: 3 },
  { month: "Aug", count: 8 },
  { month: "Sep", count: 12 },
  { month: "Oct", count: 15 },
]

export default function ResumesPage() {
  const user = getCurrentUser("student")
  const [selectedResume, setSelectedResume] = useState<string | null>(null)

  const handleGoBack = () => {
    window.location.href = "/dashboard/student"
  }

  const handleDownloadResume = (resumeId: string, title: string) => {
    alert(`Downloading ${title}...`)
  }

  const handleShareResume = (resumeId: string, title: string) => {
    alert(`Sharing ${title} via email...`)
  }

  const handlePreviewResume = (resumeId: string, title: string) => {
    alert(`Opening preview for ${title}...`)
  }

  const handleEditResume = (resumeId: string, title: string) => {
    alert(`Opening editor for ${title}...`)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGoBack}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">My Resumes</h1>
              <p className="text-slate-400 text-sm md:text-base">Generated resumes and templates</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/dashboard/student"}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs md:text-sm"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Generate New</span>
              <span className="sm:hidden">New</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => alert("Exporting all resumes...")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs md:text-sm"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Export All</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockResumes.length}</div>
              <p className="text-xs text-slate-400">
                {mockResumes.filter(r => r.status === "Generated").length} generated successfully
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {mockResumes.reduce((sum, r) => sum + r.downloadCount, 0)}
              </div>
              <p className="text-xs text-slate-400">
                Across all resumes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {(mockResumes.reduce((sum, r) => sum + r.rating, 0) / mockResumes.length).toFixed(1)}
              </div>
              <p className="text-xs text-slate-400">
                Out of 5.0 stars
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Most Popular</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Modern</div>
              <p className="text-xs text-slate-400">
                Template style
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="resumes" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger 
              value="resumes" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs md:text-sm"
            >
              My Resumes
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs md:text-sm"
            >
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs md:text-sm"
            >
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Resumes Tab */}
          <TabsContent value="resumes" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {mockResumes.map((resume) => (
                <Card key={resume.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-sm md:text-base truncate">{resume.title}</CardTitle>
                        <CardDescription className="text-slate-400 text-xs md:text-sm">
                          {resume.template} Template
                        </CardDescription>
                      </div>
                      <Badge 
                        className={`ml-2 text-xs ${
                          resume.status === "Generated" ? "bg-green-600" : "bg-yellow-600"
                        }`}
                      >
                        {resume.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-xs md:text-sm text-slate-400">
                      <span>Created: {new Date(resume.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{resume.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs md:text-sm text-slate-400">
                      <span>Downloads: {resume.downloadCount}</span>
                      <span className="text-green-400">Ready</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handlePreviewResume(resume.id, resume.title)}
                        className="bg-blue-600 hover:bg-blue-700 text-xs flex-1 min-w-[80px]"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadResume(resume.id, resume.title)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs flex-1 min-w-[80px]"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShareResume(resume.id, resume.title)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {/* Template Usage Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Template Usage</CardTitle>
                  <CardDescription className="text-slate-400">
                    Distribution of resume templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                    <PieChart>
                      <Pie
                        data={templateStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ template, count }) => `${template}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {templateStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Generation Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Resume Generation Trend</CardTitle>
                  <CardDescription className="text-slate-400">
                    Resumes created over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                    <BarChart data={monthlyGeneration}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '6px'
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {templateStats.map((template) => (
                <Card key={template.template} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm md:text-base">{template.template}</CardTitle>
                    <CardDescription className="text-slate-400 text-xs md:text-sm">
                      Used {template.count} times
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="w-full h-24 bg-slate-700 rounded border-2" style={{ borderColor: template.color }}>
                        <div className="w-full h-full rounded flex items-center justify-center text-slate-400 text-xs">
                          Preview
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        style={{ backgroundColor: template.color }}
                        onClick={() => alert(`Creating new resume with ${template.template} template...`)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}