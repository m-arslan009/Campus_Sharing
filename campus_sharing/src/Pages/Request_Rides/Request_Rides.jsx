import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Alert,
  Button,
  Select,
  Skeleton,
  Space,
  Table,
  notification,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Ride_Detail from "../../Components/RideDetail/Ride_Detail";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  acceptRideRequest,
  createNewRequest,
  getRequestQueueByUser,
  updateRequest,
  rejectRideRequest,
} from "../../requestSlice";

const cities = [
  { value: "Islamabad", label: "Islamabad" },
  { value: "Lahore", label: "Lahore" },
  { value: "Karachi", label: "Karachi" },
  { value: "Peshawar", label: "Peshawar" },
  { value: "Quetta", label: "Quetta" },
  { value: "Multan", label: "Multan" },
  { value: "Faisalabad", label: "Faisalabad" },
  { value: "Rawalpindi", label: "Rawalpindi" },
  { value: "Sialkot", label: "Sialkot" },
  { value: "Gujranwala", label: "Gujranwala" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Bahawalpur", label: "Bahawalpur" },
  { value: "Sukkur", label: "Sukkur" },
  { value: "Abbottabad", label: "Abbottabad" },
  { value: "Mardan", label: "Mardan" },
  { value: "Sargodha", label: "Sargodha" },
  { value: "Jhelum", label: "Jhelum" },
  { value: "Dera Ghazi Khan", label: "Dera Ghazi Khan" },
  { value: "Mirpur", label: "Mirpur" },
  { value: "Muzaffarabad", label: "Muzaffarabad" },
];

function Request_Rides() {
  const [api, contextHolder] = notification.useNotification();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isBlocked = user?.status !== "active";
  const dispatch = useDispatch();
  const data = useSelector((state) => state.request.bookingQueue);
  const navigate = useNavigate();
  const location = useLocation();

  const [dataSource, setDataSource] = useState(data);
  const [selectedRide, setSelectedRide] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [pickup_loc, setPickup_loc] = useState("");
  const [drop_loc, setDrop_loc] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate, location]);

  useEffect(() => {
    if (user?._id || user?.email) {
      dispatch(getRequestQueueByUser(user._id || user.email)).catch(() => {});
    }
  }, [dispatch, user?._id, user?.email]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(data.filter((ride) => ride.avaialble_seats > 0));
      setLoading(false);
    }, 1000);
  }, [data]);

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

  useEffect(() => {
    const pickup = searchParams?.get("pickup_location") ?? null;
    const drop = searchParams?.get("drop_location") ?? null;
    const departure = searchParams?.get("departure_time") ?? null;
    let filtered = data.filter((ride) => ride.avaialble_seats > 0);
    if (pickup && drop && departure) {
      filtered = filtered
        .filter(
          (ride) => ride.pickup_location.toLowerCase() === pickup.toLowerCase(),
        )
        .filter(
          (ride) => ride.drop_location.toLowerCase() === drop.toLowerCase(),
        )
        .filter(
          (ride) =>
            ride.departure_time.toLowerCase() === departure.toLowerCase(),
        );
    }
    setDataSource(filtered);
  }, [searchParams, data]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  function viewRideDetail(record) {
    setSelectedRide(record);
    setModalOpen(true);
    setSearchParams({ rideId: record.rideId, rideStatus: record.status });
  }

  function handleClose() {
    setModalOpen(false);
    setSelectedRide(null);
    setSearchParams({});
  }

  function handleAccept(requestId) {
    const request = data.find(
      (item) => item.requestId === requestId || item._id === requestId,
    );

    if (!request) return;

    dispatch(updateRequest({ ...request, status: "accepted" }))
      .then((message) => {
        dispatch(acceptRideRequest(requestId));
        api.success({
          message: message || "Request Accepted",
          description: "The ride request has been accepted.",
          duration: 1.5,
          placement: "topRight",
        });
      })
      .catch((error) => {
        api.error({
          message: "Request Update Failed",
          description: error.message,
          duration: 1.5,
          placement: "topRight",
        });
      });
  }

  function handleReject(requestId) {
    const request = data.find(
      (item) => item.requestId === requestId || item._id === requestId,
    );

    if (!request) return;

    dispatch(updateRequest({ ...request, status: "rejected" }))
      .then((message) => {
        dispatch(rejectRideRequest(requestId));
        api.info({
          message: message || "Request Rejected",
          description: "The ride request has been rejected.",
          duration: 1.5,
          placement: "topRight",
        });
      })
      .catch((error) => {
        api.error({
          message: "Request Update Failed",
          description: error.message,
          duration: 1.5,
          placement: "topRight",
        });
      });
  }

  function handleSearch() {
    if (pickup_loc && drop_loc && time) {
      setSearchParams({
        pickup_location: pickup_loc,
        drop_location: drop_loc,
        departure_time: time,
      });
    } else {
      setSearchParams({});
    }
  }

  function handleAddBooking(record) {
    const requestPayload = {
      status: "pending",
      ride_detail: record._id || record.rideId,
      booked_by: user?.email || "",
    };

    dispatch(createNewRequest(requestPayload))
      .then((message) => {
        api.success({
          title: "Ride Booked",
          description:
            message ||
            `You have booked a ride from ${record.pickup_location} to ${record.drop_location}`,
          duration: 1.5,
          placement: "topRight",
        });
        handleClose();
      })
      .catch((error) => {
        api.error({
          title: "Request Failed",
          description: error.message,
          duration: 1.5,
          placement: "topRight",
        });
      });
  }

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
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => viewRideDetail(record)}
          />
          <Button
            type="primary"
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
            onClick={() => handleAccept(record.requestId)}
          >
            <CheckCircleOutlined />
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleReject(record.requestId)}
          >
            <CloseCircleOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Select
        onChange={(value) => setPickup_loc(value)}
        allowClear
        placeholder="Pickup Location"
        style={{ width: 200, marginRight: 16, marginBottom: 20 }}
        options={cities}
      />
      <Select
        onChange={(value) => setDrop_loc(value)}
        allowClear
        placeholder="Drop Location"
        style={{ width: 200, marginBottom: 20, marginRight: 16 }}
        options={cities}
      />
      <Select
        onChange={(value) => setTime(value)}
        allowClear
        placeholder="Time"
        style={{ width: 200, marginBottom: 20, marginRight: 16 }}
        options={[
          { value: "08:00 AM", label: "08:00 AM" },
          { value: "09:00 AM", label: "09:00 AM" },
          { value: "10:00 AM", label: "10:00 AM" },
          { value: "11:00 AM", label: "11:00 AM" },
          { value: "12:00 PM", label: "12:00 PM" },
          { value: "01:00 PM", label: "01:00 PM" },
          { value: "02:00 PM", label: "02:00 PM" },
          { value: "03:00 PM", label: "03:00 PM" },
          { value: "04:00 PM", label: "04:00 PM" },
          { value: "05:00 PM", label: "05:00 PM" },
          { value: "06:00 PM", label: "06:00 PM" },
          { value: "07:00 PM", label: "07:00 PM" },
          { value: "08:00 PM", label: "08:00 PM" },
        ]}
      />
      <Button icon={<SearchOutlined />} onClick={handleSearch}>
        Search
      </Button>
      {contextHolder}
      <Skeleton active loading={loading}>
        <h1>Requests to Book a Ride</h1>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="rideId"
          pagination={{ pageSize: 8 }}
        />
        <Ride_Detail
          record={selectedRide}
          open={modalOpen}
          handleAddBooking={handleAddBooking}
          onClose={handleClose}
        />
      </Skeleton>
    </>
  );
}

export default Request_Rides;
