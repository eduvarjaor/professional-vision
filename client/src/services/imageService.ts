type DivDragEvent = React.DragEvent<HTMLDivElement>

export const handleDrop = async (
  e: DivDragEvent,
  setImages: (images: any) => void,
  setError: (error: string | null) => void,
  setModalOpen: (isOpen: boolean) => void,
  setSelectedImage: (file: File) => void,
  setIsDragging: (isDragging: boolean) => void,
) => {
  e.preventDefault()
  setIsDragging(false)

  const file = e.dataTransfer.files[0]

  if (file) {
    const formData = new FormData()
    formData.append('file', file)
    setModalOpen(true)
    setSelectedImage(file)

    try {
      const options = {
        method: 'POST',
        body: formData,
      }

      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      setImages(data)
      setError(null)
      setModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }
}

export const checkSize = async (
  selectedImage: File | null,
  imagePath: string,
  editImage: (path: string) => void,
  setError: (error: string) => void,
  setLoading: (loading: boolean) => void,
  ref: React.RefObject<HTMLImageElement>,
) => {
  try {
    setLoading(true)

    if (selectedImage) {
      const img = new Image()
      img.src = URL.createObjectURL(selectedImage)

      if (
        ref.current &&
        ref.current.width === 256 &&
        ref.current.height === 256 &&
        selectedImage.type === 'image/png' &&
        imagePath
      ) {
        await editImage(imagePath)
      } else {
        setError('Error: Choose 256 x 256 PNG image')
      }
    } else {
      setError('Error: No image selected')
    }
  } catch (error) {
    if (typeof error === 'string') {
      setError('An error occurred: ' + error)
    } else {
      setError('An unexpected error occurred')
    }
  } finally {
    setLoading(false)
  }
}
