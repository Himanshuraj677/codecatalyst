"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Award,
  BarChart3,
  Filter,
  Download,
  Calendar,
  User,
  Code2,
} from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { getUserCourses, mockSubmissions, mockAssignments, mockUsers, getAssignmentProblems } from "@/lib/mock-data"

export default function AnalyticsPage() {
  const { user } = useUser()
  const courses = useMemo(() => (user ? getUserCourses(user.id, "teacher") : []), [user]);
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all")
  const [performanceFilter, setPerformanceFilter] = useState<string>("all")
  const [searchStudent, setSearchStudent] = useState("")

  // Generate comprehensive analytics data
  const generateAnalytics = () => {
    const filteredSubmissions = mockSubmissions.filter((submission) => {
      if (selectedCourse !== "all") {
        const assignment = mockAssignments.find((a) => a.id === submission.assignmentId)
        if (!assignment || assignment.courseId !== selectedCourse) return false
      }
      if (selectedAssignment !== "all" && submission.assignmentId !== selectedAssignment) return false
      return true
    })

    const totalStudents = courses.reduce((sum, course) => sum + course.studentCount, 0)
    const totalSubmissions = filteredSubmissions.length
    const acceptedSubmissions = filteredSubmissions.filter((s) => s.status === "Accepted").length
    const averageScore =
      filteredSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / filteredSubmissions.length || 0

    // Student performance data
    const studentPerformance = mockUsers
      .filter((u) => u.role === "student")
      .map((student) => {
        const studentSubmissions = filteredSubmissions.filter((s) => s.studentId === student.id)
        const acceptedCount = studentSubmissions.filter((s) => s.status === "Accepted").length
        const avgScore = studentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / studentSubmissions.length || 0
        const totalAttempts = studentSubmissions.length

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          submissions: totalAttempts,
          accepted: acceptedCount,
          averageScore: Math.round(avgScore),
          successRate: totalAttempts > 0 ? Math.round((acceptedCount / totalAttempts) * 100) : 0,
          lastSubmission:
            studentSubmissions.length > 0
              ? new Date(Math.max(...studentSubmissions.map((s) => new Date(s.submittedAt).getTime())))
              : null,
          performance:
            avgScore >= 80 ? "Excellent" : avgScore >= 60 ? "Good" : avgScore >= 40 ? "Average" : "Needs Improvement",
        }
      })

    // Assignment analytics
    const assignmentAnalytics = mockAssignments
      .filter((assignment) => selectedCourse === "all" || assignment.courseId === selectedCourse)
      .map((assignment) => {
        const assignmentSubmissions = filteredSubmissions.filter((s) => s.assignmentId === assignment.id)
        const problems = getAssignmentProblems(assignment.id)
        const uniqueStudents = [...new Set(assignmentSubmissions.map((s) => s.studentId))].length
        const completionRate = totalStudents > 0 ? (uniqueStudents / totalStudents) * 100 : 0
        const avgScore =
          assignmentSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / assignmentSubmissions.length || 0

        return {
          ...assignment,
          submissions: assignmentSubmissions.length,
          uniqueStudents,
          completionRate: Math.round(completionRate),
          averageScore: Math.round(avgScore),
          problems: problems.length,
          acceptedSubmissions: assignmentSubmissions.filter((s) => s.status === "Accepted").length,
          pendingSubmissions: assignmentSubmissions.filter((s) => s.status === "Pending").length,
          wrongSubmissions: assignmentSubmissions.filter((s) => s.status === "Wrong Answer").length,
        }
      })

    return {
      totalStudents,
      totalSubmissions,
      acceptedSubmissions,
      averageScore: Math.round(averageScore),
      completionRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
      studentPerformance,
      assignmentAnalytics,
      submissionsByStatus: {
        accepted: acceptedSubmissions,
        wrong: filteredSubmissions.filter((s) => s.status === "Wrong Answer").length,
        pending: filteredSubmissions.filter((s) => s.status === "Pending").length,
        error: filteredSubmissions.filter((s) => s.status === "Runtime Error").length,
      },
    }
  }

  const analytics = generateAnalytics()

  // Filter student performance based on selected filter
  const filteredStudentPerformance = analytics.studentPerformance
    .filter((student) => {
      if (performanceFilter !== "all" && student.performance !== performanceFilter) return false
      if (searchStudent && !student.name.toLowerCase().includes(searchStudent.toLowerCase())) return false
      return true
    })
    .sort((a, b) => b.averageScore - a.averageScore)

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-100 text-green-800 border-green-200"
      case "Good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Average":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Needs Improvement":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-purple-100 text-lg">
                Comprehensive insights into student performance and course analytics
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <span>Filters & Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Assignment</label>
                <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignments</SelectItem>
                    {mockAssignments
                      .filter((a) => selectedCourse === "all" || a.courseId === selectedCourse)
                      .map((assignment) => (
                        <SelectItem key={assignment.id} value={assignment.id}>
                          {assignment.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Performance</label>
                <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Performance</SelectItem>
                    <SelectItem value="Excellent">Excellent (80%+)</SelectItem>
                    <SelectItem value="Good">Good (60-79%)</SelectItem>
                    <SelectItem value="Average">Average (40-59%)</SelectItem>
                    <SelectItem value="Needs Improvement">Needs Improvement (&lt;40%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Search Student</label>
                <Input
                  placeholder="Search by name..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{analytics.totalStudents}</p>
                  <p className="text-sm text-slate-600">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{analytics.totalSubmissions}</p>
                  <p className="text-sm text-slate-600">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{analytics.averageScore}%</p>
                  <p className="text-sm text-slate-600">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{analytics.completionRate}%</p>
                  <p className="text-sm text-slate-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Award className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{analytics.acceptedSubmissions}</p>
                  <p className="text-sm text-slate-600">Accepted Solutions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assignments">Assignment Analytics</TabsTrigger>
            <TabsTrigger value="students">Student Performance</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Assignment Performance Analysis</span>
                </CardTitle>
                <CardDescription>
                  Detailed analytics for each assignment including completion rates and student performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analytics.assignmentAnalytics.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-slate-200 rounded-xl p-6 bg-gradient-to-r from-white to-slate-50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900">{assignment.title}</h3>
                            <Badge variant="outline" className="border-slate-300">
                              {assignment.courseName}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Code2 className="h-4 w-4" />
                              <span>{assignment.problems} Problems</span>
                            </span>
                          </div>
                        </div>
                        <div className="ml-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">{assignment.completionRate}%</div>
                            <div className="text-sm text-slate-600">Completion Rate</div>
                          </div>
                        </div>
                      </div>

                      {/* Assignment Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="text-lg font-semibold text-blue-900">{assignment.uniqueStudents}</div>
                          <div className="text-xs text-blue-700">Students Attempted</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <div className="text-lg font-semibold text-green-900">{assignment.acceptedSubmissions}</div>
                          <div className="text-xs text-green-700">Accepted</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                          <div className="text-lg font-semibold text-red-900">{assignment.wrongSubmissions}</div>
                          <div className="text-xs text-red-700">Wrong Answer</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <div className="text-lg font-semibold text-yellow-900">{assignment.pendingSubmissions}</div>
                          <div className="text-xs text-yellow-700">Pending</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="text-lg font-semibold text-purple-900">{assignment.submissions}</div>
                          <div className="text-xs text-purple-700">Total Submissions</div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                          <div className="text-lg font-semibold text-indigo-900">{assignment.averageScore}%</div>
                          <div className="text-xs text-indigo-700">Average Score</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Overall Progress</span>
                          <span className="font-medium text-slate-900">{assignment.averageScore}%</span>
                        </div>
                        <Progress value={assignment.averageScore} className="h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Student Performance Analysis</span>
                </CardTitle>
                <CardDescription>
                  Individual student performance metrics and progress tracking
                  {filteredStudentPerformance.length !== analytics.studentPerformance.length && (
                    <span className="ml-2 text-blue-600">
                      (Showing {filteredStudentPerformance.length} of {analytics.studentPerformance.length} students)
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudentPerformance.map((student, index) => (
                    <div
                      key={student.id}
                      className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-white to-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{student.name}</h3>
                            <p className="text-sm text-slate-600">{student.email}</p>
                            {student.lastSubmission && (
                              <p className="text-xs text-slate-500">
                                Last active: {student.lastSubmission.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900">{student.averageScore}%</div>
                            <div className="text-xs text-slate-600">Avg Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900">
                              {student.accepted}/{student.submissions}
                            </div>
                            <div className="text-xs text-slate-600">Accepted</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900">{student.successRate}%</div>
                            <div className="text-xs text-slate-600">Success Rate</div>
                          </div>
                          <Badge className={getPerformanceColor(student.performance)}>{student.performance}</Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={student.averageScore} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredStudentPerformance.length === 0 && (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
                    <p className="text-slate-600">Try adjusting your filters to see student data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submission Status Distribution */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle>Submission Status Distribution</CardTitle>
                  <CardDescription>Breakdown of all submission results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Accepted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{analytics.submissionsByStatus.accepted}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.submissionsByStatus.accepted / analytics.totalSubmissions) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Wrong Answer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{analytics.submissionsByStatus.wrong}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.submissionsByStatus.wrong / analytics.totalSubmissions) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{analytics.submissionsByStatus.pending}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.submissionsByStatus.pending / analytics.totalSubmissions) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Runtime Error</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{analytics.submissionsByStatus.error}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.submissionsByStatus.error / analytics.totalSubmissions) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle>Student Performance Distribution</CardTitle>
                  <CardDescription>How students are performing overall</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Excellent", "Good", "Average", "Needs Improvement"].map((performance) => {
                      const count = analytics.studentPerformance.filter((s) => s.performance === performance).length
                      const percentage =
                        analytics.studentPerformance.length > 0
                          ? (count / analytics.studentPerformance.length) * 100
                          : 0

                      return (
                        <div key={performance} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                performance === "Excellent"
                                  ? "bg-green-500"
                                  : performance === "Good"
                                    ? "bg-blue-500"
                                    : performance === "Average"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm">{performance}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{count} students</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  performance === "Excellent"
                                    ? "bg-green-500"
                                    : performance === "Good"
                                      ? "bg-blue-500"
                                      : performance === "Average"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-500">{Math.round(percentage)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Key Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">🎯 Top Performing Assignment</h4>
                    <p className="text-sm text-green-800">
                      {analytics.assignmentAnalytics.sort((a, b) => b.averageScore - a.averageScore)[0]?.title ||
                        "No data"}
                      has the highest average score of{" "}
                      {analytics.assignmentAnalytics.sort((a, b) => b.averageScore - a.averageScore)[0]?.averageScore ||
                        0}
                      %
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">📈 Engagement Rate</h4>
                    <p className="text-sm text-blue-800">
                      {Math.round((analytics.totalSubmissions / analytics.totalStudents) * 100) / 100} average
                      submissions per student
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">⭐ Success Rate</h4>
                    <p className="text-sm text-purple-800">
                      {analytics.completionRate}% of submissions are accepted on first try
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">⚠️ Low Participation</h4>
                    <p className="text-sm text-orange-800">
                      {analytics.studentPerformance.filter((s) => s.submissions === 0).length} students haven't
                      submitted any solutions yet
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">🔄 High Retry Rate</h4>
                    <p className="text-sm text-red-800">
                      {analytics.submissionsByStatus.wrong} wrong answers suggest students need more guidance
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">⏱️ Assignment Difficulty</h4>
                    <p className="text-sm text-yellow-800">
                      Consider reviewing assignments with completion rates below 50%
                    </p>
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
