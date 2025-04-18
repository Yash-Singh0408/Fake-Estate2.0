import prisma from "../lib/prisma.js";

// Get all chats
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats) {
        const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

        const receiver = await prisma.user.findUnique({
            where: {
                id: receiverId
            },
            select: {
                id: true,
                avatar: true,
                username: true,
            }
        })

        chat.receiver = receiver
    }

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get chats" });
  }
};

// Get a single chat
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          set: [tokenUserId],   //set instead of push
        },
      },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get a single chats" });
  }
};

// Add a new chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add chats" });
  }
};

// Read a chat
export const readChat = async (req, res) => {
    const tokenUserId = req.userId;
  try {
    const chat = await prisma.chat.update({
        where: {
            id: req.params.id,
            userIDs: {
                hasSome: [tokenUserId],
            }
        },
        data: {
            seenBy: {
                set: [tokenUserId],
            }
        }
    })

    res.status(200).json(chat);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to read chats" });
  }
};

// Access or create a chat between two users
export const accessChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  try {
    // Check if chat already exists
    let chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
    });

    if (!chat) {
      // Create if not found
      chat = await prisma.chat.create({
        data: {
          userIDs: [tokenUserId, receiverId],
        },
      });
    }

    // Attach receiver info
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        avatar: true,
        username: true,
      },
    });

    chat.receiver = receiver;

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to access chat" });
  }
};
