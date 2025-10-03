"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, User, CheckCircle, XCircle, AlertCircle, Code2, Trophy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { mockAssignments, getAssignmentSubmissions, getAssignmentProblems, getUserSubmissions } from "@/lib/mock-data"
import { useParams } from "next/navigation"

export default function AssignmentPage() {
  const { user } = useAuth()
  const params = useParams()
  const assignmentId = params.assignmentId as string
  const courseId = params.courseId as string

  const assignment = mockAssignments.find((a) => a.id === assignmentId)
  const problems = getAssignmentProblems(assignmentId)
  const submissions = getAssignmentSubmissions(assignmentId)
  const userSubmissions = getUserSubmissions(user!.id).filter((s) => s.assignmentId === assignmentId)

  if (!assignment) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment not found</h3>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "text-green-600"
      case "Wrong Answer":
        return "text-red-600"
      case "Pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getProblemStatus = (problemId: string) => {
    const submission = userSubmissions.find((s) => s.problemId === problemId)
    return submission ? submission.status : "Not Attempted"
  }

  const solvedProblems = problems.filter((p) => getProblemStatus(p.id) === "Accepted").length
  const progressPercentage = problems.length > 0 ? (solvedProblems / problems.length) * 100 : 0

  if (user?.role === "teacher") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="p-6 space-y-6">
          {/* Assignment Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">{assignment.title}</h1>
                <p className="text-purple-100 mb-4 text-lg">{assignment.description}</p>
                <div className="flex items-center space-x-6 text-sm text-purple-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code2 className="h-4 w-4" />
                    <span>{problems.length} Problems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>{submissions.length} Submissions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problems Overview */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code2 className="h-5 w-5 text-blue-600" />
                <span>Assignment Problems ({problems.length})</span>
              </CardTitle>
              <CardDescription>Problems included in this assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {problems.map((problem, index) => {
                  const problemSubmissions = submissions.filter((s) => s.problemId === problem.id)
                  const acceptedSubmissions = problemSubmissions.filter((s) => s.status === "Accepted").length

                  return (
                    <div
                      key={problem.id}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300 bg-gradient-to-r from-white to-slate-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">{problem.title}</h3>
                            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                          </div>
                          <p className="text-slate-600 mb-3 line-clamp-2">{problem.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>{problemSubmissions.length} submissions</span>
                            <span>{acceptedSubmissions} accepted</span>
                            <span>{problem.tags.join(", ")}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link href={`/dashboard/problemset/${problem.id}`}>
                            <Button variant="outline" className="border-slate-200 bg-transparent">
                              View Problem
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Submissions List */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle>Student Submissions ({submissions.length})</CardTitle>
              <CardDescription>Review and provide feedback on student submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{submission.studentName}</span>
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">Problem: {submission.problemTitle}</p>
                        <p className="text-sm text-slate-600">
                          Submitted {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
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
                        {submission.score && <Badge variant="outline">{submission.score}/100</Badge>}
                      </div>
                    </div>

                    {submission.feedback && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Feedback:</p>
                        <p className="text-sm text-blue-800">{submission.feedback}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-200 bg-transparent">
                        View Code
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-200 bg-transparent">
                        Add Feedback
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {submissions.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No submissions yet</h3>
                  <p className="text-slate-600">Students haven't submitted solutions for this assignment yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Student View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="p-6 space-y-6">
        {/* Assignment Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{assignment.title}</h1>
              <p className="text-blue-100 mb-4 text-lg">{assignment.description}</p>
              <div className="flex items-center space-x-6 text-sm text-blue-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code2 className="h-4 w-4" />
                  <span>{problems.length} Problems</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>
                    {solvedProblems}/{problems.length} Solved
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-blue-100 mb-2">Progress</div>
                <div className="w-20 bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-blue-600" />
              <span>Assignment Problems</span>
            </CardTitle>
            <CardDescription>Solve all problems to complete this assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {problems.map((problem, index) => {
                const status = getProblemStatus(problem.id)
                const isCompleted = status === "Accepted"

                return (
                  <div
                    key={problem.id}
                    className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300 bg-gradient-to-r from-white to-slate-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? "bg-green-100" : "bg-blue-100"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">{problem.title}</h3>
                          <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                          {status !== "Not Attempted" && (
                            <Badge
                              variant="outline"
                              className={
                                status === "Accepted"
                                  ? "border-green-200 text-green-700"
                                  : status === "Wrong Answer"
                                    ? "border-red-200 text-red-700"
                                    : "border-yellow-200 text-yellow-700"
                              }
                            >
                              {status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-600 mb-3 line-clamp-2">{problem.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-slate-300 text-slate-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link href={`/dashboard/problemset/${problem.id}?assignment=${assignmentId}`}>
                          <Button
                            className={
                              isCompleted
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            }
                          >
                            {isCompleted ? "View Solution" : status === "Not Attempted" ? "Start Problem" : "Continue"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        {userSubmissions.length > 0 && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Summary of your submissions for this assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{submission.problemTitle}</p>
                      <p className="text-sm text-slate-600">
                        Submitted {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {submission.status === "Accepted" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : submission.status === "Wrong Answer" ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
