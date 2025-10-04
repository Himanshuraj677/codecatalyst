"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Calendar, UserPlus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockCourses } from "@/lib/mock-data"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function JoinCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [joinCode, setJoinCode] = useState("")
  const [foundCourse, setFoundCourse] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchCourse = () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a join code")
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      const course = mockCourses.find((c) => c.joinCode.toLowerCase() === joinCode.toLowerCase())

      if (course) {
        setFoundCourse(course)
        toast.success("Course found!")
      } else {
        setFoundCourse(null)
        toast.error("Course not found. Please check the join code.")
      }
      setIsSearching(false)
    }, 1000)
  }

  const handleJoinCourse = () => {
    if (!foundCourse) return

    console.log("Joining course:", foundCourse.id)
    toast.success(`Successfully joined ${foundCourse.name}!`)

    // Redirect to the course page
    setTimeout(() => {
      router.push(`/dashboard/courses/${foundCourse.id}`)
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Join a Course</h1>
        <p className="text-gray-600 mt-1">Enter a course join code to enroll in a new course</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Join Code Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Enter Join Code</span>
            </CardTitle>
            <CardDescription>Ask your instructor for the course join code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="joinCode">Course Join Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="joinCode"
                  placeholder="Enter course join code (e.g., DSA2024)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={handleSearchCourse} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Find Course"}
                </Button>
              </div>
            </div>

            {/* Available Courses for Demo */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Demo Join Codes:</h4>
              <div className="flex flex-wrap gap-2">
                {mockCourses.map((course) => (
                  <Button
                    key={course.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setJoinCode(course.joinCode)}
                    className="text-xs"
                  >
                    {course.joinCode}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-blue-800 mt-2">Click any code above to try joining that course</p>
            </div>
          </CardContent>
        </Card>

        {/* Course Preview */}
        {foundCourse && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <BookOpen className="h-5 w-5" />
                <span>Course Found!</span>
              </CardTitle>
              <CardDescription className="text-green-700">Review the course details before joining</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-green-900">{foundCourse.name}</h3>
                <p className="text-green-800 mt-1">{foundCourse.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">{foundCourse.studentCount} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Created {new Date(foundCourse.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Instructor: {foundCourse.instructor}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Join Code: {foundCourse.joinCode}</Badge>
              </div>

              <Button onClick={handleJoinCourse} className="w-full bg-green-600 hover:bg-green-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Join This Course
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">Where to find join codes:</h4>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Ask your instructor or teacher</li>
                <li>Check your course syllabus or welcome email</li>
                <li>Look for announcements in your learning management system</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Join code format:</h4>
              <p>
                Join codes are typically 6-8 characters long and may contain letters and numbers (e.g., DSA2024,
                WEB2024)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
