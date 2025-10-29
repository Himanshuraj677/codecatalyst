import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  History,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Code2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarkdownPreview } from "@/components/MarkdownEditor";
import { Card, CardContent } from "@/components/ui/card";

type LeftPanelProps = {
  problem: Record<string, any>;
  userSubmissions: Record<string, any>[];
};

const LeftPanel = ({ problem, userSubmissions }: LeftPanelProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "text-green-600";
      case "WrongAnswer":
        return "text-red-600";
      case "Pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  
  const [activeTab, setActiveTab] = useState<string>("description");
  
  useEffect(() => {
    setActiveTab("submissions");
  }, [userSubmissions]);

  return (
    <div className="h-full bg-white border-r border-slate-200">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
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

        <TabsContent value="description" className="p-6 space-y-6 m-0">
          <div>
            <h3 className="text-lg font-semibold mb-3">Problem Statement</h3>
            <div className="prose prose-slate max-w-none">
              <MarkdownPreview content={problem.description} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag: string) => (
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
                <Card key={submission.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {submission.status === "Accepted" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : submission.status === "WrongAnswer" ? (
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
                      <Badge variant="outline">{submission.language}</Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p>
                        Submitted{" "}
                        {new Date(submission.createdAt).toLocaleString()}
                      </p>
                      {submission.executionTime && (
                        <p>
                          Runtime: {submission.executionTime}ms | Memory:{" "}
                          {submission.memoryUsed}MB
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
      </Tabs>
    </div>
  );
};

export default LeftPanel;
