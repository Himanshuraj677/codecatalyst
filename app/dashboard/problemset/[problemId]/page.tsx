"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Clock,
  MemoryStick,
  Tag,
  Play,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Code2,
  FileText,
  TestTube,
  History,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const languageTemplates = {
  python: `def solution():
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
  javascript: `function solution() {
    // Write your solution here
    
}

// Test your solution
console.log(solution());`,
  java: `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println(sol.solution());
    }
    
    public int solution() {
        // Write your solution here
        return 0;
    }
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int solution() {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    cout << sol.solution() << endl;
    return 0;
}`,
};

export default function ProblemPage() {
  const { user, isLoading } = useUser();
  const [problem, setProblem] = useState<any>();
  const [problemSubmissions, setProblemSubmissions] = useState<any[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);

  const params = useParams();
  const problemId = params.problemId as string;
  const editorRef = useRef<any>(null);

  // problem = getProblemById(problemId)
  // problemSubmissions = getProblemSubmissions(problemId)
  // userSubmissions = getUserSubmissions(user!.id).filter((s) => s.problemId === problemId)

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {

  }, []);

  useEffect(() => {
    if (
      language &&
      languageTemplates[language as keyof typeof languageTemplates]
    ) {
      setCode(languageTemplates[language as keyof typeof languageTemplates]);
    }
  }, [language]);

  if (!problem) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Problem not found
          </h3>
        </div>
      </div>
    );
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab("console");

    // Mock code execution
    setTimeout(() => {
      const mockResults = {
        success: Math.random() > 0.3,
        output: Math.random() > 0.3 ? problem.sampleOutput : "Wrong output",
        executionTime: Math.floor(Math.random() * 100) + 50,
        memoryUsed: Math.floor(Math.random() * 50) + 10,
        testCasesPassed: Math.floor(Math.random() * 3) + 1,
        totalTestCases: 3,
      };

      setTestResults(mockResults);
      setIsRunning(false);

      if (mockResults.success) {
        toast.success("Code executed successfully!");
      } else {
        toast.error("Test cases failed");
      }
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Mock submission
    setTimeout(() => {
      const results = [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
      ];
      const result = results[Math.floor(Math.random() * results.length)];

      setIsSubmitting(false);

      if (result === "Accepted") {
        toast.success("Solution Accepted! 🎉");
      } else {
        toast.error(`${result} - Try again!`);
      }
    }, 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "text-green-600";
      case "Wrong Answer":
        return "text-red-600";
      case "Pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <h3 className="text-lg font-medium text-gray-900 mt-4">Loading...</h3>
        </div>
      </div>
    );
  }

  const isSolved = userSubmissions.some((s) => s.status === "Accepted");

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isSolved && (
                <div className="p-1 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
              <h1 className="text-2xl font-bold text-slate-900">
                {problem.title}
              </h1>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{problem.timeLimit}s</span>
              </div>
              <div className="flex items-center space-x-1">
                <MemoryStick className="h-4 w-4" />
                <span>{problem.memoryLimit}MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Problem Description Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full bg-white border-r border-slate-200">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full flex flex-col"
              >
                <div className="border-b border-slate-200 px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger
                      value="description"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="submissions"
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Submissions ({userSubmissions.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto">
                  <TabsContent
                    value="description"
                    className="p-6 space-y-6 m-0"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Problem Statement
                      </h3>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {problem.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Example</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">
                            Input:
                          </h4>
                          <pre className="bg-slate-100 p-3 rounded-lg text-sm font-mono text-slate-800 overflow-x-auto">
                            {problem.sampleInput}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">
                            Output:
                          </h4>
                          <pre className="bg-slate-100 p-3 rounded-lg text-sm font-mono text-slate-800 overflow-x-auto">
                            {problem.sampleOutput}
                          </pre>
                        </div>
                        {problem.explanation && (
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">
                              Explanation:
                            </h4>
                            <p className="text-slate-700">
                              {problem.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Constraints
                      </h3>
                      <ul className="space-y-1">
                        {problem.constraints.map((constraint, index) => (
                          <li key={index} className="text-slate-700 text-sm">
                            • {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-slate-300 text-slate-600"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="submissions" className="p-6 m-0">
                    <div className="space-y-4">
                      {userSubmissions.length > 0 ? (
                        userSubmissions.map((submission) => (
                          <Card
                            key={submission.id}
                            className="border-slate-200"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {submission.status === "Accepted" ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : submission.status === "Wrong Answer" ? (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  )}
                                  <span
                                    className={`font-medium ${getStatusColor(
                                      submission.status
                                    )}`}
                                  >
                                    {submission.status}
                                  </span>
                                </div>
                                <Badge variant="outline">
                                  {submission.language}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-600">
                                <p>
                                  Submitted{" "}
                                  {new Date(
                                    submission.submittedAt
                                  ).toLocaleString()}
                                </p>
                                {submission.executionTime && (
                                  <p>
                                    Runtime: {submission.executionTime}ms |
                                    Memory: {submission.memoryUsed}MB
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Code2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-900 mb-2">
                            No submissions yet
                          </h3>
                          <p className="text-slate-600">
                            Submit your first solution to see it here
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col bg-white">
              {/* Editor Header */}
              <div className="border-b border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-40 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="border-slate-200 bg-transparent"
                    >
                      {isRunning ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <MonacoEditor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    glyphMargin: false,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>

              {/* Console/Results */}
              {(testResults || isRunning) && (
                <div className="border-t border-slate-200 bg-slate-50">
                  <Tabs value="console" className="h-48">
                    <div className="border-b border-slate-200 px-4">
                      <TabsList className="bg-transparent">
                        <TabsTrigger
                          value="console"
                          className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                        >
                          <TestTube className="h-4 w-4 mr-2" />
                          Console
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent
                      value="console"
                      className="p-4 h-40 overflow-auto m-0"
                    >
                      {isRunning ? (
                        <div className="flex items-center space-x-2 text-slate-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span>Running your code...</span>
                        </div>
                      ) : testResults ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            {testResults.success ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span
                              className={`font-medium ${
                                testResults.success
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {testResults.success
                                ? "Test Passed"
                                : "Test Failed"}
                            </span>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="text-sm">
                              <div className="mb-2">
                                <span className="font-medium">Output:</span>
                                <pre className="mt-1 text-slate-700 font-mono">
                                  {testResults.output}
                                </pre>
                              </div>
                              <div className="flex items-center space-x-4 text-slate-600">
                                <span>
                                  Runtime: {testResults.executionTime}ms
                                </span>
                                <span>Memory: {testResults.memoryUsed}MB</span>
                                <span>
                                  Test Cases: {testResults.testCasesPassed}/
                                  {testResults.totalTestCases}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
