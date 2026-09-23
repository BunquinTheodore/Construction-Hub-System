export interface ReceiptUploadResult {
  url: string
  path: string
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadReceipt(file: File, userId: string): Promise<ReceiptUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `receipts/${userId}`)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Receipt upload failed: ${errorBody}`)
  }

  const data = await response.json()
  return { url: data.secure_url as string, path: data.public_id as string }
}
