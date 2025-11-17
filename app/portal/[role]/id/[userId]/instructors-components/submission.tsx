"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { format, isPast, differenceInMinutes } from "date-fns"
import {
  Upload, FileText, X, Clock, Users, Check, Loader2,
  Edit3, Eye, Download, AlertCircle, CheckCircle, UserCheck, UserX,
  TrendingUp, FileCheck, FileX,
  CalendarIcon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

interface UploadedFile {
  file: File
  preview?: string
  name: string
  size: number
}

interface Student {
  id: string
  name: string
  email: string
  submitted: boolean
  submittedAt?: string
  answerFile?: string
  answerText?: string
  score?: number
  isLate?: boolean
}

interface Quiz {
  id: string
  title: string
  instructions: string
  dueDate: string
  createdAt: string
  fileCount: number
  questionCount: number
  totalStudents: number
  students: Student[]
}

const mockQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Weekly Biology Quiz",
    instructions: "Answer all 10 MCQs. No partial credit.",
    dueDate: "2025-11-16T23:59:00",
    createdAt: "2025-11-14",
    fileCount: 0,
    questionCount: 10,
    totalStudents: 32,
    students: [
      { id: "s1", name: "Alice Johnson", email: "alice@school.com", submitted: true, submittedAt: "2025-11-15T10:30:00", answerFile: "alice-bio.pdf", score: 8 },
      { id: "s2", name: "Bob Smith", email: "bob@school.com", submitted: true, submittedAt: "2025-11-15T11:15:00", answerFile: "bob-bio.docx", score: 7 },
      { id: "s3", name: "Carol Davis", email: "carol@school.com", submitted: false },
      { id: "s4", name: "David Wilson", email: "david@school.com", submitted: true, submittedAt: "2025-11-15T09:45:00", score: 10 },
      { id: "s5", name: "Eva Martinez", email: "eva@school.com", submitted: true, submittedAt: "2025-11-17T01:15:00", score: 6, isLate: true },
      { id: "s6", name: "Frank Lee", email: "frank@school.com", submitted: false },
    ]
  },
  {
    id: "q2",
    title: "Grammar Pop Quiz",
    instructions: "5 questions. 2 points each.",
    dueDate: "2025-11-15T12:00:00",
    createdAt: "2025-11-12",
    fileCount: 1,
    questionCount: 5,
    totalStudents: 30,
    students: [
      { id: "s1", name: "Alice Johnson", email: "alice@school.com", submitted: true, submittedAt: "2025-11-14T14:20:00", score: 9 },
      { id: "s2", name: "Bob Smith", email: "bob@school.com", submitted: false },
      { id: "s5", name: "Eva Martinez", email: "eva@school.com", submitted: true, submittedAt: "2025-11-15T11:55:00", score: 8 },
      { id: "s7", name: "Grace Kim", email: "grace@school.com", submitted: true, submittedAt: "2025-11-15T13:10:00", score: 7, isLate: true },
    ]
  }
]

const COLORS = ["#10b981", "#ef4444", "#f59e0b"]

export default function SubmissionPage() {
  const [quizzes] = React.useState<Quiz[]>(mockQuizzes)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [instructions, setInstructions] = React.useState("")
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(f => ({
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      name: f.name,
      size: f.size,
    }))
    setUploadedFiles(p => [...p, ...newFiles])
    toast.success(`${acceptedFiles.length} file(s) uploaded`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true })

  const removeFile = (i: number) => {
    const f = uploadedFiles[i]
    if (f.preview) URL.revokeObjectURL(f.preview)
    setUploadedFiles(p => p.filter((_, idx) => idx !== i))
    toast.info(`Removed: ${f.name}`)
  }

  const handleCreateQuiz = async () => {
    if (!title.trim() || !dueDate) return toast.error("Title and due date required")
    setIsCreating(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success("Quiz created!", { description: "Students notified" })
    setTitle(""); setInstructions(""); setDueDate(undefined); setUploadedFiles([])
    setIsCreating(false)
  }

  // Global Stats
  const totalQuizzes = quizzes.length
  const totalStudents = quizzes.reduce((sum, q) => sum + q.totalStudents, 0)
  const totalSubmitted = quizzes.reduce((sum, q) => sum + q.students.filter(s => s.submitted).length, 0)
  const totalPending = totalStudents - totalSubmitted
  const totalLate = quizzes.reduce((sum, q) => sum + q.students.filter(s => s.submitted && s.isLate).length, 0)

  const pieData = [
    { name: "Submitted", value: totalSubmitted, color: "#10b981" },
    { name: "Pending", value: totalPending, color: "#ef4444" },
    { name: "Late", value: totalLate, color: "#f59e0b" },
  ]

  const barData = quizzes.map(q => {
    const submitted = q.students.filter(s => s.submitted).length
    const late = q.students.filter(s => s.submitted && s.isLate).length
    return {
      name: q.title,
      submitted,
      pending: q.totalStudents - submitted,
      late,
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Submissions Dashboard</h1>
        <p className="text-muted-foreground">Track student quiz submissions and performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalSubmitted}</div>
            <p className="text-xs text-muted-foreground">{((totalSubmitted / totalStudents) * 100).toFixed(0)}% of students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalLate}</div>
            <p className="text-xs text-muted-foreground">Submitted after deadline</p>
          </CardContent>
        </Card>
      </div>

      {/* Submitted Students List (Top) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Students Who Submitted
          </CardTitle>
          <CardDescription>
            {totalSubmitted} out of {totalStudents} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {quizzes.flatMap(q => q.students.filter(s => s.submitted)).map((student, i) => (
              <div
                key={`${student.id}-${i}`}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                {student.score !== undefined && (
                  <Badge variant="secondary">{student.score}/10</Badge>
                )}
                {student.isLate && (
                  <Badge variant="destructive" className="text-xs">Late</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Quiz Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Create New Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              <Input placeholder="e.g. Weekly Grammar Quiz" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start", !dueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="md:col-span-2">
              <Label>Instructions</Label>
              <Textarea placeholder="e.g. 10 MCQs. 2 points each." value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} />
            </div>
            <div className="md:col-span-2">
              <Label>Upload Question File (Optional)</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm">{isDragActive ? "Drop here..." : "Drag files or click"}</p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span className="truncate">{f.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(i)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleCreateQuiz} disabled={isCreating || !title || !dueDate} className="w-full md:w-auto">
                {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <><Check className="mr-2 h-4 w-4" /> Create Quiz</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radial (Pie) Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>Overall completion breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions by Quiz</CardTitle>
            <CardDescription>Submitted, pending, and late per quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submitted" fill="#10b981" />
                <Bar dataKey="pending" fill="#ef4444" />
                <Bar dataKey="late" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}