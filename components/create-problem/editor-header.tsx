import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Send } from "lucide-react";

type EditorHeaderProps = {
  languageId: string;
  setLanguageId: (id: string) => void;
  isRunning: boolean;
  handleRunCode: () => void;
  isSubmitting: boolean;
  handleSubmit: () => void;
  languages: { id: string; name: string }[];
}

const EditorHeader = ({ languageId, setLanguageId, isRunning, handleRunCode, isSubmitting, handleSubmit, languages }: EditorHeaderProps) => {
  return (
    <div className="border-b border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={languageId} onValueChange={setLanguageId}>
            <SelectTrigger className="w-40 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
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
  );
};

export default EditorHeader;