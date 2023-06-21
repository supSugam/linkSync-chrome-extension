import React from 'react';
import {FaLink,FaTelegramPlane,FaDiscord} from 'react-icons/fa';


const Headings:React.FC = () => {
  return (
        <div className='flex flex-col justify-center items-center gap-8'>
            <div className='flex gap-2 items-center justify-center group'>
                <FaLink size={28} className="group-hover:scale-x-[-1] transition-all duration-200"/>
                <h1 className='text-3xl font-bold tracking-wide'>LinkSync+</h1>
            </div>
            <h2 className='text-base uppercase opacity-50 tracking-widest'>
                Share Links Effortlessly with a single tap
            </h2>
      </div>
  )
}

export default Headings;