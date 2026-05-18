import { useState, useEffect } from 'react'
import { apiRequest } from '../lib/api-client'
import type { Expense } from '../data/dummy-expenses'

interface ApiExpense {
  id: string
  amount: number
  description: string | null
  photoUrl: string | null
  expenseDate: string
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await apiRequest<ApiExpense[]>('/api/expenses')
        const mapped = data.map((d) => ({
          id: d.id,
          amount: d.amount,
          description: d.description ?? '',
          expenseDate: d.expenseDate,
          photoUrl: d.photoUrl,
          status: 'Approved' as const,
        }))
        setExpenses(mapped)
      } catch (error) {
        console.error('Failed to fetch expenses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  return { expenses, setExpenses, isLoading }
}

export function useDeleteExpense() {
  const deleteExpense = async (id: string) => {
    await apiRequest(`/api/expenses/${id}`, { method: 'DELETE' })
  }
  return { deleteExpense }
}

export function useCreateExpense() {
  const createExpense = async (formData: FormData): Promise<Expense> => {
    const created = await apiRequest<ApiExpense>('/api/expenses', {
      method: 'POST',
      body: formData,
    })
    return {
      id: created.id,
      amount: created.amount,
      description: created.description ?? '',
      expenseDate: created.expenseDate,
      photoUrl: created.photoUrl,
      status: 'Pending',
    }
  }
  return { createExpense }
}
