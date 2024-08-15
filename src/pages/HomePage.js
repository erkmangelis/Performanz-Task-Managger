import React, { useState } from 'react';
import { Layout, Button, Avatar, Space, theme } from 'antd';
import { FileAddOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Tasks from '../components/Tasks';
import TaskModal from '../components/TaskModal';
import { data } from './data.js';

const { Header, Content } = Layout;


const HomePage = () => {
  
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
            <Avatar shape='square' style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle', marginTop: '-5px'}} size='large' icon={<UserOutlined />} src={data.user.url}>{data.user.name}</Avatar>
            <h1 style={{ color: 'white', fontWeight: '500', fontSize: '16px' }}>{data.user.name} {data.user.surname}</h1>
          </Space>
        </div>
        <div className='taskAdd'>
          <Button size="large" type="text" style={{ color: 'white', fontWeight: '500', fontSize: '16px'}} onClick={handleAddTask}>Görev Ekle <FileAddOutlined /></Button>
        </div>
        <div className='logout'>
          <Button size="large" type="text" style={{ color: 'white', fontWeight: '500', fontSize: '16px' }}>Çıkış Yap <LogoutOutlined /></Button>
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
        <TaskModal user={data.user} onOpen={taskModalVisible} task={editingTask} onClose={handleCloseModal} />
        <div
          className='main-table'
          style={{
            background: colorBgContainer,
            minHeight: '100%',
            borderRadius: borderRadiusLG,
          }}
        >
          <Tasks userId={data.user.id} userRole={data.user.role} data={data.tasks} onEditTask={handleEditTask}/>
        </div>
      </Content>
    </Layout>
  );
}

export default HomePage;
