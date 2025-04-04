"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AtSign, Lock, ShieldCheck } from "lucide-react"
import AuthCheck from "@/components/auth-check"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      // Send admin login request to backend
      const response = await fetch('http://localhost:5000/api/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      // Store token in localStorage with admin prefix to distinguish from student tokens
      localStorage.setItem('admin_token', data.token)
      
      // Store admin data in localStorage (for offline demo purposes)
      const { password: pwd, ...adminProfile } = data.admin
      localStorage.setItem('adminProfile', JSON.stringify(adminProfile))
      
      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err) {
      console.error('Admin login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCheck loginPage redirectTo="/admin">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="h-12 w-12 text-slate-800" />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-slate-700">Admin Login</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
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
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In as Admin"}
              </button>
              <div className="text-center text-sm text-slate-600">
                <Link href="/admin/register" className="underline font-medium hover:text-slate-800 mr-2">
                  Register New Admin
                </Link>
                |
                <Link href="/" className="underline font-medium hover:text-slate-800 ml-2">
                  Back to Home
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthCheck>
  )
} 