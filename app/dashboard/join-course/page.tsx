"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Calendar, UserPlus } from "lucide-react"
import { mockCourses } from "@/lib/mock-data"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"

export default function JoinCoursePage() {
  const { user } = useUser()
  const router = useRouter()
  const [joinCode, setJoinCode] = useState("")
  const [isFetching, setIsFetching] = useState(false)

  const handleJoinCourse = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/courses/enrollments?joinCode=${joinCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Successfully joined the course!");
        router.push(`/dashboard/courses/${data.data.courseId}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while joining the course.");
    } finally {
      setIsFetching(false);
    }
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
                <Button onClick={handleJoinCourse} disabled={isFetching}>
                  {isFetching ? "Searching..." : "Join Course"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
