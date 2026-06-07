"use client"

import UserCard from '@/shared/components/UserCard'
import React, { useEffect, useState } from 'react'
import { getTweetDownReactors, getTweetUpReactors, getTweetViewers } from '../services/views.api.client.service';
import UpVote from '@/features/tweets/components/UpVote';
import DownVote from '@/features/tweets/components/DownVote';
import TweetView from '@/features/tweets/components/TweetView';
import { alert, text } from '@/shared/styles/globalN';
import { useSession } from 'next-auth/react';
import { useTweet } from '@/features/tweets/contexts/TweetContext';
import { EyeOff, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ViewerList =  () => {
  const {data:session, status} = useSession();
  const router = useRouter();
  
  const {isTweetsViewersModalOpen, setIsTweetViewersModalOpen, tweetIdForViewers} = useTweet();

  const [ tweetViewers, setTweetViewers] = useState();
  const [ tweetUpReactors, setTweetUpReactors] = useState();
  const [ tweetDownReactors, setTweetDownReactors] = useState();
  const [ tweetViewersLen, setTweetViewersLen] = useState(0);
  const [ tweetUpReactorsLen, setTweetUpReactorsLen] = useState(0);
  const [ tweetDownReactorsLen, setTweetDownReactorsLen] = useState(0 );

  const [activeNav, setActiveNav] = useState('upvote');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);

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

    // function for fetching all tweet viewers and reactors
    // calling getTweetViewers, getTweetUpReactors, and getTweetDownReactors functions from views.api.client.servce.js
    const getData = async() => {
      let inError = false;
      try {
        
        setLoading(true);
        // call getTweetViewers function, if success is false then add error to error state, otherwise setTweetViewers state
        const tweetViewers = await getTweetViewers(tweetIdForViewers);

        if (!tweetViewers.success) {
          
          setError(prev => [...new Set([...prev, tweetViewers.error])]);
          
        }
        setTweetViewers(tweetViewers);
        setTweetViewersLen(tweetViewers.tweet_viewers.length);

        // call getTweetUpReactors function, if success is false then add error to error state, otherwise setTweetUpReactors state
        const tweetUpReactors = await getTweetUpReactors(tweetIdForViewers);

        if (!tweetUpReactors.success) {
          
          setError(prev => [...new Set([...prev, tweetUpReactors.error])]);
          
        }
        setTweetUpReactors(tweetUpReactors);
        setTweetUpReactorsLen(tweetUpReactors.tweet_upreactors.length);

        // call tweetDownReactors function, if success is false then add error to error state, otherwise setTweetDownReactors state
        const tweetDownReactors = await getTweetDownReactors(tweetIdForViewers);

        if (!tweetDownReactors.success) {
          
          setError(prev => [...new Set([...prev, tweetDownReactors.error])]);
          
        }
        setTweetDownReactors(tweetDownReactors);
        setTweetDownReactorsLen(tweetDownReactors.tweet_downreactors.length);

      } catch (catchError) {
        
        setError(prev => [
          ...new Set([...prev, catchError.message])]
        );
        
      } finally{
        setLoading(false);
        console.log("Done executing getData function in ViewerList.jsx");
      }
      
    }
    getData();
    
  }, [tweetIdForViewers, status, router]);

  const handleActiveNav = (nav) => {
    setActiveNav(nav);
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-500/35 flex justify-center items-center z-50 ${!isTweetsViewersModalOpen && 'hidden'}`}>
      <div className='bg-white rounded-md p-4 w-120 m-4 h-120'>
        <div className='flex border-b border-gray-200 w-full justify-between'>
          <nav className={`flex flex-row gap-10 border-gray-200 w-full`}>
            <div className={`text-gray-600 p-2 block hover:text-blue-500 focus:outline-none ${activeNav === 'upvote' && 'border-b font-medium border-blue-500 transition-all'}`}>
                <UpVote votes={tweetUpReactorsLen} fill={tweetUpReactorsLen !==0} onUpvoteClick={() => handleActiveNav('upvote')} />
            </div>
            <div className={`text-gray-600 p-2 block hover:text-blue-500 focus:outline-none ${activeNav === 'downvote' && 'border-b font-medium border-blue-500 transition-all'}`}>
                <DownVote votes={tweetDownReactorsLen} fill={tweetDownReactorsLen !==0} onDownvoteClick={() => handleActiveNav('downvote')} />
            </div>
            <div className={`text-gray-600 py-2 block hover:text-blue-500 focus:outline-none ${activeNav === 'view' && 'border-b font-medium border-blue-500 transition-all'}`}>
               <TweetView views={tweetViewersLen} fill={tweetViewersLen !==0} onClick={() => handleActiveNav('view')} />
            </div>        
          </nav>
          <nav>
            <X className="w-4 h-4 text-gray-500 hover:text-gray-900 " onClick={()=>setIsTweetViewersModalOpen(false)}/>
          </nav>
          
        </div>
        {
          error?.length !== 0 ? (
            <section className={`mt-2 ${alert.base} ${alert.variants.danger} text-xs flex flex-col`}>
              {error.map((err, index) => (
                <p key={index} className={`${text.primary} text-xs`}>
                  {err}
                </p>
              ))}
            </section>
          ) :
          loading ? 
            <p className=' w-full mt-4 text-center text-sm'>Loading tweet viewers and reactors. . .</p> :
          <>
            {/* Upvote */}
            <section className={` w-full mt-2 h-100 overflow-y-auto ${activeNav === 'upvote' ? 'block' : 'hidden'}`}>
              {
                tweetUpReactorsLen !== 0 ?
                tweetUpReactors.tweet_upreactors.map((upreactor) => (
                  <UserCard key={upreactor._id} user={upreactor}/>
                  
                )) :
                <div className='flex flex-col justify-center items-center h-full'>
                  <span className={`${text.primary} text-md`}>No upvotes yet</span>
                  <p className={`${text.muted} text-xs`}>Be the first to show your support.</p>
                </div>
              }
            </section>
            {/* DownVote */}
            <section className={` w-full mt-2 h-100 overflow-y-auto  ${activeNav === 'downvote' ? 'block' : 'hidden'}`}>
              {
                tweetDownReactorsLen !== 0 ?
                tweetDownReactors.tweet_downreactors.map((downreactor) => (
                  <UserCard key={downreactor._id} user={downreactor}/>
                )) :
                <div className='flex flex-col justify-center items-center h-full'>
                  <span className={`${text.primary} text-md`}>No downvotes yet</span>
                  <p className={`${text.muted} text-xs`}>That's a good sign.</p>
                </div>
              }
            </section>
              {/* Viewers */}
            <section className={` w-full mt-2 h-100 overflow-y-auto  ${activeNav === 'view' ? 'block' : 'hidden'}`}>
              {
                tweetViewersLen !== 0 ?
                tweetViewers.tweet_viewers.map((viewer) => (
                  <UserCard key={viewer._id} user={viewer}/>
                )) :
                <div className='flex flex-col justify-center items-center h-full'>
                  <span className={`${text.primary} text-md`}>No views yet</span>
                  <p className={`${text.muted} text-xs`}>Views will appear as people discover your post.</p>
                </div>
              }
            </section>
          </>
        }
      </div>
      
    </div>
  )
}

export default ViewerList