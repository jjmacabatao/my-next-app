"use client";
import {
  API_BASE_URL,
  GET_TWEET_DOWNREACTORS,
  GET_TWEET_STATS_DETAILS,
  GET_TWEET_UPREACTORS,
  GET_TWEET_VIEWERS,
} from "@/lib/utils";

// get all tweet's stats details
export const getTweetStatsDetails = async (tweetId) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/${tweetId}?action=${GET_TWEET_STATS_DETAILS}`,
    );

    if (!res.ok) {
      console.log(`Something went wrong! ${res.statusText}: ${res.url}`);
      return {
        success: false,
        error: `Something went wrong! ${res.statusText}: ${res.url}`,
        tweet_viewers: [],
        tweet_upreactors: [],
        tweet_downreactors: [],
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: `Something went wrong! ${error.message}`,
      tweet_viewers: [],
    };
  }
};

export const getTweetViewers = async (tweetId) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/${tweetId}?action=${GET_TWEET_VIEWERS}`,
    );

    if (!res.ok) {
      console.log(`Something went wrong! ${res.statusText}: ${res.url}`);
      return {
        success: false,
        error: `Something went wrong! ${res.statusText}: ${res.url}`,
        tweet_viewers: [],
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: `Something went wrong! ${error.message}`,
      tweet_viewers: [],
    };
  }
};

export const getTweetUpReactors = async (tweetId) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/${tweetId}?action=${GET_TWEET_UPREACTORS}`,
    );

    if (!res.ok) {
      console.log(`Something went wrong! ${res.statusText}: ${res.url}`);
      return {
        success: false,
        error: `Something went wrong! ${res.statusText}: ${res.url}`,
        tweet_upreactors: [],
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: `Something went wrong! ${error.message}`,
      tweet_upreactors: [],
    };
  }
};

export const getTweetDownReactors = async (tweetId) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/${tweetId}?action=${GET_TWEET_DOWNREACTORS}`,
    );

    if (!res.ok) {
      console.log(`Something went wrong! ${res.statusText}: ${res.url}`);
      return {
        success: false,
        error: `Something went wrong! ${res.statusText}: ${res.url}`,
        tweet_downreactors: [],
      };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: `Something went wrong! ${error.message}`,
      tweet_downreactors: [],
    };
  }
};
