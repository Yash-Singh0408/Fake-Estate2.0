
import apiRequest from "./apiRequest";


export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/getPost/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts/getAllPosts?" + query);
  return { postResponse: postPromise };
};