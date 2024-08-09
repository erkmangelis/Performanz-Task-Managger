import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Button, Typography, Avatar, Space } from 'antd';
import { FileAddOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Tasks from '../components/Tasks';


const { Header, Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: '#ff7d06',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '10vh',
          color: 'white',
        }}
      >
        <div className='user'><Space align="baseline" size={16}><Avatar size='large' icon={<UserOutlined />} /><h6 style={{color: 'white'}}>Erkman Geliş</h6></Space></div>
        <div className='taskAdd'><Button size="large" type="text" style={{color: 'white'}}>Görev Ekle <FileAddOutlined /></Button></div>
        <div className='logout'><Button size="large" type="text" style={{color: 'white'}}>Çıkış Yap <LogoutOutlined /></Button></div>
      </Header>
      <Content style={{
            margin: '24px 16px',
            padding: 24,
            height: '100%',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
        <space></space>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
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