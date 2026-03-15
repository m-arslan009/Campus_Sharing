import { Card, Typography } from "antd";
import styles from "./pagePlaceholder.module.css";

const { Title, Paragraph } = Typography;

function PagePlaceholder({ title, description }) {
  return (
    <Card className={styles.card}>
      <Title level={3} className={styles.title}>
        {title}
      </Title>
      <Paragraph className={styles.text}>{description}</Paragraph>
      <Paragraph className={styles.note}>
        This is a base file. Add your own logic, API calls, and state handling
        here.
      </Paragraph>
    </Card>
  );
}

export default PagePlaceholder;
