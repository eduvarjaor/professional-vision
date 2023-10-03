import Demo from "./Demo";
import UploadImage from "./UploadImage";
import { Image } from '../interfaces/Image';
import { useState } from "react";

function Content() {
    const [images, setImages] = useState<Image[]>([]);

    return (
    <div className="font-lexend">
        <span className="flex justify-center mt-[4rem] text-5xl">Professional Vision</span>
        <span className="flex justify-center mt-[1rem] text-lg">Generate commercial photos with AI</span>

        <section className='flex justify-center mt-[5vh]'>
            {images?.map((image, _index) => (
                <img 
                    key={_index} 
                    src={image.url}
                />
            ))}
        </section>

        <div className="flex justify-center mt-[6vh] space-x-[3rem]">
            <Demo />
            <UploadImage images={images} setImages={setImages} />
        </div>
    </div>
    );
}

export default Content;