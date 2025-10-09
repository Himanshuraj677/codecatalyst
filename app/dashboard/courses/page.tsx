"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Users,
  Calendar,
  Search,
  Plus,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CoursesPage() {
  const { user, isLoading } = useUser();
  const [isFetching, setIsFetching] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  

  const [searchTerm, setSearchTerm] = useState("");
  // const courses = getUserCourses(user!.id, user!.role)
  useEffect(() => {
    const controller = new AbortController();
    const fetchCourses = async () => {
      try {
        setIsFetching(true);
        const res = await fetch("/api/course", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.message || "Unable to fetch courses");
          return;
        }
        setCourses(data.data); // assuming your API returns { success, data }
      } catch (err) {
        let errorMessage = "";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full">
        <div className="">I am loading</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                  {user?.role === "teacher" ? "My Courses" : "Enrolled Courses"}
                </h1>
                <p className="text-lg text-slate-600">
                  {user?.role === "teacher"
                    ? "Manage your courses and track student progress"
                    : "Access your enrolled courses and assignments"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {user?.role === "teacher" && (
                  <Link href="/dashboard/create">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </Link>
                )}
                <div className="hidden lg:flex items-center space-x-2 text-slate-600">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">
                    {filteredCourses.length} courses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Search courses or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
              <div className="group bg-white rounded-2xl border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Course Header */}
                <div className="relative p-6 pb-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-7 w-7 text-white" />
                      </div>
                      {user?.role === "teacher" && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 font-mono text-xs"
                        >
                          {course.joinCode}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Users className="h-4 w-4" />
                        <span>{course.studentCount} students</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="px-6 pb-6">
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {course.instructor}
                      </p>
                      <p className="text-xs text-slate-600">Instructor</p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No courses found
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms to find the courses you're looking for."
                : user?.role === "teacher"
                ? "Create your first course to get started with teaching on our platform."
                : "You are not enrolled in any courses yet. Join a course to get started!"}
            </p>
            {user?.role === "teacher" && !searchTerm && (
              <Link href="/dashboard/create">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </Link>
            )}
            {user?.role === "student" && !searchTerm && (
              <Link href="/dashboard/join-course">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Join a Course
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
