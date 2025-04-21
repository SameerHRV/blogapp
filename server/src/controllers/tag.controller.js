import { Tag } from "../models/tag.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all tags
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });

  return res.status(200).json(
    new ApiResponse(200, tags, "Tags fetched successfully")
  );
});

// Get tag by slug
export const getTagBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const tag = await Tag.findOne({ slug }).populate({
    path: "posts",
    populate: {
      path: "author",
      select: "username fullName avatar",
    },
    match: { isPublished: true },
  });

  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  return res.status(200).json(
    new ApiResponse(200, tag, "Tag fetched successfully")
  );
});

// Create a new tag (admin only)
export const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Tag name is required");
  }

  // Check if tag already exists
  const existingTag = await Tag.findOne({ name: name.toLowerCase() });
  if (existingTag) {
    throw new ApiError(409, "Tag already exists");
  }

  // Create slug from name
  const slug = name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

  // Create tag
  const tag = await Tag.create({
    name: name.toLowerCase(),
    slug,
  });

  return res.status(201).json(
    new ApiResponse(201, tag, "Tag created successfully")
  );
});

// Delete a tag (admin only)
export const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findById(id);

  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  // Delete tag
  await Tag.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Tag deleted successfully")
  );
});
