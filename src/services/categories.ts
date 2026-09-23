import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Category, NewCategory } from '../types'

const categoriesRef = collection(db, 'categories')

export const DEFAULT_CATEGORIES: NewCategory[] = [
  { name: 'Client Payments', type: 'inflow', active: true },
  { name: 'Software Subscriptions Revenue', type: 'inflow', active: true },
  { name: 'Partnerships', type: 'inflow', active: true },
  { name: 'Other Income', type: 'inflow', active: true },
  { name: 'Payroll', type: 'outflow', active: true },
  { name: 'Software/Tools', type: 'outflow', active: true },
  { name: 'Marketing', type: 'outflow', active: true },
  { name: 'Office/Admin', type: 'outflow', active: true },
  { name: 'Contractor Fees', type: 'outflow', active: true },
  { name: 'Equipment', type: 'outflow', active: true },
  { name: 'Misc', type: 'outflow', active: true },
]

export function subscribeToCategories(callback: (categories: Category[]) => void) {
  const q = query(categoriesRef, orderBy('name'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Category))
  })
}

export async function createCategory(category: NewCategory): Promise<string> {
  const docRef = await addDoc(categoriesRef, category)
  return docRef.id
}

export async function updateCategory(id: string, changes: Partial<NewCategory>): Promise<void> {
  await updateDoc(doc(db, 'categories', id), changes)
}

export async function archiveCategory(id: string): Promise<void> {
  await updateDoc(doc(db, 'categories', id), { active: false })
}

export async function seedDefaultCategories(): Promise<void> {
  await Promise.all(DEFAULT_CATEGORIES.map((category) => createCategory(category)))
}
