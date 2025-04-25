import Homepage from "./pages/homePage/Homepage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./pages/listPage/ListPage.jsx";
import { AdminLayout, Layout, RequireAuth } from "./pages/layout/Layout.jsx";
import SinglePage from "./pages/singlePage/SinglePage.jsx";
import Profile from "./pages/profilePage/Profile.jsx";
import Register from "./pages/registerPage/Register.jsx";
import Login from "./pages/loginPage/Login.jsx";
import ProfileUpdatePage from "./pages/profileUpdatePage/ProfileUpdatePage.jsx";
import NewPostPage from "./pages/newPostPage/NewPost.jsx";
import {
  editPostLoader,
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loaders.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";
import AuthPageWrapper from "./components/animatedRoutes/AnimatedRoutes.jsx";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import AdminPage from "./pages/adminPage/AdminPage.jsx";
import UserPage from "./pages/userPage/UserPage.jsx";
import AdminlistPage from "./pages/adminListPage/AdminlistPage.jsx";
import EditPost from "./pages/editPostPage/EditPost.jsx";
import PageNotFound from "./404/PageNotFound.jsx";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
          element: <PageNotFound />,
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
        {
          path: "/profile/editpost/:id",
          element: <EditPost />,
          loader:editPostLoader
        }
      ],
    },
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        {
         path: "/admin",
         element: <AdminPage /> 
        },
        {
          path:"/admin/updateProfile",
          element: <ProfileUpdatePage />
        },
        {
          path:"/admin/users",
          element: <UserPage />
        },
        {
          path:"/admin/properties",
          element: <AdminlistPage />
        }
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
