import { Button, Card, Form, Input, notification } from "antd";
import style from "./settings.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser, updateUserStatus } from "../../userSlice";

function Settings() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(sessionStorage.getItem("user")),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  function onFinish(values) {
    const { confirmPassword: _confirmPassword, ...rest } = values;
    const updatedUser = {
      ...userInfo,
      ...rest,
      email: userInfo.email,
    };
    dispatch(updateUser(updatedUser, userInfo._id))
      .then((savedUser) => {
        const { password: _password, ...userToStore } = savedUser;
        sessionStorage.setItem("user", JSON.stringify(userToStore));
        setUserInfo(userToStore);
        api.success({
          message: "Profile Updated",
          description: "Your account information has been updated.",
          duration: 3,
          placement: "topRight",
        });
      })
      .catch((error) => {
        api.error({
          message: "Update Failed",
          description: error.message || "Unable to update profile.",
          duration: 3,
          placement: "topRight",
        });
      });
  }

  function onFinishFailed() {
    api.error({
      message: "Update Failed",
      description: "Please check the form and try again.",
      duration: 3,
      placement: "topRight",
    });
  }

  const isBlocked = userInfo?.status?.toLowerCase() !== "active";

  function handleRequestUnblock() {
    dispatch(updateUserStatus(userInfo.email, "active"))
      .then((savedStatus) => {
        const nextUser = {
          ...userInfo,
          status: savedStatus?.user?.status || "active",
        };
        sessionStorage.setItem("user", JSON.stringify(nextUser));
        setUserInfo(nextUser);
        api.success({
          message: "Request Sent",
          description: "Your account has been unblocked.",
          duration: 1.5,
          placement: "topRight",
        });
      })
      .catch((error) => {
        api.error({
          message: "Request Failed",
          description: error.message || "Unable to update status.",
          duration: 3,
          placement: "topRight",
        });
      });
  }

  return (
    <div className={style.page}>
      {contextHolder}
      <div className={style.container}>
        <Card>
          {isBlocked && (
            <div style={{ marginBottom: 16, color: "red", fontWeight: 600 }}>
              Your account has been blocked. Please request to unblock.
              <br />
              <Button
                type="primary"
                onClick={handleRequestUnblock}
                style={{ marginTop: 8 }}
              >
                Request to Unblock
              </Button>
            </div>
          )}
          <Form
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={userInfo}
            disabled={isBlocked}
          >
            <Form.Item
              name={"username"}
              label={"Username"}
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input
                placeholder="New Username"
                variant="outlined"
                size="large"
              />
            </Form.Item>
            <Form.Item name={"email"} label={"Email"}>
              <Input
                placeholder="New Email"
                variant="outlined"
                size="large"
                disabled
              />
            </Form.Item>
            <Form.Item
              name={"password"}
              label={"New Password"}
              rules={[
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                placeholder="Enter New Password"
                variant="outlined"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name={"confirmPassword"}
              label={"Confirm Password"}
              dependencies={["password"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm New Password"
                variant="outlined"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" htmlType="submit">
                Save Change
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
