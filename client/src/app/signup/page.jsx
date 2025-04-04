"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AtSign, User, Hash, BookOpen, GraduationCap } from "lucide-react"

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

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // In a real app, you would save this data to a backend first
    console.log("Registering user:", formData)
    
    // Convert batch value to a formatted display value
    const batchDisplay = formData.batch ? `${formData.batch}-${parseInt(formData.batch) + 4}` : ""
    
    // Convert branch code to full name
    const branchMap = {
      "CSE": "Computer Science",
      "ECE": "Electronics & Communication",
      "ME": "Mechanical Engineering",
      "CE": "Civil Engineering",
      "EE": "Electrical Engineering"
    }
    
    // Create profile data from form data
    const profileData = {
      name: formData.name,
      rollNo: formData.rollNo,
      batch: batchDisplay,
      branch: branchMap[formData.branch] || formData.branch,
      email: formData.email,
      bio: "Tell us something about yourself.",
      skills: "Add your skills here",
      interests: "Add your interests here",
    }
    
    // Store user data in localStorage (for demo purposes)
    localStorage.setItem("userProfile", JSON.stringify(profileData))
    
    // Redirect to profile page
    router.push("/profile")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-slate-700">Sign Up</CardTitle>
          <CardDescription className="text-center text-slate-500">Create your account to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            >
              Create Account
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
  )
}

