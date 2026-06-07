import { Notification } from "@/lib/models/Notification";
import { connectDB } from "@/lib/mongoose";
import { Tweet } from "@/lib/models/Tweet";
import { User } from "@/lib/models/User";

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (request) => {
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

    const { searchParams } = new URL(request.url);
    const forUserId = searchParams.get("forUserId");

    if (!forUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: forUserId",
        },
        { status: 401 },
      );
    }

    //check if valid ids
    if (!mongoose.Types.ObjectId.isValid(forUserId)) {
      return NextResponse.json(
        { success: false, error: "Invalid forUserId" },
        { status: 400 },
      );
    }

    const populatedNotif = await Notification.find({
      to: forUserId,
      opened: false,
    })
      .sort({ createdAt: "desc" })
      .populate("tweet", "_id body")
      .populate("from", "_id firstName lastName username")
      .lean();

    // console.log("populatedNotif: ", populatedNotif);
    return NextResponse.json(
      {
        success: true,
        notification: populatedNotif,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 },
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
    const { tweetId, fromUserId, toUserId, message } = await request.json();

    if (!tweetId || !fromUserId || !toUserId || !message) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: tweetId, fromUserId,toUserId, and message",
        },
        { status: 401 },
      );
    }

    //check if valid ids
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
      return NextResponse.json(
        { success: false, error: "Invalid tweetId" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(fromUserId)) {
      return NextResponse.json(
        { success: false, error: "Invalid fromUserId" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return NextResponse.json(
        { success: false, error: "Invalid toUserId" },
        { status: 400 },
      );
    }
    const notifObj = {
      message: message,
      tweet: tweetId,
      from: fromUserId,
      to: toUserId,
    };

    const newNotif = await Notification.create(notifObj);

    const populatedNotif = await Notification.findById(newNotif._id)
      .populate("tweet", "_id body")
      .populate("from", "_id firstName lastName username")
      .populate("to", "_id")
      .lean();

    // console.log("populatedNotif: ", populatedNotif);
    return NextResponse.json(
      {
        success: true,
        notification: populatedNotif,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 },
    );
  }
};
