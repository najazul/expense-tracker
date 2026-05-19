import { useEffect, useId, useState } from 'react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Button } from '#/components/ui/button'
import { toast } from '#/components/ui/toast'
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
import { FileText, Loader2, Plus, X } from 'lucide-react'
import { useCreateExpense, useUpdateExpense } from '#/hooks/useExpenses'
import type { Expense } from '#/data/dummy-expenses'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f97316',
    },
    background: {
      default: '#111',
      paper: '#111',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
})

type UploadExpenseModalProps = {
  mode?: 'upload'
  onUploadSuccess: (expense: Expense) => void
}

type UpdateExpenseModalProps = {
  mode: 'update'
  expense: Expense
  trigger: React.ReactNode
  onUpdateSuccess: (expense: Expense) => void
}

type ExpenseModalProps = UploadExpenseModalProps | UpdateExpenseModalProps

export function UploadExpenseModal(props: ExpenseModalProps) {
  const updateProps = props.mode === 'update' ? props : null
  const uploadProps = props.mode === 'update' ? null : props
  const updateExpenseRecord = updateProps?.expense ?? null
  const isUpdateMode = updateExpenseRecord !== null
  const { createExpense } = useCreateExpense()
  const { updateExpense } = useUpdateExpense()
  const formId = useId()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState<Dayjs | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialAmount = updateExpenseRecord
    ? String(updateExpenseRecord.amount)
    : ''
  const initialDescription = updateExpenseRecord
    ? updateExpenseRecord.description
    : ''
  const initialExpenseDate = updateExpenseRecord
    ? dayjs(updateExpenseRecord.expenseDate)
    : null
  const initialExpenseDateIso = initialExpenseDate?.toISOString() ?? ''
  const currentPhotoUrl = updateExpenseRecord
    ? updateExpenseRecord.photoUrl
    : null
  const title = isUpdateMode ? 'Update Expense' : 'Upload Expense'
  const submitLabel = isUpdateMode ? 'Update Expense' : 'Upload Receipt'
  const submittingLabel = isUpdateMode ? 'Updating...' : 'Uploading...'
  const successTitle = isUpdateMode ? 'Update complete' : 'Upload complete'
  const successDescription = isUpdateMode
    ? 'Your expense has been updated.'
    : 'Your expense has been recorded.'
  const failureTitle = isUpdateMode ? 'Update failed' : 'Upload failed'
  const amountId = `${formId}-amount`
  const descriptionId = `${formId}-description`
  const photoId = `${formId}-photo`
  const hasRequiredFields =
    amount.trim() !== '' && description.trim() !== '' && expenseDate !== null
  const hasChanges =
    isUpdateMode &&
    (amount.trim() !== initialAmount ||
      description.trim() !== initialDescription ||
      (expenseDate?.toISOString() ?? '') !== initialExpenseDateIso ||
      photoFile !== null)
  const canSubmit =
    hasRequiredFields && (!isUpdateMode || hasChanges) && !isSubmitting

  useEffect(() => {
    if (!isDialogOpen) return

    setAmount(initialAmount)
    setDescription(initialDescription)
    setExpenseDate(initialExpenseDate)
    setPhotoFile(null)
    setUploadProgress(0)
  }, [initialAmount, initialDescription, initialExpenseDateIso, isDialogOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setUploadProgress(0)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 50)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('amount', amount)
      formData.append('description', description)
      formData.append('expenseDate', expenseDate.toISOString())
      if (photoFile) {
        formData.append('receiptPhoto', photoFile)
      }

      const savedExpense = updateExpenseRecord
        ? await updateExpense(updateExpenseRecord.id, formData)
        : await createExpense(formData)

      toast({
        title: successTitle,
        description: successDescription,
      })

      if (updateProps) {
        updateProps.onUpdateSuccess(savedExpense)
      } else if (uploadProps) {
        uploadProps.onUploadSuccess(savedExpense)
      }

      // Reset Form
      setAmount('')
      setDescription('')
      setExpenseDate(null)
      setPhotoFile(null)
      setUploadProgress(0)
      setIsDialogOpen(false)
    } catch (error) {
      console.error(
        `Failed to ${isUpdateMode ? 'update' : 'create'} expense:`,
        error,
      )
      toast({
        title: failureTitle,
        description: 'Please try again in a moment.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {updateProps ? (
          updateProps.trigger
        ) : (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 py-5 rounded-md transition-colors duration-200">
            <Plus className="w-4 h-4 mr-2" /> Upload Expense
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-[#111] border border-[#222]/80 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400 font-light">
            {isUpdateMode
              ? 'Change any transaction details or replace the receipt image.'
              : 'Input transaction specifics and attach files. Supports PNG, JPG, and PDFs.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          {/* Amount Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor={amountId}
              className="text-xs text-gray-300 font-medium"
            >
              Amount (PHP) <span className="text-[#f97316]">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-[55%] text-gray-500 font-medium">
                ₱
              </span>
              <Input
                id={amountId}
                type="text"
                inputMode="decimal"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9.]/g, '')
                  const parts = val.split('.')
                  if (parts.length > 2) {
                    val = parts[0] + '.' + parts.slice(1).join('')
                  }
                  setAmount(val)
                }}
                className="h-9 pl-7 bg-[#0a0a0a] border-[#222] text-white placeholder-gray-600 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] transition-colors"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor={descriptionId}
              className="text-xs text-gray-300 font-medium"
            >
              Description <span className="text-[#f97316]">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id={descriptionId}
                type="text"
                required
                placeholder="e.g. AWS Cloud Hosting Fees"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 pl-9 bg-[#0a0a0a] border-[#222] text-white placeholder-gray-600 focus-visible:ring-[#f97316] focus-visible:border-[#f97316] transition-colors"
              />
            </div>
          </div>

          {/* Receipt Date Input */}
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-xs text-gray-300 font-medium">
              Receipt Date <span className="text-[#f97316]">*</span>
            </Label>
            <ThemeProvider theme={darkTheme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={expenseDate}
                  onChange={(newValue) => setExpenseDate(newValue)}
                  slotProps={{
                    popper: { disablePortal: true },
                    textField: {
                      className: 'bg-[#0a0a0a] rounded-md',
                      fullWidth: true,
                      variant: 'outlined',
                      required: true,
                      size: 'small',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#0a0a0a !important',
                          color: 'white',
                          borderRadius: '0.375rem',
                          height: '36px',
                          transition:
                            'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                          '& fieldset': {
                            borderColor: '#222',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#222',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#f97316',
                            borderWidth: '1px',
                            boxShadow: '0 0 0 1px #f97316',
                          },
                        },
                        '& .MuiInputBase-input': {
                          padding: '0 14px',
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%',
                          fontSize: '14px',
                        },
                        '& .MuiPickersSectionList-root': {
                          fontSize: '14px',
                        },
                        '& .MuiPickersInputBase-sectionContent': {
                          fontSize: '14px',
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#6b7280',
                          width: '18px',
                          height: '18px',
                        },
                        '& .MuiIconButton-root': {
                          padding: '8px',
                          marginRight: '-4px',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </div>

          {/* Photo Upload Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor={photoId}
              className="text-xs text-gray-300 font-medium"
            >
              Receipt Photo
            </Label>

            {photoFile ? (
              <div className="relative w-full border border-[#222] rounded-md overflow-hidden bg-[#0a0a0a]">
                <div className="relative h-20 w-full flex items-center justify-center p-2">
                  <img
                    src={URL.createObjectURL(photoFile)}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition-colors"
                    onClick={() => {
                      setPhotoFile(null)
                      setUploadProgress(0)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                {uploadProgress < 100 && (
                  <div className="w-full bg-[#111] h-1.5 absolute bottom-0 left-0">
                    <div
                      className="bg-[#f97316] h-1.5 transition-all duration-75"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : currentPhotoUrl ? (
              <div className="relative w-full border border-[#222] rounded-md overflow-hidden bg-[#0a0a0a]">
                <div className="relative h-20 w-full flex items-center justify-center p-2">
                  <img
                    src={currentPhotoUrl}
                    alt="Current receipt"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
                <label
                  htmlFor={photoId}
                  className="flex cursor-pointer items-center justify-center border-t border-[#222] px-3 py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-[#111] hover:text-[#f97316]"
                >
                  Replace receipt image
                </label>
                <input
                  id={photoId}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <label
                htmlFor={photoId}
                className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-[#222] rounded-md cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all hover:border-[#f97316]/50"
              >
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Plus className="w-5 h-5 text-gray-500 mb-1" />
                  <p className="text-xs text-gray-400 font-medium">
                    Click to upload receipt image
                  </p>
                </div>
                <input
                  id={photoId}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <DialogFooter className="pt-2 border-t border-[#222]/40 gap-2 sm:gap-0">
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
              disabled={!canSubmit}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {submittingLabel}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
