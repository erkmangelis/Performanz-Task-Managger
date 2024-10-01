import React, { useState, useEffect } from 'react';
import { Layout, Button, Avatar, theme, Segmented, Divider, FloatButton } from 'antd';
import { FileAddOutlined, LogoutOutlined, UserOutlined, ScheduleOutlined, ContactsOutlined, UserAddOutlined, NotificationOutlined, RobotOutlined } from '@ant-design/icons';
import Tasks from '../components/Tasks';
import TaskModal from '../components/TaskModal';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { API_URL, ADMIN } from '../config/Config.js';
import openNotificationWithIcon from '../services/notificationService';
import Profile from '../components/Profile';
import Users from '../components/Users';
import UserModal from '../components/UserModal';
import Statistics from '../components/Statistics';
import Notification from '../components/Notification';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/tr';
import NotificationModal from '../components/NotificationModal.js';


const { Header, Content } = Layout;
dayjs.locale('tr'); 
dayjs.extend(utc);
dayjs.extend(timezone);

const HomePage = () => {
  const {user, setUser} = useUser();
  const [table, setTable] = useState("tasks");

  ///////////////// Profile ////////////////
  const [showProfile, setShowProfile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const openProfile = () => {
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  const handleUpdateProfile = (updatedUser) => {
    setIsProcessing(true);
    let holder = updatedUser.role;
    updatedUser.role = updatedUser.role === ADMIN ? 1 : 2;
    axios.post(API_URL + "Users", updatedUser)
    .then(response => {
      updatedUser.role = holder;
      delete updatedUser.password;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsProcessing(false);
      closeProfile();
      openNotificationWithIcon({
        type: 'success',
        title: 'Profil Güncelleme Başarılı',
        description: 'Profil bilgilerini güncelleme işlemi başarıyla gerçekleştirildi.',
      });
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      setIsProcessing(false);
      openNotificationWithIcon({
        type: 'error',
        title: 'Profil Güncelleme Başarısız',
        description: 'Profil bilgilerini güncelleme işlemi gerçekleştirilemedi.',
      });
    });
  };
  //////////////////////////////////////////

  /////////////// Log  Out ///////////////
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    axios.defaults.headers.common['Authorization'] = "";
    navigate('/login');
  };
  ///////////////////////////////////////////////

  /////////////// Fetch Tasks ///////////////
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [completeCount, setCompleteCount] = useState(0);
  const [processCount, setProcessCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [postponedCount, setPostponedCount] = useState(0);
  const [totalTask, setTotalTask] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = "Bearer "+user.token;
      axios.get(user.role === ADMIN ? (API_URL+'TaskItems') : (API_URL+'TaskItems/ByUserId/'+user.id))
        .then(response => {
          setTasks(response.data);
          setTotalTask(response.data.length);
          setCompleteCount(response.data.filter(item => item.task.status === 4).length);
          setProcessCount(response.data.filter(item => item.task.status === 3).length);
          setPostponedCount(response.data.filter(item => item.task.status === 1).length);
          setPendingCount(response.data.filter(item => item.task.status === 2).length);
        })
        .catch(error => {
          console.error('API isteği başarısız:', error);
          setError(error);
          setLoading(false);
        });

        axios.get(API_URL+'Categories')
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error('API isteği başarısız:', error);
          setLoading(false);
        });

        axios.get(API_URL+'Users')
        .then(response => {
          setUsers(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('API isteği başarısız:', error);
          setLoading(false);
        });

        axios.get(API_URL+"Notifications/ByUserId/" + user.id)
        .then(response => {
          setNotifications(response.data);
          setLoading(false);
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setNotifications([]);
          } else {
            console.error("API isteği sırasında hata oluştu:", error);
          }
          setLoading(false);
        });
    }
  }, [user]);
  //////////////////////////////////////////
  
  /////////////// Add Tasks ///////////////
  const handleSaveTask = (task, taskUser, taskCategories, statistic) => {
    let taskUserStr = taskUser.map(String).join(',');
    let taskCategoriesStr = taskCategories.map(String).join(',');
    let taskId;
 
    if (task.id === 0) {
    // CREATING TASK
    axios.post(API_URL + "TaskItems", task)
    .then(response => {
      taskId = response.data.id;
      
      // TaskUsers POST işlemi
      return axios.post(API_URL + "TaskUsers?taskId=" + taskId + "&userIds=" + taskUserStr);
    })
    .then(() => {
      // TaskCategories POST işlemi
      return axios.post(API_URL + "TaskCategories?taskId=" + taskId + "&categorieIds=" + taskCategoriesStr);
    })
    .then(() => {
      return axios.get(API_URL + "TaskItems/" + taskId);
    })
    .then(response => {
      setTasks(prevTasks => [...prevTasks, response.data]);
      setTotalTask(totalTask + 1);
      switch (response.data.task.status) {
        case 1:
          setPostponedCount(postponedCount + 1);
          break;
        case 2:
          setPendingCount(pendingCount + 1);
          break;
        case 3:
          setProcessCount(processCount + 1);
          break;
        case 4:
          setCompleteCount(completeCount + 1);
          break;
      };

      openNotificationWithIcon({
        type: 'success',
        title: 'Görev Oluşturma Başarılı',
        description: '"'+task.title+'" adlı görevi oluşturma işlemi başarıyla gerçekleştirildi.',
      });
    })
    .then(() => {
      const filteredUsers = taskUser.filter(aUser => aUser !== user.id);
        const notificationPromises = filteredUsers.map(aUser => {
          let notification = {
            id: 0,
            title: `${user.name} ${user.surname} yeni bir görev verdi.`,
            detail: `${user.name} ${user.surname}, size "${task.title}" adlı yeni bir görev verdi.`,
            date: dayjs().tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            userId: user.id,
            assignedUserId: aUser
          };
          return axios.post(API_URL+"Notifications/", notification)
            .then(response => {
              notification.id = response.data.id;
              return notification;
            });
        });
      
        return Promise.all(notificationPromises)
    })
    .catch(error => {
      console.error('Error creating task:', error);
      openNotificationWithIcon({
        type: 'error',
        title: 'Görev Oluşturma Başarısız',
        description: '"'+task.title+'" adlı görevi oluşturma işlemi gerçekleştirilemedi.',
      });
    });
    } else {
    // UPDATING TASK
    axios.post(API_URL + "TaskItems", task)
    .then(response => {
      // TaskUsers POST işlemi
      return axios.post(API_URL + "TaskUsers?taskId=" + task.id + "&userIds=" + taskUserStr);
    })
    .then(() => {
      // TaskCategories POST işlemi
      return axios.post(API_URL + "TaskCategories?taskId=" + task.id + "&categorieIds=" + taskCategoriesStr);
    })
    .then(() => {
      return axios.get(API_URL + "TaskItems/" + task.id);
    })
    .then(response => {
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.task.id === response.data.task.id ? { ...response.data } : t
        )
      );

      if (statistic.isUpdate) {
        setCompleteCount(completeCount + statistic.completeCount);
        setProcessCount(processCount + statistic.processCount);
        setPendingCount(pendingCount + statistic.pendingCount);
        setPostponedCount(postponedCount + statistic.postponedCount);
      }

      openNotificationWithIcon({
        type: 'success',
        title: 'Görev Düzenleme Başarılı',
        description: '"'+task.title+'" adlı görevi düzenleme işlemi başarıyla gerçekleştirildi.',
      });
    })
    .then(() => {
      let tempTaskUser = taskUser[0];
      const filteredUsers = tempTaskUser.filter(aUser => aUser !== user.id);
        const notificationPromises = filteredUsers.map(aUser => {
          let notification = {
            id: 0,
            title: `${user.name} ${user.surname} görevini güncelledi.`,
            detail: `${user.name} ${user.surname}, sizin "${task.title}" adlı görevinizi güncelledi.`,
            date: dayjs().tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            userId: user.id,
            assignedUserId: aUser
          };
          return axios.post(API_URL+"Notifications/", notification)
            .then(response => {
              notification.id = response.data.id;
              return notification;
            });
      });
      
      return Promise.all(notificationPromises)
    })
    .catch(error => {
      console.error('Error creating task:', error);
      openNotificationWithIcon({
        type: 'error',
        title: 'Görev Düzenleme Başarısız',
        description: '"'+task.title+'" adlı görevi düzenleme işlemi gerçekleştirilemedi.',
      });
    });
    }
  };

  /////////////// Delete Tasks ///////////////
  const deleteTask = (task) => {
    axios.delete(API_URL+"TaskItems/"+task.id)
    .then(() => {
      setTasks(prevTasks => prevTasks.filter(item => item.task.id !== task.id));
      if (task.status === 1) {
        setPostponedCount(postponedCount - 1);
      } else if (task.status === 2) {
        setPendingCount(pendingCount - 1);
      } else if (task.status === 3) {
        setProcessCount(processCount - 1);
      } else if (task.status === 4) {
        setCompleteCount(completeCount - 1);
      };

      setTotalTask(totalTask - 1);
      openNotificationWithIcon({
        type: 'info',
        title: 'Görev Silme Başarılı',
        description: 'Görevi silme işlemi başarıyla gerçekleştirildi.',
      });
    })
    .catch(error => {
      console.error('Görev silme başarısız:', error);
      openNotificationWithIcon({
        type: 'error',
        title: 'Görev Silme Başarısız',
        description: 'Görevi silme işlemi gerçekleştirilemedi.',
      });
    });
  };

  /////////////// Add User ///////////////
  const handleSaveUser = (usr) => {
    if (usr.id === 0) {
    // CREATING USER
    axios.post(API_URL + "Users", usr)
    .then((response) => {
      return axios.get(API_URL + "Users/" + response.data.id);
    })
    .then(response => {
      setUsers(prevUsers => [...prevUsers, response.data]);
      
      openNotificationWithIcon({
        type: 'success',
        title: 'Kullanıcı Oluşturma Başarılı',
        description: '"'+usr.name+' '+usr.surname+'" adlı kullanıcı oluşturma işlemi başarıyla gerçekleştirildi.',
      });
    })
    .catch(error => {
      console.error('Error creating user:', error);
      openNotificationWithIcon({
        type: 'error',
        title: 'Kullanıcı Oluşturma Başarısız',
        description: '"'+usr.name+' '+usr.surname+'" adlı kullanıcı oluşturma işlemi gerçekleştirilemedi.',
      });
    });
    } else {
    // UPDATING USER
    axios.post(API_URL + "Users", usr)
    .then(response => {
      delete usr.password;
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === usr.id ? { ...usr } : u
        )
      );

      openNotificationWithIcon({
        type: 'success',
        title: 'Kullanıcı Düzenleme Başarılı',
        description: '"'+usr.name+' '+usr.surname+'" adlı kullanıcıyı düzenleme işlemi başarıyla gerçekleştirildi.',
      });
    })
    .catch(error => {
      console.error('Error creating task:', error);
      openNotificationWithIcon({
        type: 'error',
        title: 'Kullanıcı Düzenleme Başarısız',
        description: '"'+usr.name+' '+usr.surname+'" adlı kullanıcıyı düzenleme işlemi gerçekleştirilemedi.',
      });
    });
    }
  };

  /////////////// Delete User ///////////////
  const deleteUser = (userId) => {
    axios.delete(API_URL+"Users/"+userId)
    .then(() => {
      setUsers(prevUsers => prevUsers.filter(usr => usr.id !== userId));
      openNotificationWithIcon({
        type: 'info',
        title: 'Kullanıcı Silme Başarılı',
        description: 'Kullanıcı silme işlemi başarıyla gerçekleştirildi.',
      });
    })
    .catch(error => {
      console.error('Kullanıcı silme başarısız:', error);
      openNotificationWithIcon({
        type: 'error',
        title: 'Kullanıcı Silme Başarısız',
        description: 'Kullanıcı silme işlemi gerçekleştirilemedi.',
      });
    });
  } 

  /////////////// Add Category /////////////
  const addTask = (category) => {
    if (categories.every(c => c.name.toLowerCase() !== category.toLowerCase())) {
      axios.post(API_URL + "Categories", {"name": category})
      .then(response => {
        setCategories(prevCategories => [...prevCategories, response.data]);
        openNotificationWithIcon({
          type: 'success',
          title: 'Kategori Ekleme Başarılı',
          description: '"'+category+'" adlı kategori ekleme işlemi başarıyla gerçekleştirildi.',
        });
      })
      .catch(error => {
        console.error('Kategori ekleme başarısız:', error);
        openNotificationWithIcon({
          type: 'error',
          title: 'Kategori Ekleme Başarısız',
          description: 'Kategori ekleme işlemi gerçekleştirilemedi.',
        });
      });
    } else {
      openNotificationWithIcon({
        type: 'info',
        title: 'Kategori Zaten Mevcut',
        description: 'Eklemek istediğiniz kategori zaten mevcut.',
      });
    }
    
  };

  /////////////// User Modal ///////////////
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setUserModalVisible(true);
  };

  const handleEditUser = (usr) => {
    setEditingUser(usr);
    setUserModalVisible(true);
  };

  const handleCloseUserModal = () => {
    setEditingUser(null);
    setUserModalVisible(false);
  };
  //////////////////////////////////////////

  /////////////// Task Modal ///////////////
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setTaskModalVisible(false);
  };

  /////////////// Notification Modal ///////////////
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [modalType, setModalType] = useState();

  const handleOpenNotificationModal = (type) => {
    setModalType(type);
    setNotificationModalVisible(true);
  };

  const handleCloseNotificationModal = () => {
    setNotificationModalVisible(false);
  };

  ////////// SEND CUSTOM NOTIFICATION ///////////
  const sendCustomNotification = (notification, assignedUsers) => {  
    assignedUsers.forEach(user => {
        const updatedNotification = {
            ...notification,
            assignedUserId: user,
        };
        const assignedUserDetail = users.find(u => u.id === user);

        axios.post(API_URL+"Notifications/", updatedNotification)
        .then(response => {
            openNotificationWithIcon({
                type: 'success',
                title: 'Bildirim Gönderme Başarılı',
                description: `Bildirim ${assignedUserDetail.name} ${assignedUserDetail.surname} isimli kullanıcıya başarıyla gönderildi.`,
            });
        })
        .catch(error => {
            console.error(`Bildirim gönderme başarısız (Kullanıcı ID: ${user}):`, error);
            openNotificationWithIcon({
                type: 'error',
                title: 'Bildirim Gönderme Başarısız',
                description: `Bildirim ${assignedUserDetail.name} ${assignedUserDetail.surname} isimli kullanıcıya gönderilemedi.`,
            });
        });
    });
  };


  //////////// STATISTIC FILTER ///////////

  const [filter, setFilter] = useState([1,2,3]);

  const statisticFilter = (filters) => {
    setFilter(filters);
  };

  /////////////////////////////////////////

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '10vh',
          color: 'white',
          flexShrink: 0,
        }}
      >
        <div className='user' style={{display: 'flex', alignItems:'center', marginLeft: '-40px'}}>
          <Notification data={notifications} users={users}/>
          <Divider type="vertical" />
          <Button size='large' type="text" onClick={openProfile} style={{display: 'flex', alignItems: 'center', height: '100%', paddingBottom: '6px', paddingTop: '10px'}}>
            <Avatar shape='square' style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle', marginTop: '-5px'}} size='large' icon={<UserOutlined />} src={user.url}>{user.name}</Avatar>
            <h1 style={{ color: 'white', fontWeight: '500', fontSize: '16px' }}>{user.name} {user.surname}</h1>
          </Button>

          <>
          {user.role === ADMIN &&
            <>
              <Divider type="vertical" />
              <div className='tableSegment'>
                <Segmented
                  options={[
                    { value: 'tasks', icon: <ScheduleOutlined style={{fontSize: '18px'}}/> },
                    { value: 'users', icon: <ContactsOutlined style={{fontSize: '18px'}}/> }
                  ]}
                  value={table}
                  onChange={setTable}
                />
              </div>
            </>
          }

              <Divider type="vertical" />
              <Statistics data={{completeCount, processCount, pendingCount, postponedCount, totalTask}} statisticFilter={statisticFilter}/>
          </>
        </div>

        <div className='addButton' style={{marginLeft: user.role === ADMIN ? '-300px' : '-200px' }}>
          {table === "tasks" ? ( 
            <Button size="large" type="text" style={{ color: 'white', fontWeight: '500', fontSize: '16px'}} onClick={handleAddTask}>Görev Ekle <FileAddOutlined /></Button>
              ) : (
            <Button size="large" type="text" style={{ color: 'white', fontWeight: '500', fontSize: '16px'}} onClick={handleAddUser}>Kullanıcı Ekle <UserAddOutlined /></Button>
            )}
        </div>
        
        <div className='logout'>
          <Button onClick={handleLogout} size="large" type="text" style={{ color: 'white', fontWeight: '500', fontSize: '16px' }}>Çıkış Yap <LogoutOutlined /></Button>
        </div>
      </Header>
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Profile shown={showProfile} onClose={closeProfile} onSave={handleUpdateProfile} loading={isProcessing}/>
        <Content
          style={{
            flex: 1,
            margin: '24px 16px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <TaskModal
            users={users}
            categories={categories}
            onOpen={taskModalVisible}
            data={editingTask}
            onClose={handleCloseModal}
            onSave={handleSaveTask}
          />
          <UserModal
            data={editingUser}
            onOpen={userModalVisible}
            onClose={handleCloseUserModal}
            onSave={handleSaveUser}
          />
          <NotificationModal
            users={users}
            onOpen={notificationModalVisible}
            onClose={handleCloseNotificationModal}
            onSave={sendCustomNotification}
            type={modalType}
          />
          <div
            className='main-table'
            style={{
              background: colorBgContainer,
              minHeight: '100%',
              borderRadius: borderRadiusLG,
            }}
          >
            {table === "tasks" ? 
            (!loading && !error && (
            <Tasks 
              addTask={addTask}
              users={users}
              categories={categories}
              tasks={tasks}
              onEditTask={handleEditTask}
              deleteTask={deleteTask}
              sFilter={filter}
              setNotifications={setNotifications}
            /> )) :
            <Users
              userList={users}
              onEditUser={handleEditUser}
              deleteUser={deleteUser}
            />
            }
            {(user.role === ADMIN || user.id === 3) &&
            <FloatButton.Group
              trigger="click"
              type="default"
              tooltip={"Duyuru Yap"}
              style={{
                bottom: '20px',
                right: '20px'
              }}
              icon={<NotificationOutlined />}
            >
              <FloatButton
                type="primary"
                tooltip={"Kendi Adına"}
                icon={<UserOutlined />}
                onClick={() => handleOpenNotificationModal(1)}
              />
              <FloatButton
                type="primary"
                tooltip={"Sistem Adına"}
                icon={<RobotOutlined />}
                onClick={() => handleOpenNotificationModal(2)}
              />
            </FloatButton.Group>
            }
          </div>
        </Content>
      </div>
    </Layout>
  );
}

export default HomePage;
