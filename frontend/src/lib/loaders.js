
import apiRequest from "./apiRequest";

// Utility function to simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Single Page Data Loader
export const singlePageLoader = async ({ params }) => {
  const promise = apiRequest.get(`/posts/getPost/${params.id}`).then(res => res.data);
  return {
    post: promise,
  };
};

// List Page Data Loader
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts/getAllPosts?" + query);
  return { postResponse: postPromise };
};

// Profile Page Data Loader
export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts")
  const chatPromise = apiRequest("/chats")
  return {
     postResponse: postPromise,
     chatResponse: chatPromise
     };
}