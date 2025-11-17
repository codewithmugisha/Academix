"use client"

import * as React from "react"
import {
  Search,
  User,
  FileText,
  Calendar,
  DollarSign,
  Plus,
  Eye,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
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
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Toaster } from "sonner"
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
// Mock Data (Replace with API)
// ————————————————————————————————————————
type ClaimStatus = "Pending" | "Approved" | "Rejected"

interface Claim {
  id: number
  studentId: number
  studentName: string
  type: "Medical" | "Financial Aid" | "Excused Absence" | "Other"
  amount?: number
  dateSubmitted: string
  status: ClaimStatus
  description: string
  evidence?: string[]
  notes?: string
}

const mockClaims: Claim[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Alice Johnson",
    type: "Medical",
    amount: 150,
    dateSubmitted: "2025-11-10",
    status: "Approved",
    description: "Doctor visit for flu",
    evidence: ["receipt.pdf"],
    notes: "Approved by nurse",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Bob Smith",
    type: "Excused Absence",
    amount: null,
    dateSubmitted: "2025-11-12",
    status: "Pending",
    description: "Family wedding",
    evidence: ["invitation.jpg"],
  },
  {
    id: 3,
    studentId: 3,
    studentName: "Carol Davis",
    type: "Financial Aid",
    amount: 500,
    dateSubmitted: "2025-11-08",
    status: "Rejected",
    description: "Textbook reimbursement",
    notes: "Insufficient proof",
  },
  {
    id: 4,
    studentId: 4,
    studentName: "David Wilson",
    type: "Other",
    amount: 75,
    dateSubmitted: "2025-11-14",
    status: "Pending",
    description: "Field trip fee",
  },
  {
    id: 5,
    studentId: 5,
    studentName: "Eva Martinez",
    type: "Medical",
    amount: 200,
    dateSubmitted: "2025-11-13",
    status: "Approved",
    description: "Dental checkup",
    evidence: ["bill.pdf", "xray.jpg"],
  },
]

// ————————————————————————————————————————
// Derived Analytics
// ————————————————————————————————————————
const getStatusData = (claims: Claim[]) => {
  const status = claims.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {} as Record<ClaimStatus, number>)
  return Object.entries(status).map(([name, value]) => ({ name, value }))
}

const getMonthlyTrend = (claims: Claim[]) => {
  const monthly = claims.reduce((acc, c) => {
    const month = format(new Date(c.dateSubmitted), "MMM yyyy")
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(monthly)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}

const COLORS = ["#FFBB28", "#00C49F", "#FF8042"]

// ————————————————————————————————————————
// Main Component
// ————————————————————————————————————————
export default function ClaimsComponent() {
  const [claims, setClaims] = React.useState<Claim[]>(mockClaims)
  const [filtered, setFiltered] = React.useState<Claim[]>(claims)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [filterType, setFilterType] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<keyof Claim>("dateSubmitted")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")
  const [selectedClaim, setSelectedClaim] = React.useState<Claim | null>(null)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Form state
  const [newClaim, setNewClaim] = React.useState({
    studentName: "",
    type: "Medical" as Claim["type"],
    amount: "",
    description: "",
  })

  // Simulate fetch
  React.useEffect(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  // Filter + Search + Sort
  React.useEffect(() => {
    let result = [...claims]

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== "all") {
      result = result.filter((c) => c.status === filterStatus)
    }

    if (filterType !== "all") {
      result = result.filter((c) => c.type === filterType)
    }

    result.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFiltered(result)
  }, [searchTerm, filterStatus, filterType, sortBy, sortOrder, claims])

  const handleSort = (key: keyof Claim) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("desc")
    }
  }

  const handleAddClaim = () => {
    const id = Math.max(...claims.map((c) => c.id)) + 1
    const claim: Claim = {
      id,
      studentId: id,
      studentName: newClaim.studentName,
      type: newClaim.type,
      amount: newClaim.amount ? Number(newClaim.amount) : undefined,
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "Pending",
      description: newClaim.description,
    }
    setClaims([claim, ...claims])
    setIsAddOpen(false)
    toast({ title: "Claim submitted", description: "Review pending." })
    setNewClaim({ studentName: "", type: "Medical", amount: "", description: "" })
  }

  const handleStatusChange = (claimId: number, newStatus: ClaimStatus) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: newStatus } : c))
    )
    toast({ title: `Claim ${newStatus}`, description: "Status updated." })
  }

  const exportCSV = () => {
    const headers = ["ID", "Student", "Type", "Amount", "Date", "Status", "Description"]
    const rows = filtered.map((c) => [
      c.id,
      c.studentName,
      c.type,
      c.amount ?? "",
      c.dateSubmitted,
      c.status,
      `"${c.description.replace(/"/g, '""')}"`,
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `claims-export-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    toast({ title: "Export ready", description: "CSV downloaded." })
  }

  const statusData = getStatusData(filtered)
  const monthlyData = getMonthlyTrend(filtered)
  const totalPending = filtered.filter((c) => c.status === "Pending").length
  const totalAmountApproved = filtered
    .filter((c) => c.status === "Approved" && c.amount)
    .reduce((sum, c) => sum + (c.amount || 0), 0)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Claims Management</h1>
          <p className="text-muted-foreground">
            Review, approve, or reject student claims. Total: {filtered.length}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmountApproved}</div>
              <p className="text-xs text-muted-foreground">Total disbursed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyData[monthlyData.length - 1]?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">Claims submitted</p>
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
              <CardTitle>Claims by Status</CardTitle>
              <CardDescription>Current distribution</CardDescription>
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
                    {statusData.map((entry, i) => (
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
              <CardTitle>Monthly Trend</CardTitle>
              <CardDescription>Claims over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Claims List</CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Claim
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>New Claim</DialogTitle>
                  <DialogDescription>Submit on behalf of a student</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Student Name</Label>
                    <Input
                      placeholder="e.g. Alice Johnson"
                      value={newClaim.studentName}
                      onChange={(e) => setNewClaim({ ...newClaim, studentName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Claim Type</Label>
                    <Select
                      value={newClaim.type}
                      onValueChange={(v) => setNewClaim({ ...newClaim, type: v as Claim["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Financial Aid">Financial Aid</SelectItem>
                        <SelectItem value="Excused Absence">Excused Absence</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {["Medical", "Financial Aid", "Other"].includes(newClaim.type) && (
                    <div>
                      <Label>Amount (USD)</Label>
                      <Input
                        type="number"
                        placeholder="150"
                        value={newClaim.amount}
                        onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
                      />
                    </div>
                  )}
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Reason for claim..."
                      value={newClaim.description}
                      onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddClaim} disabled={!newClaim.studentName || !newClaim.description}>
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="flex flex-col sm:flex-row gap-3 pb-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student or description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Financial Aid">Financial Aid</SelectItem>
                <SelectItem value="Excused Absence">Excused Absence</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
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
                    Student {sortBy === "studentName" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:underline"
                    onClick={() => handleSort("type")}
                  >
                    Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead
                    className="cursor-pointer hover:underline"
                    onClick={() => handleSort("dateSubmitted")}
                  >
                    Submitted {sortBy === "dateSubmitted" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No claims found.{" "}
                      <Button variant="link" onClick={() => { setSearchTerm(""); setFilterStatus("all"); setFilterType("all"); }}>
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>{claim.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {claim.studentName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{claim.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {claim.amount != null ? `$${claim.amount}` : "—"}
                      </TableCell>
                      <TableCell>{format(new Date(claim.dateSubmitted), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            claim.status === "Approved"
                              ? "default"
                              : claim.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {claim.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {claim.status === "Pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(claim.id, "Approved")}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(claim.id, "Rejected")}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Claim Details Dialog */}
        <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Claim Details</DialogTitle>
            </DialogHeader>
            {selectedClaim && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedClaim.studentName}</h3>
                    <p className="text-sm text-muted-foreground">ID: {selectedClaim.id}</p>
                  </div>
                  <Badge
                    variant={
                      selectedClaim.status === "Approved"
                        ? "default"
                        : selectedClaim.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedClaim.status}
                  </Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Type</p>
                    <p>{selectedClaim.type}</p>
                  </div>
                  <div>
                    <p className="font-medium">Amount</p>
                    <p>{selectedClaim.amount ? `$${selectedClaim.amount}` : "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Submitted</p>
                    <p>{format(new Date(selectedClaim.dateSubmitted), "PPP")}</p>
                  </div>
                  <div>
                    <p className="font-medium">Evidence</p>
                    <p>
                      {selectedClaim.evidence?.length
                        ? selectedClaim.evidence.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-sm mt-1">{selectedClaim.description}</p>
                </div>
                {selectedClaim.notes && (
                  <div>
                    <p className="font-medium">Admin Notes</p>
                    <p className="text-sm italic">{selectedClaim.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Notify Student
                  </Button>
                  {selectedClaim.status === "Pending" && (
                    <>
                      <Button onClick={() => handleStatusChange(selectedClaim.id, "Approved")}>
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusChange(selectedClaim.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  )
}