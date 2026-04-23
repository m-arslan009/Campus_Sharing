import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Tag,
  Space,
  Divider,
  Alert,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import styles from "./profile.module.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className={styles.profileBg}>
        <Card className={styles.profileCard}>
          <Text type="secondary">No user data found.</Text>
        </Card>
      </div>
    );
  }
  const isBlocked = user?.status?.toLowerCase() !== "active";
  if (isBlocked) {
    return (
      <div className={styles.profileBg}>
        <Card className={styles.profileCard}>
          <Alert
            title="Account Blocked"
            description="Your account has been blocked. Please request to unblock from settings."
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.profileBg}>
      <Card
        className={styles.profileCard}
        variant={false}
        style={{
          maxWidth: 420,
          margin: "2rem auto",
          boxShadow: "0 8px 32px rgba(6,36,40,0.13)",
        }}
        cover={
          <div
            style={{
              height: 110,
              background: "linear-gradient(120deg, #0f7a74 60%, #2fd9c7 100%)",
            }}
          />
        }
        actions={[
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate("/settings")}
            key="edit"
            size="medium"
            style={{
              borderRadius: 8,
              background: "#0f7a74",
              border: "none",
              boxShadow: "0 2px 8px #0f7a7422",
            }}
          >
            Edit Profile
          </Button>,
        ]}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: -55,
          }}
        >
          <Avatar
            size={110}
            src={user.profileImageUrl}
            icon={!user.profileImageUrl && <UserOutlined />}
            style={{
              border: "5px solid #fff",
              background: "#e6f7f6",
              marginBottom: 8,
            }}
          >
            {!user.profileImageUrl && user.name ? user.name[0] : null}
          </Avatar>
          <Title level={3} style={{ marginBottom: 0 }}>
            {user.name}
          </Title>
          <Text type="secondary" style={{ marginBottom: 4 }}>
            {user.email}
          </Text>
          <Tag color="cyan" style={{ marginBottom: 12, fontWeight: 600 }}>
            {user.role}
          </Tag>
        </div>
        <Divider style={{ margin: "12px 0" }} />
        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
          {user.username && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Username</Text>
              <Text>{user.username}</Text>
            </div>
          )}
          {user.status && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Status</Text>
              <Text>{user.status}</Text>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}

export default Profile;
