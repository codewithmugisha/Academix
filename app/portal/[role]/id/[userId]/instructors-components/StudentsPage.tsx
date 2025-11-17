"use client"

import * as React from "react"
import { Search, User, Mail, Calendar, GraduationCap, Plus, Eye, BarChart3, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data - Replace with actual API fetch
const mockStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    grade: "A",
    enrolledDate: "2025-09-01",
    status: "Active",
    attendance: 95,
    notes: "Excellent participation",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    grade: "B+",
    enrolledDate: "2025-09-02",
    status: "Active",
    attendance: 88,
    notes: "Needs improvement in math",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    grade: "A-",
    enrolledDate: "2025-09-03",
    status: "Inactive",
    attendance: 75,
    notes: "Medical leave",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    grade: "B",
    enrolledDate: "2025-09-04",
    status: "Active",
    attendance: 92,
    notes: "Strong in projects",
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva@example.com",
    grade: "C+",
    enrolledDate: "2025-09-05",
    status: "Active",
    attendance: 82,
    notes: "Improving steadily",
  },
  // Add more mock data as needed
]

type Student = typeof mockStudents[0]

// Derived data for charts
const getGradeDistribution = (students: Student[]) => {
  const grades = students.reduce((acc, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.entries(grades).map(([name, value]) => ({ name, value }))
}

const getStatusDistribution = (students: Student[]) => {
  const status = students.reduce((acc, student) => {
    acc[student.status] = (acc[student.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.entries(status).map(([name, value]) => ({ name, value }))
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function StudentsComponent() {
  const [students, setStudents] = React.useState<Student[]>(mockStudents)
  const [filteredStudents, setFilteredStudents] = React.useState<Student[]>(students)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortBy, setSortBy] = React.useState<keyof Student>("name")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState<string>("all")

  // Placeholder for backend fetch - Replace with actual API call (e.g., useSWR or fetch)
  React.useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      try {
        // const response = await fetch('/api/students') // Backend endpoint
        // const data = await response.json()
        // setStudents(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch students:", error)
        setIsLoading(false)
      }
    }
    fetchStudents()
  }, [])

  // Search and filter logic
  React.useEffect(() => {
    let filtered = [...students]

    // Search by name or email
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => student.status === filterStatus)
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredStudents(filtered)
  }, [searchTerm, filterStatus, sortBy, sortOrder, students])

  const handleSort = (key: keyof Student) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("asc")
    }
  }

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
  }

  const gradeData = getGradeDistribution(filteredStudents)
  const statusData = getStatusDistribution(filteredStudents)
  const averageAttendance = filteredStudents.reduce((acc, student) => acc + student.attendance, 0) / (filteredStudents.length || 1)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">Manage and view all students you teach. Total: {filteredStudents.length}</p>
      </div>

      {/* Statistics Cards with Visual Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Average Attendance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {filteredStudents.length} students
            </p>
          </CardContent>
        </Card>

        {/* Grade Distribution Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gradeData.length > 0 ? gradeData.reduce((prev, curr) => prev.value > curr.value ? prev : curr).name : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {gradeData.length} grade levels
            </p>
          </CardContent>
        </Card>

        {/* Status Distribution Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusData.find(d => d.name === "Active")?.value || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {filteredStudents.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Grade Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Number of students per grade level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Student Status</CardTitle>
            <CardDescription>Distribution by activity status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actions: Search, Filter, Add */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Students Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Placeholder form - Integrate with backend */}
                  <Input placeholder="Student Name" />
                  <Input placeholder="Email" />
                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 pb-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead 
                  className="cursor-pointer hover:underline" 
                  onClick={() => handleSort("name")}
                >
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:underline" 
                  onClick={() => handleSort("email")}
                >
                  Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:underline" 
                  onClick={() => handleSort("grade")}
                >
                  Grade {sortBy === "grade" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:underline" 
                  onClick={() => handleSort("enrolledDate")}
                >
                  Enrolled {sortBy === "enrolledDate" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance (%)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No students found. <Button variant="link" onClick={() => setSearchTerm("")}>Clear filters</Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge variant={student.grade.includes("A") ? "default" : "secondary"}>
                        {student.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(student.enrolledDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Active" ? "default" : "destructive"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{student.attendance}%</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Placeholder - Add with shadcn Pagination component if needed */}
          {filteredStudents.length > 5 && (
            <div className="flex items-center justify-between mt-4">
              <p>Showing 1 to {Math.min(10, filteredStudents.length)} of {filteredStudents.length} results</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                </div>
                <Badge>{selectedStudent.status}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Grade</p>
                  <p className="text-lg">{selectedStudent.grade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Enrolled</p>
                  <p className="text-lg">{new Date(selectedStudent.enrolledDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Attendance</p>
                  <p className="text-lg">{selectedStudent.attendance}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-lg">{selectedStudent.notes}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline">Edit</Button>
                <Button variant="destructive">Deactivate</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}