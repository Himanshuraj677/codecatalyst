import { User } from "@/app/context/userContext"
import { Calendar, TrendingUp, Users, BookOpen, FileText, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function TeacherDashboard({user}: {user: User}) {
  const [courses, setCourses] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const [res1, res2, res3] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/submissions"),
          fetch("/api/assignments"),
        ]);

        const [data1, data2, data3] = await Promise.all([
          res1.json(),
          res2.json(),
          res3.json(),
        ]);
        setCourses(data1.data);
        setSubmissions(data2.data);
        setAssignments(data3.data || []);
        setTotalStudents(data1.data[0]?.studentCount || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  if (isFetching) {
    return <div className="p-6">Loading...</div>;
  }
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
                  Welcome back, {user?.name}!
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
                    <span>{submissions.length} submissions this week</span>
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
            { icon: TrendingUp, label: "This Week", value: submissions.length, color: "from-purple-500 to-indigo-600" },
            { icon: FileText, label: "Assignments", value: assignments.length, color: "from-amber-500 to-orange-600" },
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
              {submissions.map((submission) => (
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