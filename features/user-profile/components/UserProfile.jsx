"use client"

import CommentCard from '@/features/comments/components/CommentCard'
import TwitterCard from '@/features/tweets/components/TwitterCard'
import { button, card, layout, text } from '@/shared/styles/globalN'
import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'

const UserProfile = ({userData, currentUser}) => {
    const [activeTab, setActiveTab] = useState("tweets");

  return (
    <div className={`p-4 sm:p-5 m-auto w-full sm:w-150 mt-2 mb-12 sm:my-4`}>
      <div className={`${card.base} ${card.padding} m-auto w-full`}>
        <ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-900" onClick={()=>window.history.back()}/>
        
        {/* cover photo */}
        <div className="h-52 mt-2 bg-gradient-to-r from-gray-800 to-black rounded-t-sm"></div>

        {/* user profile data */}
        <section className="px-6">
            {/* profile picture */}
            <div className="flex justify-between items-start">
            <img
              src="/profile.png"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white -mt-16 bg-white"
            />
            

            {
                userData.user._id === currentUser && 
                    <button className={`${button.base} ${button.variants.solid} ${button.sizes.md} mt-6 cursor-pointer`} >
                    Edit Profile
                    </button>
            }
            </div>

            {/* static user info */}
            <div className="mt-4">
                <h1 className="text-xl font-bold">{userData.user.firstName} {userData.user.lastName}</h1>
                <p className="text-sm text-gray-500">@{userData.user.username}</p>

                <p className="mt-4 text-sm text-gray-800">
                ReDI Fullstack Bootcamp Student. Full-stack developer. Created this application using NextJS and MongoDB.(static data)
                </p>

                <div className="flex gap-4 mt-5">
                <div>
                    <span className="text-[14px] font-bold text-gray-800">0</span>
                    <span className="text-[14px] text-gray-500"> Following</span>
                </div>

                <div>
                    <span className="text-[14px] font-semibold text-gray-80">0</span>
                    <span className="text-[14px] text-gray-500"> Followers</span>
                </div>
                </div>
            </div>

        </section>

        {/* section for user's tweets and comments */}
        {/* tabs */}
        <section className="mt-4 border-b border-gray-200">
          <div className="flex">
            <button className={`flex-1 py-4 text-sm ${activeTab === 'tweets' ? 'font-semibold border-b-2 border-blue-500' : ' text-gray-500 hover:bg-gray-50'} transition`} onClick={() => setActiveTab("tweets")}>
              Tweets
            </button>

            <button  className={`flex-1 py-4 text-sm ${activeTab === 'comments' ? 'font-semibold border-b-2 border-blue-500' : ' text-gray-500 hover:bg-gray-50'} transition`} onClick={() => setActiveTab("comments")}>
              Comments
            </button>
          </div>
        </section>

        {/* details, tweets and comments */}
        <section className={`w-full min-h-5 max-h-100 overflow-y-auto mt-4 `}>
            <section className={`${layout.stack} w-full mt-2 ${activeTab === 'tweets' || 'hidden'}`}>
                {
                    userData.tweets.length !== 0 ?
                    userData.tweets.map((tweet) => (
                        <TwitterCard tweet={tweet} key={tweet._id}/>
                    ))
                    :
                    <section className='px-2'>
                        <span className={`${text.primary} text-lg font-bold`}>No tweets yet</span>
                        <p className={`${text.muted} text-xs`}>
                            { 
                                userData.user._id === currentUser ?
                                'Share your first tweet and start the conversation.' :
                                "This user hasn't posted anything yet."
                            }
                        </p>
                    </section>
                }
            </section>

            <section className={`${layout.stack} w-full mt-2 ${activeTab === 'comments' || 'hidden'}`}>
                {
                    userData.comments.length > 0 ?
                        userData.comments.map((comment) => (
                                <CommentCard key={comment._id} comment={comment} withDeleleFn={false}/>
                            )  
                        )
                    :
                        <section>
                            <span className={`${text.primary} text-lg font-bold`}>No comments yet</span>
                            <p className={`${text.muted} text-xs`}>
                            { 
                                userData.user._id === currentUser ?
                                'Your comments will appear here.' :
                                "This user hasn't commented on any tweets yet."
                            }
                        </p>
                        </section>
                        
                }
            </section>
        </section>
      </div>
    </div>
  )
}

export default UserProfile