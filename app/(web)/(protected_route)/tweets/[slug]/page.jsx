
import { auth } from '@/auth';
import { createNotification } from '@/features/notification/services/notif.api.server.service';
import TwitterCard from '@/features/tweets/components/TwitterCard';
import { updateTweetViews } from '@/features/tweets/services/tweet.api.server.service';
import { notFound } from 'next/navigation';

import React from 'react'

//is a route segment configuration that forces a page or layout to be dynamically rendered on every user request.
//Milestone 5 discussion.
export const dynamic = "force-dynamic";

const SingleTwitterPage = async ( {params,searchParams} ) => {
  const session = await auth();

  if (!session) {
      redirect("/auth");
  }

  const { slug } = await params;
  const { notifId } = await searchParams;
  const userId = session?.user?.name?.id;

  // update tweet view and return updated tweet
  // update view only if user does not already in the viewers.
  const tweetViews = await updateTweetViews(slug, userId, notifId || '');

  if (!tweetViews.success){
    console.log(tweetViews.error);
    notFound();
  }

  if(tweetViews.viewerdataSave) {
  // create notification
    await createNotification(slug,userId,tweetViews.tweet[0].author._id,`viewed your post.`);
  }

  return (
    <div className={`p-4 sm:p-5 m-auto w-full sm:w-150 mt-2 sm:mt-4`}>
      <TwitterCard tweet={tweetViews.tweet[0]} key={tweetViews.tweet[0]._id} isSingleView={true}/>
    </div>
      
  )
}

export default SingleTwitterPage