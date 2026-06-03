import mongoose, { Schema } from "mongoose";

const ViewerSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tweet_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export let Viewer =
  mongoose.models.Viewer || mongoose.model("Viewer", ViewerSchema);
