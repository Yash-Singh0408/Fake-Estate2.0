import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './footer.scss';
import { Link } from 'react-router-dom';

function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, {
    threshold: 0.3,
  });

  const fadeVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.footer
      ref={footerRef}
      className="site-footer"
      variants={fadeVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="footer-content">
        <div className="footer-brand">
          <h3>FakeEstate</h3>
          <p>Your trusted partner in finding the perfect home.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/list?type=buy">Buy</Link></li>
            <li><Link to="/list?type=rent">Rent</Link></li>
            {/* <li><Link to="/contact">Contact</Link></li> */}
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: support@FakeEstate.com</p>
          <p>Phone: +1 (800) 123-4567</p>
          <p>Location: 123 Main Street, Mumbai</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FakeEstate. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
