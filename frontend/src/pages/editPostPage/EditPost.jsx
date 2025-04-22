import { useEffect, useState, useContext } from "react";
import "./editPostPage.scss";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill";
import { useLoaderData, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function EditPost() {
  const { post: postPromise } = useLoaderData();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({});
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    postPromise.then((resolvedPost) => {
      setPost(resolvedPost);
      setFormData({
        title: resolvedPost.title || "",
        price: resolvedPost.price || "",
        address: resolvedPost.address || "",
        city: resolvedPost.city || "",
        bedroom: resolvedPost.bedroom || "",
        bathroom: resolvedPost.bathroom || "",
        latitude: resolvedPost.latitude || "",
        longitude: resolvedPost.longitude || "",
        type: resolvedPost.type || "rent",
        property: resolvedPost.property || "apartment",
        utilities: resolvedPost.postDetail?.utilities || "",
        pet: resolvedPost.postDetail?.pet || "",
        income: resolvedPost.postDetail?.income || "",
        size: resolvedPost.postDetail?.size || "",
        school: resolvedPost.postDetail?.school || "",
        bus: resolvedPost.postDetail?.bus || "",
        restaurant: resolvedPost.postDetail?.restaurant || "",
      });
      setDescription(resolvedPost.postDetail?.desc || "");
      setImages(resolvedPost.images || []);
    });
  }, [postPromise]);

  if (!post) return <div>Loading post...</div>;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.put(`/posts/updatePost/${post.id}`, {
        postData: {
          ...formData,
          images,
          price: parseInt(formData.price),
          bedroom: parseInt(formData.bedroom),
          bathroom: parseInt(formData.bathroom),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
        postDetail: {
          desc: description,
          utilities: formData.utilities,
          pet: formData.pet,
          income: formData.income,
          size: parseInt(formData.size),
          school: parseInt(formData.school),
          bus: parseInt(formData.bus),
          restaurant: parseInt(formData.restaurant),
        },
      });

      navigate(`/list/${post.id}`);
      toast.success("Post updated successfully!");
    } catch (err) {
      toast.error("Failed to update post.");
    }
  };

  return (
    <div className="newPostPage">
      <div className="newPostWrapper">
        <div className="newPostLeft">
          <h1>Edit Post</h1>
          <form onSubmit={handleSubmit}>
            <div className="formGrid">
              {[
                ["Title", "title", "text"],
                ["Price", "price", "number"],
                ["Address", "address", "text"],
                ["City", "city", "text"],
                ["Bedroom Number", "bedroom", "number"],
                ["Bathroom Number", "bathroom", "number"],
                ["Latitude", "latitude", "text"],
                ["Longitude", "longitude", "text"],
                ["Income Policy", "income", "text"],
                ["Total Size (sqft)", "size", "number"],
                ["School Nearby (m)", "school", "number"],
                ["Bus Stand (m)", "bus", "number"],
                ["Restaurants Nearby (m)", "restaurant", "number"],
              ].map(([label, name, type]) => (
                <div className="formItem" key={name}>
                  <label>{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className="formItem">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>

              <div className="formItem">
                <label>Property</label>
                <select
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="formItem">
                <label>Utilities Policy</label>
                <select
                  name="utilities"
                  value={formData.utilities}
                  onChange={handleChange}
                >
                  <option value="owner">Owner is responsible</option>
                  <option value="tenant">Tenant is responsible</option>
                  <option value="shared">Shared</option>
                </select>
              </div>

              <div className="formItem">
                <label>Pet Policy</label>
                <select
                  name="pet"
                  value={formData.pet}
                  onChange={handleChange}
                >
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>
            </div>

            <div className="formItem description">
              <label>Description</label>
              <ReactQuill theme="snow" value={description} onChange={setDescription} />
            </div>

            <button type="submit" className="submitBtn">
              Update Post
            </button>
          </form>
        </div>

        <div className="newPostRight">
          <div className="imagePreviewGrid">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Uploaded ${idx}`} />
            ))}
          </div>
          <UploadWidget
            uwConfig={{
              cloudName: "djq7gjuo0",
              uploadPreset: "FakeEstate",
              multiple: "true",
              maxImageFileSize: 2000000,
              folder: "posts",
            }}
            setState={setImages}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditPost;
