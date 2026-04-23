import { Descriptions, Tag, Layout, Drawer } from "antd";

export default function User_Detail({ record, open, onClose }) {
  // Use Drawer as Sider for user details
  return (
    <Drawer
      title="User Details"
      placement="right"
      width={350}
      onClose={onClose}
      open={open}
      maskClosable={true}
    >
      {record && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">
            {record.firstName + " " + record.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag
              color={
                record.role?.toLowerCase() === "organizer" ? "blue" : "green"
              }
            >
              {record.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                record.status?.toLowerCase() === "active"
                  ? "success"
                  : "default"
              }
            >
              {record.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}
