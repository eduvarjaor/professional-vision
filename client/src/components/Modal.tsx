import { useState, useRef, useEffect } from "react";
import { ModalProps } from "../interfaces/ModalProps";
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { checkSize } from "../services/imageService";

function Modal({ setModalOpen, selectedImage, imagePath, setSelectedImage, editImage }: ModalProps) {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const ref = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const modalElement = document.getElementById("modal-container");

            if (modalElement) {
                const rect = modalElement.getBoundingClientRect();
                if (rect.top < 0) {
                    window.scrollBy(0, rect.top - 10);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const closeModal = () => {
        setModalOpen(false)
        setSelectedImage(null)
    }
    
    return ( 
        <div id="modal-container" className="relative z-50 p-[1rem] flex flex-col bg-gradient-to-r from-zinc-200 to-slate-300 rounded-lg shadow-xl">
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
                onClick={() => {
                    if (selectedImage && imagePath) {
                    checkSize(selectedImage, imagePath, editImage, setError, setLoading, ref);
                    }
                }}
                disabled={loading}
            >
                {loading ? (
        <>
            <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
        </>
            ) : 'Generate'}
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