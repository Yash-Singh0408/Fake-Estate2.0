import prisma from "../lib/prisma.js";

// Add Message
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;         // Extract user ID from request
  const chatId = req.params.chatId;       // Extract chat ID from request parameters
  const text = req.body.text;             // Extract message text from request body

  try {
    // Find the chat to ensure it exists and the user is part of it
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    // If the chat does not exist or the user is not part of it, return 404 error
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Create a new message in the chat
    const message = await prisma.message.create({
      data: {
        text, // Message text
        chatId, // Chat ID
        userId: tokenUserId, // User ID of the sender
      },
    });

    // Update the chat with the new message
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId], // Update 'seenBy' to include the sender
        lastMessage: text, // Update 'lastMessage' with the new message text
      },
    });

    // Respond with the created message
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    // If any error occurs, respond with a 500 error
    res.status(500).json({ message: "Failed to add messages" });
  }
};

