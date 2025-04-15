import "./homepage.scss";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion, useInView, useAnimation } from "framer-motion";
import OurProperties from "../../components/ourProperty/OurProperties.jsx";
import AboutSection from "../../components/aboutSection/AboutSection.jsx";
import HomeSearch from "../../components/homeSearch/HomeSearch.jsx";
import Footer from "../../components/footer/Footer.jsx";
import TestimonialSlider from "../../components/testimonial/Testimonials.jsx";
import { Link } from "react-router-dom";

function Homepage() {
  const { currentUser } = useContext(AuthContext);

  // Refs
  const mainHeadingRef = useRef();
  const searchRef = useRef();
  const propertyRef = useRef();
  const statsRef = useRef();

  // InView tracking
  const mainHeadingInView = useInView(mainHeadingRef, { threshold: 0.3 });
  const searchInView = useInView(searchRef, { threshold: 0.3 });
  const propertyInView = useInView(propertyRef, { threshold: 0.3 });
  const statsInView = useInView(statsRef, { threshold: 0.3 });

  // Animation controls
  const headingControls = useAnimation();
  const searchControls = useAnimation();
  const propertyImageControls = useAnimation();
  const propertyTextControls = useAnimation();
  const statsControls = useAnimation();

  // Effects for scroll in/out
  useEffect(() => {
    headingControls.start(
      mainHeadingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
    );
  }, [mainHeadingInView]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    searchControls.start(
      searchInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
    );
  }, [searchInView]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    propertyImageControls.start(
      propertyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
    );
    propertyTextControls.start(
      propertyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
    );
  }, [propertyInView]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    statsControls.start(
      statsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
    );
  }, [statsInView]); // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className="homepage">
      <div className="hero">
        <div className="content">
          <motion.h1
            ref={mainHeadingRef}
            className="mainHeading"
            initial={{ x: -50, opacity: 0 }}
            animate={headingControls}
            transition={{ duration: 0.8 }}
          >
            <span className="bold">Buy Sell & Rent</span>{" "}
            <span className="light">your dream</span>{" "}
            <span className="bold">Project</span>
            <span className="arrowBtn">
              <Link to="/list">
                <FontAwesomeIcon className="arrow" icon={faArrowRight} />{" "}
              </Link>
            </span>
          </motion.h1>

          <motion.div
            ref={searchRef}
            className="searchBarWrapper"
            initial={{ x: 50, opacity: 0 }}
            animate={searchControls}
            transition={{ duration: 0.8 }}
          >
            <SearchBar />
          </motion.div>

          <motion.div
            ref={propertyRef}
            className="propertyHighlight"
            initial={{ opacity: 0 }}
            animate={propertyInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="imageWrapper"
              initial={{ x: -50, opacity: 0 }}
              animate={propertyImageControls}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <img src="/modernHouse.png" alt="Modern Property" />
            </motion.div>

            <motion.div
              className="textBox"
              initial={{ x: 50, opacity: 0 }}
              animate={propertyTextControls}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3>Good property</h3>
              <p>
                A good property is one that offers long-term value, whether for
                personal use, investment, or business purposes. The key factors
                that define a good property include location, infrastructure,
                legal clarity, and market demand.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            ref={statsRef}
            className="stats"
            initial={{ x: 50, opacity: 0 }}
            animate={statsControls}
            transition={{ duration: 0.8 }}
          >
            <div className="statBox">
              <h2>16+</h2>
              <p>Years experience</p>
            </div>
            <div className="statBox">
              <h2>50+</h2>
              <p>Agents</p>
            </div>
            <div className="statBox">
              <h2>100+</h2>
              <p>Properties sold</p>
            </div>
          </motion.div>
        </div>
      </div>

      <OurProperties />
      <div id="aboutSection">
        <AboutSection />
      </div>

      <TestimonialSlider />
      <HomeSearch />
      <Footer />
    </div>
  );
}

export default Homepage;
