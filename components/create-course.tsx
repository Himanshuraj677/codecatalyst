"use client";

import { useState } from "react";
import { BookOpen, Eye, Save, Users } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { User } from "@/app/context/userContext";
import { toast } from "react-toastify";
import { MarkdownEditor } from "./MarkdownEditor";
import { generateJoinCode } from "@/lib/generateJoinCode";

function CreateCourse({ user }: { user: User }) {
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    joinCode: "",
  });
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Creating course:", courseForm);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Failed to create resource");
        return;
      }
      toast.success("Course created successfully!");
      setCourseForm({
        name: "",
        description: "",
        joinCode: "",
      });
    } catch (error) {
      let errorMessage = "Unknown error occured";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const generateNewJoinCode = () => {
    const code = generateJoinCode();
    setCourseForm({ ...courseForm, joinCode: code });
  };
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 border-b border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500 rounded-xl text-white shadow-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create Course</h2>
            <p className="text-slate-600 mt-1">
              Set up a new course and invite students to join
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleCourseSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="courseName"
                  className="text-sm font-semibold text-slate-700"
                >
                  Course Name *
                </Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Advanced Data Structures & Algorithms"
                  value={courseForm.name}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, name: e.target.value })
                  }
                  className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="joinCode"
                  className="text-sm font-semibold text-slate-700"
                >
                  Join Code *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="joinCode"
                    placeholder="Course join code"
                    value={courseForm.joinCode}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, joinCode: e.target.value })
                    }
                    className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateNewJoinCode}
                    className="h-12 px-4 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-semibold transition-all duration-200"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-sm text-slate-600">
                  Students will use this code to join your course
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="courseDescription"
                  className="text-sm font-semibold text-slate-700"
                >
                  Course Description *
                </Label>
                <MarkdownEditor
                  content={courseForm.description}
                  setContent={(value) =>
                    setCourseForm({ ...courseForm, description: value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg text-white">
                <Eye className="h-4 w-4" />
              </div>
              <h4 className="font-semibold text-purple-900">Course Preview</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-700">Name:</span>
                <span className="text-slate-600">
                  {courseForm.name || "Course name will appear here"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-700">Join Code:</span>
                <span className="text-slate-600 font-mono bg-white px-2 py-1 rounded border">
                  {courseForm.joinCode || "Generated code will appear here"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-slate-700">Instructor:</span>
                <span className="text-slate-600">{user?.name}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium text-slate-700">Description:</span>
                <span className="text-slate-600">
                  {courseForm.description ||
                    "Course description will appear here"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Course
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 border-2 border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-semibold transition-all duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Add Students
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
