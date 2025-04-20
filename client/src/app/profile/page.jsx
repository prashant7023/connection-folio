"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import AuthCheck from "@/components/auth-check"
import { getInitials, getAvatarColor } from "@/utils/auth"
import { Badge } from "@/components/ui/badge"

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
    status: "",
  })
  const [prevStatus, setPrevStatus] = useState("");
  const [statusChanged, setStatusChanged] = useState(false);

  // Load student profile data from API if authenticated
  useEffect(() => {
    // Initial fetch
    fetchProfile();
    
    // Set up interval to check for status updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchProfile(true);
    }, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Extract fetchProfile logic to a separate function
  const fetchProfile = async (isBackgroundRefresh = false) => {
    // Only show loading indicator for initial load, not background refreshes
    if (!isBackgroundRefresh) {
      setLoading(true);
    }
    setError("");
    
    // Check if token exists
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }
    
    try {
      // Fetch profile from API using token
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL}/api/students/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      
      const data = await response.json();
      
      // Check if student is blocked, and if so, redirect to login
      if (data.status === 'block') {
        console.log("Account blocked, redirecting to login");
        // Set a message in localStorage to be displayed on the login page
        localStorage.setItem("loginMessage", "Your account has been blocked. Please contact the administrator.");
        // Remove token and profile
        localStorage.removeItem("token");
        localStorage.removeItem("studentProfile");
        // Redirect to login
        router.push("/login");
        return;
      }
      
      // Check if status changed from previous fetch
      if (prevStatus && prevStatus !== data.status) {
        setStatusChanged(true);
        // Auto-hide the notification after 5 seconds
        setTimeout(() => setStatusChanged(false), 5000);
      }
      
      // Update states
      setPrevStatus(data.status);
      setProfile(data);
      
      // Save profile for offline access
      localStorage.setItem("studentProfile", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (!isBackgroundRefresh) {
        setError("Failed to load profile data. Please check your connection and try again.");
        router.push("/login");
      }
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
      }
    }
  };

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
      const response = await fetch(`https://connection-folio-1.onrender.com/api/students/profile`, {
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
                className={`cursor-pointer ${isEditing ? "bg-gray-600 hover:bg-gray-700" : "bg-slate-800 hover:bg-slate-700"}`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button 
                onClick={handleLogout}
                className="cursor-pointer bg-red-600 hover:bg-red-700"
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
                    <AvatarFallback className={`flex items-center justify-center text-2xl font-bold text-slate-800 ${getAvatarColor(profile.name)}`}>
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
                    <p className="text-slate-600">{profile.rollNo}</p>
                    <p className="text-slate-600">{profile.branch}</p>
                    <p className="text-slate-600">{profile.batch}</p>
                    <div className="mt-2">
                      <Badge className={
                        profile.status === "approved" ? "bg-green-100 text-green-800" :
                        profile.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        profile.status === "kyc" ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {profile.status === "approved" ? "Account Active" :
                         profile.status === "pending" ? "Approval Pending" :
                         profile.status === "kyc" ? "KYC Pending" :
                         "Account Inactive"}
                      </Badge>
                    </div>
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
                        className="cursor-pointer w-full bg-slate-800 hover:bg-slate-700"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Tabs defaultValue="academic" className="w-full">
                    <TabsList className="cursor-pointer bg-slate-100 text-slate-700">
                      <TabsTrigger value="academic" className="cursor-pointer">Academic</TabsTrigger>
                      <TabsTrigger value="about" className="cursor-pointer">About</TabsTrigger>
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
                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">Account Status</h3>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-2 ${
                            profile.status === "approved" ? "bg-green-500" :
                            profile.status === "pending" ? "bg-yellow-500" :
                            profile.status === "kyc" ? "bg-blue-500" :
                            "bg-red-500"
                          }`}></div>
                          <p className="text-slate-700">
                            {profile.status === "approved" ? "Your account is approved" :
                             profile.status === "pending" ? "Your account is pending approval" :
                             profile.status === "kyc" ? "KYC verification required" :
                             "Your account is blocked"}
                          </p>
                        </div>
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

          {statusChanged && (
            <div className="fixed top-20 right-4 bg-blue-500 text-white p-4 rounded-md shadow-lg z-50 animate-pulse">
              <p className="font-medium">Your account status has been updated!</p>
              <p>New status: {profile.status === "approved" ? "Approved" : 
                             profile.status === "pending" ? "Pending Approval" : 
                             profile.status === "kyc" ? "KYC Required" :
                             "Blocked"}</p>
            </div>
          )}
        </main>
      </div>
    </AuthCheck>
  )
}

