"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Copy, Save, Trash2, Users, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockCourses } from "@/lib/mock-data"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CourseSettingsPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const course = mockCourses.find((c) => c.id === courseId)

  const [courseForm, setCourseForm] = useState({
    name: course?.name || "",
    description: course?.description || "",
    joinCode: course?.joinCode || "",
  })

  if (!course) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        </div>
      </div>
    )
  }

  const copyJoinCode = () => {
    navigator.clipboard.writeText(courseForm.joinCode)
    toast.success("Join code copied to clipboard!")
  }

  const generateNewJoinCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setCourseForm({ ...courseForm, joinCode: newCode })
    toast.success("New join code generated!")
  }

  const handleSave = () => {
    console.log("Saving course settings:", courseForm)
    toast.success("Course settings updated successfully!")
  }

  const handleDeleteCourse = () => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      console.log("Deleting course:", courseId)
      toast.success("Course deleted successfully!")
      router.push("/dashboard/courses")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Course Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Update your course information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseDescription">Description</Label>
                <Textarea
                  id="courseDescription"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinCode">Join Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="joinCode"
                    value={courseForm.joinCode}
                    onChange={(e) => setCourseForm({ ...courseForm, joinCode: e.target.value })}
                  />
                  <Button variant="outline" onClick={copyJoinCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={generateNewJoinCode}>
                    Generate New
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Students use this code to join your course</p>
              </div>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Once you delete a course, there is no going back. All assignments, submissions, and student data will
                  be permanently removed.
                </AlertDescription>
              </Alert>
              <Button variant="destructive" className="mt-4" onClick={handleDeleteCourse}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Course
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Course Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Course ID</Label>
                <p className="text-sm text-gray-600">{course.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-gray-600">{new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Students Enrolled</Label>
                <p className="text-sm text-gray-600">{course.studentCount}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Join Code</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{course.joinCode}</Badge>
                  <Button size="sm" variant="ghost" onClick={copyJoinCode}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Manage Students
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Export Data
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Course Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
