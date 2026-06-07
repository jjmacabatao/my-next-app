import React from 'react'
import TwitterCard from './TwitterCard'
import { layout, text } from '@/shared/styles/globalN'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getAllTweets } from '../services/tweet.api.server.service'

const TweetLists = async () => {
    const session = await auth();
    
    if (!session) {
        redirect("/auth");
    }

    const tweets = await getAllTweets();
   
    if (!tweets.success) {
       console.log(tweets.error);
    }

    return (
        <section className={`${layout.stack} w-full`}>
            {tweets.data.length !== 0 ?
                tweets.data.map((tweet) => (
                    <TwitterCard tweet={tweet} key={tweet._id}/>
                ))
                :
                <section className='px-2'>
                    <span className={`${text.primary} text-lg font-bold`}>No tweets yet</span>
                    <p className={`${text.muted} text-xs`}>Be the first to post a tweet</p>
                </section>
            }
        </section>
    )
}

export default TweetLists