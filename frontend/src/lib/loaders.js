
import apiRequest from "./apiRequest";

// Single Page Data Loader
export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/getPost/" + params.id);
  return res.data;
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