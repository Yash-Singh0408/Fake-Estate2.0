import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import './homeSearch.scss'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

function HomeSearch() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { threshold: 0.2 })

  const types = ['buy', 'rent']
  const [query, setQuery] = useState({
    type: 'buy',
    city: '',
    minPrice: 0,
    maxPrice: 0,
  })

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }))
  }

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <motion.div
      className="homeSearch"
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      <section className="dream-home">
        <motion.h2 variants={fadeUp}>
          Find Your <span>Dream home</span>
        </motion.h2>

        <motion.p variants={fadeUp}>
          Your dream home is more than just a place to live—it’s where comfort, security, and happiness come together.
          Whether you’re looking for a modern apartment, a spacious villa, or a cozy house, finding the perfect home involves careful planning.
        </motion.p>

        <motion.div className="dream-home__search" variants={fadeUp}>
          <div className="type">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => switchType(type)}
                className={query.type === type ? 'active' : ''}
              >
                {type}
              </button>
            ))}
          </div>

          <form>
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
            />
            <input
              type="number"
              name="minPrice"
              min={0}
              placeholder="Min Price"
              onChange={handleChange}
            />
            <input
              type="number"
              name="maxPrice"
              min={0}
              placeholder="Max Price"
              onChange={handleChange}
            />
            <Link
              to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
            >
              <button type="button">
                <img src="/search.png" alt="search" />
              </button>
            </Link>
          </form>
        </motion.div>
      </section>
    </motion.div>
  )
}

export default HomeSearch
