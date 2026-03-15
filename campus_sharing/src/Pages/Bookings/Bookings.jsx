import { Skeleton, Table, Alert } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isBlocked = user?.status !== "Active";
  const bookings = useSelector((state) => state.ride.booking);
  const bookingsData = bookings.filter((b) => b.booked_by === user?.email);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const columns = [
    { title: "Pickup", dataIndex: "pickup_location", key: "pickup_location" },
    { title: "Drop", dataIndex: "drop_location", key: "drop_location" },
    {
      title: "Departure Time",
      dataIndex: "departure_time",
      key: "departure_time",
    },
    {
      title: "Contact",
      dataIndex: "contact_information",
      key: "contact_information",
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
      <Table dataSource={bookingsData} columns={columns} rowKey="rideId" />
    </Skeleton>
  );
}

export default Bookings;
