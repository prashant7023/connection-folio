"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, LogOut } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import AuthCheck from "@/components/auth-check"
import { getInitials } from "@/utils/auth"

export default function AdminPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "Super Admin",
    joinedDate: "Jan 15, 2023"
  })

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      
      try {
        // Check if admin is logged in
        const token = localStorage.getItem("admin_token")
        if (!token) {
          // Redirect to login if not authenticated
          router.push("/admin/login")
          return
        }
        
        // Fetch students from backend
        const response = await fetch("http://localhost:5000/api/students", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch students")
        }
        
        const data = await response.json()
        setStudents(data)
        
        // Also try to fetch admin profile
        try {
          const profileResponse = await fetch("http://localhost:5000/api/admins/profile", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            setAdminProfile({
              name: profileData.name || "Admin User",
              email: profileData.email || "admin@example.com",
              role: profileData.role || "Admin",
              joinedDate: new Date(profileData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            })
          }
        } catch (profileError) {
          console.error("Error fetching admin profile:", profileError)
          // Try to load from localStorage
          const savedProfile = localStorage.getItem("adminProfile")
          if (savedProfile) {
            try {
              const parsedProfile = JSON.parse(savedProfile)
              setAdminProfile({
                name: parsedProfile.name || "Admin User",
                email: parsedProfile.email || "admin@example.com",
                role: parsedProfile.role || "Admin",
                joinedDate: new Date(parsedProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              })
            } catch (e) {
              console.error("Error parsing admin profile:", e)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to load students. Using placeholder data.")
        
        // Use placeholder data if API fails
        setStudents([
          {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            rollNo: "21CS1001",
            batch: "2021-2025",
            branch: "CSE",
            status: "active",
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchStudents()
  }, [router])

  const handleLogout = () => {
    // Clear admin tokens and data
    localStorage.removeItem("admin_token")
    localStorage.removeItem("adminProfile")
    
    // Redirect to login page
    router.push("/admin/login")
  }

  const handleUpdateStatus = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem("admin_token")
      
      const response = await fetch(`http://localhost:5000/api/admins/students/${studentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error("Failed to update student status")
      }
      
      // Update the local state
      setStudents(students.map(student => 
        student._id === studentId ? { ...student, status: newStatus } : student
      ))
    } catch (err) {
      console.error("Error updating student status:", err)
      alert("Failed to update student status")
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.branch?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AuthCheck requireAuth adminOnly>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="w-full h-16 border-b border-slate-200 bg-white">
          <div className="container h-full flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-slate-800"></div>
              <span className="text-xl font-bold text-slate-800">Admin Panel</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="flex items-center text-slate-700 text-sm px-3 py-2 rounded-md hover:bg-slate-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="container p-6 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Admin Dashboard</h1>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <Tabs defaultValue="students" className="w-full">
            <TabsList className="bsg-slate-200 text-slate-700">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="profile">Admin Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="mt-6">
              <Card className="bg-gray-100 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800">Student Management</CardTitle>
                  <CardDescription className="text-slate-600">View and manage all registered students</CardDescription>
                  <div className="relative mts-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Search students..."
                      className="pl-10 border-sslate-200 focus:border-slate-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-slate-600">Loading students...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead>Branch</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <TableRow key={student._id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={student.name} />
                                    <AvatarFallback className="bg-slate-200 text-slate-700">
                                      {getInitials(student.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-slate-800">{student.name}</div>
                                    <div className="text-sm text-slate-500">{student.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{student.rollNo}</TableCell>
                              <TableCell>{student.batch}</TableCell>
                              <TableCell>{student.branch}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    student.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : student.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {student.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <select
                                    className="h-8 border border-slate-300 rounded text-sm px-2 text-slate-600"
                                    value={student.status}
                                    onChange={(e) => handleUpdateStatus(student._id, e.target.value)}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                  </select>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                              No students found matching your search criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800">Admin Profile</CardTitle>
                  <CardDescription className="text-slate-600">Your admin account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32 border-4 border-slate-200">
                        <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Admin" />
                        <AvatarFallback className="text-4xl bg-slate-200 text-slate-700">
                          {getInitials(adminProfile.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="adminName" className="text-slate-700">
                            Name
                          </Label>
                          <Input id="adminName" value={adminProfile.name} readOnly className="bg-slate-50 border-slate-200" />
                        </div>
                        <div>
                          <Label htmlFor="adminEmail" className="text-slate-700">
                            Email
                          </Label>
                          <Input
                            id="adminEmail"
                            value={adminProfile.email}
                            readOnly
                            className="bg-slate-50 border-slate-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="adminRole" className="text-slate-700">
                            Role
                          </Label>
                          <Input id="adminRole" value={adminProfile.role} readOnly className="bg-slate-50 border-slate-200" />
                        </div>
                        <div>
                          <Label htmlFor="adminJoined" className="text-slate-700">
                            Joined Date
                          </Label>
                          <Input
                            id="adminJoined"
                            value={adminProfile.joinedDate}
                            readOnly
                            className="bg-slate-50 border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Admin Privileges</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-white hover:text-white py-1 text-slate-800">Student Management</Badge>
                            <Badge className="bg-white hover:text-white py-1 text-slate-800">Content Management</Badge>
                            <Badge className="bg-white hover:text-white py-1 text-slate-800">System Settings</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthCheck>
  )
}

