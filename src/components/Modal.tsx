import { useState, useRef } from "react";
import { ModalProps } from "../interfaces/ModalProps";
function Modal({ setModalOpen, selectedImage, setSelectedImage, editImage }: ModalProps) {
    const [error, setError] = useState<string>('');
    const ref = useRef<HTMLImageElement>(null);

    const closeModal = () => {
        setModalOpen(false)
        setSelectedImage(null)
    }

    const checkSize = async () => {
        if (ref.current && ref.current.width === 256 && ref.current.height === 256) {
            await editImage()
        } else {
            setError('Error: Choose 256 x 256 image')
        }
    }
    
    return ( 
        <div className="relative z-50 bg-green-300 p-[10px] border-r-[10px] flex flex-col">
            <div onClick={closeModal}>X</div>
            <div className="h-[256px] w-[256px] overflow-hidden">
                {selectedImage && <img ref={ref} src={URL.createObjectURL(selectedImage)} alt="uploaded-image" />}
            </div>
            <p>{error || "Image must be 256 x 256"}</p>
            {! error && <button 
                className="w-full p-[20px] border-none"
                onClick={checkSize}
            >
                Generate
            </button>}
            {error && <button onClick={closeModal}>Close this and try again</button>}
        </div>
    );
}

export default Modal;