import { useState, useRef } from "react";
import { ModalProps } from "../interfaces/ModalProps";
import { AiOutlineClose } from 'react-icons/ai'

function Modal({ setModalOpen, selectedImage, setSelectedImage, editImage }: ModalProps) {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const ref = useRef<HTMLImageElement>(null);

    const closeModal = () => {
        setModalOpen(false)
        setSelectedImage(null)
    }

    const checkSize = async () => {
        try {
            setLoading(true);
    
            if (selectedImage) {
                const img = new Image();
                img.src = URL.createObjectURL(selectedImage);
                setLoading(true);
    
                if (ref.current && ref.current.width === 256 && ref.current.height === 256 && selectedImage.type === 'image/png') {
                    await editImage();
                } else {
                    setError('Error: Choose 256 x 256 PNG image');
                }
            } else {
                setError('Error: No image selected');
            }
        } catch (error) {
            setError('An error occurred.');
        } finally {
            setLoading(false);
        }
    }
    
    
    return ( 
        <div className="relative z-50 p-[1rem] flex flex-col bg-gradient-to-r from-zinc-200 to-slate-300 rounded-lg shadow-xl">
            <div onClick={closeModal} className="cursor-pointer w-5 text-xl"><AiOutlineClose /></div>
            <div className="h-[256px] w-[256px] overflow-hidden m-2 rounded-xl shadow-xl">
                {selectedImage && 
                <img 
                    ref={ref} 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="uploaded-image"
                />}
            </div>
            <p className="text-center">{error || "Image must be PNG 256 x 256"}</p>
            {! error && 
            <button 
                className="w-full p-[20px] border-none bg-blue-500 hover:bg-blue-700 text-white mt-5 rounded-lg shadow-md outline-none text-xl"
                onClick={checkSize}
                disabled={loading}
            >
                {loading ? "Loading..." : 'Generate'}
            </button>}
            {error && 
            <button
                className="w-full p-[20px] border-none bg-red-500 hover:bg-red-700 text-white mt-5 rounded-lg shadow-md outline-none text-xl" 
                onClick={closeModal}
            >
                Close this and try again
            </button>}
        </div>
    );
}

export default Modal;