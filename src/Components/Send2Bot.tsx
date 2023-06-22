import React from 'react';
import {FaTelegramPlane} from 'react-icons/fa';

interface Send2BotProps {
    handleSendLink: (e:React.FormEvent<HTMLFormElement>)=>void;
    textAreaExpanded: boolean;
    attachedFile: File | null;
    handleFileChange: (e:React.ChangeEvent<HTMLInputElement>)=>void;
    handleLabelClick: (e:React.MouseEvent<HTMLLabelElement, MouseEvent>)=>void;
    setTextAreaExpanded: (textAreaExpanded:boolean)=>void;
    textAreaLength: number;
    setTextAreaLength: (textAreaLength:number)=>void;
    setOptionalMessage: (optionalMessage:string)=>void;
    loading: boolean;
    linkSendError: boolean;
    
}
const Send2Bot:React.FC<Send2BotProps> = ({handleSendLink,textAreaExpanded,attachedFile,handleFileChange,handleLabelClick,setTextAreaExpanded,textAreaLength,setTextAreaLength,setOptionalMessage,loading,linkSendError}) => {
  return (
    <form onSubmit={(e)=>handleSendLink(e)} className={`w-full flex flex-col ${textAreaExpanded ?'gap-6':''}`}>
    <div className='flex flex-col justify-center gap-8'>
    <div className='flex justify-between'>
      <div className='flex gap-2'>
          <h2 className='text-slate-200 text-xl font-semibold'>Attach File or Image</h2>
          <p className='text-sm text-slate-400 text-[var(--primary-violet)] mt-auto mb-1'>{attachedFile ? `${attachedFile.name.substring(0,7)}(${attachedFile.type})`:''}</p>
      </div>
                <input onChange={(e)=>handleFileChange(e)} type="file" id="attachFileInput" className='hidden '/>
                <label onClick={(e)=>handleLabelClick(e)} htmlFor="attachFileInput" className={`flex items-center justify-center relative w-14 h-8 bg-[#454545] rounded-2xl shadow-sm shadow-gray-400 cursor-pointer transition-all duration-200 after:content-[''] after:absolute after:w-6 after:h-6 after:bg-white after:rounded-full ${attachedFile? 'after:translate-x-[45%] bg-primary-gradient after:duration-200':'after:-translate-x-[40%] after:duration-200'}`}></label>
        </div>
        <div className='flex justify-between'>
          <h2 className='text-slate-200 text-xl font-semibold'>Optional Message</h2>
                <input onChange={(e)=>setTextAreaExpanded(e.target.checked)} type="checkbox" id="textAreaInput" className='hidden '/>
                <label htmlFor="textAreaInput" className={`flex items-center justify-center relative w-14 h-8 bg-[#454545] rounded-2xl shadow-sm shadow-gray-400 cursor-pointer transition-all duration-200 after:content-[''] after:absolute after:w-6 after:h-6 after:bg-white after:rounded-full ${textAreaExpanded? 'after:translate-x-[45%] bg-primary-gradient after:duration-200':'after:-translate-x-[40%] after:duration-200'}`}></label>
        </div>
        <div className={`relative w-full transition-all duration-300 ${textAreaExpanded? 'h-48 overflow-visible':'h-0 overflow-hidden'}`}>
            <textarea onInput={(e)=>setTextAreaLength(e.currentTarget.value.length)} rows={5} onChange={(e)=>setOptionalMessage && setOptionalMessage(e.target.value)} className={`${textAreaExpanded?'username__input':''} bg-[#100e29] w-full text-[1.1rem] text-slate-400 font-semibold outline outline-[var(--primary-violet)] outline-1 transition-all ease-in-out duration-150 py-6 pl-14 rounded-2xl overflow-y-scroll resize-none hide_scrollbar peer`}  maxLength={500} placeholder="Any message to send along the link ?"/>
            <p className={`transition-all duration-[0.4s] opacity-0 absolute text-[3rem] rotate-50 bottom-8 ${textAreaLength>0? ' right-8 scale-[1.4] opacity-80 rotate-12':'-right-full scale-0'}`}>🕊️</p>
            <p className={`transition-all duration-[0.4s] opacity-0 right-3 absolute text-[3rem] ${textAreaLength>0? ' -bottom-full scale-0':'bottom-3 peer-focus:opacity-100'}`}>🦉</p>
            <p className='absolute top-6 left-4 text-xl'>✏️</p>
        </div>
      </div>
      <button type='submit' className={`btn__send relative transition-all self-center duration-300 w-32 h-32 rounded-full z-10 flex items-center justify-center hover:scale-125 active:scale-50 ${textAreaExpanded?'mt-8':''} ${linkSendError ? 'bg-red-gradient error':'bg-primary-gradient'} ${loading? 'animated__gradient after:content-[""] after:absolute after:top-[18%] after:left-[18%] after:bg-primary-gradient after:h-[65%] after:w-[65%] after:animate-ping after:rounded-full after:opacity-60':''}`}>
      <FaTelegramPlane size={64} className='mr-2'/>
    </button>
    <div className="sibling"></div>
  </form>
  )
}

export default Send2Bot