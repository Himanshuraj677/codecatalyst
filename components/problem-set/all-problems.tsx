import { useEffect, useState } from "react";
import {
  Filter,
  Search,
  CheckCircle,
  Code2,
  Clock,
  MemoryStick,
  TrendingUp,
  Zap,
  Tag,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { toast } from "react-toastify";

interface CategoriesProp {
  id: string;
  name: string;
}
const AllProblems = ({ categories }: { categories: CategoriesProp[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [problems, setProblems] = useState<any[]>([]);
  const [isfetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsFetching(true);
        const response = await fetch("/api/problems");
        const data = await response.json();
        if (!response.ok || !data.success) {
          toast.error(data.message || "Failed to fetch problems");
          return;
        }
        setProblems(data);
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

  return (
    <>
      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Filter Problems</h3>
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

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
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

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-slate-200 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
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
            Try adjusting your search criteria or filters to find the problems
            you're looking for.
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
    </>
  );
};

export default AllProblems;
