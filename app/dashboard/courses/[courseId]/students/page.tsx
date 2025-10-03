"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, UserPlus, Mail, Search, MoreHorizontal, Trash2, Send } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockCourses } from "@/lib/mock-data"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock enrolled students
const mockEnrolledStudents = [
  {
    id: "s1",
    name: "Himanshu Raj",
    email: "himanshu@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledAt: "2024-01-20",
    submissions: 5,
    avgScore: 85,
    status: "active",
  },
  {
    id: "s2",
    name: "Priya Sharma",
    email: "priya@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledAt: "2024-01-22",
    submissions: 3,
    avgScore: 92,
    status: "active",
  },
  {
    id: "s3",
    name: "Arjun Patel",
    email: "arjun@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledAt: "2024-01-25",
    submissions: 2,
    avgScore: 78,
    status: "active",
  },
]

export default function CourseStudentsPage() {
  const { user } = useAuth()
  const params = useParams()
  const courseId = params.courseId as string

  const course = mockCourses.find((c) => c.id === courseId)
  const [searchTerm, setSearchTerm] = useState("")
  const [inviteEmails, setInviteEmails] = useState("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  if (!course) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
        </div>
      </div>
    )
  }

  const filteredStudents = mockEnrolledStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInviteStudents = () => {
    const emails = inviteEmails.split("\n").filter((email) => email.trim())
    console.log("Inviting students:", emails)
    toast.success(`Invitations sent to ${emails.length} students!`)
    setInviteEmails("")
    setIsInviteOpen(false)
  }

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName} from this course?`)) {
      console.log("Removing student:", studentId)
      toast.success(`${studentName} has been removed from the course`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Course Students</h1>
              <p className="text-blue-100 text-lg mb-4">
                {course.name} • {mockEnrolledStudents.length} students enrolled
              </p>
              <div className="flex items-center space-x-6 text-sm text-blue-100">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{mockEnrolledStudents.length} Total Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-white/20 text-white border-white/30">{course.joinCode}</Badge>
                  <span>Join Code</span>
                </div>
              </div>
            </div>

            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Students
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>Invite Students</span>
                  </DialogTitle>
                  <DialogDescription>Add students to your course by entering their email addresses</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emails">Email Addresses</Label>
                    <Textarea
                      id="emails"
                      placeholder="Enter email addresses, one per line&#10;student1@example.com&#10;student2@example.com"
                      value={inviteEmails}
                      onChange={(e) => setInviteEmails(e.target.value)}
                      className="min-h-[120px] border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-sm text-slate-600">Enter one email address per line</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800">{course.joinCode}</Badge>
                      <span>Join Code</span>
                    </h4>
                    <p className="text-sm text-blue-800">
                      Students can also join using this code directly from their dashboard
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleInviteStudents}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitations
                    </Button>
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="border-slate-200">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Enrolled Students ({filteredStudents.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 hover:border-blue-300 bg-gradient-to-r from-white to-slate-50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">{student.name}</h3>
                      <p className="text-sm text-slate-600">{student.email}</p>
                      <p className="text-xs text-slate-500">
                        Enrolled {new Date(student.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="flex items-center space-x-4 mb-1">
                        <div className="text-center">
                          <p className="font-semibold text-slate-900">{student.submissions}</p>
                          <p className="text-xs text-slate-600">Submissions</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">{student.avgScore}%</p>
                          <p className="text-xs text-slate-600">Avg Score</p>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={student.status === "active" ? "default" : "secondary"}
                      className={student.status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""}
                    >
                      {student.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="hover:bg-slate-50">View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-slate-50">View Submissions</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-slate-50">Send Message</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveStudent(student.id, student.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
                <p className="text-slate-600">
                  {searchTerm ? "Try adjusting your search terms" : "No students enrolled in this course yet"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsInviteOpen(true)}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Students
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
