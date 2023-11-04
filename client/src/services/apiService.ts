import { Image } from '../interfaces/Image'

export const handleUpload = async (
  selectedFile: File,
  setImagePath: (path: string) => void,
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const formData = new FormData()
  formData.append('image', selectedFile, selectedFile.name)

  try {
    const options = {
      method: 'POST',
      body: formData,
    }
    const response = await fetch(
      'https://us-central1-professional-vision-262b8.cloudfunctions.net/upload',
      options,
    )
    const data = await response.json()

    if (data.success) {
      setSelectedImage(selectedFile)
      setModalOpen(true)
      setImagePath(data.path)
    } else {
      console.error('Error uploading image:', data.error)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

export const handleSendToOpenAI = async (
  path: string,
  setImages: React.Dispatch<React.SetStateAction<Image[]>>,
  setError: (error: string | null) => void,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const response = await fetch(
      'https://us-central1-professional-vision-262b8.cloudfunctions.net/sendToOpenAI',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: path }),
      },
    )

    const data = await response.json()

    if (data.success) {
      setImages(data.data)
      setError(null)
      setModalOpen(false)
    } else {
      console.error('Error editing image:', data.error)
    }
  } catch (error) {
    console.error('Error editing image:', error)
  }
}
