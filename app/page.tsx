import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard - in real app, check auth status
  redirect("/dashboard")
}
