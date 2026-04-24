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
  LoginOutlined,
} from "@ant-design/icons";
import { logoutUser, selectCurrentUser, selectAuthToken } from "../../userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sidebar.module.css";

const { Sider } = Layout;
const { Title, Paragraph } = Typography;

function Sidebar() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedKey = pathname.split("/")[1] || "dashboard";
  async function onLogout() {
    await dispatch(logoutUser());
    navigate("/login");
  }
  
  const guestSidebarItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "rides", icon: <CarOutlined />, label: "Rides" },
    { key: "login", icon: <LoginOutlined />, label: "Login" },
    { key: "signup", icon: <UsergroupAddOutlined />, label: "Sign Up" },
  ];

  const organizerSidebarItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "rides", icon: <CarOutlined />, label: "Rides" },
    { key: "create_ride", icon: <PlusCircleOutlined />, label: "Post Ride" },
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "request_ride", icon: <FileTextOutlined />, label: "Request Rides" },
    {key:"settings", icon: <SettingOutlined />, label: "Settings"},
    { key: "signup", icon: <UsergroupAddOutlined />, label: "Sign Up" },
  ];
  
  const studentSidebarItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "rides", icon: <CarOutlined />, label: "Rides" },
    { key: "bookings", icon: <InboxOutlined />, label: "Bookings" },
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "signup", icon: <UsergroupAddOutlined />, label: "Sign Up" },
  ]

  const sidebarItems = !token
    ? guestSidebarItems
    : currentUser?.role === "organizer"
      ? organizerSidebarItems
      : studentSidebarItems;

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
            if (key === "login") {
              navigate("/login");
              return;
            }
            if (key === "signup") {
              if (!token) {
                navigate("/signup");
              } else {
                message.info("Logout to move on sign up page");
              }
            } else {
              navigate(`/${key}`);
            }
          }}
        />

        {token && (
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
        )}
      </div>
    </Sider>
  );
}

export default Sidebar;
