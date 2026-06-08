import { Comment } from "@/lib/models/Comment";
import { Reaction } from "@/lib/models/Reaction";
import { Tweet } from "@/lib/models/Tweet";
import { Viewer } from "@/lib/models/Viewer";
import mongoose from "mongoose";

// function to get the tweets feed using mongoose aggregation pipeline
export const getTweetsFeed = async () => {
  const tweets = await Tweet.aggregate([
    {
      // used to lookup the author information from the users collection based on the author field in the tweets collection.
      // Note: lookup stage returns an array.
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author_info",
      },
    },
    {
      // used to convert the author_info array to a single object.
      $unwind: "$author_info",
    },
    {
      // used to lookup the tweet reactions from the reactions collections based on the tweet_id field in the reactions collection.
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "tweet_id",
        as: "reactions",
      },
    },
    {
      // add new fields upvotes and downvotes to the tweet document
      // values of the added fields are calculated based on the types of reactions in the reactions array (reactions lookup returned).
      $addFields: {
        upvotes: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: {
                $eq: ["$$reaction.type", "upvote"],
              },
            },
          },
        },
        downvotes: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: {
                $eq: ["$$reaction.type", "downvote"],
              },
            },
          },
        },
      },
    },
    {
      // used to lookup the tweet comments from the comments collections based on the tweet_id field in the comments collection.
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet_id",
        as: "comments",
      },
    },
    {
      // used to lookup the comment_by information from the users collection based on the comment_by field in the comments collection.
      $lookup: {
        from: "users",
        localField: "comments.comment_by",
        foreignField: "_id",
        as: "comment_by_info",
      },
    },
    {
      // used to specify the fields to be returned in the final output of the aggregation pipeline.
      // Note: 1 means the field will be included in the output, while 0 means it will be excluded.
      // $map: use to iterate over the collections from the lookup and specify the fields to be returned for each document in the collection.The output of $map is an array of objects with the specified fields.
      $project: {
        body: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        available: 1,
        comments: 1,
        upvotes: 1,
        downvotes: 1,
        availableEdits: 1,
        author: {
          _id: "$author_info._id",
          username: "$author_info.username",
          email: "$author_info.email",
          firstName: "$author_info.firstName",
          lastName: "$author_info.lastName",
          maidenName: "$author_info.maidenName",
        },
        reactions: {
          $map: {
            input: "$reactions",
            as: "reaction",
            in: {
              _id: "$$reaction._id",
              type: "$$reaction.type",
              reaction_by: "$$reaction.reaction_by",
            },
          },
        },
        comments: {
          $map: {
            input: "$comments",
            as: "comment",
            in: {
              _id: "$$comment._id",
              comment: "$$comment.comment",
              comment_by: {
                // specify fields to be returned from the comment_by_info array.
                _id: "$comment_by_info._id",
                firstName: "$comment_by_info.firstName",
                lastName: "$comment_by_info.lastName",
                username: "$comment_by_info.username",
                email: "$comment_by_info.email",
              },
              createdAt: "$$comment.createdAt",
            },
          },
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return tweets;
};

// function to find a tweet by id using mongoose aggregation pipeline
export const findTweetById = async (id) => {
  const tweetId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;
  const tweet = await Tweet.aggregate([
    {
      // used to filter the collection with the given id (tweetId).
      $match: {
        _id: tweetId,
      },
    },
    {
      // used to lookup the author information from the users collection based on the author field in the tweets collection.
      // Note: lookup stage returns an array.
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author_info",
      },
    },
    {
      // used to convert the author_info array to a single object.
      $unwind: "$author_info",
    },
    {
      // used to lookup the tweet reactions from the reactions collections based on the tweet_id field in the reactions collection.
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "tweet_id",
        as: "reactions",
      },
    },
    {
      // add new fields upvotes and downvotes to the tweet document
      // values of the added fields are calculated based on the types of reactions in the reactions array (reactions lookup returned).
      $addFields: {
        upvotes: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: {
                $eq: ["$$reaction.type", "upvote"],
              },
            },
          },
        },
        downvotes: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: {
                $eq: ["$$reaction.type", "downvote"],
              },
            },
          },
        },
      },
    },
    {
      // used to lookup the tweet comments from the comments collections based on the tweet_id field in the comments collection.
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet_id",
        as: "comments",
      },
    },
    {
      // used to lookup the comment_by information from the users collection based on the comment_by field in the comments collection.
      // used pipeline to specify the fields to be returned from the users collection.
      $lookup: {
        from: "users",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              maidenName: 1,
              username: 1,
              email: 1,
            },
          },
        ],
        localField: "comments.comment_by",
        foreignField: "_id",
        as: "comment_by_info",
      },
    },

    {
      // used to specify the fields to be returned in the final output of the aggregation pipeline.
      // Note: 1 means the field will be included in the output, while 0 means it will be excluded.
      // $map: use to iterate over the collections from the lookup and specify the fields to be returned for each document in the collection.The output of $map is an array of objects with the specified fields.
      $project: {
        body: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        available: 1,
        upvotes: 1,
        downvotes: 1,
        availableEdits: 1,
        author: {
          _id: "$author_info._id",
          username: "$author_info.username",
          email: "$author_info.email",
          firstName: "$author_info.firstName",
          lastName: "$author_info.lastName",
          maidenName: "$author_info.maidenName",
        },
        reactions: {
          $map: {
            input: "$reactions",
            as: "reaction",
            in: {
              _id: "$$reaction._id",
              type: "$$reaction.type",
              reaction_by: "$$reaction.reaction_by",
            },
          },
        },
        comments: {
          $map: {
            input: "$comments",
            as: "comment",
            in: {
              _id: "$$comment._id",
              comment: "$$comment.comment",
              comment_by: {
                $arrayElemAt: [
                  {
                    // used to filter the comment_by_info array to get the user information of the comment_by field in the comments collection.
                    $filter: {
                      input: "$comment_by_info",
                      as: "user",
                      cond: {
                        $eq: ["$$user._id", "$$comment.comment_by"],
                      },
                    },
                  },
                  0,
                ],
              },
              createdAt: "$$comment.createdAt",
            },
          },
        },
      },
    },
    {
      // used to sort the output of the aggregation pipeline based on the createdAt field in descending order.
      $sort: { createdAt: -1 },
    },
  ]);

  return tweet;
};

// function to find a tweet by id using mongoose aggregation pipeline
export const findTweetByAuthor = async (userId) => {
  const validatedUserId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : null;
  const tweet = await Tweet.aggregate([
    {
      // used to filter the collection with the given id (userId).
      $match: {
        author: validatedUserId,
      },
    },
    {
      // used to lookup the author information from the users collection based on the author field in the tweets collection.
      // Note: lookup stage returns an array.
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author_info",
      },
    },
    {
      // used to convert the author_info array to a single object.
      $unwind: "$author_info",
    },
    {
      // used to lookup the tweet reactions from the reactions collections based on the tweet_id field in the reactions collection.
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "tweet_id",
        as: "reactions",
      },
    },
    {
      // add new fields upvotes and downvotes to the tweet document
      // values of the added fields are calculated based on the types of reactions in the reactions array (reactions lookup returned).
      $addFields: {
        upvotes: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: {
                $eq: ["$$reaction.type", "upvote"],
              },
            },
          },
        },
        downvotes: {
          $size: {
            $filter: {
              input: "$reactions",
              as: "reaction",
              cond: {
                $eq: ["$$reaction.type", "downvote"],
              },
            },
          },
        },
      },
    },
    {
      // used to lookup the tweet comments from the comments collections based on the tweet_id field in the comments collection.
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet_id",
        as: "comments",
      },
    },
    {
      // used to lookup the comment_by information from the users collection based on the comment_by field in the comments collection.
      // used pipeline to specify the fields to be returned from the users collection.
      $lookup: {
        from: "users",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              maidenName: 1,
              username: 1,
              email: 1,
            },
          },
        ],
        localField: "comments.comment_by",
        foreignField: "_id",
        as: "comment_by_info",
      },
    },

    {
      // used to specify the fields to be returned in the final output of the aggregation pipeline.
      // Note: 1 means the field will be included in the output, while 0 means it will be excluded.
      // $map: use to iterate over the collections from the lookup and specify the fields to be returned for each document in the collection.The output of $map is an array of objects with the specified fields.
      $project: {
        body: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        available: 1,
        upvotes: 1,
        downvotes: 1,
        availableEdits: 1,
        author: {
          _id: "$author_info._id",
          username: "$author_info.username",
          email: "$author_info.email",
          firstName: "$author_info.firstName",
          lastName: "$author_info.lastName",
          maidenName: "$author_info.maidenName",
        },
        reactions: {
          $map: {
            input: "$reactions",
            as: "reaction",
            in: {
              _id: "$$reaction._id",
              type: "$$reaction.type",
              reaction_by: "$$reaction.reaction_by",
            },
          },
        },
        comments: {
          $map: {
            input: "$comments",
            as: "comment",
            in: {
              _id: "$$comment._id",
              comment: "$$comment.comment",
              comment_by: {
                $arrayElemAt: [
                  {
                    // used to filter the comment_by_info array to get the user information of the comment_by field in the comments collection.
                    $filter: {
                      input: "$comment_by_info",
                      as: "user",
                      cond: {
                        $eq: ["$$user._id", "$$comment.comment_by"],
                      },
                    },
                  },
                  0,
                ],
              },
              createdAt: "$$comment.createdAt",
            },
          },
        },
      },
    },
    {
      // used to sort the output of the aggregation pipeline based on the createdAt field in descending order.
      $sort: { createdAt: -1 },
    },
  ]);

  return tweet;
};

export const deleteTweetById = async (tweetId) => {
  await Comment.deleteMany({ tweet_id: tweetId });

  await Reaction.deleteMany({ tweet_id: tweetId });

  await Viewer.deleteMany({ tweet_id: tweetId });

  return await Tweet.findByIdAndDelete({ _id: tweetId });
};
