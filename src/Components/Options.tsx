import React from 'react';
import {FaTelegramPlane,FaDiscord} from 'react-icons/fa';

interface OptionsProps{
    setActiveSocial?: (social:string)=>void;
    activeSocial?: string;
}
const Options:React.FC<OptionsProps> = ({setActiveSocial,activeSocial}) => {
  return (
    <div className='flex justify-center'>
        <label onClick={()=>setActiveSocial && setActiveSocial("telegram")} aria-checked={`${activeSocial === "telegram"? true : false}`} className='flex cursor-pointer relative group'>
            <input className='opacity-0' type="radio" name="radio" onChange={()=>setActiveSocial && setActiveSocial("telegram")} checked={true}/>
            <span className='inline-flex gap-2 text-xl font-semibold group-aria-checked:bg-[#312e81] outline outline-transparent outline-1 hover:outline-slate-100 hover:outline-1 hover:outline transition-all ease-in-out duration-150 py-2 px-3 rounded-2xl'><FaTelegramPlane size={24}/>Telegram</span>
        </label>
        <label className='flex cursor-pointer relative group'>
            <input className='opacity-0 group' type="radio" name="radio" checked={false} disabled/>
            <span className='inline-flex gap-2 text-xl font-semibold cursor-not-allowed outline outline-transparent hover:outline-slate-100 outline-1 transition-all ease-in-out duration-150 py-2 px-3 rounded-2xl'><FaDiscord size={24}/>Discord ⌛</span>
        </label>
  </div>
  )
}

export default Options