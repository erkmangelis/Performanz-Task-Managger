import React, { useState, useEffect } from 'react';
import { Layout, Button, Avatar, theme, Segmented, Divider, Tag, Typography } from 'antd';
import { FileAddOutlined, LogoutOutlined, UserOutlined, ScheduleOutlined, ContactsOutlined, UserAddOutlined } from '@ant-design/icons';
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


const { Header, Content } = Layout;
const { Text } = Typography;

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
  const [totalTask, setTotalTask] = useState(0);

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = "Bearer "+user.token;
      axios.get(user.role === ADMIN ? (API_URL+'TaskItems') : (API_URL+'TaskItems/ByUserId/'+user.id))
        .then(response => {
          setTasks(response.data);
          setTotalTask(response.data.length);
          setCompleteCount(response.data.filter(task => task.task.progress === 100).length);
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
    }
  }, [user]);
  //////////////////////////////////////////
  
  /////////////// Add Tasks ///////////////
  const handleSaveTask = (task, taskUser, taskCategories, updateCount) => {
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
      setCompleteCount(response.data.task.progress === 100 ? completeCount + 1 : completeCount);

      openNotificationWithIcon({
        type: 'success',
        title: 'Görev Oluşturma Başarılı',
        description: '"'+task.title+'" adlı görevi oluşturma işlemi başarıyla gerçekleştirildi.',
      });
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
      setCompleteCount(completeCount + updateCount);

      openNotificationWithIcon({
        type: 'success',
        title: 'Görev Düzenleme Başarılı',
        description: '"'+task.title+'" adlı görevi düzenleme işlemi başarıyla gerçekleştirildi.',
      });
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
  const deleteTask = (taskId) => {
    axios.delete(API_URL+"TaskItems/"+taskId)
    .then(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.task.id !== taskId));
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
  //////////////////////////////////////////

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
        <div className='user' style={{display: 'flex', alignItems:'center'}}>
          <Button size='large' type="text" onClick={openProfile} style={{display: 'flex', alignItems: 'center', height: '100%', paddingBottom: '6px', paddingTop: '10px'}}>
            <Avatar shape='square' style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle', marginTop: '-5px'}} size='large' icon={<UserOutlined />} src={user.url}>{user.name}</Avatar>
            <h1 style={{ color: 'white', fontWeight: '500', fontSize: '16px' }}>{user.name} {user.surname}</h1>
          </Button>
           
          <Divider type="vertical" />
          {user.role === ADMIN ? (
          <div className='tableSegment'>
            <Segmented
              options={[
                { value: 'tasks', icon: <ScheduleOutlined style={{fontSize: '18px'}}/> },
                { value: 'users', icon: <ContactsOutlined style={{fontSize: '18px'}}/> }
              ]}
              value={table}
              onChange={setTable}
            />
          </div>) : (
            <Tag bordered={false}><Text strong type={completeCount === totalTask ? "success" : ""}>{completeCount} / {totalTask}</Text></Tag>
          )}
        </div>

        <div className='addButton' style={{marginLeft: '-80px'}}>
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
            /> )) :
            <Users
              userList={users}
              onEditUser={handleEditUser}
              deleteUser={deleteUser}
            />
            }
          </div>
        </Content>
      </div>
    </Layout>
  );
}

export default HomePage;
