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

function mapApiExpense(expense: ApiExpense): Expense {
  return {
    id: expense.id,
    amount: expense.amount,
    description: expense.description ?? '',
    expenseDate: expense.expenseDate,
    photoUrl: expense.photoUrl,
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await apiRequest<ApiExpense[]>('/api/expenses')
        const mapped = data.map((d) => mapApiExpense(d))
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
    return mapApiExpense(created)
  }
  return { createExpense }
}

export function useUpdateExpense() {
  const updateExpense = async (
    id: string,
    formData: FormData,
  ): Promise<Expense> => {
    await apiRequest(`/api/expenses/${id}`, {
      method: 'PUT',
      body: formData,
    })

    const updated = await apiRequest<ApiExpense>(`/api/expenses/${id}`)
    return mapApiExpense(updated)
  }

  return { updateExpense }
}
