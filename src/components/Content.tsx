import Demo from "./Demo";
import UploadImage from "./UploadImage";

function Content() {
    return (
    <div className="font-lexend">
        <h1 className="flex justify-center mt-[4rem] text-5xl">Professional Vision</h1>

        <div className="flex justify-center mt-[12vh] space-x-[3rem]">
            <Demo />
            <UploadImage />
        </div>
    </div>
    );
}

export default Content;