import React from 'react';
import { Layout, Button, Avatar, Space, theme } from 'antd';
import { FileAddOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Tasks from '../components/Tasks';

const { Header, Content } = Layout;

const HomePage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{
          backgroundColor: '#ff7d06',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '10vh',
          color: 'white',
          flexShrink: 0, // Header boyutunun değişmemesi için
        }}
      >
        <div className='user'>
          <Space align="baseline" size={16}>
            <Avatar size='large' icon={<UserOutlined />} />
            <h6 style={{ color: 'white', fontWeight: '500' }}>Erkman Geliş</h6>
          </Space>
        </div>
        <div className='taskAdd'>
          <Button size="large" type="text" style={{ color: 'white', fontWeight: '500'}}>Görev Ekle <FileAddOutlined /></Button>
        </div>
        <div className='logout'>
          <Button size="large" type="text" style={{ color: 'white', fontWeight: '500'}}>Çıkış Yap <LogoutOutlined /></Button>
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
        <div
          className='main-table'
          style={{
            background: colorBgContainer,
            minHeight: '100%',
            borderRadius: borderRadiusLG,
          }}
        >
          <Tasks />
        </div>
      </Content>
    </Layout>
  );
}

export default HomePage;
