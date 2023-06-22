import React from 'react'
import { MdAlternateEmail } from 'react-icons/md';
import { ColorRing } from 'react-loader-spinner';

interface SetUsernameProps {
    setUsername?: (username:string)=>void;
    setErrorMessage?: (errorMessage:string)=>void;
    loading?: boolean;
    errorMessage: string;
}
const SetUsername:React.FC<SetUsernameProps> = ({setErrorMessage,errorMessage,loading,setUsername}) => {
  return (
    <>
    <MdAlternateEmail size={24} className='absolute top-[13%] left-[3%] z-10 text-slate-400'/>
    <input onInput={()=>setErrorMessage && setErrorMessage("")} onChange={(e)=>setUsername && setUsername(e.target.value)} className={`username__input bg-[#100e29] w-full text-[1.2rem] font-[500] outline outline-slate-50 outline-1 transition-all ease-in-out duration-150 py-4 px-12 rounded-2xl ${errorMessage.length>1?'error':''}`} type="text" required minLength={5} maxLength={40} placeholder="Your Telegram Username"/>
    <button type='submit' className='username__button relative overflow-hidden px-4 py-3 w-1/2 bg-[#0b0a1f] hover:bg-[#100e29] transition-all duration-150 outline-none rounded-xl text-xl font-semibold h-[50px] flex items-center justify-center'>
      {
        loading ? <ColorRing
        visible={true}
        height="45"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#5b21b6', '#8b5cf6', '#a855f7', '#7e22ce', '#a78bfa']}
      /> : "Set Username"
      }
    </button>
    </>
  )
}

export default SetUsername;