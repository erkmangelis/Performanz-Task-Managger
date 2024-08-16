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

  useEffect(() => {
    if (user) {
      axios.get(API_URL+`TaskItems`)
        .then(response => {
          console.log(response.data);
          setTasks(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('API isteği başarısız:', error);
          setError(error);
          setLoading(false);
        });
    }
  }, [user]);
  //////////////////////////////////////////
  
  /////////////// Add Tasks ///////////////
  const addTask = (newTask) => {
    axios.post('/api/tasks', newTask, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
    .then(response => {
      setTasks(prevTasks => [...prevTasks, response.data]);
    })
    .catch(error => {
      console.error('Görev ekleme başarısız:', error);
    });
  };

  /////////////// Update Tasks ///////////////
  const updateTask = (updatedTask) => {
    axios.put(`/api/tasks/${updatedTask.id}`, updatedTask)
      .then(response => {
        setTasks(prevTasks => prevTasks.map(task =>
          task.id === updatedTask.id ? response.data : task
        ));
      })
      .catch(error => {
        console.error('Görev güncelleme başarısız:', error);
      });
  };

  /////////////// Delete Tasks ///////////////
  const deleteTask = (taskId) => {
    axios.delete(`/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
    .then(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    })
    .catch(error => {
      console.error('Görev silme başarısız:', error);
    });
  };

  /////////////// Task Modal ///////////////
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Görev Ekle butonuna basıldığında çalışacak fonksiyon
  const handleAddTask = () => {
    setEditingTask(null); // Yeni görev için formu boş başlat
    setTaskModalVisible(true); // Modal'ı aç
  };

  // Düzenleme butonuna basıldığında çalışacak fonksiyon
  const handleEditTask = (task) => {
    setEditingTask(task); // Düzenlenecek görev verisini ayarla
    setTaskModalVisible(true); // Modal'ı aç
  };

  // Modal'ı kapatma fonksiyonu
  const handleCloseModal = () => {
    setTaskModalVisible(false);
    setEditingTask(null);
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
          onOpen={taskModalVisible}
          task={editingTask}
          onClose={handleCloseModal}
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
            tasks={tasks}
            onEditTask={handleEditTask}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          /> )}
        </div>
      </Content>
    </Layout>
  );
}

export default HomePage;
