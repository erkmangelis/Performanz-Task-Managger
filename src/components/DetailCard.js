import React, { useState } from 'react';
import { Card, Col, Row, Avatar, List, Button, Drawer, theme, Input } from 'antd';
import { DeleteOutlined, ClockCircleOutlined, CloseOutlined, CommentOutlined, PlusOutlined } from '@ant-design/icons';

const commentData = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const { TextArea } = Input;

const DetailCard = () => {

  const [value, setValue] = useState('');

  // Drawwer
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

    return (
      <Row gutter={5} style={{ margin: '0px', padding: '0px'}}>
        <Col span={10}>
          <Card title="Detaylar" bordered={false} style={{ color: 'white', minHeight: '100%' }} extra={<span>2 Gün<ClockCircleOutlined style={{marginLeft: '4px'}}/></span>} actions={["updatedTime", "addedTime"]}>
            <Card.Meta 
              style={{ height: '150px' }}
              description={<span style={{ color: 'black'}}>Bu alanda kullanıcının girdiği göreve ait detay mesajları bulunacak ve bu şekilde gözükecektir.</span>}
            />
          </Card>
        </Col>
        <Col span={14} >
          <Card title={<span>Yorumlar <CommentOutlined /></span>} extra={<Button type='text' onClick={showDrawer}>Yorum Ekle<PlusOutlined style={{marginLeft: '4px'}} /></Button>} bordered={false}>
            <Drawer
              title="Yorum Ekle"
              placement="right"
              closable={false}
              onClose={onClose}
              open={open}
              getContainer={false}
              closeIcon={<CloseOutlined />}
              footer={<Button type='primary' style={{backgroundColor: '#708871'}} onClick={onClose}>Gönder</Button>}
            >
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Yorum giriniz..."
              autoSize={{ minRows: 5, maxRows: 5 }}
            />
            </Drawer>
          <List
            style={{ maxHeight: '210px', overflowY: 'scroll', marginTop: '-20px' }}
            itemLayout="horizontal"
            dataSource={commentData}
            headerBg="#ff7d06"
            renderItem={(item, index) => (
              <List.Item
                actions={[<a key="delete"><DeleteOutlined/></a>]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={"Username"}
                  description="Yorumlar burada olacak ve burda gözükücek."
                />
              </List.Item>
            )}>
          </List>
          </Card>
        </Col>
      </Row>
    );
};

export default DetailCard;

