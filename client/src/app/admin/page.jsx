"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LogOut, ChevronDown, ArrowUpDown, Megaphone, Trash2, Info, AlertTriangle, CheckCircle, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import AuthCheck from "@/components/auth-check"
import { getInitials, getAvatarColor } from "@/utils/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsSearch, BsCheck, BsChevronRight, BsArrowUp, BsArrowDown } from "react-icons/bs"
import { FiFilter } from "react-icons/fi"

export default function AdminPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pendingStudents, setPendingStudents] = useState([])
  const [activeTab, setActiveTab] = useState("notifications")
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [filterValue, setFilterValue] = useState("")
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "Super Admin",
    joinedDate: "Jan 15, 2023",
  })
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeDrowdown, setActiveDrowdown] = useState(null)

  // Announcements state
  const [announcements, setAnnouncements] = useState([])
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    type: "info", // info, warning, success, error
  })
  const [announcementLoading, setAnnouncementLoading] = useState(false)

  // Check URL hash on page load to select the right tab
  useEffect(() => {
    // Function to handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash === "notifications" || hash === "students" || hash === "admin" || hash === "announcements") {
        setActiveTab(hash)
      } else if (!hash) {
        // If no hash is present, default to notifications
        setActiveTab("notifications")
        // Optionally update the URL hash to match
        window.location.hash = "notifications"
      }
    }

    // Initial check
    handleHashChange()

    // Add listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

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
        const response = await fetch(`https://connection-folio-1.onrender.com/api/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch students")
        }

        const data = await response.json()
        setStudents(data)

        // Filter students with pending status for notifications
        const newPendingStudents = data.filter((student) => student.status === "pending")
        setPendingStudents(newPendingStudents)

        // Also try to fetch admin profile
        try {
          const profileResponse = await fetch(`https://connection-folio-1.onrender.com/api/admins/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            setAdminProfile({
              name: profileData.name || "Admin User",
              email: profileData.email || "admin@example.com",
              role: profileData.role || "Admin",
              joinedDate: new Date(profileData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
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
                joinedDate: new Date(parsedProfile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
              })
            } catch (e) {
              console.error("Error parsing admin profile:", e)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to load students. Please check your connection and try again.")

        // Set an empty array instead of using mock data
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [router])

  // Load announcements from API on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("admin_token")
        if (!token) return

        const response = await fetch(`https://connection-folio-1.onrender.com/api/announcements/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch announcements")
        }

        const data = await response.json()
        setAnnouncements(data)
      } catch (err) {
        console.error("Error loading announcements:", err)
        setAnnouncements([])
      }
    }

    fetchAnnouncements()
  }, [])

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
      if (!token) {
        router.push("/admin/login")
        return
      }

      console.log(`Updating student ${studentId} status to: ${newStatus}`)

      const response = await fetch(`https://connection-folio-1.onrender.com/api/admins/students/${studentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.error || "Failed to update student status")
      }

      // Get the updated student data
      const updatedStudent = await response.json()

      // Update the local state with the new data
      setStudents((prevStudents) =>
        prevStudents.map((student) => (student._id === updatedStudent._id ? updatedStudent : student)),
      )

      // If it was a pending student that got updated, refresh the pending list
      if (pendingStudents.some((student) => student._id === studentId)) {
        setPendingStudents((prevPending) => prevPending.filter((student) => student._id !== studentId))
      }
    } catch (err) {
      console.error("Error updating student status:", err)
      setError("Failed to update student status. Please try again.")
    }
  }

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      console.log(`Changing student ${studentId} status to: ${newStatus}`)

      const response = await fetch(`https://connection-folio-1.onrender.com/api/admins/students/${studentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.error || "Failed to update student status")
      }

      // Update the local state with the new data
      const updatedStudent = await response.json()
      setStudents((prevStudents) =>
        prevStudents.map((student) => (student._id === updatedStudent._id ? updatedStudent : student)),
      )

      // Update pending students list
      setPendingStudents((prevPending) => prevPending.filter((student) => student._id !== studentId))
    } catch (error) {
      console.error("Error updating student status:", error)
      setError("Failed to update student status. Please try again.")
    }
  }

  // Get unique batches, branches and status options for filters
  const uniqueBatches = [...new Set(students.map((student) => student.batch))].sort()
  const uniqueBranches = [...new Set(students.map((student) => student.branch))].sort()
  const statusOptions = ["approved", "pending", "blocked", "kyc"]

  // Handle filter selection
  const handleFilter = (type, value) => {
    setFilterType(type)
    setFilterValue(value)
    setShowDropdown(false)
    setActiveDrowdown(null)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setIsDropdownVisible(false)
  }

  // Filter students based on search term and filter type
  const filteredStudents = students
    .filter((student) => {
      // Apply search filter
      const searchMatch =
        searchTerm === "" ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())

      // Apply category filter
      let categoryMatch = true
      if (filterType !== "all") {
        if (filterType === "status") {
          categoryMatch = student[filterType] === filterValue
        } else {
          categoryMatch = student[filterType]?.toLowerCase() === filterValue.toLowerCase()
        }
      }

      return searchMatch && categoryMatch
    })
    .sort((a, b) => {
      const aValue = a[sortField] || ""
      const bValue = b[sortField] || ""

      // Check if values are strings
      const aIsString = typeof aValue === "string"
      const bIsString = typeof bValue === "string"

      // If both are strings, use localeCompare for proper string comparison
      if (aIsString && bIsString) {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Otherwise use regular comparison
      return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
    })

  // Sort students based on selected field and order
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aValue = a[sortField] || ""
    const bValue = b[sortField] || ""

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else {
      return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
    }
  })

  // Sort pending students based on selected field and order
  const sortedPendingStudents = [...pendingStudents].sort((a, b) => {
    let aValue =
      a[
        filterType === "all"
          ? "name"
          : filterType === "batch"
            ? "batch"
            : filterType === "branch"
              ? "branch"
              : filterType === "status"
                ? "status"
                : "name"
      ]
    let bValue =
      b[
        filterType === "all"
          ? "name"
          : filterType === "batch"
            ? "batch"
            : filterType === "branch"
              ? "branch"
              : filterType === "status"
                ? "status"
                : "name"
      ]

    // Handle special case for status to ensure consistent ordering
    if (filterType === "status") {
      const statusOrder = { approved: 1, pending: 2, kyc: 3, block: 4 }
      aValue = statusOrder[a.status] || 5 // Default to end if unknown
      bValue = statusOrder[b.status] || 5
    }

    // Handle potential null or undefined values
    if (aValue === undefined || aValue === null) return filterType === "asc" ? -1 : 1
    if (bValue === undefined || bValue === null) return filterType === "asc" ? 1 : -1

    // Compare the values
    if (aValue < bValue) return filterType === "asc" ? -1 : 1
    if (aValue > bValue) return filterType === "asc" ? 1 : -1
    return 0
  })

  // Handle creating a new announcement
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault()

    if (!newAnnouncement.title || !newAnnouncement.message) {
      setError("Title and message are required for announcements")
      return
    }

    setAnnouncementLoading(true)

    try {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      // Send the announcement to the API
      const response = await fetch(`https://connection-folio-1.onrender.com/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newAnnouncement.title,
          message: newAnnouncement.message,
          type: newAnnouncement.type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create announcement")
      }

      // Get the created announcement
      const createdAnnouncement = await response.json()

      // Update state with the new announcement
      setAnnouncements([createdAnnouncement, ...announcements])

      // Reset form
      setNewAnnouncement({
        title: "",
        message: "",
        type: "info",
      })

      // Show confirmation
      setError("")
    } catch (err) {
      console.error("Error creating announcement:", err)
      setError("Failed to create announcement. Please try again.")
    } finally {
      setAnnouncementLoading(false)
    }
  }

  // Handle deleting an announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      // Delete the announcement via API
      const response = await fetch(`https://connection-folio-1.onrender.com/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete announcement")
      }

      // Update state by filtering out the deleted announcement
      setAnnouncements(announcements.filter((a) => a._id !== id))
    } catch (err) {
      console.error("Error deleting announcement:", err)
      setError("Failed to delete announcement. Please try again.")
    }
  }

  return (
    <AuthCheck requireAuth adminOnly>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="w-full h-16 border-b border-slate-200 bg-white">
          <div className="px-2 container h-full flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-slate-800"></div>
              <span className="text-xl font-bold text-slate-800">Admin Panel</span>
            </Link>

            <div className="flex items-center space-x-3">
              {/* Desktop Tabs (Hidden on Mobile) */}
              <div className="hidden md:block mr-4">
                <TabsList className="bg-slate-100">
                  <TabsTrigger
                    className="cursor-pointer px-3 py-1 rounded-md transition-all 
             data-[state=active]:bg-white 
             data-[state=active]:text-black 
             data-[state=inactive]:text-gray-500"
                    value="notifications"
                    data-state={activeTab === "notifications" ? "active" : "inactive"}
                    onClick={() => {
                      setActiveTab("notifications")
                      window.location.hash = "notifications"
                    }}
                  >
                    Notifications
                    {pendingStudents.length > 0 && (
                      <Badge className="ml-2 bg-red-500 text-white">{pendingStudents.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="students"
                    data-state={activeTab === "students" ? "active" : "inactive"}
                    onClick={() => {
                      setActiveTab("students")
                      window.location.hash = "students"
                    }}
                    className="cursor-pointer 
             focus:bg-white 
             data-[state=active]:bg-white 
             data-[state=active]:text-black 
             data-[state=inactive]:text-gray-500"
                  >
                    Students
                  </TabsTrigger>

                  <TabsTrigger
                    className="cursor-pointer px-3 py-1 rounded-md transition-all 
             data-[state=active]:bg-white 
             data-[state=active]:text-black 
             data-[state=inactive]:text-gray-500"
                    value="announcements"
                    data-state={activeTab === "announcements" ? "active" : "inactive"}
                    onClick={() => {
                      setActiveTab("announcements")
                      window.location.hash = "announcements"
                    }}
                  >
                    Announcements
                  </TabsTrigger>

                  <TabsTrigger
                    className="cursor-pointer px-3 py-1 rounded-md transition-all 
             data-[state=active]:bg-white 
             data-[state=active]:text-black 
             data-[state=inactive]:text-gray-500"
                    value="admin"
                    data-state={activeTab === "admin" ? "active" : "inactive"}
                    onClick={() => {
                      setActiveTab("admin")
                      window.location.hash = "admin"
                    }}
                  >
                    Admin Profile
                  </TabsTrigger>
                </TabsList>
              </div>

              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center text-slate-700 text-sm px-3 py-2 rounded-md hover:bg-slate-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="container p-6 lg:p-10">
          {error && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Mobile Tabs (Hidden on Desktop) */}
          <div className="md:hidden mb-6">
            <TabsList className="w-full bg-slate-100">
              <TabsTrigger
                className="cursor-pointer flex-grow"
                value="students"
                data-state={activeTab === "students" ? "active" : "inactive"}
                onClick={() => {
                  setActiveTab("students")
                  window.location.hash = "students"
                }}
              >
                Students
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex-grow"
                value="notifications"
                data-state={activeTab === "notifications" ? "active" : "inactive"}
                onClick={() => {
                  setActiveTab("notifications")
                  window.location.hash = "notifications"
                }}
              >
                Notifications
                {pendingStudents.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">{pendingStudents.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex-grow"
                value="announcements"
                data-state={activeTab === "announcements" ? "active" : "inactive"}
                onClick={() => {
                  setActiveTab("announcements")
                  window.location.hash = "announcements"
                }}
              >
                Announcements
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer flex-grow"
                value="admin"
                data-state={activeTab === "admin" ? "active" : "inactive"}
                onClick={() => {
                  setActiveTab("admin")
                  window.location.hash = "admin"
                }}
              >
                Admin Profile
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tabs content based on activeTab */}
          <div>
            {activeTab === "students" && (
              <div className="mt-6">
                <Card className="bg-gray-100 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Student Management</CardTitle>
                    <CardDescription className="text-slate-600">
                      View and manage all registered students
                    </CardDescription>
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center border rounded-lg py-2 w-[350px] h-[40px] px-4 shadow-md">
                        <BsSearch className="text-gray-600 mr-2 text-lg" />
                        <input
                          type="text"
                          placeholder="Search by name, email, roll no., branch..."
                          className="w-full outline-none"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <button
                          className="flex items-center gap-1 rounded-lg border px-2 py-1 text-sm shadow-sm"
                          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                        >
                          <span>Filter</span>
                          <FiFilter className="h-4 w-4" />
                        </button>

                        {isDropdownVisible && (
                          <div className="absolute z-10 right-0 mt-2 w-60 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {/* Filter options */}
                              <button
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                onClick={() => handleFilter("all", "")}
                              >
                                <span>All Students</span>
                                {filterType === "all" && <BsCheck className="h-4 w-4" />}
                              </button>

                              {/* Batch filter submenu */}
                              <div className="relative group">
                                <button
                                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveDrowdown(activeDrowdown === "batch" ? null : "batch")
                                  }}
                                >
                                  <span>Batch</span>
                                  <BsChevronRight className="h-4 w-4" />
                                </button>

                                {activeDrowdown === "batch" && (
                                  <div className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                    {uniqueBatches.map((batch) => (
                                      <button
                                        key={batch}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                        onClick={() => handleFilter("batch", batch)}
                                      >
                                        <span>{batch}</span>
                                        {filterType === "batch" && filterValue === batch && (
                                          <BsCheck className="h-4 w-4" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Branch filter submenu */}
                              <div className="relative group">
                                <button
                                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveDrowdown(activeDrowdown === "branch" ? null : "branch")
                                  }}
                                >
                                  <span>Branch</span>
                                  <BsChevronRight className="h-4 w-4" />
                                </button>

                                {activeDrowdown === "branch" && (
                                  <div className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                    {uniqueBranches.map((branch) => (
                                      <button
                                        key={branch}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                        onClick={() => handleFilter("branch", branch)}
                                      >
                                        <span>{branch}</span>
                                        {filterType === "branch" && filterValue === branch && (
                                          <BsCheck className="h-4 w-4" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Status filter submenu */}
                              <div className="relative group">
                                <button
                                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveDrowdown(activeDrowdown === "status" ? null : "status")
                                  }}
                                >
                                  <span>Status</span>
                                  <BsChevronRight className="h-4 w-4" />
                                </button>

                                {activeDrowdown === "status" && (
                                  <div className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                    {statusOptions.map((status) => (
                                      <button
                                        key={status}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                        onClick={() => handleFilter("status", status)}
                                      >
                                        <span className="capitalize">{status}</span>
                                        {filterType === "status" && filterValue === status && (
                                          <BsCheck className="h-4 w-4" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="py-1">
                              {/* Sort options header */}
                              <div className="px-4 py-2 text-xs text-gray-500">Sort by</div>

                              {/* Sort options */}
                              <button
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                onClick={() => handleSort("name")}
                              >
                                <span>Name</span>
                                {sortField === "name" &&
                                  (sortOrder === "asc" ? (
                                    <BsArrowUp className="h-4 w-4" />
                                  ) : (
                                    <BsArrowDown className="h-4 w-4" />
                                  ))}
                              </button>
                              <button
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left flex items-center justify-between"
                                onClick={() => handleSort("branch")}
                              >
                                <span>Branch</span>
                                {sortField === "branch" &&
                                  (sortOrder === "asc" ? (
                                    <BsArrowUp className="h-4 w-4" />
                                  ) : (
                                    <BsArrowDown className="h-4 w-4" />
                                  ))}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <p className="text-slate-600">Loading students...</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead className="hidden md:table-cell">Roll No</TableHead>
                              <TableHead className="hidden md:table-cell">Batch</TableHead>
                              <TableHead className="hidden md:table-cell">Branch</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedStudents.length > 0 ? (
                              sortedStudents.map((student) => (
                                <TableRow key={student._id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback
                                          className={`flex items-center justify-center text-sm font-bold text-slate-800 ${getAvatarColor(student.name)}`}
                                        >
                                          {getInitials(student.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium text-slate-800">{student.name}</div>
                                        <div className="text-sm text-slate-500">{student.email}</div>
                                        <div className="text-xs text-slate-500 md:hidden">
                                          {student.rollNo} • {student.branch} • {student.batch}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">{student.rollNo}</TableCell>
                                  <TableCell className="hidden md:table-cell">{student.batch}</TableCell>
                                  <TableCell className="hidden md:table-cell">{student.branch}</TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        student.status === "approved"
                                          ? "bg-green-100 text-green-800"
                                          : student.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : student.status === "kyc"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-red-100 text-red-800"
                                      }
                                    >
                                      {student.status === "approved"
                                        ? "Approved"
                                        : student.status === "pending"
                                          ? "Pending"
                                          : student.status === "kyc"
                                            ? "KYC Required"
                                            : "Blocked"}
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
                                        <option value="approved">Approved</option>
                                        <option value="kyc">KYC Required</option>
                                        <option value="block">Blocked</option>
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
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="mt-6">
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">New Student Registrations</CardTitle>
                    <CardDescription className="text-slate-600">
                      Review and manage pending student registrations
                    </CardDescription>
                    <div className="flex justify-end mt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-1">
                            <ArrowUpDown className="h-4 w-4" />
                            <span>Sort</span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleSort("name")} className="cursor-pointer">
                            Name {filterType === "name" && (filterType === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSort("rollNo")} className="cursor-pointer">
                            Roll No {filterType === "rollNo" && (filterType === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSort("batch")} className="cursor-pointer">
                            Batch {filterType === "batch" && (filterType === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSort("branch")} className="cursor-pointer">
                            Branch {filterType === "branch" && (filterType === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSort("createdAt")} className="cursor-pointer">
                            Registration Date {filterType === "createdAt" && (filterType === "asc" ? "↑" : "↓")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {pendingStudents.length === 0 ? (
                      <div className="py-8 text-center text-slate-500">
                        <p>No pending student registrations</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student</TableHead>
                              <TableHead className="hidden md:table-cell">Roll No</TableHead>
                              <TableHead className="hidden md:table-cell">Batch</TableHead>
                              <TableHead className="hidden md:table-cell">Branch</TableHead>
                              <TableHead className="hidden md:table-cell">Registered On</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedPendingStudents.map((student) => (
                              <TableRow key={student._id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className={getAvatarColor(student.name)}>
                                        {getInitials(student.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{student.name}</div>
                                      <div className="text-sm text-slate-500">{student.email}</div>
                                      <div className="text-xs text-slate-500 md:hidden">
                                        {student.rollNo} • {student.branch} • {student.batch}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{student.rollNo}</TableCell>
                                <TableCell className="hidden md:table-cell">{student.batch}</TableCell>
                                <TableCell className="hidden md:table-cell">{student.branch}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {new Date(student.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      className="cursor-pointer bg-green-600 hover:bg-green-700"
                                      size="sm"
                                      onClick={() => handleStatusChange(student._id, "approved")}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                                      size="sm"
                                      onClick={() => handleStatusChange(student._id, "kyc")}
                                    >
                                      KYC
                                    </Button>
                                    <Button
                                      className="cursor-pointer bg-red-600 hover:bg-red-700"
                                      size="sm"
                                      onClick={() => handleStatusChange(student._id, "block")}
                                    >
                                      Block
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="mt-6">
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Admin Profile</CardTitle>
                    <CardDescription className="text-slate-600">Your admin account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-32 w-32 border-4 border-slate-200">
                          <AvatarFallback
                            className={`flex items-center justify-center text-2xl font-bold text-slate-800 ${getAvatarColor(adminProfile.name)}`}
                          >
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
                            <Input
                              id="adminName"
                              value={adminProfile.name}
                              readOnly
                              className="bg-slate-50 border-slate-200"
                            />
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
                            <Input
                              id="adminRole"
                              value={adminProfile.role}
                              readOnly
                              className="bg-slate-50 border-slate-200"
                            />
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
                              <Badge className="bg-white hover:text-white py-1 text-slate-800">
                                Student Management
                              </Badge>
                              <Badge className="bg-white hover:text-white py-1 text-slate-800">
                                Content Management
                              </Badge>
                              <Badge className="bg-white hover:text-white py-1 text-slate-800">System Settings</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "announcements" && (
              <div className="mt-6">
                <Card className="bg-white border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800 flex items-center">
                      <Megaphone className="mr-2 h-5 w-5" />
                      Announcements
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Create and manage announcements for students
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcementTitle" className="text-slate-700">
                          Announcement Title
                        </Label>
                        <Input
                          id="announcementTitle"
                          placeholder="Enter announcement title"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          className="border-slate-200 focus:border-slate-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="announcementMessage" className="text-slate-700">
                          Announcement Message
                        </Label>
                        <Textarea
                          id="announcementMessage"
                          placeholder="Enter your announcement message here"
                          value={newAnnouncement.message}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                          className="min-h-[100px] border-slate-200 focus:border-slate-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="announcementType" className="text-slate-700">
                          Announcement Type
                        </Label>
                        <Select
                          value={newAnnouncement.type}
                          onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                        >
                          <SelectTrigger className="border-slate-200">
                            <SelectValue placeholder="Select announcement type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Information</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="submit"
                        className="cursor-pointer bg-slate-800 hover:bg-slate-700"
                        disabled={announcementLoading}
                      >
                        {announcementLoading ? "Creating..." : "Create Announcement"}
                      </Button>
                    </form>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">Current Announcements</h3>

                      {announcements.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <p>No announcements have been created yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {announcements.map((announcement) => (
                            <div
                              key={announcement._id}
                              className={`p-4 rounded-md border ${
                                announcement.type === "info"
                                  ? "bg-blue-50 border-blue-200"
                                  : announcement.type === "warning"
                                    ? "bg-amber-50 border-amber-200"
                                    : announcement.type === "success"
                                      ? "bg-green-50 border-green-200"
                                      : "bg-red-50 border-red-200"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  {announcement.type === "info" && <Info className="h-5 w-5 text-blue-500 mr-2" />}
                                  {announcement.type === "warning" && (
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                  )}
                                  {announcement.type === "success" && (
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                  )}
                                  {announcement.type === "error" && <X className="h-5 w-5 text-red-500 mr-2" />}
                                  <h4 className="font-medium text-slate-800">{announcement.title}</h4>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-500 hover:text-red-500"
                                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="mt-2 text-sm text-slate-600">{announcement.message}</p>
                              <div className="mt-2 flex justify-between text-xs text-slate-500">
                                <span>Created by: {announcement.creatorName}</span>
                                <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}
