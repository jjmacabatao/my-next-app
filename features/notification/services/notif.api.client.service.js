import { API_BASE_URL } from "@/lib/utils";

export const createNotification = async (
  tweetId,
  fromUserId,
  toUserId,
  message,
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "applicatio/json",
      },
      body: JSON.stringify({
        tweetId: tweetId,
        fromUserId: fromUserId,
        toUserId: toUserId,
        message: message,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Failed to save notification: ", data.error);
      return {
        success: false,
        error: data.error,
        notification: [],
      };
    }

    return data;
  } catch (error) {
    console.error(
      "[CommentAPI][Catch]Create notification error: ",
      error.message,
    );
    return {
      success: false,
      error: error.message,
      notification: [],
    };
  }
};

export const getUserUnopenedNotification = async (toUserId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notification?forUserId=${toUserId}`,
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Failed to save notification: ", data.error);
      return {
        success: false,
        error: data.error,
        notification: [],
      };
    }

    return data;
  } catch (error) {
    console.error(
      "[CommentAPI][Catch]Create notification error: ",
      error.message,
    );
    return {
      success: false,
      error: error.message,
      notification: [],
    };
  }
};
