import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../lib/firebase'

export interface ReceiptUploadResult {
  url: string
  path: string
}

export async function uploadReceipt(file: File, userId: string): Promise<ReceiptUploadResult> {
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `receipts/${userId}/${timestamp}_${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return { url, path }
}
