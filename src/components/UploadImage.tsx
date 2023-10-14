import { useState, ChangeEvent } from 'react';
import Modal from './Modal';
import { UploadImageProps } from '../interfaces/UploadImageProps';

type DivDragEvent = React.DragEvent<HTMLDivElement>;

  function UploadImage({ images, setImages }: UploadImageProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const windowWidth = window.innerWidth;

    const handleDragOver = (e: DivDragEvent) => {
        e.preventDefault();
        setIsDragging(true);
      };

      const handleDragLeave = () => {
        setIsDragging(false);
      };
    
      const handleDrop = async (e: DivDragEvent) => {
        e.preventDefault();
        setIsDragging(false);   

        const file = e.dataTransfer.files[0];
    
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          setModalOpen(true);
          setSelectedImage(file);
    
          try {
            const options = {
              method: 'POST',
              body: formData,
            };
    
            const response = await fetch('http://localhost:8000/upload', options);
            const data = await response.json()
            return data
          } catch (error) {
            console.error(error);
          }
        }
      }

    const upload = async (e: ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        setModalOpen(true)
        setSelectedImage(e.target.files[0])
        e.target.value = null
        
        try {
            const options = {
                method: "POST",
                body: formData
            }

            const response = await fetch('http://localhost:8000/upload', options)
            const data = await response.json()
            return data
        } catch (error) {
            console.error(error)
        }
    }

    const editImage = async () => {
        try {
            const options = {
                method: 'POST',
            }
            const response = await fetch('http://localhost:8000/edit', options)
            const data = await response.json()
            setImages(data)
            setError(null)
            setModalOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='lg:p-0 xx:p-5 flex'>
            <div 
            className={`h-[60vh] lg:w-[35vw] xx:w-full rounded-3xl shadow-lg ${windowWidth < 370 ? 'bg-stone-300' : 'bg-stone-100' } ${isDragging ? 'border-dashed border-4 border-blue-500' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {modalOpen && 
            <div className='absolute top-0 left-0 w-full h-full flex items-center z-10'>
                <div className="flex justify-center items-center bg-white bg-opacity-50 p-4 w-full lg:h-[184vh] xx:h-[240vh]">
                    <div className='flex justify-center h-[27rem]'>
                        <Modal 
                        setModalOpen={setModalOpen}
                        selectedImage={selectedImage} 
                        setSelectedImage={setSelectedImage}
                        editImage={editImage}
                        />
                    </div>
                </div>
            </div>}

            <div className="flex flex-col mt-[25vh] items-center">
            <label className="bg-blue-500 hover:bg-blue-700 text-white py-7 px-8 rounded-full text-2xl shadow-lg cursor-pointer text-center lg:w-[20vw]">
                <span>Choose a file</span>
                <input 
                className="hidden"  
                accept='image/*'
                type='file'
                onChange={upload}
            />
            </label>
                <span className={windowWidth < 370 ? "hidden" : 'text-xl mt-[1.4rem]'} >or drop a file</span>
            </div>
        </div>
        </div>
    );
}

export default UploadImage;
