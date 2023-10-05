import { Image } from './Image'

export interface UploadImageProps {
  images: Image[]
  setImages: React.Dispatch<React.SetStateAction<Image[]>>
}
