import { Button, Form, Input, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import style from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user);

  function onFinish(values) {
    const user = users.find(
      (u) => u.email === values.email && u.password === values.password,
    );
    if (user) {
      const { password, confirmPassword, ...userToStore } = user;
      sessionStorage.setItem("user", JSON.stringify(userToStore));
      api.success({
        message: "Login Successful",
        description: "You have successfully logged in to your account.",
        duration: 3,
        placement: "topRight",
      });
      navigate("/dashboard", { replace: true });
    } else {
      api.error({
        message: "Login Failed",
        description: "Invalid email or password.",
        duration: 3,
        placement: "topRight",
      });
    }
  }

  function onFinishFailed(error) {
    api.error({
      message: "Login Failed",
      description:
        error.message || "Please check your credentials and try again.",
      duration: 3,
      placement: "topRight",
    });
  }

  return (
    <main className={style.page}>
      {contextHolder}
      <div className={style.card}>
        <p className={style.badge}>Campus Sharing</p>
        <h1 className={style.formHeading}>Welcome Back</h1>
        <p className={style.formText}>
          Log in to manage rides, requests, and trip updates.
        </p>
        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email field cannot be empty" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
              placeholder="you@campus.edu"
              size="large"
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password field cannot be empty" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item className={style.submitWrap}>
            <Button type="primary" size="large" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <p className={style.signupPrompt}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
