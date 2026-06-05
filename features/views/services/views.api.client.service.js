"use client";
import { API_BASE_URL } from "@/lib/utils";
// import { cookies } from "next/headers";

export const getTweetViewers = async (tweetId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${tweetId}?action=getViewers`);

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
    const res = await fetch(`${API_BASE_URL}/${tweetId}?action=getUpReactors`);

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
      `${API_BASE_URL}/${tweetId}?action=getDownReactors`,
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
