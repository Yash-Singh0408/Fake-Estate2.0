import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./pageNotFound.scss";

function PageNotFound() {
  /* skyline parallax */
  const pan = {
    scale: [1.05, 1, 1.05],
    transition: { duration: 25, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <section className="notFound">
      {/* Blurred skyline silhouettes */}
      <motion.svg
        viewBox="0 0 1440 320"
        className="skyline"
        animate={pan}
        preserveAspectRatio="none"
      >
        <path
          d="M0,192L80,160L160,96L240,128L320,160L400,96L480,160L560,96L640,128L720,160L800,64L880,96L960,160L1040,96L1120,128L1200,160L1280,96L1360,128L1440,96L1440,320L0,320Z"
          opacity=".2"
        />
      </motion.svg>

      {/* glass card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* house‑roof icon */}
        <motion.svg
          className="roofIcon"
          width="88"
          height="88"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ rotate: -6 }}
          animate={{ rotate: [ -6, 6, -6 ] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <polyline points="3 12 12 3 21 12" />
          <path d="M9 21V12H15V21" />
        </motion.svg>

        <h1>404</h1>
        <p>Oops! The Page you’re hunting for doesn’t exist.</p>

        <Link to="/list" className="homeBtn">
          Browse Listings
        </Link>
      </motion.div>
    </section>
  );
}

export default PageNotFound;
