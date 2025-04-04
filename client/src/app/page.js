"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isAdminLoggedIn, isStudentLoggedIn, getCurrentUser, getInitials } from "@/utils/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import AuthCheck from "@/components/auth-check"

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    
    // Check auth status
    const adminLoggedIn = isAdminLoggedIn()
    const studentLoggedIn = isStudentLoggedIn()
    
    setIsAdmin(adminLoggedIn)
    setIsStudent(studentLoggedIn)
    
    if (adminLoggedIn || studentLoggedIn) {
      setCurrentUser(getCurrentUser())
    }
  }, [])
  
  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token")
    localStorage.removeItem("admin_token")
    localStorage.removeItem("studentProfile")
    localStorage.removeItem("adminProfile")
    
    // Reset state
    setCurrentUser(null)
    setIsAdmin(false)
    setIsStudent(false)
    
    // Force refresh
    window.location.reload()
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="w-full p-4 flex justify-end space-x-3">
        {isClient ? (
          <>
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={currentUser.name} />
                    <AvatarFallback className="bg-slate-800 text-slate-100">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-700 font-medium">{currentUser.name}</span>
                </div>
                
                <Link 
                  href={isAdmin ? "/admin" : "/profile"}
                  className="inline-flex items-center justify-center rounded-md text-slate-700 border border-slate-300 hover:bg-slate-100 px-4 py-2 text-sm"
                >
                  {isAdmin ? "Admin Dashboard" : "My Profile"}
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/admin/register" 
                  className="inline-flex items-center justify-center rounded-md text-slate-700 border border-slate-300 hover:bg-slate-100 px-4 py-2 text-sm"
                >
                  Admin Register
                </Link>
                <Link 
                  href="/admin/login" 
                  className="inline-flex items-center justify-center rounded-md text-slate-700 border border-slate-300 hover:bg-slate-100 px-4 py-2 text-sm"
                >
                  Admin Login
                </Link>
              </>
            )}
          </>
        ) : null}
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-slate-800">
            Welcome to Connection-Folio
          </h1>
          <p className="text-xl text-slate-700">Connect with your batch mates and manage your academic profile</p>
          
          {isClient && !currentUser && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center rounded-md text-white bg-slate-800 hover:bg-slate-700 px-8 py-3 text-lg"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center rounded-md border border-slate-800 text-slate-800 hover:bg-slate-50 px-8 py-3 text-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
          
          {isClient && currentUser && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <p className="text-slate-700">
                You are logged in as {isAdmin ? "an administrator" : "a student"}.
              </p>
              <Link 
                href={isAdmin ? "/admin" : "/profile"}
                className="inline-flex items-center justify-center rounded-md text-white bg-slate-800 hover:bg-slate-700 px-8 py-3 text-lg"
              >
                Go to {isAdmin ? "Admin Dashboard" : "My Profile"}
              </Link>
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-slate-600 border-t border-slate-200">
        <p>© {new Date().getFullYear()} Connection-Folio. All rights reserved.</p>
      </footer>
    </div>
  )
}

