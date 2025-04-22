import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma.js";

// Get All Users with Post Count and Search and filter
export const getAllUsers = async (req, res) => {
  const { sortBy = "createdAt", order = "desc", search = "" } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        isAdmin: true,
        posts: {
          select: { id: true },
        },
      },
    });

    // Attach postCount to each user
    const usersWithCount = users.map((user) => ({
      ...user,
      postCount: user.posts.length,
    }));

    // Sort users
    const sortedUsers = usersWithCount.sort((a, b) => {
      const valA = sortBy === "postCount" ? a.postCount : new Date(a.createdAt);
      const valB = sortBy === "postCount" ? b.postCount : new Date(b.createdAt);
      return order === "asc" ? valA - valB : valB - valA;
    });

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

// Get DashBoard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const totalUsers = users.length;
    const totalAdmins = users.filter((user) => user.isAdmin).length;
    const totalProperties = await prisma.post.count();
    const totalRequests = 0;

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalProperties,
      totalRequests,
      latestUsers: users
        .filter((u) => !u.isAdmin)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

// Delete User from admin panelimport { PrismaClient } from "@prisma/client";
export const deleteUser = async (req, res) => {
  const prisma = new PrismaClient();
  const id = req.params.id;

  try {
    // Fetch all posts by the user
    const userPosts = await prisma.post.findMany({
      where: { userId: id },
      select: { id: true },
    });

    const postIds = userPosts.map((post) => post.id);

    const result = await prisma.$transaction([
      // 1. Delete messages in chats involving the user
      prisma.message.deleteMany({
        where: {
          chat: {
            userIDs: {
              has: id,
            },
          },
        },
      }),

      // 2. Delete chats involving the user
      prisma.chat.deleteMany({
        where: {
          userIDs: {
            has: id,
          },
        },
      }),

      // 3. Delete saved posts by the user
      prisma.savedPost.deleteMany({
        where: {
          userId: id,
        },
      }),

      // 4. Delete PostDetail entries related to the user's posts
      prisma.postDetail.deleteMany({
        where: {
          postId: {
            in: postIds,
          },
        },
      }),

      // 5. Delete posts by the user
      prisma.post.deleteMany({
        where: {
          userId: id,
        },
      }),

      // 6. Delete the user
      prisma.user.delete({
        where: {
          id,
        },
      }),
    ]);

    res.status(200).json({
      message: "User and all related data deleted successfully.",
      result,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};


// Fetch All the Listings with Sorting and Search Support
export const getAllListings = async (req, res) => {
  const { search = "", sortBy = "latest", status } = req.query;

  let orderBy;

  // Sorting logic
  if (sortBy === "latest") {
    orderBy = { createdAt: "desc" };
  } else if (sortBy === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sortBy === "priceDesc") {
    orderBy = { price: "desc" };
  } else if (sortBy === "priceAsc") {
    orderBy = { price: "asc" };
  }

  // Status filter logic
  let statusFilter = {};
  if (status && ["pending", "approved", "rejected"].includes(status)) {
    statusFilter.status = status;
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
              { city: { contains: search, mode: "insensitive" } },
            ],
          },
          statusFilter,
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postDetail: true,
      },
      orderBy,
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Failed to get listings" });
  }
};

// Update Post Status
export const updatePostStatus = async (req, res) => {
  const { postId } = req.params;
  const { status } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Failed to update post status:", error);
    res.status(500).json({ message: "Failed to update post status" });
  }
};

