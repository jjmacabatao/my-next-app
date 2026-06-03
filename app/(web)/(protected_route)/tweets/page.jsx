
import { auth } from '@/auth';
import TweetForm from '@/features/tweets/components/TweetForm'
import TweetLists from '@/features/tweets/components/TweetLists'
import { redirect } from 'next/dist/server/api-utils';
import React from 'react'

//is a route segment configuration that forces a page or layout to be dynamically rendered on every user request.
//Milestone 5 discussion.
export const dynamic = "force-dynamic";

const TwitterPage = async () => {
   const session = await auth();
   
     if (!session) {
       redirect("/auth");
     }

  return (
    <>
      <div
      className={`max-w-lg mx-auto pl-6 px-6 sm:px-6 lg:px-8 py-6 sm:pl-6 w-full`}
      >
        <TweetForm />
        <TweetLists />
      </div>
    </>
  )
}

export default TwitterPage

// https://www.youtube.com/watch?v=Sklc_fQBmcs