import { useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { DollarSign, FileText, Calendar, Plus } from 'lucide-react'
import { useCreateExpense } from '#/hooks/useExpenses'
import type { Expense } from '#/data/dummy-expenses'

export function UploadExpenseModal({ onUploadSuccess }: { onUploadSuccess: (expense: Expense) => void }) {
  const { createExpense } = useCreateExpense()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoName, setPhotoName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoName(file.name)
      setPhotoFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description || !expenseDate) return

    try {
      const formData = new FormData()
      formData.append('amount', amount)
      formData.append('description', description)
      formData.append('expenseDate', new Date(expenseDate).toISOString())
      if (photoFile) {
        formData.append('receiptPhoto', photoFile)
      }

      const newExpense = await createExpense(formData)

      onUploadSuccess(newExpense)

      // Reset Form
      setAmount('')
      setDescription('')
      setExpenseDate('')
      setPhotoFile(null)
      setPhotoName(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to create expense:', error)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-medium px-5 py-5 rounded-md shadow-[0_4px_15px_rgba(249,115,22,0.2)] transition-all transform hover:-translate-y-0.5 duration-200">
          <Plus className="w-4 h-4 mr-2" /> Upload Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#111] border border-[#222]/80 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">Upload Expense</DialogTitle>
          <DialogDescription className="text-sm text-gray-400 font-light">
            Input transaction specifics and attach files. Supports PNG, JPG, and PDFs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-gray-300 font-medium">Amount (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 bg-[#0a0a0a] border-[#222] text-white placeholder-gray-600 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] transition-colors"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-300 font-medium">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="description"
                type="text"
                required
                placeholder="e.g. AWS Cloud Hosting Fees"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pl-9 bg-[#0a0a0a] border-[#222] text-white placeholder-gray-600 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] transition-colors"
              />
            </div>
          </div>

          {/* Expense Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm text-gray-300 font-medium">Expense Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="date"
                type="date"
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="pl-9 bg-[#0a0a0a] border-[#222] text-white placeholder-gray-600 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] transition-colors"
              />
            </div>
          </div>

          {/* Photo Upload Mock Field */}
          <div className="space-y-2">
            <Label htmlFor="photo" className="text-sm text-gray-300 font-medium">Receipt Photo</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-[#222] rounded-md cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all hover:border-[#f97316]/50"
              >
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Plus className="w-5 h-5 text-gray-500 mb-1" />
                  <p className="text-xs text-gray-400 font-medium">
                    {photoName ? photoName : 'Click to upload receipt image'}
                  </p>
                </div>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-[#222]/40 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-[#1c1c1c] transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-medium"
            >
              Upload Receipt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
