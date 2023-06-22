import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import {Headings,Options, Send2Bot, SetUsername} from './Components';
import {getGreetings} from './features';
import { UserDetails,TelegramUpdates } from './features/types';
import ResetUsername from './Components/ResetUsername';
const App:React.FC = () =>{

  const [activeSocial, setActiveSocial] = useState<string>("telegram");
  const [username, setUsername] = useState<string>("");
  const [optionalMessage, setOptionalMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [textAreaExpanded, setTextAreaExpanded] = useState<boolean>(false);
  const [linkSendError, setlinkSendError] = useState<boolean>(false);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [textAreaLength, setTextAreaLength] = useState<number>(0);
  

  const initialUserDetails = {
    username: "",
    chatId: 0,
    isUserSubscribed: false,
    name: "",
  } as UserDetails;

  const [userDetails, setUserDetails] = useState<UserDetails>(initialUserDetails);

  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails");
    console.log(userDetailsString);
    const existingUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null; 
    console.log(existingUserDetails);
    existingUserDetails && setUserDetails(existingUserDetails);
  }, []);

  useEffect(() => {
    console.log(userDetails);
    userDetails!==initialUserDetails && localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }, [userDetails]);

  const getUrl = (methodName: string) => {
    return `https://api.telegram.org/bot${import.meta.env.VITE_LinkSyncBot_TOKEN}/${methodName}`;
  };


// Function to retrieve updates from the Telegram Bot API
const getUpdates = async():Promise<TelegramUpdates[]> =>{
  const response = await axios.get(getUrl('getUpdates'));
  return response.data.result;
}

// Function to check if a user is subscribed based on their username
const userIsSubscribed = (update: TelegramUpdates, username: string): boolean =>{
  if(update?.message?.chat.username === username){
    !userDetails.isUserSubscribed && setUserDetails({username:username,isUserSubscribed:true,chatId:update.message.chat.id,name:update.message.chat.first_name})
    return true;
  }
  return false;
}

const handleSendLink = async(event:React.FormEvent):Promise<void> =>{
  setTimeout(() => {
    if(loading && attachedFile) setSuccessMessage("Hang on tight! Sending File as well 🚀")
  }, 3000);
  setLoading(true);
  const target = event.target as HTMLFormElement;
  target.reset();
  setlinkSendError(false);
  setErrorMessage("");
  event.preventDefault();
   await axios({
      method: 'post',
      url: getUrl('sendMessage'),
      data: {
        chat_id: userDetails.chatId,
        parse_mode: 'Markdown',
        text: `
🔗 Link: *${window.location.href}*

⭐️ Page Title: *${document.title}*

🕊️ Message: _${optionalMessage.length<1 ? 'No Additonal Message Attached!':optionalMessage}_

*${getGreetings(userDetails.name)}*
        `,
      },
    }).then((res)=>{
      if(res.data.ok && !attachedFile){
        setLoading(false);
        setSuccessMessage("Link Successfully sent! 🚀");
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      }
    }).catch((err)=>{
      console.log(err);
      setLoading(false);
      setlinkSendError(true);
      setErrorMessage("Please Unblock and Restart the bot first 🤖");
    });

    if(attachedFile && !linkSendError){
      const formData = new FormData();
      formData.append("chat_id", userDetails.chatId ? userDetails.chatId.toString() : "");
      formData.append("document", attachedFile);
      formData.append("caption", `${attachedFile.name.substring(0,15)}(${attachedFile.type})`);

      await axios({
        method: 'post',
        url: getUrl('sendDocument'),
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res)=>{
        if(res.data.ok){
          setLoading(false);
          setAttachedFile(null);
          setSuccessMessage("Link with File Successfully Sent! 🚀");
          setTimeout(() => {
            setSuccessMessage("");
          }, 4000);
        }

      }).catch((err)=>{
        console.log(err);
        setLoading(false);
        setlinkSendError(true);
        setErrorMessage("Please Unblock and Restart the bot first 🤖");
      });
    }
    
};

// Usage example
const handleUsernameSubmit = async(event:React.FormEvent):Promise<void> =>{
  const target = event.target as HTMLFormElement
  setLoading(true);
  event.preventDefault();
  if(username.length < 5 || username.length > 40) return;
  
  try {
    const updates = await getUpdates();
    const userSubscribedPromises = updates.map((update: TelegramUpdates) => {
      return new Promise<boolean>((resolve) => {
        const isSubscribed = userIsSubscribed(update, username);
        resolve(isSubscribed);
      });
    });
    const userSubscribedResults = await Promise.all(userSubscribedPromises);
    const userSubscribed = userSubscribedResults.some((isSubscribed: boolean) => isSubscribed);

    userSubscribed && target.reset();
    !userSubscribed && setErrorMessage("Invalid Username or User not subscribed to the bot 🤖");

  } catch (error) {
    console.error('Error:', error);
  }
  setLoading(false);
  };

  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) =>{
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if(file && file.size > 48000000){
      setlinkSendError(true);
      setErrorMessage("File Size should be less than 50MB");}
    else{
      setAttachedFile(file || null);
      setlinkSendError(false);
      setErrorMessage("");
    }
  };
  const handleLabelClick = (event:React.MouseEvent<HTMLLabelElement>) =>{
    if (attachedFile){
      event.preventDefault();
      event.stopPropagation();
      setAttachedFile(null);
    }
  };

  

  return (
    <div className='flex w-screen h-screen justify-center items-center bg-dark-linear overflow-hidden hide_scrollbar'>
      <div className={`w-[75%] md:w-1/3 gap-4 flex flex-col items-center ${userDetails.isUserSubscribed ?'animate-slideup':'animate-slidedown'}`}>
        {
         !textAreaExpanded && <Headings isUserSubscribed={userDetails.isUserSubscribed} name={userDetails.name}/>
        }
        {
          userDetails.isUserSubscribed && (
            <>
                <p className={`text-red-400 text-xl font-semibold transition-all duration-200 animate-slidedown ${textAreaExpanded?'mt-6':''} ${linkSendError ? ' h-[24px] overflow-visible':'h-0 overflow-hidden'}`}>{errorMessage}</p>

                <p className={`text-xl text-slate-300 font-semibold ${successMessage.length>0? 'animate-slidedown':'animate-pulse'} transition-all duration-200 animate-slidedown ${((loading && attachedFile) || (successMessage.length > 0 && !loading)) ? 'h-[24px] overflow-visible mb-6':'h-0 overflow-hidden'}`}>{successMessage}</p>
                {
                  !textAreaExpanded && <ResetUsername initialUserDetails={initialUserDetails} setUserDetails={setUserDetails} setUsername={setUsername} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} setAttachedFile={setAttachedFile}/>
                }


          <Send2Bot handleSendLink={handleSendLink} textAreaExpanded={textAreaExpanded} attachedFile={attachedFile} handleFileChange={handleFileChange} handleLabelClick={handleLabelClick} setTextAreaExpanded={setTextAreaExpanded} textAreaLength={textAreaLength} setTextAreaLength={setTextAreaLength} setOptionalMessage={setOptionalMessage} loading={loading} linkSendError={linkSendError}/>
          </>
          )
        }
        {
          !userDetails.isUserSubscribed && (
            <form onSubmit={(e)=>handleUsernameSubmit(e)} className='flex gap-[3.8rem] flex-col w-full'>
            <Options activeSocial={activeSocial} setActiveSocial={setActiveSocial}/>
            <div className='relative flex flex-col gap-10 items-center justify-center'>
              {
                <p className='text-slate-200 text-base font-[500] justify-self-end absolute -top-8'>{
                  errorMessage
                }</p>
              }
              <SetUsername loading={loading} setErrorMessage={setErrorMessage} setUsername={setUsername} errorMessage={errorMessage}/>
              <a href='https://t.me/LinkSyncBot' target='_blank' rel="noreferrer" className='text-slate-500 text-base self-center font-semibold visited:text-slate-500 transition-all duration-200 hover:scale-125 hover:text-[var(--primary-violet)] '>☛ Link to LinkSync+ Telegram Bot ☚</a>
            </div>
          </form>

          )
        }
        </div>
      </div>
  )
}

export default App
