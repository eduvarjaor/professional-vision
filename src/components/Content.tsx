import Demo from "./Demo";
import UploadImage from "./UploadImage";
import { Image } from '../interfaces/Image';
import { useState } from "react";
import Footer from "./Footer";

function Content() {
    const [images, setImages] = useState<Image[]>([]);

    return (
    <div className="font-lexend">
        <span className="flex justify-center mt-[4rem] text-6xl font-extrabold text-slate-800">Professional Vision</span>
        <span className="flex justify-center mt-[1rem] text-lg font-medium text-slate-800">Generate commercial photos with AI</span>

        <section className='flex justify-center mt-[1vh] mb-[1.5vh] p-5'>
            {images?.map((image, _index) => (
                <img 
                    key={_index} 
                    src={image.url}
                />
            ))}
        </section>

        <div className="flex justify-center space-x-[3rem] pb-[13vh]">
            <Demo />
            <UploadImage images={images} setImages={setImages} />
        </div>

        <Footer />
    </div>
    );
}

export default Content;