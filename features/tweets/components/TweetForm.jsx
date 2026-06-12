'use client'

import { TWEET_LENGTH_LIMIT } from '@/lib/utils';
import Avatar from '@/shared/components/Avatar';
import { border, button, card, input } from '@/shared/styles/globalN'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'
import { createTweet } from '../services/tweet.api.client.service';
import showAlert from '@/lib/alert';

const TweetForm = () => {
    const router = useRouter();
    const [tweetLength, setTweetLength] = useState(0);
    const [tweet, setTweet] = useState("");
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [loading, setLoading] = useState(false);
    const {data: session, status} = useSession();
    
    useEffect(()=>{

        // return if session is not yet loaded
        if (status === "loading") {
            return;
        }
        // router push to /auth if not authenticated
        if (status === "unauthenticated") {
            router.push("/auth");
            return;
        }

    },[router, status]);
    
    // handle tweet input change action
    const handleInputChange = (e) => {
        if (e.target.value.length <= TWEET_LENGTH_LIMIT) {
            setTweetLength(e.target.value.length);
            setTweet(e.target.value);
             setIsLimitReached(false);
        }else {
            setIsLimitReached(true);
        }
    }


    // function that handle the creation of tweet
    const handleCreateTweet = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            // call the createTweet function from the tweets.api.client.js which calls the api for creating tweet.
            const response = await createTweet(tweet, session?.user?.name?.id);

            if (!response.success) {
                // setError(response.error);
                console.error(response.error);
                showAlert("danger",response.error);
                return;
            }else {
                setTweet("");
                setTweetLength(0);
                setIsLimitReached(false);
                setTweetLength(0);

                showAlert("success","Tweet successfully posted.");

                router.refresh();
            }

        } catch (error) {
            // setError(error.message);
            console.error(error.message);
            showAlert("danger",response.error);
            return;
        }finally{
            setLoading(false);
        }
    }
  return (
    <div className=' sticky top-16 z-50 bg-white/50 backdrop-blur border-b border-b-gray-200'>
        <section className={` ${card.base} ${card.padding} ${border.strong} mb-4 mx-auto w-full`}>
            <form className='flex flex-col space-y-4 w-full' onSubmit={handleCreateTweet}>
                <section className='flex flex-row w-full gap-2'>
                    <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={60} avatarHeight={60} />
                    <textarea 
                        rows="4" value={tweet} 
                        className={`${input.base} mt-1 focus:ring-0 w-full`} 
                        placeholder={`${status === 'authenticated' && '@'+session.user?.name?.username+','} What's happening?`} onChange={handleInputChange}>
                    </textarea>
                </section>
                <section className='flex items-center justify-between'>
                    <section className='flex items-center gap-4'>
                        <span className='flex items-center gap-2 text-sm text-gray-500'>Tweet limit: {tweetLength}/{TWEET_LENGTH_LIMIT} {isLimitReached && <span className='text-red-500'>Limit reached!</span>}</span>
                    </section>
                    <button type="submit" className={`${button.base} ${button.variants.solid} ${button.sizes.md}`} disabled={loading || tweetLength === 0}>
                        {loading ? 'Tweeting' : 'Tweet'}</button>
                </section>
            </form>
        </section>
    </div>
  )
}

export default TweetForm