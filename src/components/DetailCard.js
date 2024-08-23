import React, { useState, useEffect, memo } from 'react';
import { Card, Col, Row, Avatar, List, Button, Drawer, Input, Modal, Tag } from 'antd';
import { DeleteOutlined, ClockCircleOutlined, CloseOutlined, CommentOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { API_URL } from '../config/Config.js';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'; 



const { confirm } = Modal;
const { TextArea } = Input;
dayjs.locale('tr'); 

const DetailCard = memo(({ users, data }) => {
  const [commentList, setCommentList] = useState();
  const user = useUser();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const updatedNotes = await Promise.all(
        data.notes.map(async (note) => {

          const matchedUser = users.find(user => user.id === note.userId);
          
          if (matchedUser) {
            const user = {
              id: matchedUser.id,
              name: matchedUser.name,
              surname: matchedUser.surname,
              role: matchedUser.role,
              url: matchedUser.url,
            };
            
            return { ...note, user };
          } else {
            return note;
          }
        })
      );
      
      setCommentList(updatedNotes);
    };
  
    fetchUserDetails();
  }, [data.notes, users]);

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
            avatar={<Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={comment.user.url} />}
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

  const handleSendComment = async () => {

      let comment = {
        taskId: data.task.id,
        userId: user.id,
        date: new Date().toISOString(),
        content: value,
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          role: user.role,
          url: user.url
        }
      }

      await axios.post(API_URL+'Notes', comment)
      .then(response => {
        onClose();

        comment = {
          ...comment,
          id: response.data.id,
        };
        
        setCommentList(prevComments => [
          ...prevComments, comment
        ]);
      })
      .catch(error => {
        console.error("Yorum gönderilirken hata oluştu:", error);
      });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(API_URL+'Notes/'+commentId);
      setCommentList(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Yorum silinirken hata oluştu:", error);
    }
  };


  function calculateDays() {
    const targetDate = new Date(data.task.estimatedCompleteDate);
    targetDate.setHours(0, 0, 0, 0);
    
    if (data.task.progress !== 100) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const timeDifference = targetDate - currentDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
      if (daysDifference > 0) {
        return <span><Tag color='#88D66C'>{daysDifference} gün kaldı <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else if (daysDifference < 0) {
        return <span><Tag color='#F94A29'>{Math.abs(daysDifference)} gün geçti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else {
        return <span><Tag color='#ff8812'> Bugün <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      }
    } else {
      const completionDate = new Date(data.task.completeDate);
      completionDate.setHours(0, 0, 0, 0);
      const timeDifference = completionDate - targetDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      if (daysDifference > 0) {
        return <span><Tag color='#88D66C'>{daysDifference} gün erken bitti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else if (daysDifference < 0) {
        return <span><Tag color='#F94A29'>{Math.abs(daysDifference)} gün geç bitti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      } else {
        return <span><Tag color='#ff8812'>Bugün bitti <ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>;
      }
    }
  }

  const estimatedFinishDate = calculateDays();

  const [value, setValue] = useState('');

  // Drawwer
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setValue("");
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
              <span key="addedDate">Eklenme: {dayjs(data.task.addedDate).format('DD MMM YY, HH:mm')}</span>,
              <span key="updateDate">Güncellenme: {dayjs(data.task.updateDate).format('DD MMM YY, HH:mm')}</span>
            ]}
          >
            <Card.Meta 
              style={{ height: '150px' }}
              description={<span style={{ color: 'black'}}>{data.task.description}</span>}
            />
          </Card>
        </Col>
        <Col span={14} >
          <Card title={<span>Yorumlar <CommentOutlined /></span>} extra={<Button disabled={data.task.progress === 100} type='text' onClick={showDrawer}>Yorum Ekle<PlusOutlined style={{marginLeft: '4px'}} /></Button>} bordered={false}>
            <Drawer
              title="Yorum Ekle"
              placement="right"
              closable={false}
              onClose={onClose}
              open={open}
              getContainer={false}
              closeIcon={<CloseOutlined />}
              footer={<Button type='primary' style={{backgroundColor: '#3F72AF'}} onClick={handleSendComment}>Gönder</Button>}
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
                  ((data.task.progress !== 100) && ((user.id === comment.user.id) || (user.role === 1)))
                    ? [<Button type="text" shape="circle" onClick={() => onDeleteComment(comment)} key={comment.user.id}><DeleteOutlined /></Button>]
                    : []
              }
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={comment.user.url} />}
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

