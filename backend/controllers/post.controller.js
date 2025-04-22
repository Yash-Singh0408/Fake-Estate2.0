import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get All Posts
export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 1000000,
        },
        status: "approved",
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
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

    // First delete postDetail (manual cascade)
    await prisma.postDetail.delete({
      where: { postId: id },
    });

    // Then delete post
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post and its detail deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

