import React, { useState, useEffect } from 'react';
import { Layout, Button, Avatar, Space, theme } from 'antd';
import { FileAddOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Tasks from '../components/Tasks';
import TaskModal from '../components/TaskModal';
import { data } from './data.js';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { API_URL } from '../config/Config.js';
import moment from 'moment';


const { Header, Content } = Layout;

const HomePage = () => {
  const user = useUser();

  /////////////// Log  Out ///////////////
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  ///////////////////////////////////////////////

  /////////////// Fetch Tasks ///////////////
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(user.role === 1 ? (API_URL+'TaskItems') : (API_URL+'TaskItems/ByUserId/'+user.id))
        .then(response => {
          console.log("Tasks: ", response.data);
          setTasks(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('API isteği başarısız:', error);
          setError(error);
          setLoading(false);
        });

        axios.get(API_URL+'Categories')
        .then(response => {
          console.log("Categories: ", response.data);
          setCategories(response.data);
        })
        .catch(error => {
          console.error('API isteği başarısız:', error);
        });

        axios.get(API_URL+'Users')
        .then(response => {
          console.log("Users: ", response.data);
          setUsers(response.data);
        })
        .catch(error => {
          console.error('API isteği başarısız:', error);
        });
    }
  }, [user]);
  //////////////////////////////////////////
  
  /////////////// Add Tasks ///////////////
  const handleSaveTask = (task, taskUser, taskCategories) => {
    let taskUserStr = taskUser.map(String).join(',');
    let taskCategoriesStr = taskCategories.map(String).join(',');
    let taskId;

    if (task.id === 0) {
    // CREATING TASK
    axios.post(API_URL + "TaskItems", task)
    .then(response => {
      taskId = response.data.id;
      
      // TaskUsers POST işlemi
      return axios.post(API_URL + "TaskUsers", taskId, taskUserStr);
    })
    .then(() => {
      // TaskCategories POST işlemi
      return axios.post(API_URL + "TaskCategories", taskId, taskCategoriesStr);
    })
    .then(() => {
      console.log("Başarılı: ", task);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? task : t)
      );
    })
    .catch(error => {
      console.error('Error creating task:', error);
    });
    } else {
    // UPDATING TASK
      axios.post(API_URL+'TaskItems', task)
        .then(response => {
          setTasks(prevTasks => [...prevTasks, task]);
        })
        .catch(error => {
          console.error('Error creating task:', error);
        });
    }
  };

  /////////////// Delete Tasks ///////////////
  const deleteTask = (taskId) => {
    axios.delete(API_URL+"TaskItems/"+taskId)
    .then(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.task.id !== taskId));
    })
    .catch(error => {
      console.error('Görev silme başarısız:', error);
    });
  };

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
          flexShrink: 0, // Header boyutunun değişmemesi için
        }}
      >
        <div className='user'>
          <Space align="baseline" size={10}>
            <Avatar shape='square' style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle', marginTop: '-5px'}} size='large' icon={<UserOutlined />} src={user.url}>{user.name}</Avatar>
            <h1 style={{ color: 'white', fontWeight: '500', fontSize: '16px' }}>{user.name} {user.surname}</h1>
          </Space>
        </div>
        <div className='taskAdd'>
          <Button size="large" type="text" style={{ color: 'white', fontWeight: '500', fontSize: '16px'}} onClick={handleAddTask}>Görev Ekle <FileAddOutlined /></Button>
        </div>
        <div className='logout'>
          <Button onClick={handleLogout} size="large" type="text" style={{ color: 'white', fontWeight: '500', fontSize: '16px' }}>Çıkış Yap <LogoutOutlined /></Button>
        </div>
      </Header>
      <Content
        style={{
          flex: 1, // Kalan tüm alanı kaplaması için
          margin: '24px 16px',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          overflow: 'hidden', // İçeriğin taşmaması için
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
        <div
          className='main-table'
          style={{
            background: colorBgContainer,
            minHeight: '100%',
            borderRadius: borderRadiusLG,
          }}
        >
          {!loading && !error && (
          <Tasks 
            users={users}
            categories={categories}
            tasks={tasks}
            onEditTask={handleEditTask}
            deleteTask={deleteTask}
          /> )}
        </div>
      </Content>
    </Layout>
  );
}

export default HomePage;
