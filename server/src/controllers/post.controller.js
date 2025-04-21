import { Post } from "../models/post.model.js";
import { Tag } from "../models/tag.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getRemainingPosts } from "../config/subscriptionLimits.js";

// Create a new post
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, tags, isPublished = false, guestAuthor } = req.body;

  if (!title || !content || !excerpt) {
    throw new ApiError(400, "Title, content, and excerpt are required");
  }

  // Check if either user is authenticated or guest author is provided
  if (!req.user && !guestAuthor) {
    console.log("No user or guest author provided:", { user: req.user, body: req.body });
    throw new ApiError(400, "Author name is required for guest posts");
  }

  // Log the request details for debugging
  console.log("Creating post with:", {
    auth: !!req.user,
    guestAuthor: guestAuthor || "none",
    bodyKeys: Object.keys(req.body),
  });

  // Check post limits only for authenticated users
  if (req.user) {
    const remainingPosts = await getRemainingPosts(req.user, Post);
    if (remainingPosts <= 0) {
      throw new ApiError(
        403,
        "You have reached the maximum number of posts allowed for your subscription plan. Please upgrade to create more posts.",
      );
    }
  }

  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

  // Check if slug already exists
  const existingPost = await Post.findOne({ slug });
  if (existingPost) {
    throw new ApiError(409, "A post with this title already exists");
  }

  // Create post object
  const post = new Post({
    title,
    content,
    excerpt,
    slug,
    isPublished,
  });

  // Set author based on authentication status
  if (req.user) {
    post.author = req.user._id;
  } else if (guestAuthor) {
    post.guestAuthor = guestAuthor;
  }

  // Upload cover image if provided
  if (req.file) {
    const coverImageLocalPath = req.file.path;
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (coverImage) {
      post.coverImage = coverImage.url;
    }
  }

  // Process tags if provided
  if (tags) {
    let tagArray = [];

    // Handle different formats of tags
    if (typeof tags === "string") {
      try {
        // Try to parse as JSON string
        tagArray = JSON.parse(tags);
      } catch (error) {
        // If not valid JSON, treat as a single tag
        tagArray = [tags];
      }
    } else if (Array.isArray(tags)) {
      // If already an array, use it directly
      tagArray = tags;
    }

    if (tagArray.length > 0) {
      const tagIds = [];

      for (const tagName of tagArray) {
        if (!tagName) continue; // Skip empty tag names

        // Find or create tag
        let tag = await Tag.findOne({ name: tagName.toLowerCase() });

        if (!tag) {
          // Create new tag
          tag = await Tag.create({
            name: tagName.toLowerCase(),
            slug: tagName
              .toLowerCase()
              .replace(/[^\w ]+/g, "")
              .replace(/ +/g, "-"),
          });
        }

        tagIds.push(tag._id);

        // Add post to tag's posts array
        await Tag.findByIdAndUpdate(tag._id, {
          $addToSet: { posts: post._id },
        });
      }

      post.tags = tagIds;
    }
  }

  // Save post
  await post.save();

  // Prepare response data
  const responseData = { post };

  // Add subscription info for authenticated users
  if (req.user) {
    // Get updated remaining posts count
    const updatedRemainingPosts = await getRemainingPosts(req.user, Post);

    responseData.subscription = {
      plan: req.user.subscription?.plan || "Free",
      remainingPosts: updatedRemainingPosts,
      hasReachedLimit: updatedRemainingPosts === 0,
    };
  }

  // Return response
  return res.status(201).json(new ApiResponse(201, responseData, "Post created successfully"));
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, tag, author } = req.query;

  const query = {};

  // Add search filter if provided
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  // Add tag filter if provided
  if (tag) {
    const tagDoc = await Tag.findOne({ slug: tag });
    if (tagDoc) {
      query.tags = { $in: [tagDoc._id] };
    }
  }

  // Add author filter if provided
  if (author) {
    query.author = author;
  }

  // Only return published posts for non-authors
  if (!req.user || !author || req.user._id.toString() !== author) {
    query.isPublished = true;
  }

  // Count total posts
  const totalPosts = await Post.countDocuments(query);

  // Get posts with pagination
  const posts = await Post.find(query)
    .populate("author", "username fullName avatar")
    .populate("tags", "name slug")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  // Add subscription info if user is authenticated
  let subscriptionInfo = {};
  if (req.user) {
    const remainingPosts = await getRemainingPosts(req.user, Post);
    subscriptionInfo = {
      subscription: {
        plan: req.user.subscription?.plan || "Free",
        isActive: req.user.subscription?.isActive || false,
        remainingPosts,
        hasReachedLimit: remainingPosts === 0,
      },
    };
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        totalPosts,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / limit),
        ...subscriptionInfo,
      },
      "Posts fetched successfully",
    ),
  );
});

// Get post by slug
export const getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await Post.findOne({ slug })
    .populate("author", "username fullName avatar")
    .populate("tags", "name slug")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username fullName avatar",
      },
    });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if post is published or user is the author
  if (!post.isPublished) {
    // For posts with registered authors
    if (post.author && (!req.user || req.user._id.toString() !== post.author._id.toString())) {
      throw new ApiError(403, "You are not authorized to view this post");
    }
    // For guest author posts, they must be published to be viewed
    else if (post.guestAuthor) {
      throw new ApiError(403, "You are not authorized to view this post");
    }
  }

  return res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

// Update post
export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, tags, isPublished } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user is the author
  if (req.user._id.toString() !== post.author.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  // Update fields if provided
  if (title) {
    post.title = title;

    // Update slug if title is changed
    post.slug = title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  if (content) post.content = content;
  if (excerpt) post.excerpt = excerpt;
  if (isPublished !== undefined) post.isPublished = isPublished;

  // Upload cover image if provided
  if (req.file) {
    const coverImageLocalPath = req.file.path;
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (coverImage) {
      post.coverImage = coverImage.url;
    }
  }

  // Process tags if provided
  if (tags) {
    let tagArray = [];

    // Handle different formats of tags
    if (typeof tags === "string") {
      try {
        // Try to parse as JSON string
        tagArray = JSON.parse(tags);
      } catch (error) {
        // If not valid JSON, treat as a single tag
        tagArray = [tags];
      }
    } else if (Array.isArray(tags)) {
      // If already an array, use it directly
      tagArray = tags;
    }

    if (tagArray.length > 0) {
      const tagIds = [];

      // Remove post from all existing tags
      await Tag.updateMany({ posts: post._id }, { $pull: { posts: post._id } });

      for (const tagName of tagArray) {
        if (!tagName) continue; // Skip empty tag names

        // Find or create tag
        let tag = await Tag.findOne({ name: tagName.toLowerCase() });

        if (!tag) {
          // Create new tag
          tag = await Tag.create({
            name: tagName.toLowerCase(),
            slug: tagName
              .toLowerCase()
              .replace(/[^\w ]+/g, "")
              .replace(/ +/g, "-"),
          });
        }

        tagIds.push(tag._id);

        // Add post to tag's posts array
        await Tag.findByIdAndUpdate(tag._id, {
          $addToSet: { posts: post._id },
        });
      }

      post.tags = tagIds;
    }
  }

  // Save updated post
  await post.save();

  return res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});

// Delete post
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user is the author
  if (req.user._id.toString() !== post.author.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  // Remove post from all tags
  await Tag.updateMany({ posts: post._id }, { $pull: { posts: post._id } });

  // Delete post
  await Post.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// Like/unlike post
export const toggleLikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user has already liked the post
  const isLiked = post.likes.includes(req.user._id);

  if (isLiked) {
    // Unlike post
    await Post.findByIdAndUpdate(id, {
      $pull: { likes: req.user._id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { liked: false }, "Post unliked successfully"));
  } else {
    // Like post
    await Post.findByIdAndUpdate(id, {
      $addToSet: { likes: req.user._id },
    });

    return res.status(200).json(new ApiResponse(200, { liked: true }, "Post liked successfully"));
  }
});
