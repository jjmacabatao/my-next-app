import mongoose, { Schema } from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    type: {
      type: String, // "upvote" or "downvote"
      required: true,
    },
    reaction_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tweet_id: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
    },
  },
  { timestamps: true },
);

export let Reaction =
  mongoose.models.Reaction || mongoose.model("Reaction", ReactionSchema);
