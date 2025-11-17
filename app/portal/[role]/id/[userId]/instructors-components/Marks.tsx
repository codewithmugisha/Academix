// app/(dashboard)/marks/page.tsx
"use client"

import * as React from "react"
import {
  Search,
  Plus,
  Download,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Award,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
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
import { format } from "date-fns"

// ————————————————————————————————————————
// Types & Mock Data
// ————————————————————————————————————————
type AcademicYear = "2024-2025" | "2025-2026"
type Term = "Term 1" | "Term 2" | "Term 3"

interface Mark {
  id: number
  studentId: number
  studentName: string
  subject: string
  mark: number
  maxMark: number
  date: string
  academicYear: AcademicYear
  term: Term
  grade: string
}

const mockMarks: Mark[] = [
  { id: 1, studentId: 1, studentName: "Alice Johnson", subject: "Mathematics", mark: 92, maxMark: 100, date: "2025-03-15", academicYear: "2024-2025", term: "Term 1", grade: "A" },
  { id: 2, studentId: 2, studentName: "Bob Smith", subject: "English", mark: 78, maxMark: 100, date: "2025-03-16", academicYear: "2024-2025", term: "Term 1", grade: "B+" },
  { id: 3, studentId: 1, studentName: "Alice Johnson", subject: "Physics", mark: 85, maxMark: 100, date: "2025-06-10", academicYear: "2024-2025", term: "Term 2", grade: "A-" },
  { id: 4, studentId: 3, studentName: "Carol Davis", subject: "Chemistry", mark: 70, maxMark: 100, date: "2025-06-11", academicYear: "2024-2025", term: "Term 2", grade: "B" },
  { id: 5, studentId: 4, studentName: "David Wilson", subject: "History", mark: 88, maxMark: 100, date: "2025-09-05", academicYear: "2025-2026", term: "Term 1", grade: "A" },
  { id: 6, studentId: 5, studentName: "Eva Martinez", subject: "Biology", mark: 65, maxMark: 100, date: "2025-09-06", academicYear: "2025-2026", term: "Term 1", grade: "C+" },
]

const getGrade = (percentage: number): string => {
  if (percentage >= 90) return "A"
  if (percentage >= 80) return "A-"
  if (percentage >= 70) return "B+"
  if (percentage >= 60) return "B"
  if (percentage >= 50) return "C+"
  if (percentage >= 40) return "C"
  return "F"
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

// ————————————————————————————————————————
// Main Component
// ————————————————————————————————————————
export default function MarksComponent() {
  const [marks, setMarks] = React.useState<Mark[]>(mockMarks)
  const [filtered, setFiltered] = React.useState<Mark[]>(marks)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [academicYear, setAcademicYear] = React.useState<AcademicYear | "all">("all")
  const [term, setTerm] = React.useState<Term | "all">("all")
  const [sortBy, setSortBy] = React.useState<keyof Mark>("date")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Form state
  const [newMark, setNewMark] = React.useState({
    studentName: "",
    subject: "",
    mark: "",
    maxMark: "100",
    date: format(new Date(), "yyyy-MM-dd"),
    academicYear: "2025-2026" as AcademicYear,
    term: "Term 1" as Term,
  })

  // Simulate loading
  React.useEffect(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  // Filter + Sort
  React.useEffect(() => {
    let result = [...marks]

    if (searchTerm) {
      result = result.filter(
        (m) =>
          m.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (academicYear !== "all") {
      result = result.filter((m) => m.academicYear === academicYear)
    }

    if (term !== "all") {
      result = result.filter((m) => m.term === term)
    }

    result.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFiltered(result)
  }, [searchTerm, academicYear, term, sortBy, sortOrder, marks])

  const handleSort = (key: keyof Mark) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("desc")
    }
  }

  const handleAddMark = () => {
    const percentage = (Number(newMark.mark) / Number(newMark.maxMark)) * 100
    const grade = getGrade(percentage)
    const id = Math.max(...marks.map((m) => m.id)) + 1

    const mark: Mark = {
      id,
      studentId: id,
      studentName: newMark.studentName,
      subject: newMark.subject,
      mark: Number(newMark.mark),
      maxMark: Number(newMark.maxMark),
      date: newMark.date,
      academicYear: newMark.academicYear,
      term: newMark.term,
      grade,
    }

    setMarks([mark, ...marks])
    setIsAddOpen(false)
    toast({ title: "Mark recorded", description: `${newMark.subject}: ${newMark.mark}/${newMark.maxMark}` })
    setNewMark({
      studentName: "",
      subject: "",
      mark: "",
      maxMark: "100",
      date: format(new Date(), "yyyy-MM-dd"),
      academicYear: "2025-2026",
      term: "Term 1",
    })
  }

  const exportCSV = () => {
    const headers = ["ID", "Student", "Subject", "Mark", "Max", "Percentage", "Grade", "Date", "Year", "Term"]
    const rows = filtered.map((m) => {
      const percentage = ((m.mark / m.maxMark) * 100).toFixed(1)
      return [
        m.id,
        m.studentName,
        m.subject,
        m.mark,
        m.maxMark,
        percentage,
        m.grade,
        m.date,
        m.academicYear,
        m.term,
      ]
    })
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `marks-export-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    toast({ title: "Export ready", description: "CSV downloaded." })
  }

  // Analytics
  const avgMark = filtered.length > 0
    ? (filtered.reduce((sum, m) => sum + (m.mark / m.maxMark) * 100, 0) / filtered.length).toFixed(1)
    : 0

  const gradeData = filtered.reduce((acc, m) => {
    acc[m.grade] = (acc[m.grade] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const gradeChartData = Object.entries(gradeData).map(([name, value]) => ({ name, value }))

  const subjectData = filtered.reduce((acc, m) => {
    acc[m.subject] = (acc[m.subject] || 0) + m.mark
    return acc
  }, {} as Record<string, number>)
  const subjectChartData = Object.entries(subjectData).map(([subject, total]) => ({
    subject,
    average: Number((total / filtered.filter(m => m.subject === subject).length).toFixed(1)),
  }))

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Marks Management</h1>
          <p className="text-muted-foreground">
            Record, view, and analyze student performance. Total: {filtered.length} marks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgMark}%</div>
              <p className="text-xs text-muted-foreground">Across {filtered.length} entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Grade</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gradeChartData.length > 0 ? gradeChartData.reduce((a, b) => a.value > b.value ? a : b).name : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">{gradeChartData.reduce((sum, g) => sum + g.value, 0)} students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Term</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {term !== "all" ? term : "All Terms"}
              </div>
              <p className="text-xs text-muted-foreground">{academicYear !== "all" ? academicYear : "All Years"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Export</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" onClick={exportCSV} className="w-full">
                Download CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={gradeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {gradeChartData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average by Subject</CardTitle>
              <CardDescription>Performance per subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Marks List</CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record New Mark
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Record New Mark</DialogTitle>
                  <DialogDescription>Enter student performance details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Student Name</Label>
                    <Input
                      placeholder="e.g. Alice Johnson"
                      value={newMark.studentName}
                      onChange={(e) => setNewMark({ ...newMark, studentName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input
                      placeholder="e.g. Mathematics"
                      value={newMark.subject}
                      onChange={(e) => setNewMark({ ...newMark, subject: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Mark</Label>
                      <Input
                        type="number"
                        placeholder="85"
                        value={newMark.mark}
                        onChange={(e) => setNewMark({ ...newMark, mark: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Out of</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={newMark.maxMark}
                        onChange={(e) => setNewMark({ ...newMark, maxMark: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newMark.date}
                      onChange={(e) => setNewMark({ ...newMark, date: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Academic Year</Label>
                      <Select
                        value={newMark.academicYear}
                        onValueChange={(v) => setNewMark({ ...newMark, academicYear: v as AcademicYear })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Term</Label>
                      <Select
                        value={newMark.term}
                        onValueChange={(v) => setNewMark({ ...newMark, term: v as Term })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Term 1">Term 1</SelectItem>
                          <SelectItem value="Term 2">Term 2</SelectItem>
                          <SelectItem value="Term 3">Term 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMark}
                    disabled={!newMark.studentName || !newMark.subject || !newMark.mark}
                  >
                    Save Mark
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="flex flex-col sm:flex-row gap-3 pb-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student or subject..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={academicYear} onValueChange={(v) => setAcademicYear(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={term} onValueChange={(v) => setTerm(v as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="Term 1">Term 1</SelectItem>
                <SelectItem value="Term 2">Term 2</SelectItem>
                <SelectItem value="Term 3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead
                    className="cursor-pointer hover:underline"
                    onClick={() => handleSort("studentName")}
                  >
                    Student {sortBy === "studentName" && (sortOrder === "asc" ? "Up" : "Down")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:underline"
                    onClick={() => handleSort("subject")}
                  >
                    Subject {sortBy === "subject" && (sortOrder === "asc" ? "Up" : "Down")}
                  </TableHead>
                  <TableHead>Mark</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead
                    className="cursor-pointer hover:underline"
                    onClick={() => handleSort("date")}
                  >
                    Date {sortBy === "date" && (sortOrder === "asc" ? "Up" : "Down")}
                  </TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No marks found.{" "}
                      <Button variant="link" onClick={() => { setSearchTerm(""); setAcademicYear("all"); setTerm("all"); }}>
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((mark) => (
                    <TableRow key={mark.id}>
                      <TableCell>{mark.id}</TableCell>
                      <TableCell className="font-medium">{mark.studentName}</TableCell>
                      <TableCell>{mark.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {mark.mark}/{mark.maxMark}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            mark.grade.startsWith("A") ? "default" :
                            mark.grade.startsWith("B") ? "secondary" :
                            mark.grade.startsWith("C") ? "outline" : "destructive"
                          }
                        >
                          {mark.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(mark.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{mark.academicYear}</TableCell>
                      <TableCell>{mark.term}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}