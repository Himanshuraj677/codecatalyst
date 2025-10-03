"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Target,
  Award,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { getUserCourses, getDueAssignments, getUserSubmissions, mockSubmissions } from "@/lib/mock-data"

function StudentDashboard() {
  const { user } = useAuth()
  const courses = getUserCourses(user!.id, "student")
  const dueAssignments = getDueAssignments(user!.id)
  const recentSubmissions = getUserSubmissions(user!.id).slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "Wrong Answer":
        return "text-red-600 bg-red-50 border-red-200"
      case "Pending":
        return "text-amber-600 bg-amber-50 border-amber-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  Ready to continue your coding journey? Let's see what's new today.
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <Target className="h-4 w-4" />
                    <span>
                      {recentSubmissions.filter((s) => s.status === "Accepted").length} problems solved this week
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Award className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              label: "Enrolled Courses",
              value: courses.length,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Clock,
              label: "Due Assignments",
              value: dueAssignments.length,
              color: "from-amber-500 to-orange-600",
              bg: "bg-amber-50",
            },
            {
              icon: CheckCircle,
              label: "Solved Problems",
              value: recentSubmissions.filter((s) => s.status === "Accepted").length,
              color: "from-emerald-500 to-green-600",
              bg: "bg-emerald-50",
            },
            {
              icon: FileText,
              label: "Total Submissions",
              value: recentSubmissions.length,
              color: "from-purple-500 to-indigo-600",
              bg: "bg-purple-50",
            },
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
              <Link href="/dashboard/courses">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                  <div className="group bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {course.name}
                            </h3>
                            <p className="text-sm text-slate-600">{course.instructor}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{course.studentCount} students</span>
                          </span>
                          <span>•</span>
                          <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Due Assignments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Due Soon</h2>
              <Link href="/dashboard/assignments">
                <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {dueAssignments.slice(0, 4).map((assignment) => (
                <Link
                  key={assignment.id}
                  href={`/dashboard/courses/${assignment.courseId}/assignments/${assignment.id}`}
                >
                  <div className="group bg-white rounded-xl border border-slate-200/60 p-4 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {assignment.title}
                      </h3>
                      <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                        {assignment.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-1">{assignment.courseName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-600 font-medium">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
            <Link href="/dashboard/submissions">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{submission.assignmentTitle}</h3>
                  <Badge className={`${getStatusColor(submission.status)} border text-xs font-medium`}>
                    {submission.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Language: {submission.language}</span>
                  {submission.status === "Accepted" && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TeacherDashboard() {
  const { user } = useAuth()
  const courses = getUserCourses(user!.id, "teacher")
  const allSubmissions = mockSubmissions.slice(0, 5)
  const totalStudents = courses.reduce((sum, course) => sum + course.studentCount, 0)
  const weeklySubmissions = mockSubmissions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                  Welcome back, {user?.name}! 👨‍🏫
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  Manage your courses, track student progress, and create engaging assignments.
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>{weeklySubmissions} submissions this week</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Users className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, label: "Active Courses", value: courses.length, color: "from-blue-500 to-blue-600" },
            { icon: Users, label: "Total Students", value: totalStudents, color: "from-emerald-500 to-green-600" },
            { icon: TrendingUp, label: "This Week", value: weeklySubmissions, color: "from-purple-500 to-indigo-600" },
            { icon: FileText, label: "Assignments", value: 12, color: "from-amber-500 to-orange-600" },
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
              <Link href="/dashboard/create">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Course
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                  <div className="group bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                              {course.name}
                            </h3>
                            <p className="text-sm text-slate-600">{course.studentCount} students</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-mono">
                            {course.joinCode}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Created {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Submissions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Latest Submissions</h2>
              <Link href="/dashboard/submissions">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {allSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white rounded-xl border border-slate-200/60 p-4 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{submission.assignmentTitle}</h3>
                    <Badge
                      className={
                        submission.status === "Accepted"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : submission.status === "Wrong Answer"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {submission.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">by {submission.studentName}</p>
                  <p className="text-xs text-slate-500">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                href: "/dashboard/create",
                icon: Plus,
                title: "Create Assignment",
                desc: "Design new coding challenges",
                color: "from-blue-500 to-indigo-600",
              },
              {
                href: "/dashboard/courses",
                icon: BookOpen,
                title: "Manage Courses",
                desc: "View and edit your courses",
                color: "from-emerald-500 to-green-600",
              },
              {
                href: "/dashboard/submissions",
                icon: FileText,
                title: "Review Submissions",
                desc: "Grade student solutions",
                color: "from-purple-500 to-indigo-600",
              },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="group bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg mb-4`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === "teacher") {
    return <TeacherDashboard />
  }

  return <StudentDashboard />
}
