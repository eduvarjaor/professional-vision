function UploadImage() {
    return ( 
        <div className="h-[60vh] w-[35vw] rounded-3xl shadow-lg bg-slate-50">
            <div className="flex flex-col mt-[25vh] items-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white py-7 px-8 rounded-full text-2xl w-[20vw] shadow-lg">
                    Upload Image
                </button>
                <span className="text-xl mt-[1.4rem]">or drop a file</span>
            </div>
        </div>
    );
}

export default UploadImage;