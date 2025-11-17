"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import {
  Upload, FileText, X, Plus, Clock, Users, Check, Loader2,
  File, Edit3, Eye, Download,
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

interface UploadedFile {
  file: File
  preview?: string
  name: string
  size: number
}

interface SharedExam {
  id: string
  title: string
  createdAt: string
  dueDate: string
  fileCount: number
  questionCount: number
}

const mockSharedExams: SharedExam[] = [
  { id: "1", title: "Midterm Mathematics", createdAt: "2025-11-10", dueDate: "2025-11-20", fileCount: 1, questionCount: 20 },
  { id: "2", title: "Physics Final", createdAt: "2025-11-08", dueDate: "2025-11-25", fileCount: 2, questionCount: 15 },
  { id: "3", title: "Chemistry Quiz", createdAt: "2025-11-05", dueDate: "2025-11-18", fileCount: 0, questionCount: 10 },
]

export default function ExamPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [instructions, setInstructions] = React.useState("")
  const [questions, setQuestions] = React.useState("")
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [sharedExams] = React.useState<SharedExam[]>(mockSharedExams)

  React.useEffect(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      name: file.name,
      size: file.size,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
    toast.success(`${acceptedFiles.length} file(s) uploaded`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "image/*": [] },
    multiple: true,
  })

  const removeFile = (index: number) => {
    const removed = uploadedFiles[index]
    if (removed.preview) URL.revokeObjectURL(removed.preview)
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    toast.info(`Removed: ${removed.name}`)
  }

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Title is required")
    if (!dueDate) return toast.error("Due date is required")

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))

    toast.success("Exam created successfully!", {
      description: `${uploadedFiles.length} files • ${questions.split('\n').filter(q => q.trim()).length} questions`,
    })

    // Reset
    setTitle(""); setInstructions(""); setQuestions(""); setDueDate(undefined); setUploadedFiles([])
    setIsSubmitting(false)
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Exam</h1>
        <p className="text-muted-foreground">Upload files or write questions. Set due date and share instantly.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Exam File</CardTitle>
            <CardDescription>PDF, DOCX, or images</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg">Drop files here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Drag & drop files</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-2">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.preview ? (
                        <img src={file.preview} alt="" className="h-10 w-10 object-cover rounded" />
                      ) : (
                        <File className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form + Calendar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input placeholder="e.g. Midterm Mathematics" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <Label>Instructions (Optional)</Label>
                <Textarea placeholder="e.g. Show all work..." value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} />
              </div>

              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Questions (Optional)</Label>
                <Textarea
                  placeholder="1. Solve: 2x + 5 = 13\n2. Define gravity..."
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setTitle(""); setQuestions(""); setUploadedFiles([]); setDueDate(undefined); }}>
              Clear
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !title || !dueDate} className="flex-1">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <><Check className="mr-2 h-4 w-4" /> Create Exam</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Latest Shared Exams */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Latest Shared Exams</CardTitle>
          <CardDescription>Click to view or download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sharedExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(exam.dueDate), "MMM d, yyyy")} • {exam.fileCount} files • {exam.questionCount} questions
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}