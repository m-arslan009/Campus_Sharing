import "./App.css";
import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Rides from "./Pages/Rides/Rides";
import Bookings from "./Pages/Bookings/Bookings";
import Profile from "./Pages/Profile/Profile";
import Settings from "./Pages/Settings/Settings";
import Users from "./Pages/Users/Users";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import Post_Ride from "./Pages/Post_RIde/Post_Ride";
import Request_Rides from "./Pages/Request_Rides/Request_Rides";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "rides",
        element: <Rides />,
      },
      {
        path: "bookings",
        element: <Bookings />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "create_ride",
        element: <Post_Ride />,
      },
      {
        path: "request_ride",
        element: <Request_Rides />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  );
}

export default App;
