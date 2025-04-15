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
import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loaders.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";
import AuthPageWrapper from "./components/animatedRoutes/AnimatedRoutes.jsx";

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
          path: "/list/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/about-us",
          element: <div>About</div>,
        },
        {
          path: "/contact",
          element: <div>Contact</div>,
        },
        {
          path: "/login",
          element: (
            <AuthPageWrapper>
              <Login />
            </AuthPageWrapper>
          ),
        },
        {
          path: "/register",
          element: (
            <AuthPageWrapper>
              <Register />
            </AuthPageWrapper>
          ),
        },
        //  404 page
        {
          path: "*",
          element: <div>404</div>,
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
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/profile/addpost",
          element: <NewPostPage />,
        },
      ],
    },
  ]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggabl
        pauseOnHover={false}
      />
    </AnimatePresence>
  );
}

export default App;
