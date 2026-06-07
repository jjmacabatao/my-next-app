"use client";

import { createContext, useContext, useState } from "react";
import { unVoteTweet, updateTweet, voteTweet } from "../services/tweet.api.client.service";

// Create a context for managing the state of tweets, including upvotes, downvotes, and views, across the application. This context will provide a way to share state and functions related to tweets without having to pass props down through multiple levels of components.
const TweetContext = createContext();

export const TweetProvider = ({ children }) => {

    const [isUpdateTweetModalOpen, setIsUpdateTweetModalOpen] = useState(false); //state for the update post modal
    const [tweetForUpdate, setTweetForUpdate] = useState(); // state of the post to update
    const [isTweetsViewersModalOpen, setIsTweetViewersModalOpen] = useState(false); // state for the viewers modal
    const [tweetIdForViewers, setTweetIdForViewers] = useState(null); // state for the tweet id to get viewers for

    // handles the tweet up voting
    const upVoteTweet = async (tweetId, userId) => {
        
        const vote = await voteTweet(tweetId, userId, "upvote");

        if (!vote.success) {
            console.error("Failed to upvote tweet: ", vote.error);
            return;
        }
        
        // console.log(vote);

        return vote;
    };


    //handles the removing of votes in both up votes and down votes.
    const unVoteUpDownTweet = async (tweetId, reactionId) => {
        // Implement the logic to remove an upvote from a tweet, which may involve sending a request to the backend to update the tweet's reaction data and then updating the local state to reflect the change in the UI.
        console.log("Removing upvote with reaction ID: ", reactionId);
        const unVote = await unVoteTweet(tweetId, reactionId);
        // console.log("Response from unVoteUpTweet API, TweetContext:", unVote.success, unVote);
        if (!unVote.success) {
            console.error("Failed to remove vote from tweet: ", unVote.error);
            return;
        }

        return unVote;
    }   

    //handles the tweet down voting
    const downVoteTweet = async (tweetID, userID) => {
        console.log("Downvoting tweet with id: ", tweetID);
        const downvote = await voteTweet(tweetID, userID, "downvote");

        if (!downvote.success) {
          console.error("Failed to downvote tweet: ", downvote.error);
          return;
        } 

        return downvote;
    };

    const updateTweetContext = async (tweetId, body) => {

        const response = await updateTweet(tweetId, body);

        if (!response.success) {
            console.error("Failed to update tweet: ", response.error);
            return;
        }

        return response;
    }


    const value = {
        upVoteTweet,
        unVoteUpDownTweet,
        downVoteTweet,
        updateTweetContext,
        isUpdateTweetModalOpen,
        setIsUpdateTweetModalOpen,
        setTweetForUpdate,
        tweetForUpdate,
        isTweetsViewersModalOpen,
        setIsTweetViewersModalOpen,
        tweetIdForViewers,
        setTweetIdForViewers
    };

    return (
        <TweetContext.Provider value={value}>
            {children}
        </TweetContext.Provider>
    );
}

export const useTweet = () => {
    const context = useContext(TweetContext);
    if (context === undefined) {
        throw new Error("useTweet must be used within a TweetProvider");
    }
    return context;
}
