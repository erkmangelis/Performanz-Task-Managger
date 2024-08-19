import React, { useState, memo } from 'react';
import { Card, Col, Row, Avatar, List, Button, Drawer, Input, Modal, Tag } from 'antd';
import { DeleteOutlined, ClockCircleOutlined, CloseOutlined, CommentOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/tr'; 
import { useUser } from '../contexts/UserContext';



const { confirm } = Modal;

const { TextArea } = Input;

const DetailCard = memo(({ isCompleted, data }) => {
  moment.locale('tr');
  const [commentList, setCommentList] = useState(data.comments);
  const user = useUser();

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

  const leftTime = (targetDate) => {

    if (data.progress !== 100) {
      const date1 = moment(data.estimatedCompleteDate, 'DD.MM.YYYY').endOf('day');
      const date2 = moment(moment(), 'DD.MM.YYYY').endOf('day');
      const diffDays = date1.diff(date2, 'days');
      if (diffDays > 0) {
        console.log(diffDays);
        return <span><Tag color='#88D66C'>{diffDays} gün kaldı <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else if (diffDays < 0) {
        return <span><Tag color='#F94A29'>{Math.abs(diffDays)} gün geçti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else {
        return <span><Tag color='#ff8812'>Bugün <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      }
    } else {
      const date1 = moment(data.estimatedCompleteDate, 'DD.MM.YYYY').endOf('day');
      const date2 = moment(data.completeDate, 'DD.MM.YYYY').endOf('day');
      const diffDays = date1.diff(date2, 'days');
      if (diffDays > 0) {
        return <span><Tag color='#88D66C'>{diffDays} gün erken bitti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else if (diffDays < 0) {
        return <span><Tag color='#F94A29'>{Math.abs(diffDays)} gün geç bitti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else {
        return <span><Tag color='#ff8812'>Bugün bitti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      }
    }
  };

  const estimatedFinishDate = leftTime(data.estimatedCompleteDate);

  const [value, setValue] = useState('');

  // Drawwer
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
          <Card
            title="Detaylar"
            bordered={false}
            style={{ color: 'white', minHeight: '100%' }}
            extra={estimatedFinishDate}
            actions={[
              <span key="addedDate">Eklenme: {moment(data.addedDate).format('DD MMMM YY, HH:mm')}</span>,
              <span key="updateDate">Güncellenme: {moment(data.updateDate).format('DD MMMM YY, HH:mm')}</span>
            ]}
          >
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
                actions={
                  (!isCompleted && ((user.id === comment.user.id) || (user.role === 'Admin')))
                    ? [<Button type="text" shape="circle" onClick={() => onDeleteComment(comment)} key={comment.id}><DeleteOutlined /></Button>]
                    : []
              }
              >
                <List.Item.Meta
                  avatar={<Avatar src={comment.user.url} />}
                  title={comment.user.name + " " + comment.user.surname}
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

