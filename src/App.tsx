import { useEffect, useState } from 'react';
import {FaLink,FaTelegramPlane,FaDiscord} from 'react-icons/fa';
import {MdAlternateEmail} from 'react-icons/md';
import { InfinitySpin } from 'react-loader-spinner';
import axios from 'axios';
import './App.css';

type TelegramUpdates = {
  date?: number;
  message?: {
    chat: {
      id: number;
      username: string;
    }
  }
}

const App:React.FC = () =>{

  const [activeSocial, setActiveSocial] = useState<string>("telegram");
  const [username, setUsername] = useState<string>("");
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const telegramUsername = localStorage.getItem("telegramUsername");
    console.log(telegramUsername);
    telegramUsername && setUsername(telegramUsername);
  }, []);

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
  return update?.message?.chat.username === username;
}

// Usage example
const handleUsernameSubmit = async(e:React.FormEvent):Promise<void> =>{
  e.preventDefault();
  if(username.length < 5 || username.length > 40) return;
  setLoading(true);
  
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
    setIsUserSubscribed(userSubscribed);

    if (userSubscribed) {
      alert("User is subscribed.");
    } else {
      setErrorMessage("Invalid Username or User not subscribed to the bot.");
    }
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
      <div className='w-1/2 md:w-1/3 gap-10 flex flex-col'>
      <div className='flex flex-col justify-center items-center gap-8'>
          <div className='flex gap-2 items-center justify-center group'>
            <FaLink size={28} className="group-hover:scale-x-[-1] transition-all duration-200"/>
            <h1 className='text-3xl font-bold tracking-wide'>LinkSync+</h1>
          </div>
          <h2 className='text-base uppercase opacity-50 tracking-widest'>
              Effortless Link Sharing Just One Tap Away
          </h2>
      </div>
        <form onSubmit={(e)=>handleUsernameSubmit(e)} className='flex gap-20 flex-col w-full'>
          <div className='flex justify-center'>
            <label onClick={()=>setActiveSocial("telegram")} aria-checked={`${activeSocial === "telegram"? true : false}`} className='flex cursor-pointer relative group'>
              <input className='opacity-0' type="radio" name="radio" onChange={()=>setActiveSocial("telegram")} checked={true}/>
              <span className='inline-flex gap-2 text-xl font-semibold group-aria-checked:bg-[#312e81] outline outline-transparent outline-1 hover:outline-slate-100 hover:outline-1 hover:outline transition-all ease-in-out duration-150 py-2 px-3 rounded-2xl'><FaTelegramPlane size={24}/>Telegram</span>
            </label>
            <label className='flex cursor-pointer relative group'>
              <input className='opacity-0 group' type="radio" name="radio" checked={false} disabled/>
              <span className='inline-flex gap-2 text-xl font-semibold cursor-not-allowed outline outline-transparent hover:outline-slate-100 outline-1 transition-all ease-in-out duration-150 py-2 px-3 rounded-2xl'><FaDiscord size={24}/>Discord ⌛</span>
            </label>
          </div>
          <div className='relative flex flex-col gap-10 items-center justify-center'>
            {
              <p className='text-slate-200 text-base font-[500] absolute -top-8 left-2'>{
                errorMessage
              }</p>
            }
            <MdAlternateEmail size={24} className='absolute top-[13%] left-[3%] z-10 text-slate-400'/>
          <input onInput={()=>setErrorMessage("")} onChange={(e)=>setUsername(e.target.value)} className={`username__input bg-[#100e29] w-full text-[1.2rem] font-[500] outline outline-slate-50 outline-1 transition-all ease-in-out duration-150 py-4 px-12 rounded-2xl ${errorMessage.length>1?'error':''}`} type="text" required minLength={5} maxLength={40} placeholder="Your Telegram Username"/>
          <button type='submit' className='relative overflow-hidden px-4 py-3 w-1/2 bg-[#0b0a1f] hover:bg-[#100e29] transition-all duration-150 outline-none rounded-xl text-xl font-semibold '>
            {
              loading ? <InfinitySpin width='40' color="#845ef7"/> : "Set Username"
            }
          </button>
          </div>
        </form>
        </div>
      </div>
  )
}

export default App
