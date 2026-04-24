import { useDispatch, useSelector } from "react-redux";
import { createNewRide } from "../../rideSlice";
import { selectCurrentUser } from "../../userSlice";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  notification,
  Row,
  Col,
} from "antd";
import { useState } from "react";
import {
  EnvironmentOutlined,
  SwapRightOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CarOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

function Post_Ride() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  // Remove unused storedUser

  const user = useSelector(selectCurrentUser);
  const isBlocked = user?.status !== "active";
  const postedByName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    user?.username ||
    "Unknown";

  const handleFinish = (values) => {
    if (isBlocked) {
      api.error({
        message: "Account Blocked",
        description:
          "Your account has been blocked. Please request to unblock from settings.",
        duration: 2.5,
        placement: "topRight",
      });
      return;
    }

    if (!user?._id) {
      api.error({
        message: "Login required",
        description: "Please log in again before posting a ride.",
        duration: 2.5,
        placement: "topRight",
      });
      return;
    }

    setLoading(true);

    // Generate numeric rideId based on timestamp
    const rideId = Date.now().toString();
    
    const ride = {
      ...values,
      rideId: rideId,
      driver_Name: postedByName,
      posted_by: postedByName,
      posted_person_email: user._id,
    };
    
    dispatch(createNewRide(ride))
      .then(() => {
        setLoading(false);
        api.success({
          message: "Ride Posted!",
          description: "Your ride offer has been posted successfully.",
          duration: 2.5,
          placement: "topRight",
        });
        form.resetFields();
      })
      .catch((error) => {
        setLoading(false);
        api.error({
          message: "Failed to Post Ride",
          description: error.message || "Unable to post ride. Please try again.",
          duration: 3,
          placement: "topRight",
        });
      });
  };

  const handleFinishFailed = () => {
    api.error({
      message: "Submission Failed",
      description: "Please check the form for errors and try again.",
      duration: 2.5,
      placement: "topRight",
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "2.5rem auto" }}>
      {contextHolder}
      <Card
        title={
          <span
            style={{
              fontWeight: 700,
              fontSize: 22,
              color: "#0f7a74",
              letterSpacing: 1,
            }}
          >
            <CarOutlined
              style={{ color: "#0f7a74", marginRight: 8, fontSize: 24 }}
            />
            Post a New Ride
          </span>
        }
        style={{
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(6,36,40,0.13)",
          background: "#fff",
        }}
      >
        {isBlocked && (
          <div style={{ marginBottom: 16, color: "red", fontWeight: 600 }}>
            Your account has been blocked. Please request to unblock from
            settings.
          </div>
        )}
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          disabled={isBlocked}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="pickup_location"
                label={<span>Pickup Location</span>}
                rules={[
                  { required: true, message: "Please enter pickup location" },
                ]}
              >
                <Input
                  placeholder="e.g. Lahore"
                  prefix={<EnvironmentOutlined style={{ color: "#0f7a74" }} />}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="drop_location"
                label={<span>Drop Location</span>}
                rules={[
                  { required: true, message: "Please enter drop location" },
                ]}
              >
                <Input
                  placeholder="e.g. Islamabad"
                  prefix={<SwapRightOutlined style={{ color: "#0f7a74" }} />}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="departure_time"
                label={<span>Departure Time</span>}
                rules={[
                  { required: true, message: "Please enter departure time" },
                  {
                    pattern: /^([0-9]{1,2}:[0-9]{2}\s?(AM|PM))$/i,
                    message: "Format: 10:00 AM",
                  },
                ]}
              >
                <Input
                  placeholder="e.g. 10:00 AM"
                  prefix={<ClockCircleOutlined style={{ color: "#0f7a74" }} />}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="avaialble_seats"
                label={<span>Available Seats</span>}
                rules={[
                  { required: true, message: "Please enter number of seats" },
                  {
                    type: "number",
                    min: 1,
                    max: 10,
                    message: "1-10 seats allowed",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="vehical_type"
                label={<span>Vehicle Type</span>}
                rules={[
                  { required: true, message: "Please enter vehicle type" },
                ]}
              >
                <Select
                  placeholder="Select vehicle type"
                  suffixIcon={<CarOutlined style={{ color: "#0f7a74" }} />}
                  options={[
                    { value: "SUV", label: "SUV" },
                    { value: "Sedan", label: "Sedan" },
                    { value: "Hatchback", label: "Hatchback" },
                    { value: "Van", label: "Van" },
                    { value: "Other", label: "Other" },
                  ]}
                  allowClear
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="contact_information"
                label={<span>Contact Information</span>}
                rules={[
                  { required: true, message: "Please enter contact info" },
                  {
                    pattern: /^[0-9\-\s+()]{7,20}$/,
                    message: "Enter a valid phone number",
                  },
                ]}
              >
                <Input
                  placeholder="e.g. 123-456-7890"
                  prefix={<PhoneOutlined style={{ color: "#0f7a74" }} />}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="Notes"
            label={
              <span>
                <InfoCircleOutlined /> Notes
              </span>
            }
          >
            <TextArea
              rows={2}
              placeholder="Any special notes? (optional)"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 17,
                background: "#0f7a74",
                border: "none",
                boxShadow: "0 2px 8px #0f7a7422",
              }}
            >
              <CarOutlined style={{ marginRight: 8 }} /> Post Ride
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Post_Ride;
