import mongoose, { Schema } from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    opened: {
      type: Boolean,
      required: true,
      default: false,
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export let Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
