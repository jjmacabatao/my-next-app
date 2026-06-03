import { Comment } from "@/lib/models/Comment";

export const GetAllComments = async () => {
  const comments = await Comment.find().populate(
    "comment_by",
    "username email firstName lastName",
  );
};
