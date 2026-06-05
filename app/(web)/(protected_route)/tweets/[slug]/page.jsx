
import { auth } from '@/auth';
import TwitterCard from '@/features/tweets/components/TwitterCard';
import { updateTweetViews } from '@/features/tweets/services/tweet.api.server.service';
import { notFound } from 'next/navigation';

import React from 'react'

//is a route segment configuration that forces a page or layout to be dynamically rendered on every user request.
//Milestone 5 discussion.
export const dynamic = "force-dynamic";

const SingleTwitterPage = async ( {params} ) => {
  const session = await auth();

  if (!session) {
      redirect("/auth");
  }

  const { slug } = await params;

  // update tweet view and return updated tweet
  // update view only if user does not already in the viewers.
  const tweetViews = await updateTweetViews(slug, session.user?.name?.id);

  if (!tweetViews.success){
    console.log(tweetViews.error);
    notFound();
  }

  return (
      <TwitterCard tweet={tweetViews.tweet[0]} key={tweetViews.tweet[0]._id} isSingleView={true}/>
  )
}

export default SingleTwitterPage