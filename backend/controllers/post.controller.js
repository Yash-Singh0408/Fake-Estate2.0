import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get All Posts controllers/post.js
export const getPosts = async (req, res) => {
  try {
    const {
      city,
      type,
      property,
      bedroom,
      bathroom,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      status = "approved",
    } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        city: city || undefined,
        type: type || undefined,
        property: property || undefined,
        bedroom: bedroom ? +bedroom : undefined,
        bathroom: bathroom ? +bathroom : undefined,
        postDetail: {
          // nested range for size (sq ft / m²)
          size: {
            gte: minSize ? +minSize : undefined,
            lte: maxSize ? +maxSize : undefined,
          },
        },
        price: {
          gte: minPrice ? +minPrice : 0,
          lte: maxPrice ? +maxPrice : 1_000_000_000,
        },
        status,
      },
      orderBy: { createdAt: "desc" },
      include: { postDetail: true },   // so size renders in UI
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};


// Get Single Post
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          // send user image and username
          select: {
            avatar: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
      });
    }

    // If no token, return isSaved as false
    res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Add Post
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        status: "pending",  // Set status to "pending"
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add posts" });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { postData, postDetail } = req.body;

  try {
    // Check if post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // Only include valid fields for the post table
    const {
      title,
      price,
      address,
      city,
      bedroom,
      bathroom,
      latitude,
      longitude,
      type,
      property,
      images,
    } = postData;

    // Update the post and its detail
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        price,
        address,
        city,
        bedroom,
        bathroom,
        latitude,
        longitude,
        type,
        property,
        images,
        status: "pending", // Reset status for admin re-approval
        postDetail: {
          update: {
            ...postDetail, 
          },
        },
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    // Delete related SavedPosts first
    await prisma.savedPost.deleteMany({
      where: { postId: id },
    });

    // Delete PostDetail if it exists
    await prisma.postDetail.deleteMany({
      where: { postId: id },
    });

    // Finally, delete the post itself
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post and its detail deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};


