"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail, Edit, Camera, BookOpen, Trophy, Calendar } from "lucide-react"
import { getUserCourses, getUserSubmissions } from "@/lib/mock-data"
import { useUser } from "@/hooks/useUser"

export default function ProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  })

  const courses = getUserCourses(user!.id, user!.role)
  const submissions = getUserSubmissions(user!.id)
  const acceptedSubmissions = submissions.filter((s) => s.status === "Accepted")

  const handleSave = () => {
    // Mock save functionality
    console.log("Saving profile:", editForm)
    setIsEditing(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Update your profile information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 rounded-full bg-transparent"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-gray-600 flex items-center justify-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email}
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    {user?.role}
                  </Badge>
                </div>

                {user?.bio && (
                  <div className="text-left">
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-sm text-gray-600">{user.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">Courses</span>
                </div>
                <span className="font-medium">{courses.length}</span>
              </div>

              {user?.role === "student" && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">Solved</span>
                    </div>
                    <span className="font-medium">{acceptedSubmissions.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="text-sm">Submissions</span>
                    </div>
                    <span className="font-medium">{submissions.length}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity & Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses */}
          <Card>
            <CardHeader>
              <CardTitle>{user?.role === "teacher" ? "Teaching" : "Enrolled Courses"}</CardTitle>
              <CardDescription>
                {user?.role === "teacher" ? "Courses you are currently teaching" : "Courses you are enrolled in"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-gray-600">
                        {user?.role === "teacher"
                          ? `${course.studentCount} students`
                          : `Instructor: ${course.instructor}`}
                      </p>
                    </div>
                    <Badge variant="outline">{course.joinCode}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity (Student only) */}
          {user?.role === "student" && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Your latest assignment submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{submission.assignmentTitle}</h3>
                        <p className="text-sm text-gray-600">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge
                        className={
                          submission.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : submission.status === "Wrong Answer"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
