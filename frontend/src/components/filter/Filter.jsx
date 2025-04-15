import React, { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaRedo } from "react-icons/fa";


function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    bedroom: searchParams.get("bedroom") || 0,
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 10000000,
  });

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleFilter();
    }
  };

  const resetFilters = () => {
    const defaultQuery = {
      type: "",
      city: "",
      property: "",
      bedroom: "",
      minPrice: "",
      maxPrice: "",
    };
    setQuery(defaultQuery);
    setSearchParams({});
  };
  return (
    <div className="filter">
      <h1>
        Search Results for <b>{searchParams.get("city")}</b>
      </h1>

      <button className="toggleBtn" onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="top">
        <div className="item" style={{ width: "100%" }}>
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            value={query.city}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className={`bottom ${showFilters ? "show" : ""}`}>
        <div className="item">
          <label htmlFor="type">Type</label>
          <select name="type" id="type" value={query.type} onChange={handleChange}>
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="property">Property</label>
          <select name="property" id="property" value={query.property} onChange={handleChange}>
            <option value="">Any</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={query.minPrice}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={query.maxPrice}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            value={query.bedroom}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="actions">
          <button className="search" onClick={handleFilter}>
          <FaSearch /> Search
          </button>
          <button className="reset" onClick={resetFilters}>
          <FaRedo /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
