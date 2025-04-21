import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new comment
export const createComment = asyncHandler(async (req, res) => {
  const { postId, content, parentCommentId, guestAuthor } = req.body;

  // Log the request details
  console.log("Creating comment with:", {
    auth: !!req.user,
    guestAuthor: guestAuthor || "none",
    bodyKeys: Object.keys(req.body),
    body: req.body,
    headers: req.headers,
    token: req.headers.authorization ? "present" : "none",
  });

  if (!postId || !content) {
    throw new ApiError(400, "Post ID and content are required");
  }

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Create comment object
  const comment = new Comment({
    content,
    post: postId,
  });

  // Set author based on authentication status
  if (req.user) {
    // If user is authenticated, use their ID
    comment.author = req.user._id;
    console.log("Using authenticated user as comment author:", req.user._id);
  } else if (guestAuthor) {
    // If guest author name is provided, use that
    comment.guestAuthor = guestAuthor;
    console.log("Using guest author for comment:", guestAuthor);
  } else {
    // If neither, use a default guest author name
    comment.guestAuthor = "Anonymous Guest";
    console.log("Using default guest author name: Anonymous Guest");
  }

  // If it's a reply to another comment
  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new ApiError(404, "Parent comment not found");
    }

    comment.parentComment = parentCommentId;

    // Add this comment as a reply to parent comment
    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: comment._id },
    });
  }

  // Save comment
  await comment.save();

  // Add comment to post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  // Populate author details if it's a registered user
  let populatedComment;
  if (comment.author) {
    populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username fullName avatar",
    );
  } else {
    // For guest authors, just return the comment as is
    populatedComment = await Comment.findById(comment._id);
  }

  return res.status(201).json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

// Get comments for a post
export const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Get only top-level comments
  const comments = await Comment.find({
    post: postId,
    parentComment: null,
  })
    // Conditionally populate author field only for comments with an author
    .populate({
      path: "author",
      select: "username fullName avatar",
    })
    .populate({
      path: "replies",
      // Conditionally populate author field for replies
      populate: {
        path: "author",
        select: "username fullName avatar",
      },
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalComments = await Comment.countDocuments({
    post: postId,
    parentComment: null,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalComments,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
      },
      "Comments fetched successfully",
    ),
  );
});

// Update a comment
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if user is the author of the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  // Update comment
  comment.content = content;
  await comment.save();

  return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if user is the author of the comment
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  // If it's a parent comment, delete all replies
  if (!comment.parentComment) {
    await Comment.deleteMany({ parentComment: id });
  } else {
    // If it's a reply, remove it from parent's replies array
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $pull: { replies: id },
    });
  }

  // Remove comment from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: id },
  });

  // Delete comment
  await Comment.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
});
