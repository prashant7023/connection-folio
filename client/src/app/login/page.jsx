"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AtSign, Lock, AlertTriangle } from "lucide-react"
import AuthCheck from "@/components/auth-check"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isBlocked, setIsBlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Check for messages in localStorage on component mount
  useEffect(() => {
    const message = localStorage.getItem("loginMessage");
    if (message) {
      setError(message);
      setIsBlocked(true);
      // Clear the message after displaying it
      localStorage.removeItem("loginMessage");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsBlocked(false)
    setLoading(true)
    
    try {
      // Send login request to backend
      const response = await fetch('https://connection-folio-1.onrender.com/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        // Check if the account is blocked
        if (response.status === 403 && data.blocked) {
          setIsBlocked(true);
          throw new Error(data.error || 'Your account has been blocked. Please contact the administrator.');
        }
        throw new Error(data.error || 'Login failed')
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token)
      
      // Store student data in localStorage (for offline demo purposes)
      const { password: pwd, ...studentProfile } = data.student
      localStorage.setItem('studentProfile', JSON.stringify(studentProfile))
      
      // Redirect to profile page
      router.push('/')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCheck loginPage redirectTo="/profile">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-slate-700">Login</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {isBlocked ? (
                <div className="p-5 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <h3 className="font-bold">Account Blocked</h3>
                  </div>
                  <p>{error}</p>
                  <p className="mt-2">
                    If you believe this is an error, please contact your administrator at:
                    <a href="mailto:admin@connectionfolio.com" className="block mt-1 font-bold underline">
                      admin@connectionfolio.com
                    </a>
                  </p>
                </div>
              ) : error ? (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              ) : null}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 border-slate-200 focus:border-slate-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 border-slate-200 focus:border-slate-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <button 
                type="submit" 
                className="cursor-pointer w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <div className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline font-medium hover:text-slate-800">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthCheck>
  )
}

