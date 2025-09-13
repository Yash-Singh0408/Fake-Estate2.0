import { json } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";


// Get a Single User
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "No user found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user" });
  }
};

// Upate a User
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, username, email, ...restInputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  try {
    // Check for existing username or email
    if (username || email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            username ? { username } : undefined,
            email ? { email } : undefined,
          ],
          NOT: { id }, // exclude the current user
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username or email already taken" });
      }
    }

    // Hash password if provided
    let updatedPassword = null;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        ...restInputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};


// Delete a User
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  try {
    const deleteUser = await prisma.user.delete({ where: { id } });
    res.status(200).json(deleteUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Save a Post
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res
        .status(200)
        .json({ message: "Post removed from saved list", isSaved: false });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved", isSaved: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save post!" });
  }
};

// Check if post is saved
export const isPostSaved = async (req, res) => {
  const tokenUserId = String(req.userId);
  const postId = String(req.params.postId);

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId: postId,
        },
      },
    });

    res.status(200).json({ isSaved: !!savedPost });
  } catch (err) {
    console.error("Error checking saved post:", err);
    res.status(500).json({ message: "Failed to check saved status." });
  }
};


// Fetch users Posts
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Fetch posts created by the user (include all, even pending/rejected)
    const userPosts = await prisma.post.findMany({
      where: {
        userId: tokenUserId,
      },
    });

    // Fetch only saved posts that are approved
    const saved = await prisma.savedPost.findMany({
      where: {
        userId: tokenUserId,
        post: {
          status: "approved", // Only include approved posts
        },
      },
      include: {
        post: true,
      },
    });

    const savedPost = saved.map((item) => item.post);

    res.status(200).json({ userPosts, savedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch profile post!" });
  }
};


// Get Notification
export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
          userIDs: {
            hasSome:[tokenUserId]
          },
          NOT:{
            seenBy: {
              hasSome: [tokenUserId]
            }
          }
      },
    });
    res.status(200).json(number);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get notification" });
  }
};