import { notification } from 'antd';

const openNotificationWithIcon = ({ type, title, description }) => {
  notification[type]({
    message: title,
    description: description,
    duration: 2.5,
  });
};

export default openNotificationWithIcon;