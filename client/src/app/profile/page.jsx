"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    rollNo: "21CS1234",
    batch: "2021-2025",
    branch: "Computer Science",
    email: "john.doe@example.com",
    bio: "Computer Science student passionate about web development and AI.",
    skills: "JavaScript, React, Node.js, Python",
    interests: "Web Development, Machine Learning, Open Source",
  })

  // Load user profile data from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile)
          setProfile(prev => ({
            ...prev,
            ...parsedProfile
          }))
        } catch (error) {
          console.error("Error parsing profile data:", error)
        }
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
    
    // Save the updated profile to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("userProfile", JSON.stringify(profile))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />

      <main className="container p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">User Profile</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "bg-gray-600 hover:bg-gray-700" : "bg-slate-800 hover:bg-slate-700"}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile sidebar */}
          <Card className="md:col-span-1 bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-slate-200">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt={profile.name} />
                  <AvatarFallback className="text-4xl bg-slate-200 text-slate-700">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
                  <p className="text-slate-600">{profile.rollNo}</p>
                  <p className="text-slate-600">{profile.branch}</p>
                  <p className="text-slate-600">{profile.batch}</p>
                </div>
                <div className="w-full pt-4 border-t border-slate-200">
                  <h3 className="font-medium text-slate-700 mb-2">Contact</h3>
                  <p className="text-slate-600">{profile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile details */}
          <Card className="md:col-span-2 bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Profile Information</CardTitle>
              <CardDescription className="text-slate-600">
                {isEditing ? "Edit your profile information below" : "Your personal and academic information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-700">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-slate-500"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-slate-700">
                      Skills
                    </Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={profile.skills}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-slate-500"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests" className="text-slate-700">
                      Interests
                    </Label>
                    <Textarea
                      id="interests"
                      name="interests"
                      value={profile.interests}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-slate-500"
                      rows={2}
                    />
                  </div>

                  <Button type="submit" className="bg-slate-800 hover:bg-slate-700">
                    Save Changes
                  </Button>
                </form>
              ) : (
                <Tabs defaultValue="academic" className="w-full">
                  <TabsList className="bg-slate-100 text-slate-700">
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                  </TabsList>
                  <TabsContent value="academic" className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Batch</h3>
                      <p className="text-slate-700">{profile.batch}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Branch</h3>
                      <p className="text-slate-700">{profile.branch}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Roll Number</h3>
                      <p className="text-slate-700">{profile.rollNo}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="about" className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Bio</h3>
                      <p className="text-slate-700">{profile.bio}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Skills</h3>
                      <p className="text-slate-700">{profile.skills}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Interests</h3>
                      <p className="text-slate-700">{profile.interests}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            <CardFooter className="border-t border-slate-200 pt-4">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-600 text-slate-600 hover:bg-slate-50 h-10 px-4 py-2"
              >
                Back to Dashboard
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

