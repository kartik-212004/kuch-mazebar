"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Calendar,
  Tag,
  User,
  FileText,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  SortAsc,
  SortDesc,
} from "lucide-react"
import { mockActivities, type Activity } from "@/lib/data"

// Mock student data for search
const mockStudents = [
  {
    id: "CS2021001",
    name: "Arjun Sharma",
    department: "Computer Science",
    year: 3,
    cgpa: 8.7,
    totalActivities: 12,
    totalPoints: 340,
    profileImage: "/diverse-student-profiles.png",
  },
  {
    id: "EC2021045",
    name: "Priya Patel",
    department: "Electronics",
    year: 2,
    cgpa: 9.1,
    totalActivities: 8,
    totalPoints: 280,
  },
  {
    id: "ME2020123",
    name: "Rajesh Kumar",
    department: "Mechanical",
    year: 4,
    cgpa: 8.3,
    totalActivities: 15,
    totalPoints: 420,
  },
]

const categoryOptions = [
  { value: "academic", label: "Academic", color: "bg-blue-500" },
  { value: "technical", label: "Technical", color: "bg-purple-500" },
  { value: "extracurricular", label: "Extracurricular", color: "bg-green-500" },
  { value: "sports", label: "Sports", color: "bg-yellow-500" },
  { value: "cultural", label: "Cultural", color: "bg-red-500" },
  { value: "social", label: "Social", color: "bg-cyan-500" },
]

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    activities: Activity[]
    students: typeof mockStudents
    total: number
  }>({
    activities: [],
    students: [],
    total: 0,
  })

  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical"]

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({ activities: [], students: [], total: 0 })
      return
    }

    setIsSearching(true)

    // Simulate search delay
    const searchTimeout = setTimeout(() => {
      performSearch()
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery, searchType, filterCategory, filterStatus, filterDepartment, sortBy, sortOrder])

  const performSearch = () => {
    let filteredActivities = mockActivities.filter((activity) => {
      const matchesQuery =
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.studentId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = filterCategory === "all" || activity.category === filterCategory
      const matchesStatus = filterStatus === "all" || activity.status === filterStatus

      return matchesQuery && matchesCategory && matchesStatus
    })

    let filteredStudents = mockStudents.filter((student) => {
      const matchesQuery =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment

      return matchesQuery && matchesDepartment
    })

    // Apply sorting
    if (sortBy === "date") {
      filteredActivities.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB
      })
    } else if (sortBy === "points") {
      filteredActivities.sort((a, b) => {
        return sortOrder === "desc" ? b.points - a.points : a.points - b.points
      })
    } else if (sortBy === "name") {
      filteredStudents.sort((a, b) => {
        return sortOrder === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      })
    }

    // Filter by search type
    if (searchType === "activities") {
      filteredStudents = []
    } else if (searchType === "students") {
      filteredActivities = []
    }

    setSearchResults({
      activities: filteredActivities,
      students: filteredStudents,
      total: filteredActivities.length + filteredStudents.length,
    })
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
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Smart Search</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search Bar */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search activities, students, achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="all" className="focus:bg-slate-600 focus:text-white">All Results</SelectItem>
                    <SelectItem value="activities" className="focus:bg-slate-600 focus:text-white">Activities</SelectItem>
                    <SelectItem value="students" className="focus:bg-slate-600 focus:text-white">Students</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="all" className="focus:bg-slate-600 focus:text-white">All Categories</SelectItem>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="focus:bg-slate-600 focus:text-white">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px] bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="all" className="focus:bg-slate-600 focus:text-white">All Status</SelectItem>
                    <SelectItem value="pending" className="focus:bg-slate-600 focus:text-white">Pending</SelectItem>
                    <SelectItem value="approved" className="focus:bg-slate-600 focus:text-white">Approved</SelectItem>
                    <SelectItem value="rejected" className="focus:bg-slate-600 focus:text-white">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[160px] bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="all" className="focus:bg-slate-600 focus:text-white">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[120px] bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchQuery.trim() === "" ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Start Your Search</h3>
              <p className="text-slate-400 mb-6">
                Search for activities, students, achievements, and more across the Smart Student Hub platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium text-white mb-1">Activities</h4>
                  <p className="text-sm text-slate-400">Find student achievements and submissions</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium text-white mb-1">Students</h4>
                  <p className="text-sm text-slate-400">Search student profiles and records</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-medium text-white mb-1">Achievements</h4>
                  <p className="text-sm text-slate-400">Browse verified accomplishments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Search Results</h2>
                <p className="text-slate-400">
                  {searchResults.total} result{searchResults.total !== 1 ? "s" : ""} found for "{searchQuery}"
                </p>
              </div>
            </div>

            {searchResults.total === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                  <p className="text-slate-400 mb-4">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setFilterCategory("all")
                      setFilterStatus("all")
                      setFilterDepartment("all")
                      setSearchType("all")
                    }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="all" className="text-slate-300 hover:text-white data-[state=active]:text-white">All ({searchResults.total})</TabsTrigger>
                  <TabsTrigger value="activities" className="text-slate-300 hover:text-white data-[state=active]:text-white">Activities ({searchResults.activities.length})</TabsTrigger>
                  <TabsTrigger value="students" className="text-slate-300 hover:text-white data-[state=active]:text-white">Students ({searchResults.students.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {/* Students Results */}
                  {searchResults.students.map((student) => (
                    <Card
                      key={student.id}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                <User className="h-3 w-3 mr-1" />
                                Student
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                              <span>{student.id}</span>
                              <span>{student.department}</span>
                              <span>Year {student.year}</span>
                              <span>CGPA: {student.cgpa}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-300">
                              <div>{student.totalActivities} activities</div>
                              <div className="text-blue-400 font-medium">{student.totalPoints} points</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Activities Results */}
                  {searchResults.activities.map((activity) => (
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
                                <User className="h-4 w-4" />
                                <span>{activity.studentId}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Tag className="h-4 w-4" />
                                <span className="capitalize">{activity.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                            {activity.status === "approved" && (
                              <span className="text-sm font-medium text-blue-400">{activity.points} pts</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="activities" className="space-y-4 mt-6">
                  {searchResults.activities.map((activity) => (
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
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{activity.studentId}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Tag className="h-4 w-4" />
                                <span className="capitalize">{activity.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                            {activity.status === "approved" && (
                              <span className="text-sm font-medium text-blue-400">{activity.points} pts</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="students" className="space-y-4 mt-6">
                  {searchResults.students.map((student) => (
                    <Card
                      key={student.id}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                <User className="h-3 w-3 mr-1" />
                                Student
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                              <span>{student.id}</span>
                              <span>{student.department}</span>
                              <span>Year {student.year}</span>
                              <span>CGPA: {student.cgpa}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-300">
                              <div>{student.totalActivities} activities</div>
                              <div className="text-blue-400 font-medium">{student.totalPoints} points</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
