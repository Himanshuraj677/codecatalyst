import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from 'react-toastify';
import { UserProvider } from "./context/userContext" 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeCampus - College Coding Platform",
  description: "A modern coding assignment platform for colleges",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
          <ToastContainer />
        </UserProvider>
      </body>
    </html>
  )
}
