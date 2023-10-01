import Demo from "./Demo";
import UploadImage from "./UploadImage";

function Content() {
    return (
    <div className="font-lexend">
        <span className="flex justify-center mt-[4rem] text-5xl">Professional Vision</span>
        <span className="flex justify-center mt-[1rem] text-lg">Generate commercial photos with AI</span>

        <div className="flex justify-center mt-[6vh] space-x-[3rem]">
            <Demo />
            <UploadImage />
        </div>
    </div>
    );
}

export default Content;