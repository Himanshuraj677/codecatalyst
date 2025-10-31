"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Search, BookOpen, Calendar } from "lucide-react"
import Link from "next/link"
import { mockAssignments, getUserSubmissions } from "@/lib/mock-data"
import { useUser } from "@/hooks/useUser"
import { toast } from "react-toastify"

export default function AssignmentsPage() {
  const { user, isLoading } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFetching, setIsFetching] = useState(false)
  const [assignments, setAssignments] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true)
        const response = await fetch("/api/assignments")
        const data = await response.json();
        if (!data.success || !response.ok) {
          toast.error(data.message);
        }
        setAssignments(data.data); 
      } catch (error) {
        let errorMessage = "An error occurred while fetching data."
        if (error instanceof Error) {
          errorMessage = error.message
        }
        toast.error(errorMessage);
      }
      finally {
        setIsFetching(false)
      }
    }
    fetchData()
  }, [])
const userSubmissions = useMemo(() => {
  if (!user) return []
  return getUserSubmissions(user.id)
}, [user])

const submittedAssignmentIds = useMemo(() => userSubmissions.map(s => s.assignmentId), [userSubmissions])


  const filteredAssignments = useMemo(() => {
  return mockAssignments.filter((assignment) => {
    if (!user) return false // optional guard

    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDifficulty = difficultyFilter === "all" || assignment.difficulty === difficultyFilter

    let matchesStatus = true
    if (statusFilter === "submitted") {
      matchesStatus = submittedAssignmentIds.includes(assignment.id)
    } else if (statusFilter === "pending") {
      matchesStatus = !submittedAssignmentIds.includes(assignment.id)
    }

    return matchesSearch && matchesDifficulty && matchesStatus
  })
}, [searchTerm, difficultyFilter, statusFilter, submittedAssignmentIds, user])


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

  const getAssignmentStatus = (assignmentId: string) => {
    const submission = userSubmissions.find((s) => s.assignmentId === assignmentId)
    return submission ? submission.status : "Not Submitted"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800"
      case "Wrong Answer":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Not Submitted":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Assignments</h1>
        <p className="text-gray-600 mt-1">View and submit your course assignments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-4">
        {assignments.map((assignment) => {
          // const status = getAssignmentStatus(assignment.id)
          const isOverdue = new Date(assignment.dueDate) < new Date()

          return (
            <Card
              key={assignment.course.id}
              className={`hover:shadow-md transition-shadow ${isOverdue ? "border-red-200" : ""}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                    <CardDescription className="mt-2">{assignment.description}</CardDescription>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{assignment.courseName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{assignment?.timeLimit || 0} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getDifficultyColor(assignment.difficulty)}>{assignment?.difficulty || "Unknown"}</Badge>
                    {/* <Badge className={getStatusColor(status)}>{status}</Badge> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {isOverdue && <span className="text-red-600 font-medium">⚠️ Overdue</span>}
                  </div>
                  <Link href={`/dashboard/courses/${assignment.courseId}/assignments/${assignment.id}`}>
                    {/* <Button>{status === "Not Submitted" ? "Start Assignment" : "View Submission"}</Button> */}
                    <Button>View Assignment</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">
            {searchTerm || difficultyFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No assignments available at the moment"}
          </p>
        </div>
      )}
    </div>
  )
}
