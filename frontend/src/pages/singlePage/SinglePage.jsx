import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import Dompurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import SkeletonSinglePage from "../../components/skeleton/SkeletonSinglePage";
import { motion } from "framer-motion";

// Animation helper
const fadeInUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  },
});

function SinglePage() {
  const data = useLoaderData();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async (postId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest.post("/users/save", { postId });
      setSaved(res.data.isSaved);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<SkeletonSinglePage />}>
      <Await resolve={data.post} errorElement={<p>Error loading listing!</p>}>
        {(post) => {
          const handleStartChat = async () => {
            if (!currentUser) {
              navigate("/login");
              return;
            }

            try {
              const res = await apiRequest.post("/chats/access", {
                receiverId: post.userId,
              });

              navigate("/profile", {
                state: {
                  openChatId: res.data.id,
                  receiver: res.data.receiver,
                  defaultMessage: "Hi, I'm interested in your listing!",
                },
              });
            } catch (err) {
              console.log(err);
            }
          };

          return (
            <motion.div
              className="singlePage"
              initial="hidden"
              animate="visible"
            >
              <motion.div className="details" variants={fadeInUp(0)}>
                <div className="wrapper">
                  <motion.div className="slider" variants={fadeInUp(0.1)}>
                    <Slider images={post.images} />
                  </motion.div>
                  <motion.div className="info" variants={fadeInUp(0.2)}>
                    <div className="top">
                      <div className="post">
                        <motion.h1 variants={fadeInUp(0.3)}>
                          {post.title}
                        </motion.h1>
                        <motion.div
                          className="address"
                          variants={fadeInUp(0.35)}
                        >
                          <img src="/pin.png" alt="pin" />
                          <span>{post.address}</span>
                        </motion.div>
                        <motion.div className="price" variants={fadeInUp(0.4)}>
                          ₹ {post.price}
                        </motion.div>
                      </div>
                      <motion.div className="user" variants={fadeInUp(0.45)}>
                        <img src={post.user.avatar} alt="" />
                        <span className="username">{post.user.username}</span>
                      </motion.div>
                    </div>
                    <motion.div
                      className="bottom"
                      dangerouslySetInnerHTML={{
                        __html: Dompurify.sanitize(post.postDetail.desc),
                      }}
                      variants={fadeInUp(0.5)}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div className="features" variants={fadeInUp(0.6)}>
                <div className="wrapper">
                  <motion.p className="title" variants={fadeInUp(0.65)}>
                    Location
                  </motion.p>
                  <motion.div className="mapContainer" variants={fadeInUp(0.7)}>
                    <Map items={[post]} singleLocation={true} />
                  </motion.div>
                  <motion.div className="buttons" variants={fadeInUp(0.75)}>
                    <motion.button
                      onClick={handleStartChat}
                      whileHover={{ scale: 1.03 }}
                    >
                      <img src="/chat.png" alt="" />
                      Send a message
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      onClick={() => handleSave(post.id)}
                      style={{
                        backgroundColor: saved ? "#fece51" : "white",
                        minWidth: "160px",
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <img src="/save.png" alt="save" />
                          {saved ? "Place Saved" : "Save the Place"}
                        </>
                      )}
                    </motion.button>
                  </motion.div>

                  <motion.p className="title" variants={fadeInUp(0.8)}>
                    General
                  </motion.p>
                  <motion.div
                    className="listVertical"
                    variants={fadeInUp(0.85)}
                  >
                    <div className="feature">
                      <img src="/utility.png" alt="" />
                      <div className="featureText">
                        <span>Utility</span>
                        <p>
                          {post.postDetail.utilities === "owner"
                            ? "Owner is responsible"
                            : "Tenant is responsible"}
                        </p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/pet.png" alt="" />
                      <div className="featureText">
                        <span>Pet Policy</span>
                        <p>
                          {post.postDetail.pets === "allowed"
                            ? "Pets are allowed"
                            : "Pets are not allowed"}
                        </p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/fee.png" alt="" />
                      <div className="featureText">
                        <span>Income Policy</span>
                        <p>{post.postDetail.income}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.p className="title" variants={fadeInUp(0.9)}>
                    Sizes
                  </motion.p>
                  <motion.div className="sizes" variants={fadeInUp(0.95)}>
                    <div className="size">
                      <img src="/size.png" alt="" />
                      <span>{post.postDetail.size}</span>
                    </div>
                    <div className="size">
                      <img src="/bed.png" alt="" />
                      <span>{post.bedroom} bedrooms</span>
                    </div>
                    <div className="size">
                      <img src="/bath.png" alt="" />
                      <span>{post.bathroom} bathroom</span>
                    </div>
                  </motion.div>

                  <motion.p className="title" variants={fadeInUp(1)}>
                    Nearby Places
                  </motion.p>
                  <motion.div
                    className="listHorizonatal"
                    variants={fadeInUp(1.05)}
                  >
                    <div className="feature">
                      <img src="/school.png" alt="" />
                      <div className="featureText">
                        <span>School</span>
                        <p>
                          {post.postDetail.school > 999
                            ? post.postDetail.school / 1000 + "km"
                            : post.postDetail.school + "m"}{" "}
                          away
                        </p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/bus.png" alt="" />
                      <div className="featureText">
                        <span>Bus</span>
                        <p>
                          {post.postDetail.bus > 999
                            ? post.postDetail.bus / 1000 + "km"
                            : post.postDetail.bus + "m"}{" "}
                          away
                        </p>
                      </div>
                    </div>
                    <div className="feature">
                      <img src="/restaurant.png" alt="" />
                      <div className="featureText">
                        <span>Hotel</span>
                        <p>
                          {post.postDetail.restaurant > 999
                            ? post.postDetail.restaurant / 1000 + "km"
                            : post.postDetail.restaurant + "m"}{" "}
                          away
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        }}
      </Await>
    </Suspense>
  );
}

export default SinglePage;
