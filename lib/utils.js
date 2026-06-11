export const TWEET_LENGTH_LIMIT = 200;
export const UPDATE_VIEWS = "update-views";
export const UPDATE_TWEETBODY = "update-tweetBody";
export const UPDATE_TWEETREACTIONS = "update-tweetReactions";
export const UPDATE_TWEETCOMMENTS = "update-tweetComments";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_USER_BASE_URL = process.env.NEXT_PUBLIC_API_USER_BASE_URL;
export const API_AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_AUTH_BASE_URL;

export const GET_USER_TWEETS = "getUserTweets";
export const GET_USER_COMMENTS = "getUserComments";
export const GET_USER_TWEETS_AND_COMMENT = "getUserTweetsAndComments";

export const GET_TWEET = "getTweet";
export const GET_TWEET_STATS_DETAILS = "getTweetStatsDetails";
export const GET_TWEET_VIEWERS = "getViewers";
export const GET_TWEET_UPREACTORS = "getUpReactors";
export const GET_TWEET_DOWNREACTORS = "getDownReactors";

// function for the calculation of time ago.
// postDate to now
export const timeAgo = (date) => {
  const now = new Date();
  const postDate = new Date(date);

  // Calculate the diff in seconds between current date and post date then round it down to the nearest whole number using Math.floor() method.
  const seconds = Math.floor((now - postDate) / 1000);

  // check if the seconds is less than 5 then return "Just now"
  if (seconds < 5) {
    return "Just now";
  }

  // check if the seconds is less than 60, return "XXs"
  // if greater than or equal to 60, calculate minutes
  // 60 = 1 minute
  if (seconds < 60) {
    return `${seconds}s`;
  }

  // Calculate the minutes: divide the seconds by 60 (1 minute) and round it down
  // if the minutes is less than 60(i hour), return "XXm", otherwise calculate hours
  const minutes = Math.floor(seconds / 60);

  // 60 = 1 hr
  if (minutes < 60) {
    return `${minutes}m`;
  }

  // Calculate the hours: divide the minutes by 60 (1 hour) and round it down
  // if the hours is less than 24 (1 day), return "XXh", otherwise calculate days
  const hrs = Math.floor(minutes / 60);

  // 24 = 1 day
  if (hrs < 24) {
    return `${hrs}h`;
  }

  // Calculate the hours: divide the hours by 24 (1 day) and round it down
  // if the days is less than 7(1 week), return "XXd", otherwise calculate weeks
  const days = Math.floor(hrs / 24);

  // 7 = 1 week
  if (days < 7) {
    return `${days}d`;
  }

  //Calculate the weeks: divide the days by 7 (1 week) and round it down
  // if the weeks is less than 4(1 month), return "XXw" otherwise calculate months
  const weeks = Math.floor(days / 7);

  // 4 = 1 month (approximate)
  if (weeks < 4) {
    return `${weeks}w`;
  }

  // Calculate the mons: divide the days by 30 (1 month, estimated) and round it down
  // if the mons is less than 12(1 year) return "XXmo", otherwise calculate years
  const mons = Math.floor(days / 30);
  // 12 = 1 year
  if (mons < 12) {
    return `${mons}mo`;
  }

  //Calculate the yrs: divide the days by 365 (1 yr, estimated) and round it down
  const yrs = Math.floor(days / 365);

  return `${yrs} ${yrs > 1 ? "yrs" : "yr"}`;
};
