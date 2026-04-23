import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../Components/Sidebar/Sidebar";
import { getAllUsers } from "../userSlice";
import styles from "./appLayout.module.css";

const { Content } = Layout;

function AppLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

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
