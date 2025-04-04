"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Label } from "@/components/ui/label"

// Mock data for users
const USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    rollNo: "21CS1001",
    batch: "2021-2025",
    branch: "CSE",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    rollNo: "21CS1002",
    batch: "2021-2025",
    branch: "CSE",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    rollNo: "21EC1001",
    batch: "2021-2025",
    branch: "ECE",
    status: "pending",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    rollNo: "21ME1001",
    batch: "2021-2025",
    branch: "ME",
    status: "active",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    rollNo: "22CS1001",
    batch: "2022-2026",
    branch: "CSE",
    status: "inactive",
  },
]

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.branch.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />

      <main className="container p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200 text-slate-700">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="profile">Admin Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">User Management</CardTitle>
                <CardDescription className="text-slate-600">View and manage all registered users</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 border-slate-200 focus:border-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
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
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                                <AvatarFallback className="bg-slate-200 text-slate-700">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-slate-800">{user.name}</div>
                                <div className="text-sm text-slate-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.rollNo}</TableCell>
                          <TableCell>{user.batch}</TableCell>
                          <TableCell>{user.branch}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-slate-300 text-slate-600 hover:bg-slate-50"
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-slate-300 text-slate-600 hover:bg-slate-50"
                              >
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          No users found matching your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                      <AvatarFallback className="text-4xl bg-slate-200 text-slate-700">AD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50">
                      Change Avatar
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adminName" className="text-slate-700">
                          Name
                        </Label>
                        <Input id="adminName" value="Admin User" readOnly className="bg-slate-50 border-slate-200" />
                      </div>
                      <div>
                        <Label htmlFor="adminEmail" className="text-slate-700">
                          Email
                        </Label>
                        <Input
                          id="adminEmail"
                          value="admin@example.com"
                          readOnly
                          className="bg-slate-50 border-slate-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="adminRole" className="text-slate-700">
                          Role
                        </Label>
                        <Input id="adminRole" value="Super Admin" readOnly className="bg-slate-50 border-slate-200" />
                      </div>
                      <div>
                        <Label htmlFor="adminJoined" className="text-slate-700">
                          Joined Date
                        </Label>
                        <Input
                          id="adminJoined"
                          value="Jan 15, 2023"
                          readOnly
                          className="bg-slate-50 border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">Admin Privileges</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-slate-100 text-slate-800">User Management</Badge>
                          <Badge className="bg-slate-100 text-slate-800">Content Management</Badge>
                          <Badge className="bg-slate-100 text-slate-800">System Settings</Badge>
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
  )
}

