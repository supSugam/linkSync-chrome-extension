import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import {Headings,Options, SetUsername} from './Components';
import { FaTelegramPlane } from 'react-icons/fa';
import {BiMessageSquareEdit} from 'react-icons/bi';

type TelegramUpdates = {
  date?: number;
  message?: {
    chat: {
      id: number;
      username: string;
    }
  }
}
type UserDetails = {
  username?: string;
  chatId?: number;
  isUserSubscribed?: boolean;
}

const App:React.FC = () =>{

  const [activeSocial, setActiveSocial] = useState<string>("telegram");
  const [username, setUsername] = useState<string>("");
  const [optionalMessage, setOptionalMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [textAreaLength, setTextAreaLength] = useState<number>(0);

  const initialUserDetails = {
    username: "",
    chatId: 0,
    isUserSubscribed: false,
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
    !userDetails.isUserSubscribed && setUserDetails({username:username,isUserSubscribed:true,chatId:update.message.chat.id})
    return true;
  }
  return false;
}

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
    userSubscribed && alert("User is subscribed.");
    !userSubscribed && setErrorMessage("Invalid Username or User not subscribed to the bot 🤖");

  } catch (error) {
    console.error('Error:', error);
  }
  setLoading(false);



    // axios({
    //   method: 'get',
    //   url: getUrl('getUpdates'),
    // })
    //   .then((response) => {
    //     const updates = response.data.result;
    //     if (updates.length > 0) {
    //       const chatId = updates[0].message.chat.id;
    //       console.log(`Chat ID for ${username}: ${chatId}`);
    //     } else {
    //       console.log(`No updates found for ${username}`);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
    // localStorage.setItem("telegramUsername", username);
    // sendLinkToTelegram();
    // axios({
    //   method: 'post',
    //   url: `https://api.telegram.org/bot${import.meta.env.VITE_LinkSyncBot_TOKEN}/sendMessage`,
    //   data: {
    //     chat_id: `985440419`,
    //     text: "Introducing LinkSync: 🌐✨ Your ultimate link retrieval bot! 🔗💡 Get shared links effortlessly across devices with a single tap. 📲💥 Never miss important content again! 🚀🔥 Syncing your shared links seamlessly, LinkSync ensures you can access them anytime, anywhere. Say goodbye to manual transfers! Experience the convenience today! 😎🔁",

    //   },

    // }).then((res)=>{
    //   console.log(res);
    // }).catch((err)=>{
    //   console.log(err);
    // });
    // try {
    //   await axios.post(`https://api.telegram.org/6067571055:AAGRwmzYZFQzw72-mWU5I4Mf773r5zK37Iw/sendMessage`, {
    //     chat_id: `@${username}`,
    //     text: "Hello world!",
    //     withCredentials: false,
    //   });
  
    //   console.log('Message sent successfully');
    // } catch (error:any) {
    //   console.error('Error:', error.message);
    // }

  };

  

  return (
    <div className='flex w-screen h-screen justify-center items-center bg-dark-linear'>
      <div className='w-1/2 md:w-1/3 gap-10 flex flex-col items-center'>
        <Headings/>
        {
          userDetails.isUserSubscribed && (
            <>
            <div className='w-full flex flex-col items-center justify-center'>
              <div className='relative w-full'>

                <textarea onInput={(e)=>setTextAreaLength(e.currentTarget.value.length)} rows={5} onChange={(e)=>setOptionalMessage && setOptionalMessage(e.target.value)} className={`username__input bg-[#100e29] w-full text-[1.15rem] text-slate-400 font-[500] outline outline-[var(--primary-violet)] outline-1 transition-all ease-in-out duration-150 py-6 pl-14 rounded-2xl overflow-y-scroll resize-none hide_scrollbar group`}  maxLength={500} placeholder="Any Optional Message with the Link ?">

                  </textarea>
              {/* <BiMessageSquareEdit size={30} color='845ef7' className='absolute top-3 left-3'/> */}
                <p className={`transition-all duration-[0.4s] opacity-0 absolute text-[3rem] rotate-12 bird bottom-8 ${textAreaLength>0? ' right-8 scale-[2] opacity-80':'-right-full scale-0'}`}>🕊️</p>
                <p className={`transition-all duration-[0.4s] opacity-0 right-3 absolute text-[3rem] owl ${textAreaLength>0? ' -bottom-full scale-0':'bottom-3 scale-125 opacity-70'}`}>🦉</p>
                <p className='absolute top-6 left-4 text-xl'>✏️</p>
              </div>

          </div>
                      <button className='bg-primary-gradient w-32 h-32 rounded-full flex items-center justify-center'>
                      <FaTelegramPlane size={64} className='mr-2'/>
                    </button>
          </>
          )
        }
        {
          !userDetails.isUserSubscribed && (
            <form onSubmit={(e)=>handleUsernameSubmit(e)} className='flex gap-20 flex-col w-full'>
            <Options activeSocial={activeSocial} setActiveSocial={setActiveSocial}/>
            <div className='relative flex flex-col gap-10 items-center justify-center'>
              {
                <p className='text-slate-200 text-base font-[500] justify-self-end absolute -top-8'>{
                  errorMessage
                }</p>
              }
              <SetUsername loading={loading} setErrorMessage={setErrorMessage} setUsername={setUsername} errorMessage={errorMessage}/>
            </div>
          </form>
          )
        }
        </div>
      </div>
  )
}

export default App
