import React from 'react';
import {BiReset} from 'react-icons/bi';
import { UserDetails} from '../features/types';


interface ResetUsernameProps {
    initialUserDetails: UserDetails;
    setUserDetails: (userDetails:UserDetails)=>void;
    setUsername: (username:string)=>void;
    setErrorMessage: (errorMessage:string)=>void;
    setSuccessMessage: (successMessage:string)=>void;
    setAttachedFile: (attachedFile:File | null)=>void;
}

const ResetUsername:React.FC<ResetUsernameProps> = ({initialUserDetails,setUserDetails,setUsername,setErrorMessage,setSuccessMessage,setAttachedFile}) => {
  return (
    <div className='absolute top-10 right-6'>
    <button data-tooltip-target="btn-reset__tooltip" data-tooltip-placement="left" type="button" className='btn__reset transition-all duration-300 w-16 h-16 rounded-full z-10 flex items-center justify-center hover:scale-125 active:scale-50 bg-primary-gradient peer' onClick={()=>{setUserDetails(initialUserDetails);setUsername("");setErrorMessage("");setSuccessMessage("");setAttachedFile(null);}}>
      <BiReset size={32}/>
  </button>
  <div id="btn-reset__tooltip" role="tooltip" className="absolute opacity-0 transition-all duration-300 w-max z-10 top-[25%] right-[140%] px-3 py-2 text-base font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 peer-hover:opacity-100">
    Reset Username
  </div>
  </div>
  )
}

export default ResetUsername