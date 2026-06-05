import mongoose, { Schema } from "mongoose";
import { Comment } from "./Comment";
import { Reaction } from "./Reaction";

const TweetSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxLength: [200, "Tweet can't be more than 200 characters."],
    },
    reactions: {
      type: [Schema.Types.ObjectId],
      ref: "Reaction",
      default: [],
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    availableEdits: {
      type: Number,
      default: 5,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export let Tweet =
  mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
