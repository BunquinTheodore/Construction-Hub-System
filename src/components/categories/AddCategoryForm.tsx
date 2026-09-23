import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, LabelWrap } from '../ui/Field'
import { createCategory } from '../../services/categories'
import type { TransactionType } from '../../types'

export function AddCategoryForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>('outflow')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Category name is required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await createCategory({ name: trimmed, type, active: true })
      setName('')
      setType('outflow')
    } catch {
      setError('Could not add category. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <LabelWrap label="Category name" htmlFor="new-category-name" required error={error}>
          <Input
            id="new-category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Equipment Rental"
          />
        </LabelWrap>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-brand-black">Type</span>
        <div className="flex overflow-hidden rounded-lg border border-brand-border">
          <button
            type="button"
            onClick={() => setType('inflow')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
              type === 'inflow' ? 'bg-brand-green text-white' : 'bg-white text-brand-black hover:bg-brand-gray'
            }`}
          >
            Inflow
          </button>
          <button
            type="button"
            onClick={() => setType('outflow')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer border-l border-brand-border ${
              type === 'outflow' ? 'bg-brand-black text-white' : 'bg-white text-brand-black hover:bg-brand-gray'
            }`}
          >
            Outflow
          </button>
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        <Plus size={16} />
        Add Category
      </Button>
    </form>
  )
}
