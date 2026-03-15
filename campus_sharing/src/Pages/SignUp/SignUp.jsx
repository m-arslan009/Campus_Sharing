import { Button, Form, Input, Select, Spin, notification } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import style from "./signup.module.css";
import { useDispatch } from "react-redux";
import { addUser } from "../../userSlice";
import { useState } from "react";

export default function SignUp() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  function onFinish(values) {
    setIsLoading(true);
    const { firstName, lastName, ...rest } = values;
    const user = {
      ...rest,
      name: `${firstName} ${lastName}`,
      status: "Active",
    };
    setTimeout(() => {
      dispatch(addUser(user));
      api.success({
        message: "Account Created!",
        description:
          "Welcome aboard! Your Campus Sharing account is ready to use.",
        duration: 3,
        placement: "topRight",
      });
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  }

  function onFinishFailed(errorInfo) {
    api.error({
      message: "Sign Up Failed",
      description: "Please fill in all required fields correctly.",
      duration: 3,
      placement: "topRight",
    });
    //
  }

  return (
    <Spin spinning={isLoading} description="Creating Account. Please Wait">
      <main className={style.page}>
        {contextHolder}

        <div className={style.card}>
          <p className={style.badge}>Campus Sharing</p>

          <h1 className={style.formHeading}>Create Your Account</h1>
          <p className={style.formText}>
            Join thousands of students sharing rides across campus every day.
          </p>

          <Form
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark={false}
          >
            {/* Row 1: First + Last name */}
            <div className={style.twoCol}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Enter your first name" }]}
              >
                <Input
                  placeholder="Ali"
                  size="large"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Enter your last name" }]}
              >
                <Input
                  placeholder="Khan"
                  size="large"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </div>

            {/* Row 2: Username + Email */}
            <div className={style.twoCol}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Choose a username" }]}
              >
                <Input
                  placeholder="alikhan99"
                  size="large"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  placeholder="you@campus.edu"
                  size="large"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </div>

            {/* Row 3: Password + Confirm Password */}
            <div className={style.twoCol}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Minimum 6 characters" },
                ]}
              >
                <Input.Password
                  placeholder="Create password"
                  size="large"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Repeat password"
                  size="large"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
            </div>

            {/* Role */}
            <Form.Item
              name="role"
              label="I am joining as"
              rules={[{ required: true, message: "Please select your role" }]}
            >
              <Select
                size="large"
                placeholder="Select your role"
                options={[
                  {
                    value: "Driver",
                    label: (
                      <span>
                        <CarOutlined style={{ marginRight: 8 }} />
                        Driver
                      </span>
                    ),
                  },
                  {
                    value: "Student",
                    label: (
                      <span>
                        <TeamOutlined style={{ marginRight: 8 }} />
                        Student
                      </span>
                    ),
                  },
                ]}
              />
            </Form.Item>

            {/* Submit */}
            <Form.Item className={style.submitWrap}>
              <Button type="primary" size="large" htmlType="submit" block>
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <p className={style.loginPrompt}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </main>
    </Spin>
  );
}
