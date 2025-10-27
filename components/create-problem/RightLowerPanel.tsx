"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface RightLowerPanelProps {
  testResults: any[] | null;
  testSummary: any | null;
  customTestcases: { input: string }[];
  setCustomTestcases: React.Dispatch<React.SetStateAction<{ input: string }[]>>;
  handleRunCode: () => void;
  isRunning: boolean;
}

const RightLowerPanel: React.FC<RightLowerPanelProps> = ({
  testResults,
  testSummary,
  customTestcases,
  setCustomTestcases,
  handleRunCode,
  isRunning,
}) => {
  // Add a new custom test case
  const addTestcase = () =>
    setCustomTestcases((prev) => [...prev, { input: "" }]);

  // Update testcase value
  const updateTestcase = (index: number, value: string) =>
    setCustomTestcases((prev) => {
      const updated = [...prev];
      updated[index].input = value;
      return updated;
    });

  // Delete a custom test case
  const deleteTestcase = (index: number) =>
    setCustomTestcases((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="h-full flex flex-col border-t bg-white">
      <Tabs defaultValue="results" className="flex flex-col h-full">
        {/* Top Tabs */}
        <TabsList className="border-b bg-slate-100 px-4 py-2">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="custom">Custom Testcase</TabsTrigger>
        </TabsList>

        {/* 🧪 Results Tab */}
        <TabsContent
          value="results"
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {!testResults ? (
            <div className="text-center text-gray-500 mt-6">
              Run the code to view results.
            </div>
          ) : (
            <>
              {/* Summary Section */}
              {testSummary && (
                <Card className="border border-slate-200 bg-slate-50">
                  <CardContent className="flex flex-wrap gap-6 py-4 text-sm">
                    <div>
                      <span className="font-semibold text-green-600">
                        {testSummary.passedCount}/{testSummary.totalCount}
                      </span>{" "}
                      Passed
                    </div>
                    <div>Time: {testSummary.totalTime}</div>
                    <div>Memory: {testSummary.totalMemory}</div>
                    <div>Accuracy: {testSummary.percentagePassed}</div>
                  </CardContent>
                </Card>
              )}

              {/* Test Cases List */}
              <div className="space-y-3">
                {testResults.map((tc, i) => (
                  <Card
                    key={i}
                    className={cn(
                      "border rounded-lg transition-all",
                      tc.passed
                        ? "border-green-400 bg-green-50"
                        : "border-red-400 bg-red-50"
                    )}
                  >
                    <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
                      <CardTitle className="text-sm font-medium">
                        Test Case {i + 1}
                      </CardTitle>
                      <Badge
                        variant={tc.passed ? "success" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {tc.passed ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Wrong
                          </>
                        )}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm p-4 pt-0">
                      <div>
                        <strong>Input:</strong>
                        <pre className="bg-slate-100 p-2 rounded-md whitespace-pre-wrap">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <strong>Expected:</strong>
                        <pre className="bg-slate-100 p-2 rounded-md whitespace-pre-wrap">
                          {tc.expected}
                        </pre>
                      </div>
                      <div>
                        <strong>Output:</strong>
                        <pre className="bg-slate-100 p-2 rounded-md whitespace-pre-wrap">
                          {tc.output}
                        </pre>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Time: {tc.time}s</span>
                        <span>Memory: {tc.memory} KB</span>
                        <span>Status: {tc.status}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* ✏️ Custom Testcase Tab */}
        <TabsContent
          value="custom"
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div className="space-y-4">
            {customTestcases.map((tc, i) => (
              <Card key={i} className="border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
                  <CardTitle className="text-sm font-medium">
                    Custom Testcase {i + 1}
                  </CardTitle>
                  <button
                    onClick={() => deleteTestcase(i)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </CardHeader>
                <CardContent>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Input
                  </label>
                  <Input
                    value={tc.input}
                    onChange={(e) => updateTestcase(i, e.target.value)}
                    placeholder="Enter input..."
                    className="text-sm"
                  />
                </CardContent>
              </Card>
            ))}
            <Button
              onClick={addTestcase}
              variant="outline"
              className="w-full border-dashed"
            >
              + Add Testcase
            </Button>
          </div>

          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className="w-full mt-4"
          >
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightLowerPanel;
