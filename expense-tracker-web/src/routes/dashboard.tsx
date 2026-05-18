import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

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
import { getStoredUser } from '#/lib/auth'
import { useAuth } from '#/hooks/useAuth'
import { useExpenses, useDeleteExpense } from '#/hooks/useExpenses'
import { UploadExpenseModal } from '#/components/modals/UploadExpenseModal'
import {
  Receipt,
  LayoutDashboard,
  Home as HomeIcon,
  Trash2,
  DollarSign,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  FileImage,
  LogOut
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const user = getStoredUser()

  const { expenses, setExpenses, isLoading } = useExpenses()
  const { deleteExpense } = useDeleteExpense()

  // Auto-calculated stats
  const totalSpending = expenses.reduce((acc, curr) => acc + curr.amount, 0)
  const activeTransactions = expenses.length
  const monthlyAverage = activeTransactions > 0 ? totalSpending / activeTransactions : 0

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
      setExpenses(expenses.filter((exp) => exp.id !== id))
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  }

  // Handle Logout
  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }



  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* 1. Sidebar - Left Panel */}
      <aside className="w-[280px] bg-[#111111] border-r border-[#222]/60 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-20">
        <div className="flex flex-col">
          {/* Logo / Brand */}
          <div className="px-6 py-6 border-b border-[#222]/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#f97316] flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.35)]">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Expense<span className="text-[#f97316]">Flow</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1">
            <Link to="/" className="text-gray-400 hover:text-white">
              <div className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#1a1a1a] transition-all group">
                <HomeIcon className="w-4 h-4 group-hover:text-[#f97316] transition-colors" />
                <span className="text-sm font-medium">Home</span>
              </div>
            </Link>

            <Link to="/dashboard">
              <div className="flex items-center justify-between px-4 py-3 rounded-md bg-[#1a1a1a] border-l-2 border-[#f97316] text-white transition-all">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-[#f97316]" />
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
                <Badge className="bg-[#f97316]/20 border border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/20 py-0 px-1.5 text-[10px]">
                  Live
                </Badge>
              </div>
            </Link>
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
      <main className="flex-1 flex flex-col p-8 md:p-12 max-w-7xl mx-auto overflow-y-auto z-10 relative">
        {/* Decorative Ambient Radial */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)] blur-[60px] pointer-events-none z-0" />

        {/* Dashboard Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 font-sans">Dashboard</h1>
            <p className="text-sm text-gray-400 font-light">
              Manage your corporate outlays, subscription services, and receipt logs.
            </p>
          </div>

          <UploadExpenseModal onUploadSuccess={(newExpense) => setExpenses([newExpense, ...expenses])} />
        </div>

        {/* 3. Summary Cards Component Row */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#111] border-[#222]/60 text-white rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Total Spending</CardTitle>
              <DollarSign className="w-4 h-4 text-[#f97316]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-white">${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#f97316]" /> Real-time active total sum
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#222]/60 text-white rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Monthly Average</CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-white">${monthlyAverage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                Average transaction value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#222]/60 text-white rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Active Transactions</CardTitle>
              <FileText className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-white">{activeTransactions}</div>
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                Registered expense records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 4. Table Component Section - Expense List */}
        <div className="relative z-10 bg-[#111] border border-[#222]/60 rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-[#222]/40 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Expense Records</h2>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Full history of cataloged expenses, receipts, and approval processes.
              </p>
            </div>
            <Badge className="bg-[#1c1c1c] text-gray-400 hover:bg-[#1c1c1c] border border-[#222] font-normal px-2.5 py-0.5">
              Showing {expenses.length} records
            </Badge>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-400">Loading expenses...</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-600 mb-3" />
                <h3 className="text-base font-semibold text-gray-300">No expenses recorded</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs font-light">
                  Get started by uploading your first expense item and receipt copy.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#0c0c0c] hover:bg-[#0c0c0c] border-b border-[#222]/60">
                  <TableRow className="border-b border-[#222]/40">
                    <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase py-4 pl-6">Description</TableHead>
                    <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase py-4">Amount</TableHead>
                    <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase py-4">Expense Date</TableHead>
                    <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase py-4">Receipt Attachment</TableHead>
                    <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase py-4">Status</TableHead>
                    <TableHead className="text-right text-gray-400 font-semibold text-xs tracking-wider uppercase py-4 pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id} className="border-b border-[#222]/30 hover:bg-[#1c1c1c]/40 transition-colors">
                      {/* Description */}
                      <TableCell className="font-medium text-white py-4 pl-6 max-w-xs truncate">
                        {expense.description}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="font-bold text-[#f97316] py-4">
                        ${expense.amount.toFixed(2)}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-gray-300 text-sm py-4">
                        {new Date(expense.expenseDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>

                      {/* Photo/Receipt Preview */}
                      <TableCell className="py-4">
                        {expense.photoUrl ? (
                          <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-8 h-8 rounded border border-[#222] overflow-hidden bg-black shrink-0 relative">
                              <img
                                src={expense.photoUrl}
                                alt="Receipt attachment"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
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
                        ) : (
                          <span className="text-xs text-gray-600 italic">No receipt attached</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        {expense.status === 'Approved' ? (
                          <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 gap-1 font-normal py-0.5">
                            <CheckCircle className="w-3 h-3" /> Approved
                          </Badge>
                        ) : (
                          <Badge className="bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] hover:bg-[#f97316]/10 gap-1 font-normal py-0.5">
                            <Clock className="w-3 h-3" /> Pending
                          </Badge>
                        )}
                      </TableCell>

                      {/* Action (Delete) */}
                      <TableCell className="text-right py-4 pr-6">
                        <Button
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
          </div>
        </div>
      </main>
    </div>
  )
}
