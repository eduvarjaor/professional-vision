import Illustration from '/public/images/Illustration.png'
function Demo() {
    return ( 
        <div className="h-[60vh] w-[35vw]">
            <img src={Illustration} alt="Demo" className="w-full h-full object-cover rounded-3xl shadow-xl" />
        </div>
    );
}

export default Demo;