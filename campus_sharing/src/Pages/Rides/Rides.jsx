import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  AutoComplete,
  Select,
  Skeleton,
  Space,
  Table,
  notification,
} from "antd";
import { DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Ride_Detail from "../../Components/RideDetail/Ride_Detail";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteRide, getAllRides } from "../../rideSlice";
import { createNewRequest, deleteRequestsByRideId } from "../../requestSlice";
import { selectCurrentUser } from "../../userSlice";

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

function Rides() {
  const [api, contextHolder] = notification.useNotification();
  const user = useSelector(selectCurrentUser);
  const token = useSelector((state) => state.user.token);
  const isBlocked = token && user?.status?.toLowerCase() !== "active";
  const dispatch = useDispatch();
  const data = useSelector((state) => state.ride.data);
  const navigate = useNavigate();

  const [selectedRide, setSelectedRide] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [pickup_loc, setPickup_loc] = useState("");
  const [drop_loc, setDrop_loc] = useState("");
  const [time, setTime] = useState("");

  const getSeats = (ride) =>
    ride?.avaialble_seats ?? ride?.available_seats ?? 0;

  useEffect(() => {
    dispatch(getAllRides()).catch(() => {});
  }, [dispatch]);

  const dataSource = useMemo(() => {
    const pickup = searchParams?.get("pickup_location") ?? null;
    const drop = searchParams?.get("drop_location") ?? null;
    const departure = searchParams?.get("departure_time") ?? null;

    let filtered = data.filter((ride) => getSeats(ride) > 0);

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

    return filtered;
  }, [data, searchParams]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timerId);
  }, []);

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

  function viewRideDetail(record) {
    setSelectedRide(record);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setSelectedRide(null);
  }

  async function handleDelete(rideId) {
    try {
      await dispatch(deleteRequestsByRideId(rideId));
    } catch {
      // Continue even when no related requests exist.
    }

    try {
      await dispatch(deleteRide(rideId));
      api.success({
        message: "Ride Deleted",
        description: "Ride and related requests deleted successfully.",
        duration: 1.5,
        placement: "topRight",
      });
    } catch (error) {
      api.error({
        message: "Delete Failed",
        description: error.message || "Unable to delete ride.",
        duration: 2,
        placement: "topRight",
      });
    }
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
    if (!token) {
      api.info({
        message: "Login required",
        description: "Please log in before booking a ride.",
        duration: 1.5,
        placement: "topRight",
      });
      navigate("/login");
      return;
    }

    const requestPayload = {
      ride_detail: record._id || record.rideId,
      status: "pending",
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
          title: "Booking Failed",
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => viewRideDetail(record)}
          />
          {user?.role === "organizer" && (
            <Button
              type="default"
              icon={<DeleteOutlined />}
              style={{ color: "red", borderColor: "red" }}
              onClick={() => handleDelete(record._id || record.rideId)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <AutoComplete
        onChange={(value) => setPickup_loc(value)}
        allowClear
        placeholder="Type or select pickup city"
        style={{ width: 200, marginRight: 16, marginBottom: 20 }}
        options={cities}
      />
      <AutoComplete
        onChange={(value) => setDrop_loc(value)}
        allowClear
        placeholder="Type or select drop city"
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
        <h1>Book a Ride</h1>
        <Alert
          type="info"
          description="Check full detail to book a ride"
          showIcon
          style={{ marginBottom: "20px" }}
        />
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
          canBook={Boolean(token)}
          onClose={handleClose}
        />
      </Skeleton>
    </>
  );
}

export default Rides;
