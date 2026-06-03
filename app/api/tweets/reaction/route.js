import { auth } from "@/auth";
import { Reaction } from "@/lib/models/Reaction";
import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }

  await connectDB();

  const { type, reaction_by, tweet_id } = await request.json();
  console.log("Received reaction data:", { type, reaction_by, tweet_id });
  if (!type || !reaction_by || !tweet_id) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required fields: type, reaction_by, and tweet_id.",
      },
      { status: 400 },
    );
  }

  const newReaction = await Reaction.create({
    type,
    reaction_by,
    tweet_id,
  });

  return NextResponse.json({ success: true, reaction: newReaction });
};

export const DELETE = async (request) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized!" },
      { status: 401 },
    );
  }

  await connectDB();

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required field: id.",
      },
      { status: 400 },
    );
  }

  const deletedReaction = await Reaction.findByIdAndDelete(id);

  if (!deletedReaction) {
    return NextResponse.json(
      { success: false, error: "Reaction not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, reaction: deletedReaction });
};
