"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  BookOpen,
  FileText,
  Users,
  Save,
  Eye,
  Plus,
  X,
  Code2,
  Search,
  Sparkles,
  Target,
} from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { getUserCourses, mockProblems } from "@/lib/mock-data"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"

export default function CreatePage() {
  const { user } = useUser()
  const courses = getUserCourses(user!.id, "teacher")

  const [activeTab, setActiveTab] = useState("assignment")

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    courseId: "",
    selectedProblems: [] as string[],
    dueDate: undefined as Date | undefined,
    maxAttempts: "",
  })

  // Course form state
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    joinCode: "",
  })

  // Problem form state
  const [problemForm, setProblemForm] = useState({
    title: "",
    description: "",
    difficulty: "",
    category: "",
    tags: [] as string[],
    timeLimit: "",
    memoryLimit: "",
    sampleInput: "",
    sampleOutput: "",
    explanation: "",
    constraints: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [newConstraint, setNewConstraint] = useState("")
  const [problemSearch, setProblemSearch] = useState("")

  const filteredProblems = mockProblems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(problemSearch.toLowerCase())),
  )

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (assignmentForm.selectedProblems.length === 0) {
      toast.error("Please select at least one problem for the assignment")
      return
    }
    console.log("Creating assignment:", assignmentForm)
    toast.success("Assignment created successfully!")

    // Reset form
    setAssignmentForm({
      title: "",
      description: "",
      courseId: "",
      selectedProblems: [],
      dueDate: undefined,
      maxAttempts: "",
    })
  }

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating course:", courseForm)
    toast.success("Course created successfully!")

    // Reset form
    setCourseForm({
      name: "",
      description: "",
      joinCode: "",
    })
  }

  const handleProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating problem:", problemForm)
    toast.success("Problem created successfully!")

    // Reset form
    setProblemForm({
      title: "",
      description: "",
      difficulty: "",
      category: "",
      tags: [],
      timeLimit: "",
      memoryLimit: "",
      sampleInput: "",
      sampleOutput: "",
      explanation: "",
      constraints: [],
    })
  }

  const generateJoinCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setCourseForm({ ...courseForm, joinCode: code })
  }

  const addTag = () => {
    if (newTag.trim() && !problemForm.tags.includes(newTag.trim())) {
      setProblemForm({ ...problemForm, tags: [...problemForm.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProblemForm({ ...problemForm, tags: problemForm.tags.filter((tag) => tag !== tagToRemove) })
  }

  const addConstraint = () => {
    if (newConstraint.trim()) {
      setProblemForm({ ...problemForm, constraints: [...problemForm.constraints, newConstraint.trim()] })
      setNewConstraint("")
    }
  }

  const removeConstraint = (index: number) => {
    setProblemForm({ ...problemForm, constraints: problemForm.constraints.filter((_, i) => i !== index) })
  }

  const toggleProblemSelection = (problemId: string) => {
    setAssignmentForm((prev) => ({
      ...prev,
      selectedProblems: prev.selectedProblems.includes(problemId)
        ? prev.selectedProblems.filter((id) => id !== problemId)
        : [...prev.selectedProblems, problemId],
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Hard":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="p-6 space-y-8">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Create Content</h1>
              <p className="text-blue-100 text-lg font-medium">
                Design engaging assignments, problems, and courses for your students
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1 rounded-2xl">
            <TabsTrigger
              value="assignment"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              Assignment
            </TabsTrigger>
            <TabsTrigger
              value="problem"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-200"
            >
              <Code2 className="h-4 w-4 mr-2" />
              Problem
            </TabsTrigger>
            <TabsTrigger
              value="course"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Course
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignment">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-8 border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500 rounded-xl text-white shadow-lg">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Create Assignment</h2>
                    <p className="text-slate-600 mt-1">
                      Design a comprehensive coding assignment with multiple problems
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleAssignmentSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                          Assignment Title *
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g., Data Structures Mastery Challenge"
                          value={assignmentForm.title}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                          className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="course" className="text-sm font-semibold text-slate-700">
                          Course *
                        </Label>
                        <Select
                          value={assignmentForm.courseId}
                          onValueChange={(value) => setAssignmentForm({ ...assignmentForm, courseId: value })}
                          required
                        >
                          <SelectTrigger className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-0 shadow-xl">
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id} className="rounded-lg">
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700">Due Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-12 justify-start text-left font-normal border-0 bg-slate-50 rounded-xl hover:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200",
                                !assignmentForm.dueDate && "text-slate-500",
                              )}
                            >
                              <CalendarIcon className="mr-3 h-4 w-4" />
                              {assignmentForm.dueDate ? format(assignmentForm.dueDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-xl border-0 shadow-xl">
                            <Calendar
                              mode="single"
                              selected={assignmentForm.dueDate}
                              onSelect={(date) => setAssignmentForm({ ...assignmentForm, dueDate: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="maxAttempts" className="text-sm font-semibold text-slate-700">
                          Max Attempts
                        </Label>
                        <Input
                          id="maxAttempts"
                          type="number"
                          placeholder="Unlimited"
                          value={assignmentForm.maxAttempts}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, maxAttempts: e.target.value })}
                          className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                          Assignment Description *
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the assignment objectives, learning outcomes, and requirements..."
                          className="min-h-[200px] border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                          value={assignmentForm.description}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Problem Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Select Problems *</h3>
                        <p className="text-sm text-slate-600 mt-1">Choose coding problems for this assignment</p>
                      </div>
                      <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="text-sm font-medium text-blue-700">
                          {assignmentForm.selectedProblems.length} selected
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <Input
                        placeholder="Search problems by title or tags..."
                        value={problemSearch}
                        onChange={(e) => setProblemSearch(e.target.value)}
                        className="pl-12 h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                      <div className="p-4 space-y-3">
                        {filteredProblems.map((problem) => (
                          <div
                            key={problem.id}
                            className={cn(
                              "flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                              assignmentForm.selectedProblems.includes(problem.id)
                                ? "border-blue-300 bg-blue-50/50 shadow-sm"
                                : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50",
                            )}
                            onClick={() => toggleProblemSelection(problem.id)}
                          >
                            <Checkbox
                              checked={assignmentForm.selectedProblems.includes(problem.id)}
                              onCheckedChange={() => toggleProblemSelection(problem.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-slate-900 truncate">{problem.title}</h4>
                                <Badge className={cn("text-xs font-medium", getDifficultyColor(problem.difficulty))}>
                                  {problem.difficulty}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{problem.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {problem.tags.slice(0, 4).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs bg-slate-50 border-slate-200">
                                    {tag}
                                  </Badge>
                                ))}
                                {problem.tags.length > 4 && (
                                  <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                                    +{problem.tags.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-semibold transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="problem">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 border-b border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Create Problem</h2>
                    <p className="text-slate-600 mt-1">Design a new coding challenge for the problem set</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleProblemSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="problemTitle" className="text-sm font-semibold text-slate-700">
                          Problem Title *
                        </Label>
                        <Input
                          id="problemTitle"
                          placeholder="e.g., Two Sum Challenge"
                          value={problemForm.title}
                          onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                          className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="difficulty" className="text-sm font-semibold text-slate-700">
                            Difficulty *
                          </Label>
                          <Select
                            value={problemForm.difficulty}
                            onValueChange={(value) => setProblemForm({ ...problemForm, difficulty: value })}
                            required
                          >
                            <SelectTrigger className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-0 shadow-xl">
                              <SelectItem value="Easy" className="rounded-lg">
                                Easy
                              </SelectItem>
                              <SelectItem value="Medium" className="rounded-lg">
                                Medium
                              </SelectItem>
                              <SelectItem value="Hard" className="rounded-lg">
                                Hard
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
                            Category *
                          </Label>
                          <Input
                            id="category"
                            placeholder="e.g., Arrays"
                            value={problemForm.category}
                            onChange={(e) => setProblemForm({ ...problemForm, category: e.target.value })}
                            className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="timeLimit" className="text-sm font-semibold text-slate-700">
                            Time Limit (seconds) *
                          </Label>
                          <Input
                            id="timeLimit"
                            type="number"
                            placeholder="1"
                            value={problemForm.timeLimit}
                            onChange={(e) => setProblemForm({ ...problemForm, timeLimit: e.target.value })}
                            className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="memoryLimit" className="text-sm font-semibold text-slate-700">
                            Memory Limit (MB) *
                          </Label>
                          <Input
                            id="memoryLimit"
                            type="number"
                            placeholder="256"
                            value={problemForm.memoryLimit}
                            onChange={(e) => setProblemForm({ ...problemForm, memoryLimit: e.target.value })}
                            className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700">Tags</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            variant="outline"
                            className="h-12 px-4 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all duration-200"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {problemForm.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-emerald-50 border-emerald-200 text-emerald-700 px-3 py-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 hover:text-red-600 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="problemDescription" className="text-sm font-semibold text-slate-700">
                          Problem Description *
                        </Label>
                        <Textarea
                          id="problemDescription"
                          placeholder="Describe the problem statement clearly and concisely..."
                          className="min-h-[120px] border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                          value={problemForm.description}
                          onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sampleInput" className="text-sm font-semibold text-slate-700">
                          Sample Input *
                        </Label>
                        <Textarea
                          id="sampleInput"
                          placeholder="Provide sample input..."
                          className="min-h-[80px] font-mono text-sm border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                          value={problemForm.sampleInput}
                          onChange={(e) => setProblemForm({ ...problemForm, sampleInput: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sampleOutput" className="text-sm font-semibold text-slate-700">
                          Sample Output *
                        </Label>
                        <Textarea
                          id="sampleOutput"
                          placeholder="Provide expected output..."
                          className="min-h-[80px] font-mono text-sm border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                          value={problemForm.sampleOutput}
                          onChange={(e) => setProblemForm({ ...problemForm, sampleOutput: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="explanation" className="text-sm font-semibold text-slate-700">
                          Explanation
                        </Label>
                        <Textarea
                          id="explanation"
                          placeholder="Explain the solution approach..."
                          className="min-h-[60px] border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                          value={problemForm.explanation}
                          onChange={(e) => setProblemForm({ ...problemForm, explanation: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Constraints */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-slate-700">Constraints</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a constraint"
                        value={newConstraint}
                        onChange={(e) => setNewConstraint(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addConstraint())}
                        className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      />
                      <Button
                        type="button"
                        onClick={addConstraint}
                        variant="outline"
                        className="h-12 px-4 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {problemForm.constraints.map((constraint, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <span className="text-sm text-slate-700">{constraint}</span>
                          <button
                            type="button"
                            onClick={() => removeConstraint(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Problem
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-semibold transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="course">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 border-b border-purple-100">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500 rounded-xl text-white shadow-lg">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Create Course</h2>
                    <p className="text-slate-600 mt-1">Set up a new course and invite students to join</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleCourseSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="courseName" className="text-sm font-semibold text-slate-700">
                          Course Name *
                        </Label>
                        <Input
                          id="courseName"
                          placeholder="e.g., Advanced Data Structures & Algorithms"
                          value={courseForm.name}
                          onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                          className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="joinCode" className="text-sm font-semibold text-slate-700">
                          Join Code *
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="joinCode"
                            placeholder="Course join code"
                            value={courseForm.joinCode}
                            onChange={(e) => setCourseForm({ ...courseForm, joinCode: e.target.value })}
                            className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateJoinCode}
                            className="h-12 px-4 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-semibold transition-all duration-200"
                          >
                            Generate
                          </Button>
                        </div>
                        <p className="text-sm text-slate-600">Students will use this code to join your course</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="courseDescription" className="text-sm font-semibold text-slate-700">
                          Course Description *
                        </Label>
                        <Textarea
                          id="courseDescription"
                          placeholder="Describe what students will learn in this course..."
                          className="min-h-[160px] border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-none"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-500 rounded-lg text-white">
                        <Eye className="h-4 w-4" />
                      </div>
                      <h4 className="font-semibold text-purple-900">Course Preview</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-700">Name:</span>
                        <span className="text-slate-600">{courseForm.name || "Course name will appear here"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-700">Join Code:</span>
                        <span className="text-slate-600 font-mono bg-white px-2 py-1 rounded border">
                          {courseForm.joinCode || "Generated code will appear here"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-700">Instructor:</span>
                        <span className="text-slate-600">{user?.name}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="font-medium text-slate-700">Description:</span>
                        <span className="text-slate-600">
                          {courseForm.description || "Course description will appear here"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-semibold transition-all duration-200"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Add Students
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
