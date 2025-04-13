import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./testimonial.scss";

const testimonials = [
  {
    name: "Aarav Mehta",
    location: "Mumbai",
    quote: "DreamHome helped us find the perfect apartment.",
    avatar: "/user1.png",
  },
  {
    name: "Sofia Singh",
    location: "Delhi",
    quote: "The support and listings were exactly what we wanted.",
    avatar: "/user2.png",
  },
  {
    name: "Rajat Kumar",
    location: "Bangalore",
    quote: "Buying our first home was incredibly easy.",
    avatar: "/user3.png",
  },
  {
    name: "Priya Sharma",
    location: "Pune",
    quote: "Professional and friendly experience.",
    avatar: "/user5.png",
  },
  {
    name: "Kunal Verma",
    location: "Chennai",
    quote: "Excellent listings and great support!",
    avatar: "/user4.png",
  },
  {
    name: "Meera Das",
    location: "Hyderabad",
    quote: "Friendly agents and great service!",
    avatar: "/user6.png",
  },
];

const CARD_WIDTH = 320 + 16;

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const sliderRef = useRef(null);
  const isInView = useInView(sliderRef, { threshold: 0.3 });

  const extended = [...testimonials, ...testimonials.slice(0, 3)];

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (index === testimonials.length) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, 800);
    } else {
      setAnimate(true);
    }
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Client Testimonials
      </motion.h2>
      <motion.section
        className="testimonial-slider"
        ref={sliderRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="slider-container">
          <button className="nav-btn" onClick={handlePrev}>
            ←
          </button>

          <div className="viewport">
            <motion.div
              className="slider-track"
              animate={{ x: -index * CARD_WIDTH }}
              transition={
                animate
                  ? { type: "spring", stiffness: 70, damping: 18 }
                  : { duration: 0 }
              }
            >
              {extended.map((item, i) => (
                <div className="testimonial-card" key={i}>
                  <img src={item.avatar} alt={item.name} />
                  <p className="quote">&quot;{item.quote}&quot;</p>
                  <h4>{item.name}</h4>
                  <span>{item.location}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <button className="nav-btn" onClick={handleNext}>
            →
          </button>
        </div>
      </motion.section>
    </>
  );
};

export default TestimonialSlider;
