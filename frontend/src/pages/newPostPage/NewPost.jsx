import React from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewPost() {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(null);
  const [images, setImages] = React.useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validation
    if (!inputs.title.trim()) return toast.error("Title is required.");
    if (!inputs.price || isNaN(inputs.price) || inputs.price <= 0) return toast.error("Enter a valid price.");
    if (!inputs.address.trim()) return toast.error("Address is required.");
    if (!inputs.city.trim()) return toast.error("City is required.");
    if (!inputs.bedroom || isNaN(inputs.bedroom) || inputs.bedroom <= 0) return toast.error("Enter a valid number of bedrooms.");
    if (!inputs.bathroom || isNaN(inputs.bathroom) || inputs.bathroom <= 0) return toast.error("Enter a valid number of bathrooms.");
    if (!inputs.latitude || isNaN(inputs.latitude) || Math.abs(parseFloat(inputs.latitude)) > 90) return toast.error("Enter a valid latitude (-90 to 90).");
    if (!inputs.longitude || isNaN(inputs.longitude) || Math.abs(parseFloat(inputs.longitude)) > 180) return toast.error("Enter a valid longitude (-180 to 180).");
    if (!value.trim() || value.length < 20) return toast.error("Description must be at least 20 characters.");
    if (images.length === 0) return toast.error("At least one image is required.");
    if (!inputs.size || isNaN(inputs.size) || inputs.size <= 0) return toast.error("Enter a valid size in sqft.");


    try {
      const res = await apiRequest.post("/posts/addPost", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: parseFloat(inputs.latitude),
          longitude: parseFloat(inputs.longitude),
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      toast.success("Post added successfully!");
      navigate("/" + res.data.id);
    } catch (error) {
      console.error(error);
      setError(
        toast.error(error.response?.data?.message || error.message || "Something went wrong")
      );
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              {/* React Quill */}
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} max={50} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} max={50} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                {/*   apartment condo house land townhouse commercial */}
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
                <option value="townhouse">Townhouse</option>
                <option value="townhouse">Commercial</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School Nearby</label>
              <input
                min={0}
                id="school"
                name="school"
                type="number"
                placeholder="300m"
              />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Stand</label>
              <input
                min={0}
                id="bus"
                name="bus"
                type="number"
                placeholder="500m"
              />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurants Nearby</label>
              <input
                min={0}
                id="restaurant"
                name="restaurant"
                type="number"
                placeholder="100m"
              />
            </div>
            <button className="sendButton">Add</button>
            {error && <span className="error">{error.message}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img key={index} src={image} alt="" />
        ))}
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
        <ToastContainer />
    </div>
  );
}

export default NewPost;
