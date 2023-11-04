import React, { useState, ChangeEvent } from 'react';
import Modal from './Modal';
import { UploadImageProps } from '../interfaces/UploadImageProps';

type DivDragEvent = React.DragEvent<HTMLDivElement>;

function UploadImage({ setImages }: UploadImageProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [_error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [imagePath, setImagePath] = useState<string>('');
    const windowWidth = window.innerWidth;

    const handleUpload = async (image: ChangeEvent<HTMLInputElement>) => {
        const fileInput = image.target;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return;
        }
    
        const selectedFile = fileInput.files[0];
        if (!selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile, selectedFile.name);

        try {
            const options = {
                method: 'POST',
                body: formData,
            };
            const response = await fetch('https://us-central1-professional-vision-262b8.cloudfunctions.net/upload', options);
            const data = await response.json();

            if (data.success) {
                setSelectedImage(selectedFile);
                setModalOpen(true);
                setImagePath(data.path)
            } else {
                console.error('Error uploading image:', data.error);
            }
        } catch(error) {
            console.error('Error uploading image:', error);
        }
    }

    const handleSendToOpenAI = async (path: string) => {
        try {
            const response = await fetch('https://us-central1-professional-vision-262b8.cloudfunctions.net/sendToOpenAI', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: path }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                setImages(data.data)
                setError(null)
                setModalOpen(false)
            } else {
                console.error('Error editing image:', data.error);
            }
        } catch (error) {
            console.error('Error editing image:', error);
        }
    };

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
            setImages(data)
            setError(null)
            setModalOpen(false)
        } catch (error) {
            console.error(error);
        }
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
                        editImage={handleSendToOpenAI}
                        imagePath={imagePath}
                        />
                    </div>
                </div>
            </div>}

            <div className="flex flex-col mt-[25vh] items-center">
            <label className="bg-blue-500 hover:bg-blue-700 text-white py-7 px-8 rounded-full text-2xl shadow-lg cursor-pointer text-center lg:w-[20vw]">
                <span>Choose a file</span>
                <input
                name='file' 
                className="hidden"  
                accept='image/*'
                type='file'
                onChange={handleUpload}
            />
            </label>
                <span className={windowWidth < 370 ? "hidden" : 'text-xl mt-[1.4rem]'} >or drop a file</span>
            </div>
        </div>
        </div>
    );
}

export default UploadImage;