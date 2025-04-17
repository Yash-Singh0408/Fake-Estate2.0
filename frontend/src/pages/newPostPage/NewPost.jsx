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
      navigate("/list/" + res.data.id);
    } catch (error) {
      console.error(error);
      setError(
        toast.error(error.response?.data?.message || error.message || "Something went wrong")
      );
    }
  };

  return (
    <div className="newPostPage">
      <div className="newPostWrapper">
        <div className="newPostLeft">
          <h1>Add New Post</h1>
          <form onSubmit={handleSubmit}>
            <div className="formGrid">
              <div className="formItem"><label>Title</label><input name="title" type="text" /></div>
              <div className="formItem"><label>Price</label><input name="price" type="number" /></div>
              <div className="formItem"><label>Address</label><input name="address" type="text" /></div>
              <div className="formItem"><label>City</label><input name="city" type="text" /></div>
              <div className="formItem"><label>Bedroom Number</label><input name="bedroom" type="number" min="1" max="50" /></div>
              <div className="formItem"><label>Bathroom Number</label><input name="bathroom" type="number" min="1" max="50" /></div>
              <div className="formItem"><label>Latitude</label><input name="latitude" type="text" /></div>
              <div className="formItem"><label>Longitude</label><input name="longitude" type="text" /></div>
              <div className="formItem"><label>Type</label>
                <select name="type">
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>
              <div className="formItem"><label>Property</label>
                <select name="property">
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="formItem"><label>Utilities Policy</label>
                <select name="utilities">
                  <option value="owner">Owner is responsible</option>
                  <option value="tenant">Tenant is responsible</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
              <div className="formItem"><label>Pet Policy</label>
                <select name="pet">
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>
              <div className="formItem"><label>Income Policy</label><input name="income" type="text" placeholder="Income Policy" /></div>
              <div className="formItem"><label>Total Size (sqft)</label><input name="size" type="number" min="0" /></div>
              <div className="formItem"><label>School Nearby (m)</label><input name="school" type="number" placeholder="300m" min="0" /></div>
              <div className="formItem"><label>Bus Stand (m)</label><input name="bus" type="number" placeholder="500m" min="0" /></div>
              <div className="formItem"><label>Restaurants Nearby (m)</label><input name="restaurant" type="number" placeholder="100m" min="0" /></div>
            </div>

            <div className="formItem description">
              <label>Description</label>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>

            <button type="submit" className="submitBtn" >Add Post</button>
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

export default NewPost;
