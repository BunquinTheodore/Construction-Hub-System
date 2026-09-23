import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { NewTransaction, Transaction } from '../types'

const transactionsRef = collection(db, 'transactions')

export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void,
) {
  const q = query(transactionsRef, orderBy('date', 'desc'), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction))
    },
    (error) => onError?.(error),
  )
}

export async function createTransaction(transaction: NewTransaction): Promise<string> {
  const docRef = await addDoc(transactionsRef, {
    ...transaction,
    createdAt: Date.now(),
  })
  return docRef.id
}

export async function updateTransaction(
  id: string,
  changes: Partial<NewTransaction>,
): Promise<void> {
  await updateDoc(doc(db, 'transactions', id), changes)
}

export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, 'transactions', id))
}

export async function getTransactionsForMonth(monthId: string): Promise<Transaction[]> {
  const start = `${monthId}-01`
  const [year, month] = monthId.split('-').map(Number)
  const nextMonth = new Date(year, month, 1)
  const end = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`

  const q = query(
    transactionsRef,
    where('date', '>=', start),
    where('date', '<', end),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction)
}
