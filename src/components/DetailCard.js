import React, { useState, useEffect, memo } from 'react';
import { Card, Col, Row, Avatar, List, Button, Drawer, Input, Modal, Tag, Form, Skeleton } from 'antd';
import { DeleteTwoTone, ClockCircleOutlined, CloseOutlined, CommentOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { API_URL, ADMIN } from '../config/Config.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/tr'; 
import { calculateRemainingTime } from '../services/remainingTimeService';


const { confirm } = Modal;
const { TextArea } = Input;
dayjs.locale('tr'); 
dayjs.extend(utc);
dayjs.extend(timezone);


const DetailCard = memo(({ users, data }) => {
  const [commentList, setCommentList] = useState();
  const {user} = useUser();
  const [form] = Form.useForm();

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
      const sortedNotes = updatedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
      setCommentList(sortedNotes);
    };
  
    fetchUserDetails();
  }, [data.notes, users]);

  const onDeleteComment = (comment) => {
    confirm({
      title: 'Notu silmek istiyor musun?',
      icon: <ExclamationCircleFilled />,
      content:
      <List
        itemLayout="horizontal"
        headerbg="#ff7d06"
      >
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={comment.user.url}>{comment.user.name}</Avatar>}
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

  const handleSendComment = () => {
    let comment;
  
    form.validateFields()
      .then(values => {
        comment = {
          taskId: data.task.id,
          userId: user.id,
          date: dayjs().tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          content: values.comment,
          user: {
            id: user.id,
            name: user.name,
            surname: user.surname,
            role: user.role === ADMIN ? 1 : 2,
            url: user.url,
          },
        };
        onClose();
        form.resetFields();
        return axios.post(API_URL + 'Notes', comment);
      })
      .then(response => {
        comment.id = response.data.id;
        comment.date = dayjs().tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm:ss.SSS');

        setCommentList(prevComments => [...prevComments, comment]);
      })
      .catch(error => {
        console.error("Not gönderilirken hata oluştu:", error);
      });
  };
  

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(API_URL+'Notes/'+commentId);
      setCommentList(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Not silinirken hata oluştu:", error);
    }
  };

  const calculatedTime = calculateRemainingTime(data.task.estimatedCompleteDate, data.task.completeDate);

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
            extra={data.task.status !== 1 ? (<span><Tag color={calculatedTime.color}>{calculatedTime.status}<ClockCircleOutlined style={{ marginLeft: '6px' }} /></Tag></span>) : ("")}
            actions={[
              <span key="addedDate">Eklenme: {dayjs(data.task.addedDate).format('DD MMM YY, HH:mm')}</span>,
              data.task.progress === 100 ? (
                <span key="completeDate">Tamamlanma: {dayjs(data.task.completeDate).format('DD MMM YY, HH:mm')}</span>
              ) : (
                <span key="updateDate">Güncellenme: {dayjs(data.task.updateDate).format('DD MMM YY, HH:mm')}</span>
              )
            ]}
          >
            <Card.Meta 
              style={{ height: '150px' }}
              description={<span style={{ color: 'black'}}>{data.task.description}</span>}
            />
          </Card>
        </Col>
        <Col span={14} >
          <Card title={<span>Notlar <CommentOutlined /></span>} extra={<Button disabled={data.task.progress === 100} type='text' onClick={showDrawer}>Not Ekle<PlusOutlined style={{marginLeft: '4px'}} /></Button>} bordered={false}>
            <Drawer
              title="Not Ekle"
              placement="right"
              closable={false}
              onClose={onClose}
              open={open}
              getContainer={false}
              closeIcon={<CloseOutlined />}
              footer={<Button type='primary' style={{backgroundColor: '#3F72AF'}} onClick={handleSendComment}>Gönder</Button>}
            >
              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item form={form} name="comment" rules={[{ required: true, message: 'Boş bırakılamaz' }]}>
                  <TextArea
                    placeholder="Not giriniz..."
                    autoSize={{ minRows: 5, maxRows: 5 }}
                  />
                </Form.Item>
              </Form>
            </Drawer>
          <List
            style={{ minHeight: '210px', maxHeight: '210px', overflowY: 'scroll', marginTop: '-20px' }}
            itemLayout="horizontal"
            dataSource={commentList}
            headerbg="#ff7d06"
            renderItem={(comment, index) => (
              <List.Item
                actions={
                  ((data.task.progress !== 100) && ((user.id === comment.user.id) || (user.role === ADMIN)))
                    ? [<Button type="text" shape="circle" onClick={() => onDeleteComment(comment)} key={comment.user.id}><DeleteTwoTone twoToneColor="#F94A29" /></Button>]
                    : []
                }
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={comment.user.url}>{comment.user.name}</Avatar>}
                  title={
                    <span style={{display: 'flex', alignItems: 'flex-end'}}>
                      <div>{comment.user.name + " " +comment.user.surname}</div>
                      <div style={{marginLeft: '10px', fontSize: '12px', fontWeight: '400', color: 'rgba(0, 0, 0, 0.45)'}}>{dayjs(comment.date).format('DD MMMM YY ddd, HH:mm')}</div>
                    </span>
                  }
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

