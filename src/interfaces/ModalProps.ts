export interface ModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedImage: File | null
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>
  editImage: () => Promise<void>
}
