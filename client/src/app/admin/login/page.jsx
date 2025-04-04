"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AtSign, Lock, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle admin login logic here
    console.log({ email, password })
    // For demonstration, redirect to admin dashboard
    window.location.href = "/admin"
  }

  return (
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
            >
              Sign In as Admin
            </button>
            <div className="text-center text-sm text-slate-600">
              <Link href="/" className="underline font-medium hover:text-slate-800">
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 