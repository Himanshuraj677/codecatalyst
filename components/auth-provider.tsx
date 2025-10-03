"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { currentUser, mockUsers, type User } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser)
  const router = useRouter()

  const login = async (email: string, password: string) => {
    // Mock login logic - find user by email
    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      router.push("/dashboard")
    }
  }

  const logout = () => {
    setUser(null)
    router.push("/login")
  }

  const switchRole = () => {
    if (user) {
      const newRole = user.role === "student" ? "teacher" : "student"
      const newUser = mockUsers.find((u) => u.role === newRole)
      if (newUser) {
        setUser(newUser)
        router.push("/dashboard")
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
