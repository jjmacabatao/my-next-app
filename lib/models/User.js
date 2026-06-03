import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: [60, "First name cannot be more than 60 characters"],
    },
    lastName: {
      type: String,
      required: true,
      maxlength: [60, "Last name cannot be more than 60 characters"],
    },
    maidenName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  },
);

// we have to define it this way because of hot reloading
export let User = mongoose.models.User || mongoose.model("User", UserSchema);
