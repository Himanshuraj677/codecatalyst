"use client"
import { useUser } from "@/hooks/useUser"
import TeacherDashboard from "@/components/teacher-dashboard"
import StudentDashboard from "@/components/student-dashboard"


export default function DashboardPage() {
  const { user, isLoading } = useUser()
  if (isLoading) {
    return (
      <div className="w-full h-full">
        <div className="">I am loading</div>
      </div>
    );
  }

  if (user?.role === "teacher") {
    return <TeacherDashboard user={user} />
  }

  if (user?.role === "user") return <StudentDashboard user={user} />;
  return <div className="p-6">Unauthorized</div>;
}
