import { auth } from "@/auth";
import {
  getTweetsFeed,
  deleteTweetById,
} from "@/features/tweets/services/tweet.service";
import { Tweet } from "@/lib/models/Tweet";
import { connectDB } from "@/lib/mongoose";
import { NextResponse, NextRequest } from "next/server";

//using mongoDB
export const GET = async () => {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }
  try {
    await connectDB();

    const userTweets = await getTweetsFeed();

    if (userTweets === null || userTweets.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No tweets found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: userTweets },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
};

export const POST = async (request) => {
  // check if the session is null
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized!",
      },
      { status: 401 },
    );
  }

  try {
    await connectDB();
    const { tweet, userId } = await request.json();

    if (!tweet) {
      return NextResponse.json(
        {
          success: false,
          error: "Tweet field is a required field.",
        },
        { status: 406 },
      );
    }

    const newTweetObj = {
      body: tweet,
      author: userId,
    };
    //Create tweet in mongodb vie tweet model
    const newTweet = await Tweet.create(newTweetObj);

    return NextResponse.json(
      {
        success: true,
        data: JSON.stringify(newTweet),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
};

export const DELETE = async (request) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }

  try {
    await connectDB();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required param: tweetId.",
        },
        { status: 400 },
      );
    }

    const deletedTweet = await deleteTweetById(id);

    if (!deletedTweet) {
      return NextResponse.json(
        { success: false, error: "Tweet not found" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      JSON.stringify({ success: true, deletedTweet: deletedTweet }),
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete tweet" },
      { status: 400 },
    );
  }
};

export const PATCH = async (request) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const { tweetId, body } = await request.json();
    console.log(tweetId, body);

    if (!tweetId || !body) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: tweet id, body, and availableEdits",
        },
        { status: 400 },
      );
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return NextResponse.json(
        { success: false, error: "Tweet not found." },
        { status: 404 },
      );
    }

    //Check if tweet can still be edit
    if (tweet.availableEdits === 0) {
      return NextResponse.json(
        { success: false, error: "Tweet is no longer editable." },
        { status: 406 },
      );
    }

    //Apply updates and save
    tweet.body = body;
    tweet.availableEdits -= 1;

    await tweet.save();

    return NextResponse.json(
      {
        success: true,
        tweet: tweet,
      },
      { status: 202 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
};
