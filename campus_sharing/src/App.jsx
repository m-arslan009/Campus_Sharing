import "./App.css";
import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
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

function PublicRoute({ children }) {
  const isAuthenticated = Boolean(useSelector((state) => state.user.token));
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(useSelector((state) => state.user.token));
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      { path: "rides", element: <Rides /> },
      {
        path: "bookings",
        element: (
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "create_ride",
        element: (
          <ProtectedRoute>
            <Post_Ride />
          </ProtectedRoute>
        ),
      },
      {
        path: "request_ride",
        element: (
          <ProtectedRoute>
            <Request_Rides />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
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
