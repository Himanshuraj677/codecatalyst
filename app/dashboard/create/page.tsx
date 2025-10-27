"use client";

import type React from "react";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Code2, Sparkles } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import CreateCourse from "@/components/create-course";
import CreateProblem from "@/components/create-problem";
import CreateAssignment from "@/components/create-assignment";

export default function CreatePage() {
  const { user, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState("assignment");

  if (isLoading) {
    return <div className="">I am Loading</div>;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="p-6 space-y-8">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Create Content</h1>
              <p className="text-blue-100 text-lg font-medium">
                Design engaging assignments, problems, and courses for your
                students
              </p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1 rounded-2xl">
            <TabsTrigger
              value="assignment"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              Assignment
            </TabsTrigger>
            <TabsTrigger
              value="problem"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-200"
            >
              <Code2 className="h-4 w-4 mr-2" />
              Problem
            </TabsTrigger>
            <TabsTrigger
              value="course"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Course
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignment">
            {user && <CreateAssignment user={user} />}
          </TabsContent>

          <TabsContent value="problem">
            <CreateProblem />
          </TabsContent>

          <TabsContent value="course">
            {user && <CreateCourse user={user} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
