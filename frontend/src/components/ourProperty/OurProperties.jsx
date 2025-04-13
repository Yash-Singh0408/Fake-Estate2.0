import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import "./ourProperties.scss";

const OurProperties = () => {
  // Refs for all images
  const leftRef = useRef();
  const img2Ref = useRef();
  const img3Ref = useRef();
  const img4Ref = useRef();

  // InView detection
  const leftInView = useInView(leftRef, { threshold: 0.3 });
  const img2InView = useInView(img2Ref, { threshold: 0.3 });
  const img3InView = useInView(img3Ref, { threshold: 0.3 });
  const img4InView = useInView(img4Ref, { threshold: 0.3 });

  // Controls
  const leftControls = useAnimation();
  const img2Controls = useAnimation();
  const img3Controls = useAnimation();
  const img4Controls = useAnimation();

  // Effects for inView and out of view animation
  useEffect(() => {
    leftControls.start(leftInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 });
  }, [leftInView]);

  useEffect(() => {
    img2Controls.start(img2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 });
  }, [img2InView]);

  useEffect(() => {
    img3Controls.start(img3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 });
  }, [img3InView]);

  useEffect(() => {
    img4Controls.start(img4InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 });
  }, [img4InView]);

  return (
    <section className="ourProperties">
      <h1>Our Properties</h1>
      <div className="mainSection">
        {/* Left Image */}
        <motion.div
          className="left"
          ref={leftRef}
          initial={{ opacity: 0, x: -50 }}
          animate={leftControls}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
            src="/property1.png"
            alt="Property 1"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Right Column */}
        <div className="right">
          <div className="topRow">
            <motion.img
              ref={img2Ref}
              src="/property2.png"
              alt="Property 2"
              initial={{ opacity: 0, y: -30 }}
              animate={img2Controls}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
            <motion.img
              ref={img3Ref}
              src="/property3.png"
              alt="Property 3"
              initial={{ opacity: 0, y: -30 }}
              animate={img3Controls}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            />
          </div>
          <div className="bottomRow">
            <motion.img
              ref={img4Ref}
              src="/property4.png"
              alt="Property 4"
              initial={{ opacity: 0, y: 30 }}
              animate={img4Controls}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProperties;
