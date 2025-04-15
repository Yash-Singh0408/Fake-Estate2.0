import React from "react";
import "./card.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Card({ item }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
    >
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
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="save" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="chat" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
