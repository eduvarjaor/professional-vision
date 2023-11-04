import React, { useState } from 'react';
import Modal from './Modal';
import { UploadImageProps } from '../interfaces/UploadImageProps';
import { handleUpload, handleSendToOpenAI } from '../services/apiService';
import { handleDrop } from '../services/imageService';

type DivDragEvent = React.DragEvent<HTMLDivElement>;

function UploadImage({ setImages }: UploadImageProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [_error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [imagePath, setImagePath] = useState<string>('');
    const windowWidth = window.innerWidth;

    const handleDragOver = (e: DivDragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className='lg:p-0 xx:p-5 flex'>
            <div 
            className={`h-[60vh] lg:w-[35vw] xx:w-full rounded-3xl shadow-lg ${windowWidth < 370 ? 'bg-stone-300' : 'bg-stone-100' } ${isDragging ? 'border-dashed border-4 border-blue-500' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
                e.preventDefault();
                handleDrop(e, setImages, setError, setModalOpen, setSelectedImage, setIsDragging);
              }}
        >
            {modalOpen && 
            <div className='absolute top-0 left-0 w-full h-full flex items-center z-10'>
                <div className="flex justify-center items-center bg-white bg-opacity-50 p-4 w-full lg:h-[184vh] xx:h-[240vh]">
                    <div className='flex justify-center h-[27rem]'>
                        <Modal 
                        setModalOpen={setModalOpen}
                        selectedImage={selectedImage} 
                        setSelectedImage={setSelectedImage}
                        editImage={(path) => handleSendToOpenAI(path, setImages, setError, setModalOpen)}
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
                onChange={(event) => {
                    if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    if (file) {
                        handleUpload(file, setImagePath, setSelectedImage, setModalOpen);
                    }
                    }
                }}
            />
            </label>
                <span className={windowWidth < 370 ? "hidden" : 'text-xl mt-[1.4rem]'} >or drop a file</span>
            </div>
        </div>
        </div>
    );
}

export default UploadImage;