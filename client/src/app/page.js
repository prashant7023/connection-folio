import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="w-full p-4 flex justify-end">
        <Link 
          href="/admin/login" 
          className="inline-flex items-center justify-center rounded-md text-slate-700 border border-slate-300 hover:bg-slate-100 px-4 py-2 text-sm"
        >
          Admin Login
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-slate-800">
            Welcome to Connection-Folio
          </h1>
          <p className="text-xl text-slate-700">Connect with your batch mates and manage your academic profile</p>
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
        </div>
      </main>
      <footer className="py-6 text-center text-slate-600 border-t border-slate-200">
        <p>© {new Date().getFullYear()} Connection-Folio. All rights reserved.</p>
      </footer>
    </div>
  )
}

