import {
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Radio, Skeleton, Space, Table, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, updateUser, updateUserStatus } from "../../userSlice";
import User_Detail from "../../Components/UserDetail/User_Detail";

function Users() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user);

  const [displayData, setDisplayData] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const filter = searchParams.get("filter") || "all";
      // setCurrentFilter(filter);
      switch (filter) {
        case "Active":
          setDisplayData(users.filter((user) => user.status === "Active"));
          break;
        case "Inactive":
          setDisplayData(users.filter((user) => user.status === "Inactive"));
          break;
        case "Driver":
          setDisplayData(users.filter((user) => user.role === "Driver"));
          break;
        case "Student":
          setDisplayData(users.filter((user) => user.role === "Student"));
          break;
        default:
          setDisplayData(users);
      }
      setIsLoading(false);
    }, 1000);
  }, [users, searchParams]);

  function viewUserDetail(record) {
    setSelectedUser(record);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setSelectedUser(null);
  }

  function handleActiveFilter() {
    setSearchParams({ filter: "Active" });
  }

  function handleInactiveFilter() {
    setSearchParams({ filter: "Inactive" });
  }

  function handleDriverFilter() {
    setSearchParams({ filter: "Driver" });
  }

  function handleStudentFilter() {
    setSearchParams({ filter: "Student" });
  }

  function handleAllFilter() {
    setSearchParams({ filter: "all" });
  }

  function handleDelete(record) {
    dispatch(deleteUser(record.email));
  }

  function handleStatusChange(email, newStatus) {
    const storedUserStr = sessionStorage.getItem("user");
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      if (storedUser.email === email) {
        const oldUser = users.find((user) => user.email === email);
        if (oldUser) {
          const updated_user = { ...oldUser, status: newStatus };
          sessionStorage.setItem("user", JSON.stringify(updated_user));
        }
      }
    }
    dispatch(updateUserStatus({ key: email, status: newStatus }));
  }

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Driver" ? "blue" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "success" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => viewUserDetail(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
          <Button
            type="default"
            icon={
              record.status === "Active" ? (
                <StopOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
            onClick={() =>
              record.status === "Active"
                ? handleStatusChange(record?.email, "Inactive")
                : handleStatusChange(record?.email, "Active")
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Radio.Group defaultValue="all" style={{ marginBottom: "20px" }}>
        <Radio.Button value="all" onClick={() => handleAllFilter()}>
          All
        </Radio.Button>
        <Radio.Button value="Active" onClick={() => handleActiveFilter()}>
          Active
        </Radio.Button>
        <Radio.Button value="Inactive" onClick={() => handleInactiveFilter()}>
          Inactive
        </Radio.Button>
        <Radio.Button value="Driver" onClick={() => handleDriverFilter()}>
          Driver
        </Radio.Button>
        <Radio.Button value="Student" onClick={() => handleStudentFilter()}>
          Student
        </Radio.Button>
      </Radio.Group>
      <Skeleton active loading={isLoading}>
        <Table
          dataSource={displayData}
          columns={columns}
          rowKey="email"
          pagination={{ pageSize: 8 }}
        />
        <User_Detail
          record={selectedUser}
          open={modalOpen}
          onClose={handleClose}
        />
      </Skeleton>
    </>
  );
}

export default Users;
