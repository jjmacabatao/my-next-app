"use client"


import { border, card, layout, typography } from '@/shared/styles/globalN';
import { ArrowLeft, Ellipsis, MessageCircle, PencilIcon, Trash2, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import DownVote from './DownVote';
import UpVote from './UpVote';
import TweetView from './TweetView';
import { useTweet } from '../contexts/TweetContext';
import { useSession } from 'next-auth/react';
import Avatar from '@/shared/components/Avatar';
import TweetUpdateModal from './TweetUpdateModal';
import Link from 'next/link';
import TweetComments from '../../comments/components/TweetComments';
import { deleteTweet } from '../services/tweet.api.client.service';
import showAlert from '@/lib/alert';
import { GET_USER_TWEETS_AND_COMMENT, timeAgo } from '@/lib/utils';
import ViewerList from '@/features/views/component/ViewerList';
import { createNotification } from '@/features/notification/services/notif.api.client.service';


const TwitterCard = ({ tweet, isSingleView = false }) => {
  const router = useRouter();
  const pathname = usePathname()
  const { upVoteTweet, downVoteTweet, unVoteUpDownTweet, setIsUpdateTweetModalOpen, isUpdateTweetModalOpen, setTweetForUpdate, isTweetsViewersModalOpen, setIsTweetViewersModalOpen, setTweetIdForViewers} = useTweet();
  const {data: session, status} = useSession();
 
  const [isCardActionOpen, setIsCardActionOpen] = useState(false);


  // check session if available
  // return if session is not yet loaded
    if (status === "loading") {
        return;
    }
    // router push to /auth if not authenticated
    if (status === "unauthenticated") {
        router.push("/auth");
        return;
    }

  const userId =  session?.user?.name?.id || '';

  // handles the deletion of tweet
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tweet?");

    if (!confirmDelete) {
      return;
    }
    
    try {
      console.log("Delete tweet with id: ", id);
      const response = await deleteTweet(id);
    
      if (!response.success) {
        console.error("Failed to delete tweet: ", response.error);
        showAlert('danger',response.error);
        return;
      }

      // console.log("Tweet deleted successfully: ", response);
      showAlert('success', "Tweet deleted successfully");

    } catch (error) {
      console.error("[Catch]Handle delete tweet: ", error);
      showAlert('danger',error.message);
    }finally {
      console.log("Done executing handleDelete function");
      
      if (isSingleView) {
        router.replace("/");
      }else{
         router.refresh();
      }
     
    }

  }
  
  // handles the adding and removing upvote.
  // if isVoted then remove upvote otherwise add
  const handleUpvote = async (tweetId,isVoted, reactionId,tweetAuthor) => {
    let upvote;
    try {
      if (isVoted) {
        //delete the reaction
        upvote = await unVoteUpDownTweet(tweetId, reactionId);
      } else {
        // add new reaction
        upvote = await upVoteTweet(tweetId, userId);
      }

      if (!upvote.success) {
        console.error(`Failed to ${isVoted ? 'remove upvote from' : 'upvote'} tweet: `, upvote.error);
        showAlert("danger", `Failed to ${isVoted ? 'remove upvote from' : 'upvote'} tweet: ${upvote.error}`);
        return;
      }

      // create notification
      if (userId !== tweetAuthor){
        await createNotification(tweetId,userId,tweetAuthor,`${isVoted ? 'unupvoted' : 'upvoted'} your post.`);
      }
      //success
      showAlert("success",isVoted ? "Upvote removed successfully." : "Tweet upvoted successfully.");

    } catch (error) {
      console.error("[Catch]Handle upvote: ", error.message);
      showAlert("danger", `[Catch]Handle upvote:  ${error.message}`);
    }finally{
      console.log("Done executing handleUpvote function");
      router.refresh();
    }
    
  }


  // handles the adding and removing downvote.
  // if isVoted then remove downvote otherwise add
  const handleDownvote = async (tweetId, isVoted, reactionId,tweetAuthor) => {
    let downvote;
    try {
      if (isVoted) {
        //delete the reaction
        downvote = await unVoteUpDownTweet(tweetId, reactionId);
      }else {
        //add new down vote reaction
        downvote = await downVoteTweet(tweetId, userId);
      }

      if (!downvote.success) {
        console.error(`Failed to ${isVoted ? 'remove downvote from' : 'downvote'} tweet: `, downvote.error);
        showAlert("danger",`Failed to ${isVoted ? 'remove downvote from' : 'downvote'} tweet: ${downvote.error}`);
        return;
      }

      // create notification
      if (tweetAuthor !== userId){
        await createNotification(tweetId,userId,tweetAuthor,`${isVoted ? 'undownvoted' : 'downvoted'} your post.`);
      }

      //success
      showAlert("success",isVoted ? "Downvote removed successfully." : "Tweet down voted successfully.");

    } catch (error) {
      console.error("[Catch]Handle downvote: ", error.message);
      showAlert("danger",`[Catch]Handle downvote: ${error.message}`)
    }finally{
      console.log("Done executing handleDownvote function");
      router.refresh();
    }
  }

  //check if the user upvoted the tweet
  const isVotedUp =  tweet.reactions.some(reaction => reaction.reaction_by === userId && reaction.type === "upvote");
  //get the reaction id of the user if the tweet is upvoted
  const reactionIdUp = isVotedUp ? tweet.reactions.find(reaction => reaction.reaction_by === userId && reaction.type === "upvote")?._id : null;
  //check if the user down voted the tweet
  const isVotedDown =  tweet.reactions.some(reaction => reaction.reaction_by === userId && reaction.type === "downvote");
   //get the reaction id of the user if the tweet is down voted.
  const reactionIdDown = isVotedDown ? tweet.reactions.find(reaction => reaction.reaction_by === userId && reaction.type === "downvote")?._id : null;
  
  const commentLen = tweet?.comments?.length || 0;
  

  return (
    <>
      
      <article className={`${card.base} ${card.padding} ${card.interactive} ${border.strong} relative mx-auto w-full`}>
        {/* if isSingleView, show this menu */}
        {isSingleView && 
          <section className={`flex gap-3 justify-between mb-4`}>
            <ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-900" onClick={()=>window.history.back()}/>
            {userId === tweet.author._id && (<Ellipsis className="w-5 h-5 text-gray-500 cursor-pointer" onMouseEnter={()=>setIsCardActionOpen(true)}/>)}
          </section>
        }
        
        <section className={`flex gap-3`}>
          <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={50} avatarHeight={50} />

          <section className="flex-1">
            <h3 className="text-md font-semibold">
              {
                pathname === '/user-profile' ?
                  <>{tweet.author.firstName} {tweet.author.lastName}</>
                 :
                  <Link href={`/user-profile?userId=${tweet.author._id}&action=${GET_USER_TWEETS_AND_COMMENT}`} className='hover:underline'>
                    {tweet.author.firstName} {tweet.author.lastName}
                  </Link>
              }
            </h3>
            <span className="text-gray-400 text-sm">
              @{tweet.author.username}
            </span>

            <span className="mx-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
              {/* · {new Date(tweet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(tweet.createdAt).toLocaleDateString()} */}
              {timeAgo(tweet.createdAt)}
            </span>
          </section>

          {(!isSingleView && userId === tweet.author._id) && (<Ellipsis className="w-5 h-5 text-gray-500 cursor-pointer" onMouseEnter={()=>setIsCardActionOpen(true)}/>)}
        </section>

        <section className={`mt-5 ${typography.body} wrap-break-word`}>
          <p>{tweet.body}</p>
        </section>
        
        <section className={`flex justify-between mt-4 ${layout.between} ${card.footer} border-t border-gray-200 pt-3`}>
           {!isSingleView ? (
            <Link className={`cursor-pointer`} href={`/tweets/${tweet._id}`} >
              <span className={`flex items-center ${typography.caption} cursor-pointer`}>
                <MessageCircle className="w-4 h-4 text-gray-500 hover:fill-black" />
                <span className="ml-1 text-gray-500">{commentLen}</span>
              </span>
          </Link>
           ) :
            (
               <span className={`flex items-center ${typography.caption} cursor-pointer`}>
                <MessageCircle className="w-4 h-4 text-gray-500 hover:fill-black" />
                <span className="ml-1 text-gray-500">{commentLen}</span>
              </span>
            )
           }
           
          <UpVote 
            onUpvoteClick={() => handleUpvote(tweet._id, isVotedUp, reactionIdUp,tweet.author._id)} 
            votes={tweet.upvotes} 
            fill={isVotedUp}
          />
            
          <DownVote 
            onDownvoteClick={() => handleDownvote(tweet._id, isVotedDown, reactionIdDown, tweet.author._id)} 
            votes={tweet.downvotes} 
            fill={isVotedDown} 
          />
          <TweetView views={tweet.views} onClick={() => {
            setIsTweetViewersModalOpen(true);
            setTweetIdForViewers(tweet._id);
            
          }} />
        </section>

        {/* for comments */}
        {isSingleView && (
          <TweetComments comments = {tweet.comments} tweetId={tweet._id} tweetAuthor={tweet.author._id}/>
        )}
        
          
        {(userId === tweet.author._id && isCardActionOpen) && (
          <section className={`absolute top-2 right-2 flex ${card.base} ${layout.stack} p-4 text-xs z-10`} onMouseLeave={()=>setIsCardActionOpen(false)}>
            <section className={`flex items-center gap-1 cursor-pointer text-xs`} onClick={() => handleDelete(tweet._id)}>
              <Trash2 className="w-4 h-4 text-gray-500 text-xs hover:fill-black" /> 
                Delete Post
            </section>
            {tweet.availableEdits !== 0 && (
              <section className={`flex items-center gap-1 cursor-pointer text-xs`} onClick={()=>{
                  setIsUpdateTweetModalOpen(!isUpdateTweetModalOpen);
                  setTweetForUpdate(tweet);
                  }}>
                <PencilIcon className=" w-3 h-3 text-gray-500 hover:fill-black"  /> 
                  Edit Post
              </section>
            )}
          </section>
        )}
        
      </article>
      {isUpdateTweetModalOpen && <TweetUpdateModal/>}
      {isTweetsViewersModalOpen && <ViewerList/>}
    </>
  )
}

export default TwitterCard