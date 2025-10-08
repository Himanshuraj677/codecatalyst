"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, FileText, Send, Plus, BarChart3, ChevronLeft, ChevronRight, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/useUser"

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/problemset", label: "Problem Set", icon: Code2 },
  { href: "/dashboard/assignments", label: "Assignments", icon: FileText },
  { href: "/dashboard/submissions", label: "Submissions", icon: Send },
  { href: "/dashboard/join-course", label: "Join Course", icon: Plus },
]

const teacherNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/problemset", label: "Problem Set", icon: Code2 },
  { href: "/dashboard/create", label: "Create", icon: Plus },
  { href: "/dashboard/submissions", label: "All Submissions", icon: Send },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useUser();

  const navItems = user?.role === "teacher" ? teacherNavItems : studentNavItems

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-md z-10 hover:shadow-lg transition-shadow"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-11 transition-all duration-200",
                    collapsed && "px-2",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border-l-2 border-blue-500 shadow-sm"
                      : "hover:bg-slate-100 text-slate-700",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Quick Actions</div>
          {user?.role === "teacher" ? (
            <Link href="/dashboard/create">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/join-course">
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Join Course
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
