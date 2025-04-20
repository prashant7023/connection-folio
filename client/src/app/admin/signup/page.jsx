"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AtSign, Lock, User, AlertTriangle, ShieldCheck, Check, X } from "lucide-react"

// Hardcode the authorized emails directly in the frontend for immediate validation
const AUTHORIZED_EMAILS = [
  'prahantsh123@gmail.com',
  'prahantsh7014@gmail.com'
];

export default function AdminSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailAuthorized, setEmailAuthorized] = useState(null)

  // Check if email is authorized when it changes
  useEffect(() => {
    if (formData.email) {
      const normalizedEmail = formData.email.toLowerCase().trim();
      const isAuthorized = AUTHORIZED_EMAILS.includes(normalizedEmail);
      setEmailAuthorized(isAuthorized);
    } else {
      setEmailAuthorized(null);
    }
  }, [formData.email]);

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    // Check if email is authorized before submitting
    const normalizedEmail = formData.email.toLowerCase().trim();
    if (!AUTHORIZED_EMAILS.includes(normalizedEmail)) {
      setError("This email is not authorized to create an admin account")
      return
    }
    
    setLoading(true)
    
    try {
      // Send registration request to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL}/api/admins/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'Admin'
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      // Store token and redirect to admin dashboard
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('adminProfile', JSON.stringify(data.admin))
      
      router.push('/')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <ShieldCheck className="h-12 w-12 text-slate-800" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-slate-700">Admin Signup</CardTitle>
          <CardDescription className="text-center text-slate-500">
            Create an admin account for Connection Folio
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-50 border-red-200 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Alert className="bg-amber-50 border-amber-200 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p>Only the following emails can register as admin:</p>
                <ul className="list-disc ml-5 mt-2">
                  {AUTHORIZED_EMAILS.map(email => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 border-slate-200 focus:border-slate-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
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
                  className={`pl-10 pr-10 border-slate-200 focus:border-slate-500 ${
                    emailAuthorized === true ? 'border-green-500' : 
                    emailAuthorized === false ? 'border-red-500' : ''
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {emailAuthorized !== null && (
                  <div className="absolute right-3 top-3">
                    {emailAuthorized ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {emailAuthorized === false && (
                <p className="text-sm text-red-500 mt-1">
                  This email is not in the list of authorized admin emails
                </p>
              )}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 border-slate-200 focus:border-slate-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full cursor-pointer bg-slate-800 hover:bg-slate-700"
              disabled={loading || emailAuthorized === false}
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
            </Button>
            
            <div className="text-center text-sm text-slate-600">
              Already have an admin account?{" "}
              <Link href="/admin/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 