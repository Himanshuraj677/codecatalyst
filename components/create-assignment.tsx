import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "./ui/select";
import { PopoverContent, Popover, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { Target, CalendarIcon, Search, Eye, Save } from "lucide-react";
import { User } from "@/app/context/userContext";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Calendar from "react-calendar";

const CreateAssignment = ({ user }: { user: User }) => {
  const [problemSearch, setProblemSearch] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [DSA_Problems, setDSA_Problems] = useState<any[]>([]);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    courseId: "",
    selectedProblems: [] as string[],
    dueDate: undefined as Date | undefined,
    maxAttempts: "",
  });

  useEffect(() => {
    const callApi = async () => {
      try {
        const promise1 = fetch("/api/problems", {
          credentials: "include",
        });
        const promise2 = fetch("/api/courses", {
          credentials: "include",
        });
        const [response1, response2] = await Promise.all([promise1, promise2]);
        const data1 = await response1.json();
        const data2 = await response2.json();
        if (!response1.ok || !data1.success) {
          toast.error(data1.message || "Failed to fetch problems");
          return;
        }
        if (!response2.ok || !data2.success) {
          toast.error(data2.message || "Failed to fetch courses");
          return;
        }
        setDSA_Problems(data1.data);
        setCourses(data2.data);
      } catch (error) {
        let errorMessage = "An unexpected error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    };
    callApi();
  }, []);

  const toggleProblemSelection = (problemId: string) => {
    console.log("Toggling problem:", problemId);
    setAssignmentForm((prev) => {
      const isSelected = prev.selectedProblems.includes(problemId);
      return {
        ...prev,
        selectedProblems: isSelected
          ? prev.selectedProblems.filter((id) => id !== problemId)
          : [...prev.selectedProblems, problemId],
      };
    });
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assignmentForm.selectedProblems.length === 0) {
      toast.error("Please select at least one problem for the assignment");
      return;
    }
    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentForm),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data?.message || "Failed to create assignment");
        return;
      }
      toast.success("Assignment created successfully!");
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }

    // Reset form
    setAssignmentForm({
      title: "",
      description: "",
      courseId: "",
      selectedProblems: [],
      dueDate: undefined,
      maxAttempts: "",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-8 border-b border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500 rounded-xl text-white shadow-lg">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Create Assignment
            </h2>
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
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-slate-700"
                >
                  Assignment Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Data Structures Mastery Challenge"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      title: e.target.value,
                    })
                  }
                  className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="course"
                  className="text-sm font-semibold text-slate-700"
                >
                  Course *
                </Label>
                <Select
                  value={assignmentForm.courseId}
                  onValueChange={(value) =>
                    setAssignmentForm({ ...assignmentForm, courseId: value })
                  }
                  required
                >
                  <SelectTrigger className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-0 shadow-xl">
                    {courses.map((course) => (
                      <SelectItem
                        key={course.id}
                        value={course.id}
                        className="rounded-lg"
                      >
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Due Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!assignmentForm.dueDate}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {assignmentForm.dueDate ? (
                        format(assignmentForm.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    {/* Prevent Popover from closing when clicking inside */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Calendar
                        value={assignmentForm.dueDate || null}
                        onChange={(value) => {
                          // value might still be null
                          if (value instanceof Date) {
                            setAssignmentForm({
                              ...assignmentForm,
                              dueDate: value,
                            });
                          }
                        }}
                        // calendarType="US" // Optional: week starts on Sunday
                        minDate={new Date()} // Optional: prevent past dates
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="maxAttempts"
                  className="text-sm font-semibold text-slate-700"
                >
                  Max Attempts
                </Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  placeholder="Unlimited"
                  value={assignmentForm.maxAttempts}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      maxAttempts: e.target.value,
                    })
                  }
                  className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Assignment Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the assignment objectives, learning outcomes, and requirements..."
                  className="min-h-[200px] border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  value={assignmentForm.description}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Problem Selection */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Select Problems *
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Choose coding problems for this assignment
                </p>
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
                {DSA_Problems.map((problem) => (
                  <div
                    key={problem.id}
                    className={cn(
                      "flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                      assignmentForm.selectedProblems.includes(problem.id)
                        ? "border-blue-300 bg-blue-50/50 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                    )}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest("input")) {
                        return;
                      }
                      toggleProblemSelection(problem.id);
                    }}
                  >
                    <Checkbox
                      checked={assignmentForm.selectedProblems.includes(
                        problem.id
                      )}
                      onCheckedChange={() => toggleProblemSelection(problem.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {problem.title}
                        </h4>
                        <Badge
                          className={cn(
                            "text-xs font-medium",
                            getDifficultyColor(problem.difficulty)
                          )}
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {problem.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.slice(0, 4).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-slate-50 border-slate-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {problem.tags.length > 4 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-slate-50 border-slate-200"
                          >
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
  );
};

export default CreateAssignment;
