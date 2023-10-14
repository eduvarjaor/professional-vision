import UploadImage from "./UploadImage";
import { Image } from '../interfaces/Image';
import { useState } from "react";
import Footer from "./Footer";
import Illustration from '/public/images/Illustration.png';
import IllustrationVertical from '/public/images/IllustrationVertical.png';

function Content() {
    const [images, setImages] = useState<Image[]>([]);
    const windowWidth = window.innerWidth;

    return (
    <div className="font-lexend">
        <span className="flex justify-center mt-[4rem] lg:text-6xl font-extrabold text-slate-800 xx:text-3xl xm:text-4xl sm:text-5xl">Professional Vision</span>
        <span className="flex justify-center mt-[1rem] lg:text-lg font-medium text-slate-800 sm:text-lg">Generate commercial photos with AI</span>

        <section className='flex justify-center mt-[1vh] mb-[1.5vh] p-5'>
            {images?.map((image, _index) => (
                <img 
                    key={_index} 
                    src={image.url}
                />
            ))}
        </section>

        <div className="flex justify-center lg:space-x-[3rem] xx:space-x-[0rem] pb-[13vh] lg:flex-row xx:flex-col">
            <div className={`h-[60vh] lg:w-[35vw] xx:w-full xx:p-4 lg:p-0`}>
                <img 
                    src={windowWidth < 370 ? IllustrationVertical : Illustration} 
                    alt="Demo" 
                    className="w-full h-full object-cover rounded-3xl shadow-xl" 
                />
            </div>

            <UploadImage images={images} setImages={setImages} />
        </div>

        <Footer />
    </div>
    );
}

export default Content;