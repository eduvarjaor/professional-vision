import { AiFillLinkedin } from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';

function Footer() {
    return ( 
        <div className="bg-slate-800 h-[22rem] text-white font-leagueSpartan">
            
            <div className="flex lg:flex-row lg:justify-center lg:space-x-[35rem] xm:space-x-0 xm:flex-col xx:flex-col lg:p-0 xm:p-0 xl:p-0 md:p-0 sm:p-0 xx:p-5 xx:space-y-[1.7rem] lg:space-y-[0rem] xl:space-y-[0rem] md:space-y-[0rem] sm:space-y-[0rem] xm:space-y-[0rem]">

                <div className="flex flex-col lg:mt-[6rem] space-y-3 xm:mt-[3rem] lg:pl-[0rem] xm:pl-[2rem] xm:w-[30rem] xx:mt-[1rem]">
                    <span className="font-bold text-xl">EDUARDO VARJÃO</span>
                    <span className="lg:w-[29rem] text-justify text-base xm:w-[29rem] xm:whitespace-break-spaces">A Full Stack Developer who builds Websites and Web Applications that leads to the success of any product.</span>
                </div>

                <div>
                    <div className="flex flex-col lg:mt-[6rem] xm:mt-[2rem] lg:pl-[0rem] xm:pl-[2rem]">
                        <span className="font-bold text-xl mb-[1rem]">SOCIAL</span>

                        <div className="flex space-x-5 text-3xl cursor-pointer">
                            <a href="https://www.linkedin.com/in/eduvarjaor/?locale=en_US" target="_blank" rel="noopener noreferrer">
                                <AiFillLinkedin />
                            </a>
                            <a href="https://github.com/eduvarjaor" target="_blank" rel="noopener noreferrer">
                                <BsGithub />
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            <div className="relative lg:mt-[8.4rem] flex justify-center xm:mt-[5rem] xx:mt-[3rem]">
                <div className="relative z-10 text-xs">© Copyright 2023. Made by <a id="btn" href="https://www.linkedin.com/in/eduvarjaor/?locale=en_US" className="underline" target="_blank" rel="noopener noreferrer">Eduardo Varjão</a></div>
                <div className="absolute lg:top-[-1.5rem] left-1/2 transform translate-x-[-50%] lg:w-[80%] h-[0.01rem] bg-gray-500 rounded-full xm:w-[90%] xm:top-[-1rem]"></div>
            </div>
        </div>
     );
}

export default Footer;