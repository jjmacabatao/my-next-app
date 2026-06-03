import { cookies } from "next/headers";

const TwEET_API_BASE_URL = "http://localhost:3000/api/tweets";

//service has not been used
// single fetching of tweet was move to "updateTweetViews" function
// due to when viewing single tweet need to update tweet view count if viewer ist not already in the list
// possible to use when checking of viewers happened in "TweetCard.jsx"

// export const getSingleTwitterData = async (id) => {
//   const cookiesStore = await cookies();

//   const res = await fetch(`${TwEET_API_BASE_URL}/a${id}`, {
//     headers: {
//       Cookie: cookiesStore.toString(),
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch Twitter data");
//   }

//   const data = await res.json();

//   return data;
// };

// export const deleteTweet = async (id) => {
//   const cookiesStore = await cookies();
//   const response = await fetch(TwEET_API_BASE_URL, {
//     method: "DELETE",
//     headers: {
//       Cookie: cookiesStore.toString(),
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ id: id }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to delete Twitter data.");
//   }

//   const data = await response.json();

//   return JSON.parse(data);
// };

export const getAllTweets = async () => {
  try {
    const cookiesStore = await cookies();
    const res = await fetch(TwEET_API_BASE_URL, {
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
      error: `Something went wrong! ${data.error}`,
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

export const updateTweetViews = async (tweetId, userId) => {
  const cookieStore = await cookies();
  const response = await fetch(`${TwEET_API_BASE_URL}/update-views`, {
    method: "PATCH",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tweetId: tweetId,
      userId: userId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Something went wrong! ${response.statusText}: ${response.url}`,
    );
  }

  const data = await response.json();
  console.log(
    "Response from updateTweetViews, tweet.api.server.service.js",
    data,
  );
  if (!data.success) {
    console.error("Failed to update tweet views: ", data.error);
    return null;
  }

  return data;
};
