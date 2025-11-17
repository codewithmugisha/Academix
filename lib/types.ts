export type ExamType = "exam" | "quiz"

export interface SharedItem {
  id: string
  title: string
  type: ExamType
  createdAt: string
  dueDate: string
  fileCount: number
  questionCount: number
}