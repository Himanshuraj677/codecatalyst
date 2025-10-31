"use client";

import { useState, useRef, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useUser } from "@/hooks/useUser";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { judge0ToMonaco } from "@/lib/judge0-to-monaco";
import Header from "@/components/create-problem/page-header";
import EditorHeader from "@/components/create-problem/editor-header";
import LeftPanel from "@/components/create-problem/LeftPanel";
import RightLowerPanel from "@/components/create-problem/RightLowerPanel";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function ProblemPage() {
  const { user, isLoading } = useUser();
  const [problem, setProblem] = useState<any>();
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);

  const params = useParams();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");
  const problemId = params.problemId as string;
  const editorRef = useRef<any>(null);

  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState("52");
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // testResults is an array (based on the response you showed)
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [testSummary, setTestSummary] = useState<any>(null);

  // Custom testcases state (you asked for one test case section — support multiple)
  const [customTestcases, setCustomTestcases] = useState<{ input: string }[]>(
    []
  );

  const selectedLangName =
    languages.find((lang) => lang.id === languageId)?.name || "Plain Text";

  const shortName = selectedLangName.split(" ")[0];

  const monacoLang = judge0ToMonaco[shortName] || "plaintext";

  useEffect(() => {
    const fetchProblemData = async () => {
      setIsFetching(true);
      try {
        const [problemData, userSubmissionsData, languageData] =
          await Promise.all([
            fetch(`/api/problems/${problemId}`).then((res) => res.json()),
            fetch(`/api/submissions/${problemId}`).then((res) => res.json()),
            fetch(`/api/judge0/languages`).then((res) => res.json()),
          ]);
        setProblem(problemData.data);
        console.log("Fetched Problem Data:", problemData.data);
        setUserSubmissions(userSubmissionsData.data);
        setLanguages(languageData.data);
      } catch (error) {
        toast.error("Failed to fetch problem data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProblemData();
  }, [problemId]);

  const handleRunCode = async () => {
    try {
      setIsRunning(true);

      // build testCases: include original problem testcases (if any) + the custom ones
      const original = Array.isArray(problem.testCases)
        ? problem.testCases.map((tc: any) => ({ input: tc.input }))
        : [];

      const custom = customTestcases.map((t) => ({ input: t.input }));

      const testCases = [...original, ...custom];

      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, languageId, problemId, testCases }),
      });
      if (!res.ok) {
        toast.error("Failed to run code");
        setIsRunning(false);
        return;
      }
      const data = await res.json();

      setTestResults(Array.isArray(data.results) ? data.results : null);
      setTestSummary(data.summary ?? null);
    } catch (error) {
      toast.error("Failed to run code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload: any = { code, languageId, problemId };
      if (assignmentId) {
        payload.assignmentId = assignmentId;
      }
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast.error("Submission failed");
        return;
      }
      const result = await res.json();
      if (result.summary.status === "Accepted") {
        toast.success(`Submission successful - All test cases passed!`);
      } else {
        toast.error(`${result.summary.status} - Try again!`);
      }
      setUserSubmissions((prev) => [
        ...prev,
        { id: result.summary.submissionId, status: result.summary.status, problemId, languageId, executionTime: result.summary.totalTime, memoryUsed: result.summary.totalMemory, createdAt: result.summary.createdAt },
      ]);
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false); 
    }
  };

  const isSolved = userSubmissions.some((s) => s.status === "Accepted");

  if (isLoading || isFetching) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <h3 className="text-lg font-medium text-gray-900 mt-4">Loading...</h3>
        </div>
      </div>
    );
  }

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

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <Header isSolved={isSolved} problem={problem} />
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Problem Description Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <LeftPanel problem={problem} userSubmissions={userSubmissions} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Editor Header */}
              <ResizablePanel defaultSize={80} minSize={50}>
                <EditorHeader
                  languageId={languageId}
                  setLanguageId={setLanguageId}
                  isRunning={isRunning}
                  handleRunCode={handleRunCode}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  languages={languages}
                />
                {/* Monaco Editor */}
                <MonacoEditor
                  height="100%"
                  language={monacoLang}
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
              </ResizablePanel>
              <ResizableHandle
                withHandle
                className="!h-1 bg-gray-200 hover:bg-gray-400"
              />
              {/* Right Lower Panel */}
              <ResizablePanel defaultSize={20} minSize={10}>
                <RightLowerPanel
                  testResults={testResults}
                  testSummary={testSummary}
                  customTestcases={customTestcases}
                  setCustomTestcases={setCustomTestcases}
                  handleRunCode={handleRunCode}
                  isRunning={isRunning}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
