"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/utils/auth"
import AnnouncementButton from "./announcement-button"

export function Navbar() {
  const router = useRouter()
  
  const handleLogout = () => {
    // Use our utility function to log out
    logoutUser()
    
    // Redirect to home page
    router.push("/")
  }
  
  return (
    <header className="px-4 w-full h-16 border-b border-slate-200 bg-white">
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-slate-800"></div>
          <span className="text-xl font-bold text-slate-800">Connection-Folio</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <AnnouncementButton />
          <button 
            onClick={handleLogout}
            className="cursor-pointer flex items-center text-slate-700 text-sm px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

