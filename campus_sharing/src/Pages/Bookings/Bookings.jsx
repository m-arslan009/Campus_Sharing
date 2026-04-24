import { Skeleton, Table, Alert } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBookingsByUser } from "../../requestSlice";
import { selectCurrentUser } from "../../userSlice";

function Bookings() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector((state) => state.user.token);
  const isBlocked = user?.status?.toLowerCase() !== "active";
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.request.booking);
  const bookingsData = bookings;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    if (user?._id || user?.email) {
      dispatch(getBookingsByUser(user._id || user.email)).catch(() => {});
    }
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [dispatch, navigate, token, user?._id, user?.email]);

  const columns = [
    {
      title: "Pickup",
      key: "pickup_location",
      render: (_, record) =>
        record.ride_detail?.pickup_location || record.pickup_location || "",
    },
    {
      title: "Drop",
      key: "drop_location",
      render: (_, record) =>
        record.ride_detail?.drop_location || record.drop_location || "",
    },
    {
      title: "Departure Time",
      key: "departure_time",
      render: (_, record) =>
        record.ride_detail?.departure_time || record.departure_time || "",
    },
    {
      title: "Contact",
      key: "contact_information",
      render: (_, record) =>
        record.ride_detail?.contact_information ||
        record.contact_information ||
        "",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        if (status === "Pending" || status === "pending") {
          return (
            <span
              style={{
                color: "#ad8b00",
                background: "#fffbe6",
                padding: "2px 10px",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Pending
            </span>
          );
        } else if (status === "Accepted" || status === "accepted") {
          return (
            <span
              style={{
                color: "#389e0d",
                background: "#f6ffed",
                padding: "2px 10px",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Accepted
            </span>
          );
        } else if (status === "Rejected" || status === "rejected") {
          return (
            <span
              style={{
                color: "#cf1322",
                background: "#fff1f0",
                padding: "2px 10px",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Rejected
            </span>
          );
        } else {
          return status;
        }
      },
    },
  ];

  if (isBlocked) {
    return (
      <div style={{ maxWidth: 600, margin: "2.5rem auto" }}>
        <Alert
          message="Account Blocked"
          description="Your account has been blocked. Please request to unblock from settings."
          type="error"
          showIcon
        />
      </div>
    );
  }
  return (
    <Skeleton loading={isLoading}>
      <Table
        dataSource={bookingsData}
        columns={columns}
        rowKey={(record) => record.requestId || record._id}
      />
    </Skeleton>
  );
}

export default Bookings;
