import { API_BASE_URL } from "@/lib/utils";
import { cookies } from "next/headers";

export const getAllTweets = async () => {
  try {
    const cookiesStore = await cookies();
    const res = await fetch(API_BASE_URL, {
      headers: {
        Cookie: cookiesStore.toString(),
      },
    });

    if (!res.ok) {
      console.log(`Something went wrong! ${res.statusText}: ${res.url}`);
      return {
        success: false,
        error: `Something went wrong! ${res.statusText}: ${res.url}`,
        data: [],
      };
    }

    const data = await res.json();

    if (!data.success) {
      console.error("Message:", data.error);
      return {
        success: false,
        error: `Something went wrong! ${data.error}`,
        data: [],
      };
    }

    return {
      success: true,
      data: data ? data.data : [],
    };
  } catch (error) {
    return {
      success: false,
      error: `Something went wrong! ${error.message}`,
      data: [],
    };
  }
};

export const updateTweetViews = async (tweetId, userId, notifId) => {
  const cookieStore = await cookies();
  const response = await fetch(`${API_BASE_URL}/update-views`, {
    method: "PATCH",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tweetId: tweetId,
      userId: userId,
      notifId: notifId,
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: `Something went wrong! ${response.statusText}: ${response.url}`,
      data: [],
    };
  }

  const data = await response.json();

  if (!data.success) {
    console.error("Failed to update tweet views: ", data.error);
    return null;
  }

  return data;
};
