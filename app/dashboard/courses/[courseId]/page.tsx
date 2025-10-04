"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Calendar, Clock, FileText, Plus, Copy, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { mockCourses, getCourseAssignments, getAssignmentSubmissions } from "@/lib/mock-data"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"

export default function CoursePage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const course = mockCourses.find((c) => c.id === courseId)
  const assignments = getCourseAssignments(courseId)

  if (!course) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
          <Link href="/dashboard/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const copyJoinCode = () => {
    navigator.clipboard.writeText(course.joinCode)
    toast.success("Join code copied to clipboard!")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            <p className="text-blue-100 mb-4">{course.description}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{course.studentCount} students</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Instructor: {course.instructor}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {user?.role === "teacher" && (
              <>
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg p-2">
                  <span className="text-sm">Join Code:</span>
                  <code className="bg-white/30 px-2 py-1 rounded text-sm font-mono">{course.joinCode}</code>
                  <Button size="sm" variant="ghost" onClick={copyJoinCode} className="text-white hover:bg-white/20">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/courses/${courseId}/settings`}>
                    <Button variant="secondary" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Course Settings
                    </Button>
                  </Link>
                  <Link href={`/dashboard/courses/${courseId}/students`}>
                    <Button variant="secondary" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Add Students
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          {user?.role === "teacher" && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Assignments</h2>
            {user?.role === "teacher" && (
              <Link href="/dashboard/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </Link>
            )}
          </div>

          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{assignment.title}</CardTitle>
                      <CardDescription className="mt-2">{assignment.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(assignment.difficulty)}>{assignment.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{assignment.timeLimit} min</span>
                      </div>
                      {user?.role === "teacher" && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{getAssignmentSubmissions(assignment.id).length} submissions</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/dashboard/courses/${courseId}/assignments/${assignment.id}`}>
                      <Button>{user?.role === "teacher" ? "Manage" : "View Assignment"}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {assignments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
              <p className="text-gray-600">
                {user?.role === "teacher"
                  ? "Create your first assignment to get started"
                  : "No assignments have been posted for this course yet"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>{course.studentCount} students enrolled in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Student list feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === "teacher" && (
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Course Analytics</CardTitle>
                <CardDescription>Track student progress and assignment performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
