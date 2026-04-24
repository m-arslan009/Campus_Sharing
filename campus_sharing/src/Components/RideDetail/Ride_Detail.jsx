import { Modal, Button, Card, Typography, Divider } from "antd";
import {
  CarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
import User_Detail from "../UserDetail/User_Detail";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Ride_Detail({
  record, 
  open,
  onClose,
  handleAddBooking,
  canBook = true,
}) {
  console.log("Ride Detail Record:", record);

  function handleOnOk() {
    handleAddBooking(record);
  }
  function handleOnCancel() {
    onClose();
  }

  // State for showing user detail drawer
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [userDetailRecord, setUserDetailRecord] = useState(null);
  const [searchParam] = useSearchParams();

  const status = searchParam.get("status");

  function handleProfileView(email) {
    if (!record?.posted_person_email) return;
    setUserDetailRecord(record.posted_person_email);
    setUserDetailOpen(true);
  }

  return (
    <>
      <Modal
        open={open}
        onCancel={handleOnCancel}
        footer={null}
        centered
        width={420}
      >
        {record && (
          <Card>
            <Title level={4} style={{ marginBottom: 8 }}>
              Ride Details
            </Title>
            <Text
              type="secondary"
              style={{ fontSize: 15, marginBottom: 16, display: "block" }}
            >
              <CarOutlined /> {record.vehicle_type} &nbsp; {" "}
            </Text>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{ marginBottom: 12 }}>
              <Text>
                <EnvironmentOutlined /> <b>Pickup:</b> {record.pickup_location}
              </Text>
              <br />
              <Text>
                <EnvironmentOutlined /> <b>Drop:</b> {record.drop_location}
              </Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text>
                <ClockCircleOutlined /> <b>Departure:</b>{" "}
                {record.departure_time}
              </Text>
              <br />
              <Text>
                <TeamOutlined /> <b>Seats:</b>{" "}
                {record.available_seats > 0 ? (
                  record.available_seats
                ) : (
                  <p style={{ color: "red" }}>No Seat Available</p>
                )}
              </Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text>
                <PhoneOutlined /> <b>Contact:</b> {record.contact_information}
              </Text>
              <br />
              <Text>
                <InfoCircleOutlined /> <b>Posted By:</b> {record.posted_person_email?.email || "Unknown"}
                {record.posted_person_email && (
                  <Button
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={() =>
                      handleProfileView(record.posted_person_email.email)
                    }
                  >
                    View Profile
                  </Button>
                )}
              </Text>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            {record.notes && (
              <div style={{ marginBottom: 12 }}>
                <Text>
                  <InfoCircleOutlined /> <b>Additional Details:</b>{" "}
                  {record.notes}
                </Text>
              </div>
            )}
            <Button
              type="primary"
              block
              size="large"
              style={{
                marginTop: 16,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
              onClick={handleOnOk}
              disabled={record.available_seats <= 0 ? true : false}
            >
              {!canBook
                ? "Login to Book"
                : status && status == "Pending"
                ? "Accept Ride Request"
                : "Book this ride"}
            </Button>
            <Button
              block
              size="large"
              style={{
                marginTop: 8,
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 15,
                background: "#fff",
                border: "1px solid #d9d9d9",
              }}
              onClick={handleOnCancel}
            >
              {status && status == "Pending"
                ? "Reject Ride Request"
                : "Back to rides"}
            </Button>
          </Card>
        )}
      </Modal>
      <User_Detail
        record={userDetailRecord}
        open={userDetailOpen}
        onClose={() => setUserDetailOpen(false)}
      />
    </>
  );
}
