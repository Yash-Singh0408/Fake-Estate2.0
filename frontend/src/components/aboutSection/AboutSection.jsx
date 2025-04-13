import React, { useEffect, useRef } from "react";
import "./aboutSection.scss";
import { FaHome, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { motion, useAnimation, useInView } from "framer-motion";

function AboutSection() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const titleRef = useRef(null);

  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const titleControls = useAnimation();

  const isLeftInView = useInView(leftRef, { threshold: 0.2 });
  const isRightInView = useInView(rightRef, { threshold: 0.2 });
  const isTitleInView = useInView(titleRef, { threshold: 0.2 });

  useEffect(() => {
    isTitleInView
      ? titleControls.start({ opacity: 1, y: 0 })
      : titleControls.start({ opacity: 0, y: -20 });

    isLeftInView
      ? leftControls.start({ opacity: 1, x: 0 })
      : leftControls.start({ opacity: 0, x: -50 });

    isRightInView
      ? rightControls.start({ opacity: 1, x: 0 })
      : rightControls.start({ opacity: 0, x: 50 });
  }, [isLeftInView, isRightInView, isTitleInView]);

  return (
    <>
      <motion.h1
        className="about__title"
        ref={titleRef}
        initial={{ opacity: 0, y: -20 }}
        animate={titleControls}
        transition={{ duration: 0.6 }}
      >
        About us
      </motion.h1>

      <div className="about">
        <div className="about__content">
          <motion.div
            className="about__left"
            ref={leftRef}
            initial={{ opacity: 0, x: -50 }}
            animate={leftControls}
            transition={{ duration: 0.8 }}
          >
            <h2>Trusted By</h2>
            <h3>
              100 Million <span>buyers</span>
            </h3>
            <p>
              A strong market presence. It reflects a brand’s ability to
              consistently deliver quality, ensuring customer satisfaction on a
              massive scale. Whether in real estate, e-commerce, or any other
              industry, such a milestone builds trust and attracts more buyers.
            </p>
          </motion.div>

          <motion.div
            className="about__right"
            ref={rightRef}
            initial={{ opacity: 0, x: 50 }}
            animate={rightControls}
            transition={{ duration: 0.8 }}
          >
            {[ 
              { icon: <FaHome />, title: "Explore properties" },
              { icon: <FaSearch />, title: "Find properties" },
              { icon: <FaExternalLinkAlt />, title: "Rent properties" },
            ].map((item, index) => (
              <div key={index} className="about__feature">
                <motion.div
                  className="icon"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    Finding the right property is more than just choosing a
                    location—it’s about discovering a space that fits your
                    lifestyle, investment goals, or business needs.
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default AboutSection;
