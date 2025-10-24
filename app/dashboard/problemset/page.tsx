"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  Search,
  Clock,
  MemoryStick,
  Tag,
  TrendingUp,
  Plus,
  CheckCircle,
  Target,
  Zap,
  Award,
  Filter,
} from "lucide-react";
import Link from "next/link";
import {
  mockProblems,
} from "@/lib/mock-data";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";

export default function ProblemSetPage() {
  const { user, isLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [problems, setProblems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsFetching(true);
        const response1 = fetch("/api/problems");
        const response2 = fetch("/api/categories");
        const [problemsRes, categoriesRes] = await Promise.all([
          response1,
          response2,
        ]);
        const data = await problemsRes.json();
        const categoriesData = await categoriesRes.json();
        if (!problemsRes.ok || !data.success) {
          toast.error(data.message || "Failed to fetch problems");
          return;
        }
        if (!categoriesRes.ok || !categoriesData.success) {
          toast.error(categoriesData.message || "Failed to fetch categories");
          return;
        }
        setProblems(data?.data);
        setCategories(categoriesData?.data);  
      } catch (error) {
        let errorMessage = "An unexpected error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const stats = {
    total: 300,
    solved: 150,
    easy: 100,
    medium: 100,
    hard: 100,
  };
  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full">
        <div className="">I am loading</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-blue-600/10 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Code2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                      Problem Set
                    </h1>
                    <p className="text-lg text-slate-600">
                      Practice coding problems and sharpen your skills
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-indigo-600" />
                    <span className="text-slate-600">
                      {stats.total} total problems
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-slate-600">
                      {stats.solved} solved
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-slate-600">
                      {Math.round((stats.solved / stats.total) * 100)}%
                      completion
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Easy",
                      count: stats.easy,
                      color: "from-emerald-500 to-green-600",
                    },
                    {
                      label: "Medium",
                      count: stats.medium,
                      color: "from-amber-500 to-orange-600",
                    },
                    {
                      label: "Hard",
                      count: stats.hard,
                      color: "from-red-500 to-red-600",
                    },
                    {
                      label: "Solved",
                      count: stats.solved,
                      color: "from-purple-500 to-indigo-600",
                    },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg mb-2`}
                      >
                        <span className="text-2xl font-bold text-white">
                          {stat.count}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="problems" className="space-y-8">
          <TabsList className="bg-white shadow-sm border border-slate-200/60 p-1 rounded-xl">
            <TabsTrigger
              value="problems"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-2"
            >
              All Problems
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-2"
            >
              Categories
            </TabsTrigger>
            {user?.role === "teacher" && (
              <TabsTrigger
                value="manage"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-2"
              >
                Manage Problems
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="problems" className="space-y-8">
            {/* Filter Section */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <Filter className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">
                  Filter Problems
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>

                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger className="border-slate-200 rounded-xl">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="border-slate-200 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories && categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-slate-200 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
                    <SelectItem value="unsolved">Unsolved</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setDifficultyFilter("all");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                  className="border-slate-200 hover:bg-slate-50 rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Problems List */}
            <div className="space-y-4">
              {problems.map((problem) => {
                const isSolved = problem?.isSolved || false;
                const submissionCount = problem?.submissionCount || 0;

                return (
                  <div
                    key={problem.id}
                    className="group bg-white rounded-2xl border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                                isSolved
                                  ? "bg-gradient-to-br from-emerald-500 to-green-600"
                                  : "bg-gradient-to-br from-slate-400 to-slate-500"
                              }`}
                            >
                              {isSolved ? (
                                <CheckCircle className="h-6 w-6 text-white" />
                              ) : (
                                <Code2 className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {problem.title}
                                </h3>
                                <Badge
                                  className={`${getDifficultyColor(
                                    problem.difficulty
                                  )} border font-medium`}
                                >
                                  {problem.difficulty}
                                </Badge>
                                {isSolved && (
                                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    Solved
                                  </Badge>
                                )}
                              </div>
                              <p className="text-slate-600 line-clamp-2 mb-3">
                                {problem.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{problem.timeLimit}s</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MemoryStick className="h-4 w-4" />
                                <span>{problem.memoryLimit}MB</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{submissionCount} submissions</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {problem.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs border-slate-300 text-slate-600"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {problem.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs border-slate-300 text-slate-600"
                                >
                                  +{problem.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="ml-6">
                          <Link href={`/dashboard/problemset/${problem.id}`}>
                            <Button
                              className={`shadow-lg ${
                                isSolved
                                  ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              }`}
                            >
                              {isSolved ? "View Solution" : "Solve Problem"}
                              <Zap className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {problems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code2 className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No problems found
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find the
                  problems you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setDifficultyFilter("all");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryProblems = mockProblems.filter(
                  (p) => p.category === category
                );
                const solvedInCategory = 50; // Mocked value Should be derived from user data
                const progressPercentage =
                  (solvedInCategory / categoryProblems.length) * 100;

                return (
                  <div
                    key={category}
                    className="group bg-white rounded-2xl border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Code2 className="h-6 w-6 text-white" />
                        </div>
                        <Badge
                          variant="outline"
                          className="border-slate-300 text-slate-600"
                        >
                          {categoryProblems.length} problems
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {category}
                      </h3>

                      <p className="text-sm text-slate-600 mb-4">
                        {solvedInCategory}/{categoryProblems.length} solved
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-900">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-slate-200 hover:bg-slate-50 rounded-xl group-hover:border-indigo-300 group-hover:text-indigo-600 bg-transparent"
                        onClick={() => setCategoryFilter(category)}
                      >
                        View Problems
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {user?.role === "teacher" && (
            <TabsContent value="manage">
              <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Problem Management
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Create and manage coding problems for your assignments and
                    courses.
                  </p>
                  <Link href="/dashboard/create">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Problem
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
