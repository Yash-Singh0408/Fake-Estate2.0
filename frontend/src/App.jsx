import Homepage from "./pages/homePage/Homepage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./pages/listPage/ListPage.jsx";
import { Layout, RequireAuth } from "./pages/layout/Layout.jsx";
import SinglePage from "./pages/singlePage/SinglePage.jsx";
import Profile from "./pages/profilePage/Profile.jsx";
import Register from "./pages/registerPage/Register.jsx";
import Login from "./pages/loginPage/Login.jsx";
import ProfileUpdatePage from "./pages/profileUpdatePage/ProfileUpdatePage.jsx";
import NewPostPage from "./pages/newPostPage/NewPost.jsx";
import { listPageLoader, singlePageLoader } from "./lib/loaders.js";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/about",
          element: <div>About</div>,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path:"/profile/addpost",
          element: <NewPostPage/>,
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
