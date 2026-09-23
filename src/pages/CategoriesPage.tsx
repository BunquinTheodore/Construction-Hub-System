import { useEffect, useMemo, useState } from 'react'
import { Sprout } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { AddCategoryForm } from '../components/categories/AddCategoryForm'
import { CategorySection } from '../components/categories/CategorySection'
import { seedDefaultCategories, subscribeToCategories } from '../services/categories'
import type { Category } from '../types'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loaded, setLoaded] = useState(false)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      setCategories(data)
      setLoaded(true)
    })
    return unsubscribe
  }, [])

  const { inflowActive, inflowArchived, outflowActive, outflowArchived } = useMemo(() => {
    const inflow = categories.filter((c) => c.type === 'inflow')
    const outflow = categories.filter((c) => c.type === 'outflow')
    return {
      inflowActive: inflow.filter((c) => c.active),
      inflowArchived: inflow.filter((c) => !c.active),
      outflowActive: outflow.filter((c) => c.active),
      outflowArchived: outflow.filter((c) => !c.active),
    }
  }, [categories])

  async function handleSeed() {
    setSeeding(true)
    try {
      await seedDefaultCategories()
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-brand-black">Categories</h1>
        <p className="text-sm text-neutral-500">
          Manage the inflow and outflow categories used across transactions and summaries.
        </p>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-brand-black">Add Category</h2>
        <AddCategoryForm />
      </Card>

      {loaded && categories.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 py-10 text-center">
          <Sprout className="text-brand-green" size={32} />
          <div>
            <h2 className="text-base font-semibold text-brand-black">No categories yet</h2>
            <p className="text-sm text-neutral-500">
              Seed a starter set of inflow and outflow categories to get going.
            </p>
          </div>
          <Button onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding…' : 'Seed default categories'}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategorySection
            title="Inflow categories"
            tone="positive"
            active={inflowActive}
            archived={inflowArchived}
          />
          <CategorySection
            title="Outflow categories"
            tone="neutral"
            active={outflowActive}
            archived={outflowArchived}
          />
        </div>
      )}
    </div>
  )
}
