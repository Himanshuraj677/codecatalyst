import { useEffect, useState } from "react";
import { Code2, Plus, Save, Eye, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MarkdownEditor } from "./MarkdownEditor";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { toast } from "react-toastify";
import { Checkbox } from "./ui/checkbox";

type TestCase = {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
};

function CreateProblem() {
  const [problemForm, setProblemForm] = useState({
    title: "",
    description: "",
    difficulty: "",
    categoryId: "",
    tags: [] as string[],
    timeLimit: "",
    memoryLimit: "",
    constraints: [] as string[],
    teacherSolution: "",
    teacherSolutionLanguageId: "",
    testCases: [] as TestCase[],
  });

  const [categories, setCategories] = useState(
    [] as { id: string; name: string }[]
  );
  const [newTag, setNewTag] = useState("");
  const [newConstraint, setNewConstraint] = useState("");
  const [newTestCase, setNewTestCase] = useState<TestCase>({
    input: "",
    expectedOutput: "",
    isHidden: false,
  });
  const [languages, setLanguages] = useState(
    [] as { id: string; name: string }[]
  );

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const [categoriesRes, languagesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/judge0/languages`),
        ]);

        const [categoriesData, languagesData] = await Promise.all([
          categoriesRes.json(),
          languagesRes.json(),
        ]);

        if (categoriesRes.ok && categoriesData?.success) {
          setCategories(categoriesData.data);
        } else {
          console.error("Failed to load categories:", categoriesData?.message);
        }

        if (languagesRes.ok && languagesData?.success) {
          setLanguages(languagesData.data);
        } else {
          console.error("Failed to load languages:", languagesData?.message);
        }
      } catch (error) {
        console.error("Error fetching categories or languages:", error);
      }
    };

    initialFetch();
  }, []);

  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...problemForm,
          timeLimit: Number(problemForm.timeLimit),
          memoryLimit: Number(problemForm.memoryLimit),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to create problem");
        return;
      }
      toast.success("Problem created successfully!");
      setProblemForm({
        title: "",
        description: "",
        difficulty: "",
        tags: [],
        timeLimit: "",
        memoryLimit: "",
        constraints: [],
        categoryId: "",
        teacherSolution: "",
        teacherSolutionLanguageId: "",
        testCases: [],
      });
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error("Error creating problem");
    }
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

  const addTestCase = () => {
    if (newTestCase.input.trim() && newTestCase.expectedOutput.trim()) {
      setProblemForm({
        ...problemForm,
        testCases: [...problemForm.testCases, newTestCase],
      });
      setNewTestCase({ input: "", expectedOutput: "", isHidden: false });
    } else {
      toast.error("Please fill both input and expected output for test case");
    }
  };

  const removeTestCase = (index: number) => {
    setProblemForm({
      ...problemForm,
      testCases: problemForm.testCases.filter((_, i) => i !== index),
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
              {/* Title */}
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

              {/* Difficulty & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">
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
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Category *
                  </Label>
                  <Select
                    value={problemForm.categoryId}
                    onValueChange={(value) =>
                      setProblemForm({ ...problemForm, categoryId: value })
                    }
                    required
                  >
                    <SelectTrigger className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-xl">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time & Memory Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Time Limit (seconds) *</Label>
                  <Input
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
                  <Label>Memory Limit (MB) *</Label>
                  <Input
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
                <Label>Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyUp={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
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
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3 ml-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div className="space-y-3">
                <Label>Constraints</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a constraint"
                    value={newConstraint}
                    onChange={(e) => setNewConstraint(e.target.value)}
                    onKeyUp={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addConstraint())
                    }
                    className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    onClick={addConstraint}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {problemForm.constraints.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <span>{c}</span>
                      <button
                        onClick={() => removeConstraint(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Original Solution */}
              <div className="space-y-3">
                <Label>Original Solution *</Label>
                <Select
                  value={problemForm.teacherSolutionLanguageId}
                  onValueChange={(value) =>
                    setProblemForm({ ...problemForm, teacherSolutionLanguageId: value })
                  }
                  required
                >
                  <SelectTrigger className="h-12 border-0 bg-slate-50 rounded-xl">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-0 shadow-xl">
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id.toString()}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <textarea
                  value={problemForm.teacherSolution}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      teacherSolution: e.target.value,
                    })
                  }
                  placeholder="Write the solution here"
                  className="w-full h-40 p-2 border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-3">
                <Label>Problem Description *</Label>
                <MarkdownEditor
                  content={problemForm.description}
                  setContent={(value) =>
                    setProblemForm({ ...problemForm, description: value })
                  }
                />
              </div>

              {/* Test Cases */}
              <div className="space-y-3">
                <Label>Test Cases</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Input"
                    value={newTestCase.input}
                    onChange={(e) =>
                      setNewTestCase({ ...newTestCase, input: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Expected Output"
                    value={newTestCase.expectedOutput}
                    onChange={(e) =>
                      setNewTestCase({
                        ...newTestCase,
                        expectedOutput: e.target.value,
                      })
                    }
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={newTestCase.isHidden}
                      onCheckedChange={(checked) =>
                        setNewTestCase({ ...newTestCase, isHidden: !!checked })
                      }
                    />
                    <span className="text-sm">Hidden</span>
                    <Button
                      type="button"
                      onClick={addTestCase}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  {problemForm.testCases.map((tc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <span className="text-sm">{`Input: ${
                        tc.input
                      } | Output: ${tc.expectedOutput} ${
                        tc.isHidden ? "(Hidden)" : ""
                      }`}</span>
                      <button
                        onClick={() => removeTestCase(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Problem
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProblem;