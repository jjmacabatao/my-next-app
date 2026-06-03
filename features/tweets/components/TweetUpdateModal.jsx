
"use client"

import Avatar from '@/shared/components/Avatar'
import { button } from '@/shared/styles/globalN'
import { useTweet } from '../contexts/TweetContext'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { TWEET_LENGTH_LIMIT } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import showAlert from '@/lib/alert'


const TweetUpdateModal = () => {
  const router = useRouter();
  const { updateTweetContext, isUpdateTweetModalOpen, setIsUpdateTweetModalOpen,tweetForUpdate } = useTweet();
  const {data: session} = useSession();

  const data = tweetForUpdate;
  const [tweet, setTweet] = useState(data.body);
  const [tweetLength, setTweetLength] = useState(data.body.length);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);

  if(!session) {
    return null;
  }

  const handleTweetBodyOnChange = (e) => {
    if (e.target.value.length <= TWEET_LENGTH_LIMIT) {
        setTweetLength(e.target.value.length);
        setTweet(e.target.value);
        setIsLimitReached(false);
    }else {
        setIsLimitReached(true);
    }
  }
  
  const handleUpdateTweet = async () => {
    try {
      setLoading(true);
      const tweetId = data?._id;
      const response = await updateTweetContext(tweetId, tweet);

      if (!response.success) {
        console.error(response.error);
        return;
      }

      console.log("Tweet updated successfully.: ", response.tweet);
      showAlert("success","Tweet updated successfully.");

      setIsUpdateTweetModalOpen(!isUpdateTweetModalOpen);
      router.refresh();

    } catch (error) {
      console.error("[Catch]Update tweet: ", error.message);
    }finally{
      console.log("Done executing handleUpdateTweet function.");
      setLoading(false);
    }
    
  }

  const handleRestore = () => {
    setTweet(data.body);
    setTweetLength(data.body.length);
    setIsLimitReached(false);
  }

  
  return (
    
        <div className='fixed top-0 left-0 w-full h-full bg-gray-500/35 flex justify-center items-center z-50'>
          {isUpdateTweetModalOpen}
          <div className='bg-white shadow-lg rounded-md p-5 w-120 m-4'>
            <section className={`flex gap-3`}>
                <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={50} avatarHeight={50} />
    
                <section className="flex-1">
                    <h3 className="text-md font-semibold">
                        {data.author.firstName} {data.author.lastName}
                    </h3>
                    <span className="text-gray-400 text-sm">
                        @{data.author.username}
                    </span>
        
                    <span className="text-gray-500 text-sm">
                        · {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(data.createdAt).toLocaleDateString()}
                    </span>
                </section>
            </section>
            <div className='py-4'>
              <textarea
                className='w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
                rows={4}
                value={tweet}
                onChange={handleTweetBodyOnChange}
              />
              <span className='flex items-center gap-2 text-sm text-gray-500'>Tweet limit: {tweetLength}/{TWEET_LENGTH_LIMIT} {isLimitReached && <span className='text-red-500'>Limit reached!</span>}</span>
            </div>
            <div className='border-t border-gray-300 flex justify-end items-center gap-4 pt-3'>
              
              <button
                type='button'
                className={`${button.base} ${button.variants.solid} ${button.sizes.md}`}
                onClick={() => handleUpdateTweet()}
                disabled={loading || (tweet === data.body)}
              >
                {loading ? 'Saving Changes. . .' : 'Save Changes'}
              </button>
              <button
                type='button'
                className={`${button.base} ${button.variants.solid} ${button.sizes.md}`}
                onClick={handleRestore}
              >
                Restore
              </button>
              <button
                type='button'
                className={`${button.base} ${button.variants.solid} ${button.sizes.md}`}
                onClick={()=>{setIsUpdateTweetModalOpen(!isUpdateTweetModalOpen)}}
              >
                Close
              </button>
            </div>
          </div>
        </div>

  )
}

export default TweetUpdateModal