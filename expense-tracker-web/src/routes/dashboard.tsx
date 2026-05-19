import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { ScrollArea } from '#/components/ui/scroll-area'
import { toast } from '#/components/ui/toast'
import { getStoredUser } from '#/lib/auth'
import { useAuth } from '#/hooks/useAuth'
import { useExpenses, useDeleteExpense } from '#/hooks/useExpenses'
import { UploadExpenseModal } from '#/components/modals/UploadExpenseModal'
import {
  Receipt,
  LayoutDashboard,
  Trash2,
  FileText,
  TrendingUp,
  AlertCircle,
  FileImage,
  LogOut,
  Search,
  ChevronDown,
  Pencil,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const { logout } = useAuth()
  const navigate = useNavigate()
  const user = getStoredUser()

  const { expenses, setExpenses, isLoading } = useExpenses()
  const { deleteExpense } = useDeleteExpense()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<
    'latest_date' | 'oldest_date' | 'highest_amount' | 'lowest_amount'
  >('latest_date')

  const sortLabels = {
    latest_date: 'Latest Date',
    oldest_date: 'Oldest Date',
    highest_amount: 'Highest Amount',
    lowest_amount: 'Lowest Amount',
  }

  // Filter & Sort expenses
  const filteredExpenses = expenses
    .filter((expense) =>
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'latest_date':
          return (
            new Date(b.expenseDate).getTime() -
            new Date(a.expenseDate).getTime()
          )
        case 'oldest_date':
          return (
            new Date(a.expenseDate).getTime() -
            new Date(b.expenseDate).getTime()
          )
        case 'highest_amount':
          return b.amount - a.amount
        case 'lowest_amount':
          return a.amount - b.amount
        default:
          return 0
      }
    })

  // Auto-calculated stats
  const totalSpending = filteredExpenses.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  )
  const activeTransactions = filteredExpenses.length
  const monthlyAverage =
    activeTransactions > 0 ? totalSpending / activeTransactions : 0

  // User initials for avatar fallback
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id)
      toast({
        title: 'Expense deleted',
        description: 'The expense record has been removed.',
      })
      setExpenses(expenses.filter((exp) => exp.id !== id))
    } catch (error) {
      console.error('Failed to delete expense:', error)
      toast({
        title: 'Delete failed',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      })
    }
  }

  // Handle Logout
  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* 1. Sidebar - Left Panel */}
      <aside className="w-[280px] bg-[#111111] border-r border-[#222]/60 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-20">
        <div className="flex flex-col">
          {/* Logo / Brand */}
          <div className="px-6 py-6 border-b border-[#222]/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#f97316] flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.35)]">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Expense <span className="text-[#f97316]">Tracker</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1">
            <Link to="/dashboard">
              <div className="flex items-center justify-between px-4 py-3 rounded-md bg-[#1a1a1a] border-l-2 border-[#f97316] text-white transition-all">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-[#f97316]" />
                  <span className="text-sm font-medium">Track</span>
                </div>
                <Badge className="bg-[#f97316]/20 border border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/20 py-0 px-1.5 text-[10px]">
                  Live
                </Badge>
              </div>
            </Link>

            <div className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-500 cursor-not-allowed group">
              <FileText className="w-4 h-4 group-hover:text-gray-400 transition-colors" />
              <span className="text-sm font-medium">About</span>
            </div>
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-[#222]/40 bg-[#0d0d0d]">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="w-10 h-10 border border-[#222]">
              <AvatarImage src={user?.pictureUrl ?? undefined} />
              <AvatarFallback className="bg-[#f97316]/10 text-[#f97316] font-semibold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate text-white">
                {user?.name ?? 'User'}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.email ?? ''}
              </span>
            </div>
          </div>
          <div className="mt-3 px-2 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-gray-600">Online</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors h-7 px-2 text-xs gap-1"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <main className="flex-1 flex flex-col pt-6 px-6 pb-4 md:pt-8 md:px-8 md:pb-4 max-w-7xl mx-auto overflow-hidden min-h-0 z-10 relative w-full">
        {/* Decorative Ambient Radial */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)] blur-[60px] pointer-events-none z-0" />

        {/* Dashboard Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1 font-sans">
              Dashboard
            </h1>
            <p className="text-xs text-gray-400 font-light">
              Manage your corporate outlays, subscription services, and receipt
              logs.
            </p>
          </div>

          <UploadExpenseModal
            onUploadSuccess={(newExpense) =>
              setExpenses([newExpense, ...expenses])
            }
          />
        </div>

        {/* 3. Summary Cards Component Row */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <Card className="bg-[#111] border-[#222]/60 text-white rounded-lg shadow-sm py-4 gap-4">
            <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 px-5">
              <CardTitle className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Total Spending
              </CardTitle>
              <span className="flex h-4 w-4 items-center justify-center text-[#f97316] font-bold leading-none">
                ₱
              </span>
            </CardHeader>
            <CardContent className="px-5">
              <div className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                ₱
                {totalSpending.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-[11px] leading-none text-gray-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#f97316]" /> Real-time
                active total sum
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#222]/60 text-white rounded-lg shadow-sm py-4 gap-4">
            <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 px-5">
              <CardTitle className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Monthly Average
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent className="px-5">
              <div className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                ₱
                {monthlyAverage.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-[11px] leading-none text-gray-500 mt-1 flex items-center gap-1">
                Average transaction value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#222]/60 text-white rounded-lg shadow-sm py-4 gap-4">
            <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 px-5">
              <CardTitle className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Logged Transactions
              </CardTitle>
              <FileText className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent className="px-5">
              <div className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                {activeTransactions}
              </div>
              <p className="text-[11px] leading-none text-gray-500 mt-1 flex items-center gap-1">
                Registered expense records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 4. Table Component Section - Expense List */}
        <div className="relative z-10 bg-[#111] border border-[#222]/60 rounded-lg overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="px-5 py-3 border-b border-[#222]/40 flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-base font-bold text-white">
                Expense Records
              </h2>
              <p className="text-[11px] text-gray-400 font-light">
                Full history of cataloged expenses, receipts, and approval
                processes.
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-9 bg-[#111] border-[#222] text-white placeholder-gray-600 focus-visible:ring-[#f97316] focus-visible:border-[#f97316]"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  Sort by:
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#111] border-[#222] text-white hover:bg-[#1c1c1c] hover:text-white px-2.5"
                    >
                      {sortLabels[sortOrder]}
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[160px] bg-[#111] border-[#222] text-white"
                  >
                    <DropdownMenuItem
                      onClick={() => setSortOrder('latest_date')}
                      className="focus:bg-[#1c1c1c] focus:text-white cursor-pointer"
                    >
                      Latest Date
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOrder('oldest_date')}
                      className="focus:bg-[#1c1c1c] focus:text-white cursor-pointer"
                    >
                      Oldest Date
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOrder('highest_amount')}
                      className="focus:bg-[#1c1c1c] focus:text-white cursor-pointer"
                    >
                      Highest Amount
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOrder('lowest_amount')}
                      className="focus:bg-[#1c1c1c] focus:text-white cursor-pointer"
                    >
                      Lowest Amount
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-x-auto">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-[21%]" />
                <col className="w-[14%]" />
                <col className="w-[18%]" />
                <col className="w-[27%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
              </colgroup>
              <TableHeader className="bg-black hover:bg-black border-b border-[#222]/60">
                <TableRow className="border-b border-[#222]/40">
                  <TableHead className="bg-black text-gray-400 font-semibold text-[12px] tracking-wider uppercase py-3.5 pl-6">
                    Description
                  </TableHead>
                  <TableHead className="bg-black text-gray-400 font-semibold text-[12px] tracking-wider uppercase py-3.5">
                    Amount
                  </TableHead>
                  <TableHead className="bg-black text-gray-400 font-semibold text-[12px] tracking-wider uppercase py-3.5">
                    Expense Date
                  </TableHead>
                  <TableHead className="bg-black text-gray-400 font-semibold text-[12px] tracking-wider uppercase py-3.5">
                    Receipt Attachment
                  </TableHead>
                  <TableHead className="bg-black text-gray-400 font-semibold text-[12px] tracking-wider uppercase py-3.5">
                    Edit
                  </TableHead>
                  <TableHead className="bg-black text-right text-gray-400 font-semibold text-[12px] tracking-wider uppercase py-3.5 pr-6">
                    Delete
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>

            <ScrollArea className="flex-1 min-h-0 pb-[6px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-gray-400">Loading expenses...</p>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-full py-16 px-4 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-500/70 mb-3" />
                  <h3 className="text-base font-semibold text-gray-400">
                    No expenses recorded
                  </h3>
                  <p className="text-xs text-gray-500/80 mt-1 max-w-xs font-light">
                    Get started by uploading your first expense item and receipt
                    copy.
                  </p>
                </div>
              ) : (
                <Table className="table-fixed">
                  <colgroup>
                    <col className="w-[21%]" />
                    <col className="w-[14%]" />
                    <col className="w-[18%]" />
                    <col className="w-[27%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                  </colgroup>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow
                        key={expense.id}
                        className="border-b border-[#222]/30 hover:bg-[#1c1c1c]/40 transition-colors"
                      >
                        {/* Description */}
                        <TableCell className="font-medium text-white py-4 pl-6 max-w-xs truncate">
                          {expense.description}
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="font-bold text-[#f97316] py-4">
                          ₱{expense.amount.toFixed(2)}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-gray-300 text-sm py-4">
                          {new Date(expense.expenseDate).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </TableCell>

                        {/* Photo/Receipt Preview */}
                        <TableCell className="py-4">
                          {expense.photoUrl ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="flex items-center gap-2 group cursor-pointer">
                                  <div className="w-8 h-8 rounded border border-[#222] overflow-hidden bg-black shrink-0 relative">
                                    <img
                                      src={expense.photoUrl}
                                      alt="Receipt attachment"
                                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                      onError={(e) => {
                                        ;(
                                          e.target as HTMLElement
                                        ).style.display = 'none'
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <FileImage className="w-3 h-3 text-white" />
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-400 group-hover:text-[#f97316] transition-colors font-light max-w-[100px] truncate">
                                    View Attachment
                                  </span>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="bg-[#111] border border-[#222]/80 text-white sm:max-w-3xl flex justify-center p-2 pt-8">
                                <DialogTitle className="sr-only">
                                  Receipt Attachment
                                </DialogTitle>
                                <img
                                  src={expense.photoUrl}
                                  alt="Receipt attachment full size"
                                  className="max-h-[80vh] max-w-full object-contain rounded-md"
                                />
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-xs text-gray-600 italic">
                              No receipt attached
                            </span>
                          )}
                        </TableCell>

                        {/* Action (Edit) */}
                        <TableCell className="py-4">
                          <UploadExpenseModal
                            mode="update"
                            expense={expense}
                            onUpdateSuccess={(updatedExpense) =>
                              setExpenses(
                                expenses.map((exp) =>
                                  exp.id === updatedExpense.id
                                    ? updatedExpense
                                    : exp,
                                ),
                              )
                            }
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors h-8 w-8"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </TableCell>

                        {/* Action (Delete) */}
                        <TableCell className="text-right py-4 pr-6">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(expense.id)}
                            className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  )
}
