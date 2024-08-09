import React, { useState } from 'react';
import { Card, Col, Row, Avatar, List } from 'antd';
import { DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';

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

const DetailCard = () => {

    return (
      <Row gutter={5} style={{ margin: '0px', padding: '0px'}}>
        <Col span={10}>
          <Card title="Detaylar" bordered={false} style={{ minHeight: '100%' }} extra={<span>2 Gün<ClockCircleOutlined /></span>} actions={["updatedTime", "addedTime"]}>
            <Card.Meta 
              style={{ height: '100px' }}
              description={<span style={{ color: 'black'}}>Content</span>}
            />
          </Card>
        </Col>
        <Col span={14}>
          <Card title="Yorumlar" bordered={false}>
          <List
            style={{ maxHeight: '140px', overflowY: 'scroll' }}
            itemLayout="horizontal"
            dataSource={commentData}
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
            )}
          />
          </Card>
        </Col>
      </Row>
    );
};

export default DetailCard;

