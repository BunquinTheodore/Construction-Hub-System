import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Archive, Check, Pencil, RotateCcw, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Field'
import { archiveCategory, updateCategory } from '../../services/categories'
import type { Category } from '../../types'

interface CategoryRowProps {
  category: Category
}

export function CategoryRow({ category }: CategoryRowProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [confirmingArchive, setConfirmingArchive] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  async function saveRename() {
    const trimmed = name.trim()
    if (!trimmed || trimmed === category.name) {
      setName(category.name)
      setEditing(false)
      return
    }
    setBusy(true)
    try {
      await updateCategory(category.id, { name: trimmed })
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  function cancelRename() {
    setName(category.name)
    setEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') saveRename()
    if (event.key === 'Escape') cancelRename()
  }

  async function handleArchive() {
    setBusy(true)
    setActionError('')
    try {
      await archiveCategory(category.id)
      setConfirmingArchive(false)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to archive category.')
    } finally {
      setBusy(false)
    }
  }

  async function handleRestore() {
    setBusy(true)
    setActionError('')
    try {
      await updateCategory(category.id, { active: true })
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to restore category.')
    } finally {
      setBusy(false)
    }
  }

  if (confirmingArchive) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-brand-red-light bg-brand-red-light/40 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-brand-black">
            Archive "{category.name}"? It will disappear from the transaction form.
          </span>
          <div className="flex gap-2">
            <Button variant="danger" onClick={handleArchive} disabled={busy}>
              Archive
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmingArchive(false)
                setActionError('')
              }}
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        </div>
        {actionError && <span className="text-xs font-medium text-brand-red">{actionError}</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-brand-border px-4 py-3">
      <div className="flex items-center justify-between gap-3">
      {editing ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={busy}
          />
          <button
            type="button"
            onClick={saveRename}
            disabled={busy}
            className="cursor-pointer rounded-md p-2 text-brand-green hover:bg-brand-green-light disabled:opacity-50"
            aria-label="Save name"
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={cancelRename}
            disabled={busy}
            className="cursor-pointer rounded-md p-2 text-brand-black hover:bg-brand-gray disabled:opacity-50"
            aria-label="Cancel rename"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <span className={`text-sm font-medium ${category.active ? 'text-brand-black' : 'text-neutral-500'}`}>
          {category.name}
        </span>
      )}

      {!editing && (
        <div className="flex shrink-0 gap-2">
          {category.active ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="cursor-pointer rounded-md p-2 text-brand-black hover:bg-brand-gray"
                aria-label="Rename category"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => setConfirmingArchive(true)}
                className="cursor-pointer rounded-md p-2 text-brand-black hover:bg-brand-gray"
                aria-label="Archive category"
              >
                <Archive size={16} />
              </button>
            </>
          ) : (
            <Button variant="secondary" onClick={handleRestore} disabled={busy}>
              <RotateCcw size={14} />
              Restore
            </Button>
          )}
        </div>
      )}
      </div>
      {actionError && <span className="text-xs font-medium text-brand-red">{actionError}</span>}
    </div>
  )
}
