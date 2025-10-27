"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Code, Calendar, FileText, User, Eye } from "lucide-react";
import Link from "next/link";
import { getUserSubmissions, mockSubmissions } from "@/lib/mock-data";
import { useUser } from "@/hooks/useUser";

export default function SubmissionsPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isTeacher = user?.role === "teacher";

  const submissions = useMemo(() => {
    if (!user) return []; // guard for client runtime
    return isTeacher ? mockSubmissions : getUserSubmissions(user.id);
  }, [isTeacher, user]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch =
        submission.assignmentTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (isTeacher &&
          submission.studentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter, isTeacher]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Wrong Answer":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Time Limit Exceeded":
        return "bg-orange-100 text-orange-800";
      case "Runtime Error":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case "python":
        return "bg-blue-100 text-blue-800";
      case "javascript":
        return "bg-yellow-100 text-yellow-800";
      case "java":
        return "bg-red-100 text-red-800";
      case "cpp":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: submissions.length,
    accepted: submissions.filter((s) => s.status === "Accepted").length,
    pending: submissions.filter((s) => s.status === "Pending").length,
    rejected: submissions.filter((s) => s.status === "Wrong Answer").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isTeacher ? "All Submissions" : "My Submissions"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isTeacher
            ? "Review and grade student submissions"
            : "Track your assignment submissions and results"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-green-600 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-yellow-600 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-red-600 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={
              isTeacher
                ? "Search by assignment or student..."
                : "Search assignments..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Wrong Answer">Wrong Answer</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Time Limit Exceeded">Time Limit</SelectItem>
            <SelectItem value="Runtime Error">Runtime Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <Card
            key={submission.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {submission.assignmentTitle}
                    </h3>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                    <Badge
                      className={getLanguageColor(submission.language)}
                      variant="outline"
                    >
                      {submission.language}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    {isTeacher && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{submission.studentName}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Submitted{" "}
                        {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    {submission.score && (
                      <div className="flex items-center">
                        <span className="font-medium">
                          Score: {submission.score}/100
                        </span>
                      </div>
                    )}
                  </div>

                  {submission.feedback && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Feedback:
                      </p>
                      <p className="text-sm text-blue-800">
                        {submission.feedback}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        Code Preview
                      </span>
                    </div>
                    <pre className="text-sm text-gray-700 overflow-x-auto">
                      <code>{submission.code.substring(0, 150)}...</code>
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Link
                    href={`/dashboard/courses/${submission.assignmentId}/assignments/${submission.assignmentId}`}
                  >
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                  {isTeacher && submission.status === "Pending" && (
                    <Button size="sm">Grade</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No submissions found
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : isTeacher
              ? "No student submissions yet"
              : "You haven't submitted any assignments yet"}
          </p>
        </div>
      )}
    </div>
  );
}
