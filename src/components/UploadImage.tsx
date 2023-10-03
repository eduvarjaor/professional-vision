import { useState } from 'react';
import Modal from './Modal';

function UploadImage({ images, setImages }) {
    const [selectedImage, setSelectedImage] = useState(null)
    const [error, setError] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const uploadImage = async (e) => {
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
        <div className="h-[60vh] w-[35vw] rounded-3xl shadow-lg bg-slate-50">
            {modalOpen && 
            <div className='absolute top-0 left-0 w-[100vw] h-[100vh] overflow-hidden bg-zinc-800 flex justify-center items-center z-10'>
                <Modal 
                    setModalOpen={setModalOpen}
                    selectedImage={selectedImage} 
                    setSelectedImage={setSelectedImage}
                    editImage={editImage}
                />
            </div>}

            <div className="flex flex-col mt-[25vh] items-center">
                
                <label htmlFor='files'></label>
                <input 
                    className="bg-blue-500 hover:bg-blue-700 text-white py-7 px-8 rounded-full text-2xl w-[20vw] shadow-lg cursor-pointer"  
                    accept='image/*'
                    type='file'
                    onChange={uploadImage}
                />
                <span className="text-xl mt-[1.4rem]">or drop a file</span>
            </div>
        </div>
    );
}

export default UploadImage;
