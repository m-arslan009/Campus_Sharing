import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./appLayout.module.css";

const { Content } = Layout;

function AppLayout() {
  return (
    <Layout className={styles.appLayout}>
      <Sidebar />
      <Layout className={styles.mainLayout}>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
