export interface Expense {
  id: string
  amount: number
  description: string
  photoUrl: string | null
  expenseDate: string
  status?: 'Approved' | 'Pending' | 'Rejected' // Added status for UI visual flavor
}

export const dummyExpenses: Expense[] = [
  {
    id: 'e1d5a7b6-3c4d-4e5f-6a7b-8c9d0e1f2a3b',
    amount: 1250.00,
    description: 'Custom GPU Server Hosting - AI Training Node 1',
    photoUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=120&auto=format&fit=crop&q=60',
    expenseDate: '2026-05-15T14:30:00Z',
    status: 'Approved'
  },
  {
    id: 'f2d6b8c7-4d5e-5f6a-7b8c-9d0e1f2a3b4c',
    amount: 89.99,
    description: 'Browser Use Cloud API Subscription - 10,000 Tasks Plan',
    photoUrl: null,
    expenseDate: '2026-05-14T09:15:00Z',
    status: 'Approved'
  },
  {
    id: 'a3d7c9d8-5e6f-6a7b-8c9d-0e1f2a3b4c5d',
    amount: 320.50,
    description: 'Team Dinner & Offsite Strategy Meeting at Noir Bistro',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=60',
    expenseDate: '2026-05-12T20:45:00Z',
    status: 'Approved'
  },
  {
    id: 'b4d8d0e9-6f7a-7b8c-9d0e-1f2a3b4c5d6e',
    amount: 15.00,
    description: 'Premium Domain Registration - expenseflow.ai',
    photoUrl: null,
    expenseDate: '2026-05-10T11:00:00Z',
    status: 'Approved'
  },
  {
    id: 'c5d9e1f0-7a8b-8c9d-0e1f-2a3b4c5d6e7f',
    amount: 450.00,
    description: 'Office Ergonomic Chair & Desktop Setup Upgrades',
    photoUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=120&auto=format&fit=crop&q=60',
    expenseDate: '2026-05-08T16:00:00Z',
    status: 'Pending'
  }
]
