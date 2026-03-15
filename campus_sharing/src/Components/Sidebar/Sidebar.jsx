import { Button, Layout, Menu, Typography, message } from "antd";
import {
  DashboardOutlined,
  CarOutlined,
  InboxOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./sidebar.module.css";

const { Sider } = Layout;
const { Title, Paragraph } = Typography;

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedKey = pathname.split("/")[1] || "dashboard";
  function onLogout() {
    sessionStorage.clear();
    navigate("/");
  }

  function onRide() {
    if (sessionStorage.getItem("isLogin")) {
      navigate("/login");
    } else {
      navigate("/rides");
    }
  }

  const sidebarItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "users", icon: <UsergroupAddOutlined />, label: "Users" },
    { key: "rides", icon: <CarOutlined />, label: "Rides" },
    { key: "bookings", icon: <InboxOutlined />, label: "Bookings" },
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "create_ride", icon: <PlusCircleOutlined />, label: "Post Ride" },
    { key: "request_ride", icon: <FileTextOutlined />, label: "Request Rides" },
    { key: "signup", icon: <UsergroupAddOutlined />, label: "Sign Up" },
  ];

  return (
    <Sider
      width={260}
      className={styles.sider}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className={styles.brandWrap}>
        <Title level={4} className={styles.brandTitle}>
          Campus Sharing
        </Title>
        <Paragraph className={styles.brandTagline}>Starter Dashboard</Paragraph>
      </div>

      <div className={styles.bodyWrap}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={sidebarItems}
          className={styles.menu}
          onSelect={({ key }) => {
            if (key === "signup") {
              const user = sessionStorage.getItem("user");
              if (!user) {
                navigate("/signup");
              } else {
                message.info("Logout to move on sign up page");
              }
            } else {
              navigate(`/${key}`);
            }
          }}
        />

        <div className={styles.logoutWrap}>
          <Button
            size="large"
            icon={<LogoutOutlined />}
            className={styles.logoutButton}
            onClick={onLogout}
            block
          >
            Logout
          </Button>
        </div>
      </div>
    </Sider>
  );
}

export default Sidebar;
