import { auth } from "@/auth";
import { findTweetByAuthor } from "@/features/tweets/services/tweet.service";

import { Comment } from "@/lib/models/Comment";
import { Tweet } from "@/lib/models/Tweet";
import { User } from "@/lib/models/User";

import { connectDB } from "@/lib/mongoose";
import {
  GET_USER_COMMENTS,
  GET_USER_TWEETS,
  GET_USER_TWEETS_AND_COMMENT,
} from "@/lib/utils";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const action = searchParams.get("action");

    if (!userId || !action) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required url params: userId and action",
        },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400 },
      );
    }

    //find user data first before getting its tweets and comments
    const responseFindUser = await User.findOne(
      { _id: userId },
      "_id firstName lastName username email createdAt",
    );

    if (!responseFindUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // if user is not empty the get its data
    switch (action) {
      case GET_USER_TWEETS:
        // call the function that call the function that aggregate tweet data suing pipline
        const resGetTweets = await getUserTweets(userId);
        const jUserTweets = await resGetTweets.json();
        jUserTweets.user = responseFindUser;

        return NextResponse(jUserTweets);

      case GET_USER_COMMENTS:
        // call the function that populate comments data
        const resGetComments = await getUserComments(userId);
        const jUserComments = await resGetComments.json();
        jUserComments.user = responseFindUser;

        return NextResponse(jUserComments);
      case GET_USER_TWEETS_AND_COMMENT:
        const responseGetUserTweets = await getUserTweets(userId);
        const responseGetUserComments = await getUserComments(userId);

        const jsonUserTweets = await responseGetUserTweets.json();
        const jsonUserComments = await responseGetUserComments.json();

        //return the response
        //check if both success true
        if (jsonUserTweets.success && jsonUserComments.success) {
          return NextResponse.json(
            {
              success: true,
              message: "Tweets and comments successfully fetched.",
              user: responseFindUser,
              tweets: jsonUserTweets.tweets,
              comments: jsonUserComments.comments,
            },
            { status: 200 },
          );
        }

        // if user tweet failed and user comments succeed
        if (!jsonUserTweets.success && jsonUserComments.success) {
          return NextResponse.json(
            {
              success: false,
              error: jsonUserTweets.error,
              user: responseFindUser,
              tweets: [],
              comments: jsonUserComments.comments,
            },
            { status: 200 },
          );
        }

        // if user tweet succeed and user comments faild
        if (!jsonUserTweets.success && jsonUserComments.success) {
          return NextResponse.json(
            {
              success: false,
              error: jsonUserComments.error,
              user: responseFindUser,
              tweets: jsonUserTweets.tweets,
              comments: [],
            },
            { status: 200 },
          );
        }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unknown action!",
            user: responseFindUser,
          },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message, user: responseFindUser },
      { status: 400 },
    );
  }
};

const getUserTweets = async (userId) => {
  try {
    // call the aggregate pipeline of tweet model for finding tweets usng userId/tweet author id
    const responseGetTweet = await findTweetByAuthor(userId);

    //check if the response is empty
    if (!responseGetTweet) {
      return NextResponse.json(
        { success: false, error: "Failed to load user tweets", user: [] },
        { status: 400 },
      );
    }

    //return the response
    return NextResponse.json(
      {
        success: true,
        message: "Tweets successfully fetched.",
        tweets: responseGetTweet,
        user: [],
      },

      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message, user: [] },
      { status: 400 },
    );
  }
};

const getUserComments = async (userId) => {
  try {
    const responseGetComments = await Comment.find({ comment_by: userId })
      .sort({ createAt: -1 })
      .populate("comment_by", "_id firstName lastName username")
      .populate({
        path: "tweet_id",
        select: "_id body author",
        populate: {
          path: "author",
          select: "_id firstName lastName username",
        },
      })
      .lean();

    //check if the response is empty
    if (!responseGetComments) {
      return NextResponse.json(
        { success: false, error: "Failed to load user tweets", user: [] },
        { status: 400 },
      );
    }

    //return the response
    return NextResponse.json(
      {
        success: true,
        message: "Comments successfully fetched.",
        comments: responseGetComments,
        user: [],
      },

      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message, user: [] },
      { status: 400 },
    );
  }
};
