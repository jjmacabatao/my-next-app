"use server";

import {
  API_BASE_URL,
  UPDATE_TWEETCOMMENTS,
  UPDATE_TWEETREACTIONS,
} from "@/lib/utils";
import { cookies } from "next/headers";

export const createComment = async (tweetId, userId, comment) => {
  try {
    const cookieStore = await cookies();

    const response = await fetch(`${API_BASE_URL}/comment`, {
      method: "POST",
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tweetId: tweetId,
        userId: userId,
        comment: comment,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Failed to save comment: ", data.error);
      return null;
    }

    // call tweet api patch for reaction
    const patchReactionResponse = await fetch(
      `${API_BASE_URL}/${UPDATE_TWEETCOMMENTS}`,
      {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tweetId: tweetId,
          commentId: data.newComment._id,
        }),
      },
    );

    if (!patchReactionResponse.ok) {
      throw new Error(
        `Something went wrong! ${patchReactionResponse.statusText}: ${patchReactionResponse.url}`,
      );
    }

    const patchReactionData = await patchReactionResponse.json();
    if (!patchReactionData.success) {
      console.error(
        "Failed to update tweet reaction: ",
        patchReactionData.error,
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error("[CommentAPI][Catch]Create comment error: ", error.message);
    return null;
  }
};

//helper function
