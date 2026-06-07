import { API_BASE_URL, UPDATE_TWEETREACTIONS } from "@/lib/utils";

export const createTweet = async (tweet, userId) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweet: tweet, userId: userId }),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteTweet = async (id) => {
  const response = await fetch(API_BASE_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete Twitter data.");
  }

  const data = await response.json();

  return JSON.parse(data);
};

//handles the api call for voting tweet
//if successful api call for adding vote, call tweet api via method patch to update the tweet's reactions (add reaction id)
export const voteTweet = async (tweetId, userId, reactionType) => {
  const response = await fetch(`${API_BASE_URL}/reaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: reactionType,
      reaction_by: userId,
      tweet_id: tweetId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Something went wrong! ${response.statusText}: ${response.url}`,
    );
  }

  const data = await response.json();
  // console.log("Response from voteTweet API:", data);
  if (!data.success) {
    console.error("Failed to upvote tweet: ", data.error);
    return null;
  }

  // call tweet api patch for reaction
  const patchReactionResponse = await fetch(
    `${API_BASE_URL}/${UPDATE_TWEETREACTIONS}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tweetId: tweetId,
        reactionId: data.reaction._id,
        isVote: true,
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
    console.error("Failed to update tweet reaction: ", patchReactionData.error);
    return null;
  }

  return data;
};

export const unVoteTweet = async (tweetId, reactionId) => {
  const response = await fetch(`${API_BASE_URL}/reaction`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: reactionId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Something went wrong! ${response.statusText}: ${response.url}`,
    );
  }

  const data = await response.json();

  if (!data.success) {
    console.error("Failed to unvote up tweet: ", data.error);
    return null;
  }

  // call tweet api patch for reaction
  const patchReactionResponse = await fetch(
    `${API_BASE_URL}/${UPDATE_TWEETREACTIONS}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tweetId: tweetId,
        reactionId: data.reaction._id,
        isVote: false,
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
    console.error("Failed to update tweet reaction: ", patchReactionData.error);
    return null;
  }

  return data;
};

export const updateTweet = async (tweetId, tweetBody) => {
  const response = await fetch(API_BASE_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tweetId: tweetId,
      body: tweetBody,
      action: "update-tweetBody",
    }),
  });

  const data = await response.json();
  // console.log("Response from updateTweet, tweet.api.client.js", data);
  if (!data.success) {
    console.error("Failed to update tweet: ", data.error);
    return null;
  }

  return data;
};
