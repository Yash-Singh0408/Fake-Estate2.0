import Homepage from "./pages/homePage/Homepage.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ListPage from "./pages/listPage/ListPage.jsx";
import Layout from "./pages/layout/Layout.jsx";
import SinglePage from "./pages/singlePage/SinglePage.jsx";

function App() {
  const router = createBrowserRouter([
    {
     path: "/",
     element: <Layout/>,
     children: [
       {
        path: "/",
        element: <Homepage/>
       },
       {
        path: "/list",
        element: <ListPage/>
       },
       {
        path:"/:id",
        element:<SinglePage/>
       },
       {
        path:"/about",
        element: <div>About</div>
       }
     ]
    },
 
  ]);

  return (
   
    <RouterProvider router={router} />
  );
}

export default App;
