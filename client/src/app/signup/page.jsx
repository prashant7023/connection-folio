"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AtSign, User, Hash, BookOpen, GraduationCap } from "lucide-react"
import AuthCheck from "@/components/auth-check"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    batch: "",
    branch: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      // Convert batch value to a formatted display value
      const batchDisplay = formData.batch ? `${formData.batch}-${parseInt(formData.batch) + 4}` : ""
      
      // Create the registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rollNo: formData.rollNo,
        batch: batchDisplay,
        branch: formData.branch,
      }
      
      // Send registration request to backend
      const response = await fetch('http://localhost:5000/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token)
      
      // Store student data in localStorage (for offline demo purposes)
      const { password, ...studentProfile } = data.student
      localStorage.setItem('studentProfile', JSON.stringify(studentProfile))
      
      // Redirect to profile page
      router.push('/profile')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCheck loginPage redirectTo="/profile">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-slate-700">Sign Up</CardTitle>
            <CardDescription className="text-center text-slate-500">Create your account to get started</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
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
                    placeholder="name@example.com"
                    className="pl-10 border-slate-200 focus:border-slate-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="border-slate-200 focus:border-slate-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNo" className="text-slate-700">
                  Roll Number
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="rollNo"
                    placeholder="e.g. 21CS1234"
                    className="pl-10 border-slate-200 focus:border-slate-500"
                    value={formData.rollNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch" className="text-slate-700">
                  Batch
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Select onValueChange={(value) => handleSelectChange("batch", value)}>
                    <SelectTrigger className="pl-10 border-slate-200 focus:border-slate-500">
                      <SelectValue placeholder="Select batch year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2020">2020-2024</SelectItem>
                      <SelectItem value="2021">2021-2025</SelectItem>
                      <SelectItem value="2022">2022-2026</SelectItem>
                      <SelectItem value="2023">2023-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch" className="text-slate-700">
                  Branch
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Select onValueChange={(value) => handleSelectChange("branch", value)}>
                    <SelectTrigger className="pl-10 border-slate-200 focus:border-slate-500">
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">Computer Science</SelectItem>
                      <SelectItem value="ECE">Electronics & Communication</SelectItem>
                      <SelectItem value="ME">Mechanical Engineering</SelectItem>
                      <SelectItem value="CE">Civil Engineering</SelectItem>
                      <SelectItem value="EE">Electrical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="underline font-medium hover:text-slate-800">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthCheck>
  )
}

