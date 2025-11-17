"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { format } from "date-fns"
import {
  Upload, FileText, X, Plus,  Clock, Users, Check, Loader2,
  Edit3, Eye, Download,
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

interface SharedQuiz {
  id: string
  title: string
  createdAt: string
  dueDate: string
  fileCount: number
  questionCount: number
}

const mockSharedQuizzes: SharedQuiz[] = [
  { id: "q1", title: "Weekly Biology Quiz", createdAt: "2025-11-14", dueDate: "2025-11-16", fileCount: 0, questionCount: 10 },
  { id: "q2", title: "Grammar Pop Quiz", createdAt: "2025-11-12", dueDate: "2025-11-15", fileCount: 1, questionCount: 8 },
]

export default function QuizPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [questions, setQuestions] = React.useState("")
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800) }, [])

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

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Title required")
    if (!dueDate) return toast.error("Due date required")

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success("Quiz created!", { description: "Students notified" })
    setTitle(""); setQuestions(""); setDueDate(undefined); setUploadedFiles([])
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
        <p className="text-muted-foreground">Quick assessments with instant feedback.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Quiz File</CardTitle>
            <CardDescription>Optional: PDF or image</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? <p>Drop here...</p> : <p>Drag files or click</p>}
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <span className="truncate">{f.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(i)}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div>
                <Label>Questions</Label>
                <Textarea
                  placeholder="1. What is a verb?\n2. Fix: He go to school..."
                  value={questions}
                  onChange={e => setQuestions(e.target.value)}
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} disabled={isSubmitting || !title || !dueDate} className="w-full">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <><Check className="mr-2 h-4 w-4" /> Create Quiz</>}
          </Button>
        </div>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSharedQuizzes.map(q => (
              <div key={q.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Edit3 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{q.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {format(new Date(q.dueDate), "MMM d")}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}