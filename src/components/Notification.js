import React, { useState, useEffect } from 'react';
import { Badge, Avatar, Dropdown, List, Card, Button, Empty } from 'antd';
import { BellOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../config/Config.js';
import { useUser } from '../contexts/UserContext';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'; 


dayjs.locale('tr'); 

const Notification = ({data, users}) => {
    const [notificationList, setNotificationList] = useState(data);
    const {user} = useUser();

    useEffect(() => {
      if (data) {
        const fetchUserDetails = async () => {
          const updatedNotifications = await Promise.all(
            data.map(async (notification) => {
              
              const matchedUser = users.find(user => user.id === notification.userId);
              
              if (matchedUser) {
                const user = {
                  id: matchedUser.id,
                  name: matchedUser.name,
                  surname: matchedUser.surname,
                  role: matchedUser.role,
                  url: matchedUser.url,
                };
                
                let notif = { ...notification, user };
                return notif;
              } else {
                return notification;
              }
            })
          );
          const sortedNotifications = updatedNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
          setNotificationList(sortedNotifications);
        };
      
        fetchUserDetails();
      };
      }, [data, users]);


    const handleDeleteNotification = async (notificationId) => {
        try {
          await axios.delete(API_URL+"Notifications/"+notificationId);
          setNotificationList(prevNotifications => prevNotifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
          console.error("Bildirim silinirken hata oluştu:", error);
        }
    };

    const handleDeleteAllNotification = async () => {
      try {
        await axios.delete(API_URL+"Notifications/ByUserId/"+user.id);
        setNotificationList([]);
      } catch (error) {
        console.error("Bildirim silinirken hata oluştu:", error);
      }
  };

    const listMenu = (
        <Card size="small" style={{width: 500}} extra={notificationList.length > 0 && <Button size="small" onClick={() => handleDeleteAllNotification()} type="text">Tümünü Temizle</Button>}>
            <List
                locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span>Bildirim Bulunamadı</span>}
                      />
                    ),
                }}
                itemLayout="horizontal"
                dataSource={notificationList}
                renderItem={(notification, index) => (
                    <List.Item extra={<Button onClick={() => handleDeleteNotification(notification.id)} key={notification.id} type="text" shape="circle"><CloseOutlined /></Button>}>
                        <List.Item.Meta
                            avatar={<Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={notification.user ? notification.user.url : ""}>{notification.user ? `${notification.user.name} ${notification.user.surname}` : <RobotOutlined style={{fontSize: '30px'}}/>}</Avatar>}
                            title={
                                <span style={{display: 'flex', alignItems: 'flex-end'}}>
                                    <div>{notification.title}</div>
                                    <div style={{marginLeft: '10px', fontSize: '12px', fontWeight: '400', color: 'rgba(0, 0, 0, 0.45)'}}>{dayjs(notification.date).format('DD MMM YY, HH:mm')}</div>
                                </span>
                            }
                            description={notification.detail}
                        />
                </List.Item>
                )}
            />
        </Card>
    );

    return (
        <Dropdown overlay={listMenu} trigger={['click']}>
            <Badge offset={[-9, 4]} size='small' count={notificationList.length} overflowCount={99}>
                <Avatar size='large' shape='circle' style={{ backgroundColor: '#3F72AF', verticalAlign: 'middle'}}>
                    <BellOutlined style={{fontSize: '20px', color: 'white'}}/>
                </Avatar>
            </Badge>
        </Dropdown>
    );
};

export default Notification;