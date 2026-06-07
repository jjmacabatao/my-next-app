import { auth } from "@/auth";
import { Comment } from "@/lib/models/Comment";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (request) => {
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

    const { tweetId, userId, comment } = await request.json();

    if (!tweetId || !userId || !comment) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: tweetId, userId, and comment.",
        },
        { status: 400 },
      );
    }

    const newComment = await Comment.create({
      tweet_id: tweetId,
      comment_by: userId,
      comment: comment,
    });

    return NextResponse.json(
      {
        success: true,
        newComment: newComment,
      },
      { status: 201 },
    );
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

    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required param: commentId.",
        },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid commentId" },
        { status: 400 },
      );
    }

    const deleteComment = await Comment.deleteOne({ _id: commentId });

    if (deleteComment.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to delete comment" },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { success: true, message: "Comment successfully deleted" },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 400 },
    );
  }
};
