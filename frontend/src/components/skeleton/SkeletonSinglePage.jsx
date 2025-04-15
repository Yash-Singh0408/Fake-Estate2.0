import "./skeletonSinglePage.scss";

function SkeletonSinglePage() {
  return (
    <div className="singlePage skeleton">
      <div className="details">
        <div className="wrapper">
          <div className="slider skeleton-box"></div>
          <div className="info">
            <div className="top">
              <div className="post">
                <div className="skeleton-box title" />
                <div className="skeleton-box address" />
                <div className="skeleton-box price" />
              </div>
              <div className="user">
                <div className="skeleton-avatar" />
                <div className="skeleton-box username" />
              </div>
            </div>
            <div className="bottom">
              <div className="skeleton-box desc" />
              <div className="skeleton-box desc" />
              <div className="skeleton-box desc short" />
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <div className="skeleton-box title" />
          <div className="mapContainer">
            <div className="skeleton-map" />
          </div>

          <div className="buttons">
            <div className="skeleton-box button" />
            <div className="skeleton-box button" />
          </div>

          <div className="skeleton-box title" />
          <div className="listVertical">
            {[1, 2, 3].map((_, idx) => (
              <div className="feature" key={idx}>
                <div className="skeleton-icon" />
                <div className="featureText">
                  <div className="skeleton-box text short" />
                  <div className="skeleton-box text" />
                </div>
              </div>
            ))}
          </div>

          <div className="skeleton-box title" />
          <div className="sizes">
            {[1, 2, 3].map((_, idx) => (
              <div className="size" key={idx}>
                <div className="skeleton-icon" />
                <div className="skeleton-box text short" />
              </div>
            ))}
          </div>

          <div className="skeleton-box title" />
          <div className="listHorizonatal">
            {[1, 2, 3].map((_, idx) => (
              <div className="feature" key={idx}>
                <div className="skeleton-icon" />
                <div className="featureText">
                  <div className="skeleton-box text short" />
                  <div className="skeleton-box text" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonSinglePage;
