import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { debounce } from "lodash";

function Chat({ chats, setChats,  openChatId, receiver, defaultMessage }) {
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  // Emit newUser on mount
  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("newUser", currentUser.id);
    }
  }, [socket, currentUser]);

  // Scroll to bottom when chat or typing changes
  useEffect(() => {
    const scrollToBottom = () => {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };
    scrollToBottom();
  }, [chat, partnerTyping]);

  // Load selected chat
  useEffect(() => {
    if (openChatId && receiver) {
      handleOpenChat(openChatId, receiver);
    }
  }, [openChatId, receiver]);

  const handleOpenChat = async (id, receiver) => {
    try {
      setLoading(true);
      const res = await apiRequest("/chats/" + id);

      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
        await apiRequest.put("/chats/read/" + id);

        const updatedChats = chats.map((c) =>
          c.id === id ? { ...c, seenBy: [...c.seenBy, currentUser.id] } : c
        );
        setChats(updatedChats);
        setChat({ ...res.data, receiver });
      } else {
        setChat({ ...res.data, receiver });
      }

      if (defaultMessage && res.data.messages.length === 0) {
        setText(defaultMessage);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      setText("");

      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });

      // Stop typing on send
      socket.emit("stopTyping", {
        chatId: chat.id,
        to: chat.receiver.id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Emit typing (debounced)
  const emitTyping = debounce(() => {
    if (chat && socket) {
      socket.emit("typing", {
        chatId: chat.id,
        to: chat.receiver.id,
      });
    }
  }, 300);

  // Emit stopTyping if no keypress for a while
  useEffect(() => {
    if (!chat || !socket || !text) return;

    const timeout = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: chat.id,
        to: chat.receiver.id,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [text]);

  // Handle incoming messages and typing
  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
          read();
        }
      });

      socket.on("typing", (data) => {
        if (data.chatId === chat.id) {
          setPartnerTyping(true);
        }
      });

      socket.on("stopTyping", (data) => {
        if (data.chatId === chat.id) {
          setPartnerTyping(false);
        }
      });
    }

    return () => {
      socket.off("getMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="chatBox">
          <div className="center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div className="chatSkeleton" key={i}></div>
              ))}
          </div>
        </div>
      ) : (
        chat && (
          <div className="chatBox">
            <div className="top">
              <div className="user">
                <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
                {chat.receiver.username}
              </div>
              <span className="close" onClick={() => setChat(null)}>
                X
              </span>
            </div>
            <div className="center">
              {chat.messages.map((message) => (
                <div
                  className={`chatMessage ${
                    message.userId === currentUser.id ? "own" : ""
                  }`}
                  key={message.id}
                >
                  <p>{message.text}</p>
                  <span title={new Date(message.createdAt).toLocaleString()}>
                    {format(message.createdAt)}
                  </span>
                </div>
              ))}
              {partnerTyping && (
                <div className="chatMessage typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messageEndRef}></div>
            </div>
            <form onSubmit={handleSubmit} className="bottom">
              <textarea
                onKeyDown={handleKeyDown}
                name="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  emitTyping();
                }}
                placeholder="Type your message..."
              />
              <button disabled={!text.trim()}>Send</button>
            </form>
          </div>
        )
      )}
    </div>
  );
}

export default Chat;
