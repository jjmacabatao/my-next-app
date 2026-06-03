import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      maxLength: [200, "Comment can't be more than 200 characters."],
    },
    comment_by: {
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

export let Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
