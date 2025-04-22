import React, { useState } from "react";
import "./card.scss";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiRequest from "../../lib/apiRequest";
import { toast } from "react-toastify";

function Card({ item, showStatus, showActions }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await apiRequest.delete(`/posts/deletePost/${item.id}`);
      toast.success("Post deleted successfully");
      setTimeout(()=>{
        window.location.reload();
      },3000)
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <>
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {showStatus && (
          <span className={`statusBadge ${item.status}`}>{item.status}</span>
        )}

        <Link to={`/list/${item.id}`} className="imageContainer">
          <img src={item.images?.[0]} alt="" />
        </Link>

        <div className="textContainer">
          <h2 className="title">
            <Link to={`/list/${item.id}`}>{item.title}</Link>
          </h2>
          <p className="address">
            <img src="/pin.png" alt="pin" />
            <span>{item.address}</span>
          </p>
          <p className="price">₹{item.price}</p>

          <div className="bottom">
            <div className="features">
              <div className="feature">
                <img src="/bed.png" alt="" />
                <span>{item.bedroom} Bedrooms</span>
              </div>
              <div className="feature">
                <img src="/bath.png" alt="" />
                <span>{item.bathroom} Bathrooms</span>
              </div>
            </div>

            {showActions ? (
              <div className="icons">
                <div className="icon" onClick={() => navigate(`/profile/editpost/${item.id}`)}>
                  ✏️
                </div>
                <div className="icon" onClick={() => setShowModal(true)}>
                  🗑️
                </div>
              </div>
            ) : (
              <div className="icons">
                <div className="icon">
                  <img src="/save.png" alt="save" />
                </div>
                <div className="icon">
                  <img src="/chat.png" alt="chat" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this listing?</p>
            <div className="modalActions">
              <button className="cancelBtn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirmBtn" onClick={() => {
                handleDelete();
                setShowModal(false);
              }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
