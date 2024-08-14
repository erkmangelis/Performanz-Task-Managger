import React, { useState, useEffect, memo } from 'react';
import { Card, Col, Row, Avatar, List, Button, Drawer, theme, Input, Modal } from 'antd';
import { DeleteOutlined, ClockCircleOutlined, CloseOutlined, CommentOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

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

const DetailCard = memo(({ data }) => {
  const [commentList, setCommentList] = useState(data.comments);

  const onDeleteComment = (comment) => {
    confirm({
      title: 'Yorumu silmek istiyor musun?',
      icon: <ExclamationCircleFilled />,
      content:
      <List
        itemLayout="horizontal"
        headerbg="#ff7d06"
      >
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={comment.user.url} />}
            title={comment.user.name + " " + comment.user.surname}
            description={comment.content}
          />
        </List.Item>
      </List>,
      okText: 'Evet',
      okType: 'danger',
      cancelText: 'Hayır',
      onOk() {
        handleDeleteComment(comment.id);
      },
      onCancel() {
        console.log('Silme işlemi iptal edildi.');
      },
    });
  };

  const handleDeleteComment = (commentId) => {
    console.log(commentId);
    setCommentList(prevComments => prevComments.filter(comment => comment.id !== commentId));
  };

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
          <Card title="Detaylar" bordered={false} style={{ color: 'white', minHeight: '100%' }} extra={<span>2 Gün<ClockCircleOutlined style={{marginLeft: '4px'}}/></span>} actions={[<span>Eklenme: {data.addedDate}</span>, <span>Güncellenme: {data.updateDate}</span>]}>
            <Card.Meta 
              style={{ height: '150px' }}
              description={<span style={{ color: 'black'}}>{data.description}</span>}
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
              footer={<Button type='primary' style={{backgroundColor: '#3F72AF'}} onClick={onClose}>Gönder</Button>}
            >
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Yorum giriniz..."
              autoSize={{ minRows: 5, maxRows: 5 }}
            />
            </Drawer>
          <List
            style={{ minHeight: '210px', maxHeight: '210px', overflowY: 'scroll', marginTop: '-20px' }}
            itemLayout="horizontal"
            dataSource={commentList}
            headerbg="#ff7d06"
            renderItem={(comment, index) => (
              <List.Item
                actions={[<a onClick={() => onDeleteComment(comment)} key={comment.id}><DeleteOutlined/></a>]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={comment.user.url} />}
                  title={comment.user.name + " " +comment.user.surname}
                  description={comment.content}
                />
              </List.Item>
            )}>
          </List>
          </Card>
        </Col>
      </Row>
    );
});

export default DetailCard;

