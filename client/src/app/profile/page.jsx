"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import AuthCheck from "@/components/auth-check"
import { getInitials } from "@/utils/auth"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState({
    name: "",
    rollNo: "",
    batch: "",
    branch: "",
    email: "",
    bio: "",
    skills: "",
    interests: "",
  })

  // Load student profile data from API if authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      
      // Check if token exists
      const token = localStorage.getItem("token")
      
      if (!token) {
        // Try to load from localStorage as fallback for offline demo
        const savedProfile = localStorage.getItem("studentProfile")
        if (savedProfile) {
          try {
            setProfile(JSON.parse(savedProfile))
          } catch (error) {
            console.error("Error parsing profile data:", error)
          }
        } else {
          // No token and no local data, redirect to login
          router.push("/login")
        }
        setLoading(false)
        return
      }
      
      try {
        // Fetch profile from API using token
        const response = await fetch("http://localhost:5000/api/students/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        
        const data = await response.json()
        setProfile(data)
        
        // Update localStorage copy for offline access
        localStorage.setItem("studentProfile", JSON.stringify(data))
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data. Using local data if available.")
        
        // Try to load from localStorage as fallback
        const savedProfile = localStorage.getItem("studentProfile")
        if (savedProfile) {
          try {
            setProfile(JSON.parse(savedProfile))
          } catch (error) {
            console.error("Error parsing profile data:", error)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("Not authenticated")
      }
      
      // Send updated profile to API
      const response = await fetch("http://localhost:5000/api/students/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: profile.bio,
          skills: profile.skills,
          interests: profile.interests
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to update profile")
      }
      
      // Get updated profile
      const data = await response.json()
      
      // Update localStorage copy
      localStorage.setItem("studentProfile", JSON.stringify(data))
      
      // Switch back to view mode
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("studentProfile")
    router.push("/login")
  }

  if (loading && !profile.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <p className="text-xl text-slate-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <AuthCheck requireAuth studentOnly>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />

        <main className="container p-6 lg:p-10">
          {error && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-md">
              {error}
            </div>
          )}
        
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Student Profile</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-gray-600 hover:bg-gray-700" : "bg-slate-800 hover:bg-slate-700"}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Profile sidebar */}
            <Card className="md:col-span-1 bg-white border-slate-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32 border-4 border-slate-200">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" alt={profile.name} />
                    <AvatarFallback className="text-4xl bg-slate-200 text-slate-700">
                      {getInitials(profile.name)}
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

            {/* Profile main content */}
            <Card className="md:col-span-2 bg-white border-slate-200">
              <CardContent className="pt-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-slate-700 font-medium">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="min-h-[100px] border-slate-200 focus:border-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skills" className="text-slate-700 font-medium">
                          Skills
                        </Label>
                        <Textarea
                          id="skills"
                          placeholder="Your technical or soft skills"
                          value={profile.skills}
                          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                          className="min-h-[100px] border-slate-200 focus:border-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interests" className="text-slate-700 font-medium">
                          Interests
                        </Label>
                        <Textarea
                          id="interests"
                          placeholder="Your academic or personal interests"
                          value={profile.interests}
                          onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                          className="min-h-[100px] border-slate-200 focus:border-slate-500"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-slate-800 hover:bg-slate-700"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
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
            </Card>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}

