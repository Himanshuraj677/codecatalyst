import React from "react";
import { CheckCircle, Clock, MemoryStick } from "lucide-react";
import { Badge } from "@/components/ui/badge";
type HeaderProps = {
  isSolved: boolean;
  problem: {
    title: string;
    difficulty: string;
    timeLimit: number;
    memoryLimit: number;
  };
};

const Header = ({ isSolved, problem }: HeaderProps) => {
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
  return (
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
  );
};

export default Header;
