import Link from "next/link"
import { LogOut } from "lucide-react"

export function Navbar() {
  return (
    <header className="px-4 w-full h-16 border-b border-slate-200 bg-white">
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-slate-800"></div>
          <span className="text-xl font-bold text-slate-800">Connection-Folio</span>
        </Link>

        <Link href="/login" className="flex items-center text-slate-700 text-sm px-3 py-2 rounded-md hover:bg-slate-100">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Link>
      </div>
    </header>
  )
}

