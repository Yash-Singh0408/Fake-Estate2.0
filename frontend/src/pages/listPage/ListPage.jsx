import "./listpage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import SkeletonCard from "../../components/skeleton/SkeletonCard";
import SkeletonMap from "../../components/skeleton/SkeletonMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";


function ListPage() {
  const data = useLoaderData();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense
            fallback={
              <div className="skeleton-wrapper">
                {Array(6)
                  .fill()
                  .map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
              </div>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => (
                <>
                  <div className="resultCount">
                    {postResponse.data.length} results found
                  </div>

                  {postResponse.data.length === 0 ? (
                    <div className="noResults">
                      <div className="noResultsIcon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="80"
                          height="80"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35m1.6-4.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 017.5 8.5z"
                          />
                        </svg>
                      </div>
                      <p>No properties found. Try adjusting your filters.</p>
                    </div>
                  ) : (
                    postResponse.data.map((post) => (
                      <Card key={post.id} item={post} />
                    ))
                  )}
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="mapContainer">
        <Suspense fallback={<SkeletonMap />}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>

      {showScrollTop && (
  <button className="scrollToTop" onClick={scrollToTop}>
    <FontAwesomeIcon icon={faChevronUp} />
  </button>
)}
    </div>
  );
}

export default ListPage;
