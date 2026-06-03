import { auth } from "@/auth";
import { findTweetById } from "@/features/tweets/services/tweet.service";
import { Tweet } from "@/lib/models/Tweet";
import { Comment } from "@/lib/models/Comment";
import { Reaction } from "@/lib/models/Reaction";
import { User } from "@/lib/models/User";
import { connectDB } from "@/lib/mongoose";
import {
  UPDATE_TWEETCOMMENTS,
  UPDATE_TWEETREACTIONS,
  UPDATE_VIEWS,
} from "@/lib/utils";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import { Viewer } from "@/lib/models/Viewer";

export const GET = async (_request, { params }) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json(
      { success: false, error: "Missing required param: tweetId." },
      { status: 400 },
    );
  }

  const tweet = await findTweetById(slug);
  // console.log("tweet: ", tweet);

  // using populate
  // not used because of the initial design that the output should have a added fields that can only be achieved using aggregation.
  // const tweet = await Tweet.findById(slug)
  // .populate("author", "_id firstName lastName maidenName username email")
  // .populate("reactions", "_id type reaction_by")
  // .populate({
  //   path: "comments",
  //   select: "_id comment comment_by createdAt",
  //   populate: {
  //     path: "comment_by",
  //     select: "_id firstName lastName maidenName username email",
  //   },
  // })
  // .lean();

  if (!tweet) {
    return NextResponse.json(
      { success: false, error: "Tweet not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, tweet }, { status: 200 });
};

// update tweet
// params: slug: [update-view]
export const PATCH = async (request, { params }) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const { slug } = await params;
    const { tweetId, reactionId, isVote, commentId, userId } =
      await request.json();

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required API params: slug[valid values (update-views, update-tweetBody, update-tweetReactions, and update-tweetComments)].",
        },
        { status: 400 },
      );
    }

    if (!tweetId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: tweetId.",
        },
        { status: 400 },
      );
    }

    // check slug value for the appropriate patch request
    switch (slug) {
      case UPDATE_VIEWS:
        // Check if provided tweetId exist
        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
          return NextResponse.json(
            { success: false, error: "Tweet not found." },
            { status: 404 },
          );
        }

        //check if the viewer is not the owner of the tweet
        if (!tweet.author.equals(userId)) {
          //find viewer, if exist don't increment, otherwise create viewer's data and increment
          const viewer = await Viewer.findOne({
            user_id: userId,
            tweet_id: tweetId,
          });
          console.log(viewer);
          if (!viewer) {
            await Viewer.create({ user_id: userId, tweet_id: tweetId });
            // update view
            tweet.views += 1;

            await tweet.save();
          }
        }

        // get the updated tweet reflecting all the aggregations
        // didn't use this "findTweetById" for the update of views because it doesn't have save function.
        const updatedTweet = await findTweetById(tweetId);

        return NextResponse.json(
          {
            success: true,
            message: "Tweet views successfully incremented",
            tweet: updatedTweet,
          },
          { status: 200 },
        );
      case UPDATE_TWEETREACTIONS:
        return updateTweetReactions(tweetId, reactionId, isVote);
      case UPDATE_TWEETCOMMENTS:
        return updateTweetComments(tweetId, commentId);
      default:
        return NextResponse.json(
          { success: false, error: "Unknown patch action!" },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    );
  }
};

//helper function
//handles the update of reactions id in the tweet document
const updateTweetReactions = async (tweetId, reactionId, isVote) => {
  //check if tweetId and reactionId is not missing
  if (!tweetId || !reactionId) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required fields: tweet id, reactionId",
      },
      { status: 400 },
    );
  }

  //check if tweetId is a valid mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid tweetId.",
      },
      { status: 400 },
    );
  }
  //check if reactionId is a valid mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(reactionId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid reactionId.",
      },
      { status: 400 },
    );
  }

  //update the tweet
  const filter = { _id: tweetId };
  //if isVote is true the push the reaction id to the tweet otherwise remove from reactions
  const update = isVote
    ? { $push: { reactions: reactionId } }
    : { $pull: { reactions: reactionId } };
  const updateTweetResult = await Tweet.updateOne(filter, update);

  //check if the update is successful, matchedCount = 0 means tweet not found and no update was executed.
  console.log(updateTweetResult);
  if (!updateTweetResult.matchedCount === 0) {
    return NextResponse.json(
      { success: false, error: "Tweet not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      tweet: updateTweetResult,
    },
    { status: 202 },
  );
};

const updateTweetComments = async (tweetId, commentId) => {
  //check if tweetId and reactionId is not missing
  if (!tweetId || !commentId) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required fields: tweet id, commentId",
      },
      { status: 400 },
    );
  }

  //check if tweetId is a valid mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid tweetId.",
      },
      { status: 400 },
    );
  }
  //check if commentId is a valid mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid commentId.",
      },
      { status: 400 },
    );
  }

  //update the tweet
  const filter = { _id: tweetId };
  const update = { $push: { comments: commentId } };
  const updateTweetResult = await Tweet.updateOne(filter, update);

  //check if the update is successful, matchedCount = 0 means tweet not found and no update was executed.
  console.log(updateTweetResult);
  if (!updateTweetResult.matchedCount === 0) {
    return NextResponse.json(
      { success: false, error: "Tweet not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      tweet: updateTweetResult,
    },
    { status: 202 },
  );
};
