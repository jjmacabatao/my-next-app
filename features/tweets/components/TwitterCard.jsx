"use client"


import { border, card, layout, typography } from '@/shared/styles/globalN';
import { Ellipsis, MessageCircle, PencilIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { timeAgo } from '@/lib/utils';


const TwitterCard = ({ tweet, isSingleView = false }) => {
  const router = useRouter();

  const { upVoteTweet, downVoteTweet, unVoteUpDownTweet, setIsUpdateTweetModalOpen, isUpdateTweetModalOpen, setTweetForUpdate } = useTweet();
  const {data: session} = useSession();
 
  const [openModal, setModal] = useState(false);
  const [openCommentModal, setCommentModal] = useState(false);

  // check session if available
  if (!session) {
    return null;
  }

  // handles modal for updating tweets
  const handleModal = () => {
    setModal(!openModal)
  }
  
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

      console.log("Tweet deleted successfully: ", response);
      showAlert('success', "Tweet deleted successfully");

    } catch (error) {
      console.error("[Catch]Handle delete tweet: ", error);
      showAlert('danger',error.message);
    }finally {
      console.log("Done executing handleDelete function");
      router.refresh();
    }

  }
  
  // handles the adding and removing upvote.
  // if isVoted then remove upvote otherwise add
  const handleUpvote = async (tweetId,isVoted, reactionId) => {
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
  const handleDownvote = async (tweetId, isVoted, reactionId) => {
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

  const userId =  session.user?.name?.id || '';
  //check if the user upvoted the tweet
  const isVotedUp =  tweet.reactions.some(reaction => reaction.reaction_by === userId && reaction.type === "upvote");
  //get the reaction id of the user if the tweet is upvoted
  const reactionIdUp = isVotedUp ? tweet.reactions.find(reaction => reaction.reaction_by === userId && reaction.type === "upvote")?._id : null;
  //check if the user down voted the tweet
  const isVotedDown =  tweet.reactions.some(reaction => reaction.reaction_by === userId && reaction.type === "downvote");
   //get the reaction id of the user if the tweet is down voted.
  const reactionIdDown = isVotedDown ? tweet.reactions.find(reaction => reaction.reaction_by === userId && reaction.type === "downvote")?._id : null;
  
  const commentLen = tweet?.comments?.length || 0;
  const perTweet = tweet;
  

  return (
    <>
      <article className={`${card.base} ${card.padding} ${card.interactive} ${border.strong} relative mx-auto w-95 sm:w-md ${isSingleView && 'mt-8' } `}>
        <section className={`flex gap-3`}>
          <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={50} avatarHeight={50} />

          <section className="flex-1">
            <h3 className="text-md font-semibold">
              {tweet.author.firstName} {tweet.author.lastName}
            </h3>
            <span className="text-gray-400 text-sm">
              @{tweet.author.username}
            </span>

            <span className="text-gray-500 text-sm mx-2">
              {/* · {new Date(tweet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(tweet.createdAt).toLocaleDateString()} */}
              {timeAgo(tweet.createdAt)}
            </span>
          </section>
          <Ellipsis className="w-5 h-5 text-gray-500" />
        </section>

        <section className={`mt-5 ${typography.body}`}>
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
            onUpvoteClick={() => handleUpvote(tweet._id, isVotedUp, reactionIdUp)} 
            votes={tweet.upvotes} 
            fill={isVotedUp}
          />
            
          <DownVote 
            onDownvoteClick={() => handleDownvote(tweet._id, isVotedDown, reactionIdDown)} 
            votes={tweet.downvotes} 
            fill={isVotedDown} 
          />
          <TweetView views={tweet.views} />
        </section>

        {/* for comments */}
        {isSingleView && (
          <TweetComments comments = {tweet.comments} tweetId={tweet._id}/>
        )}
        
          
        {userId === tweet.author._id && (
          <section className={`absolute top-2 right-2 flex ${card.base} ${card.padding} ${layout.stack} text-xs z-10`}>
            <section className={` ${layout.inline} cursor-pointer`} onClick={() => handleDelete(tweet._id)}>
              <X className="w-5 h-5 text-gray-500" /> 
                Delete Post
            </section>
            {tweet.availableEdits !== 0 && (
              <section className={` ${layout.inline} cursor-pointer`} onClick={()=>{
                  setIsUpdateTweetModalOpen(!isUpdateTweetModalOpen);
                  setTweetForUpdate(tweet);
                  }}>
                <PencilIcon className=" w-5 h-5 text-gray-500"  /> 
                  Edit Post
              </section>
            )}
          </section>
        )}
        
      </article>
      {isUpdateTweetModalOpen && <TweetUpdateModal/>}
    </>
  )
}

export default TwitterCard