import { useState } from "react";
import { Code2, Plus, Save, Eye, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { toast } from "react-toastify";

function CreateProblem() {
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
  });

  const [newTag, setNewTag] = useState("");
  const [newConstraint, setNewConstraint] = useState("");

  const handleProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating problem:", problemForm);
    toast.success("Problem created successfully!");

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
    });
  };

  const addTag = () => {
    if (newTag.trim() && !problemForm.tags.includes(newTag.trim())) {
      setProblemForm({
        ...problemForm,
        tags: [...problemForm.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProblemForm({
      ...problemForm,
      tags: problemForm.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const addConstraint = () => {
    if (newConstraint.trim()) {
      setProblemForm({
        ...problemForm,
        constraints: [...problemForm.constraints, newConstraint.trim()],
      });
      setNewConstraint("");
    }
  };

  const removeConstraint = (index: number) => {
    setProblemForm({
      ...problemForm,
      constraints: problemForm.constraints.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 border-b border-emerald-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Create Problem
            </h2>
            <p className="text-slate-600 mt-1">
              Design a new coding challenge for the problem set
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleProblemSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="problemTitle"
                  className="text-sm font-semibold text-slate-700"
                >
                  Problem Title *
                </Label>
                <Input
                  id="problemTitle"
                  placeholder="e.g., Two Sum Challenge"
                  value={problemForm.title}
                  onChange={(e) =>
                    setProblemForm({ ...problemForm, title: e.target.value })
                  }
                  className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="difficulty"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Difficulty *
                  </Label>
                  <Select
                    value={problemForm.difficulty}
                    onValueChange={(value) =>
                      setProblemForm({ ...problemForm, difficulty: value })
                    }
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
                  <Label
                    htmlFor="category"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Category *
                  </Label>
                  <Input
                    id="category"
                    placeholder="e.g., Arrays"
                    value={problemForm.category}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        category: e.target.value,
                      })
                    }
                    className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="timeLimit"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Time Limit (seconds) *
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    placeholder="1"
                    value={problemForm.timeLimit}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        timeLimit: e.target.value,
                      })
                    }
                    className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="memoryLimit"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Memory Limit (MB) *
                  </Label>
                  <Input
                    id="memoryLimit"
                    type="number"
                    placeholder="256"
                    value={problemForm.memoryLimit}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        memoryLimit: e.target.value,
                      })
                    }
                    className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Tags
                </Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
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
                <Label
                  htmlFor="problemDescription"
                  className="text-sm font-semibold text-slate-700"
                >
                  Problem Description *
                </Label>
                <Textarea
                  id="problemDescription"
                  placeholder="Describe the problem statement clearly and concisely..."
                  className="min-h-[120px] border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                  value={problemForm.description}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="sampleInput"
                  className="text-sm font-semibold text-slate-700"
                >
                  Sample Input *
                </Label>
                <Textarea
                  id="sampleInput"
                  placeholder="Provide sample input..."
                  className="min-h-[80px] font-mono text-sm border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                  value={problemForm.sampleInput}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      sampleInput: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="sampleOutput"
                  className="text-sm font-semibold text-slate-700"
                >
                  Sample Output *
                </Label>
                <Textarea
                  id="sampleOutput"
                  placeholder="Provide expected output..."
                  className="min-h-[80px] font-mono text-sm border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                  value={problemForm.sampleOutput}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      sampleOutput: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="explanation"
                  className="text-sm font-semibold text-slate-700"
                >
                  Explanation
                </Label>
                <Textarea
                  id="explanation"
                  placeholder="Explain the solution approach..."
                  className="min-h-[60px] border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none"
                  value={problemForm.explanation}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      explanation: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-slate-700">
              Constraints
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a constraint"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addConstraint())
                }
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
  );
}

export default CreateProblem;
