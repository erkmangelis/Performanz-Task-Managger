import React, { useRef, useState } from 'react';
import { Table, Space, Tag, Progress, Modal, Divider, Button, Avatar, Tooltip } from 'antd';
import { EditTwoTone, DeleteTwoTone, FlagFilled, ExclamationCircleFilled } from '@ant-design/icons';
import DetailCard from './DetailCard';
import './tasks.css'
import dayjs from 'dayjs';
import { useUser } from '../contexts/UserContext';
import { PRIORITY, STATUS } from '../config/Config.js';


const { confirm } = Modal;

const Tasks = ({ users, categories, tasks, onEditTask, deleteTask}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const rowRefs = useRef({});
  const user = useUser();
  
  const handleDeleteTask = (record) => {
    confirm({
      title: 'Görevi silmek istiyor musun?',
      icon: <ExclamationCircleFilled />,
      content: <span>{record.task.title}</span>,
      okText: 'Evet',
      okType: 'danger',
      cancelText: 'Hayır',
      onOk() {
        deleteTask(record.task.id);
      },
      onCancel() {
        console.log('Silme işlemi iptal edildi.');
      },
    });
  };

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.task.id]);

      setTimeout(() => {
        const rowElement = rowRefs.current[record.task.id];
        if (rowElement) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        }, 0);

    } else {
      setExpandedRowKeys([]);
    }
  };

    const columns = [
      {
        title: 'Görev',
        align: 'center',
        dataIndex: ['task', 'title'],
        sorter: (a, b) => {
          return a.task.title.localeCompare(b.task.title, 'tr', { sensitivity: 'base' });
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Kategori',
        align: 'center',
        dataIndex: 'categories',
        filters: categories.map(category => ({
          text: category.name,
          value: category.id,
        })),
        onFilter: (value, record) => {
          return record.categories.some(cat => cat.id === value);
        },
        render: (items) => (
          <Avatar.Group
            shape="square"
            size="medium"
            max={{
              count: 1,
              style: { fontWeight: '500', color: '#3F72AF', backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' },
            }}
          >
            {items && items.length > 0 ? (
              items.map((item) => (
                <Avatar
                  shape="square"
                  size="large"
                  key={item.id}
                  style={{ backgroundColor: 'rgba(0,0,0,0)', color: 'black', borderColor: 'rgba(0,0,0,0)', fontSize: '14px', fontWeight: '400', transform: '1' }}
                >
                  {item.name.length <= 6 ? (item.name) : (item.name.slice(0, 5) + '..')}
                </Avatar>
              ))
            ) : ''} 
          </Avatar.Group>
        ),
      },
      {
        title: 'Tahmini Bitiş Tarihi',
        align: 'center',
        dataIndex: ['task', 'estimatedCompleteDate'],
        render: (date) => {
          return date ? dayjs(date).format('DD.MM.YYYY') : 'Bilgi Yok';
        },
        sorter: (a, b) => {
          const dateFormat = 'YYYY-MM-DD';
          const dateA = dayjs(a.task.estimatedCompleteDate, dateFormat);
          const dateB = dayjs(b.task.estimatedCompleteDate, dateFormat);
          
          if (dateA.isBefore(dateB)) return -1;
          if (dateA.isAfter(dateB)) return 1;
          return 0;
        },
      },
      {
        title: 'Durum',
        align: 'center',
        dataIndex: ['task', 'status'],
        filters: [
          {
            text: 'Ertelendi',
            value: 1,
          },
          {
            text: 'İşlemde',
            value: 2,
          },
          {
            text: 'Beklemede',
            value: 3,
          },
          {
            text: 'Tamamlandı',
            value: 4,
          },
        ],
        onFilter: (value, record) => record.task.status === value,
        render: (i) => {
          let color;

          if (STATUS[i] === "Beklemede") {
            color = '#FFEA20';
          } else if (STATUS[i] === 'Ertelendi') {
            color = '#F94A29';
          } else if (STATUS[i] === 'İşlemde') {
            color = '#008DDA';
          } else if (STATUS[i] === 'Tamamlandı') {
            color = '#88D66C';
          }
    
          return <Tag color={color}>{STATUS[i]}</Tag>;
        },
      },
      {
        title: 'Öncelik',
        align: 'center',
        dataIndex: ['task', 'priority'],
        filters: [
          {
            text: 'Düşük',
            value: 1,
          },
          {
            text: 'Orta',
            value: 2,
          },
          {
            text: 'Yüksek',
            value: 3,
          },
        ],
        onFilter: (value, record) => record.task.priority === value,
        render: (i) => {
          let color;
    
          if (PRIORITY[i] === 'Düşük') {
            color = 'warning';
          } else if (PRIORITY[i]=== 'Orta') {
            color = 'orange';
          } else if (PRIORITY[i] === 'Yüksek') {
            color = 'volcano';
          }
    
          return (
            <Tag color={color}>
              <FlagFilled style={{ marginRight: '5px' }} /> {PRIORITY[i]}
            </Tag>
          );
        },
      },
      {
        title: 'İlerleme',
        align: 'center',
        dataIndex: ['task', 'progress'],
        sorter: (a, b) => a.task.progress - b.task.progress,
        render: (text) => (
          <div style={{ display: 'inline-block', width: 45, height: 45 }}>
            <Progress type="circle" percent={text} size={45} />
          </div>
        ),
      },
      {
        title: 'Görev Sahibi',
        align: 'center',
        dataIndex: 'creator',
        filters: users.map(user => ({
          text: user.name,
          value: user.id,
        })),
        onFilter: (value, record) => record.creator.id === value,
        render: (item) => (
          <Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={item.url}>{item.name}</Avatar>
        ),
      },
      {
        title: 'Görevli Kişiler',
        align: 'center',
        dataIndex: 'assignedUsers',
        filters: users.map(user => ({
          text: user.name,
          value: user.id,
        })),
        onFilter: (value, record) => {
          return record.assignedUsers.some(aUser => aUser.id === value);
        },
        render: (items) => (
          <Avatar.Group
            size="large"
            max={{
              count: 2,
              style: { fontWeight: '500', color: '#3F72AF', backgroundColor: '#f2dac8' },
            }}
          >
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <Avatar
                  key={item.id}
                  style={{ backgroundColor: '#78bf9b' }}
                  src={item.url}
                >
                  {item.name}
                </Avatar>
              ))
            ) : ''} 
          </Avatar.Group>
        ),
      },
      {
        title: 'Aksiyon',
        align: 'center',
        dataIndex: '',
        key: 'x',
        render: (text, record) => {
          const canDelete = ((user.id === record.creator.id) || (user.role === 1));
    
          if (record.task.progress !== 100) {
            return (
              <Space>
                <Button type="text" shape="circle" onClick={() => onEditTask(record)}>
                  <EditTwoTone twoToneColor="#3F72AF" />
                </Button>
    
                <Divider type="vertical" />
    
                {canDelete ? (
                  <Button type="text" shape="circle" onClick={() => handleDeleteTask(record)}>
                    <DeleteTwoTone twoToneColor="#3F72AF" />
                  </Button>
                ) : (
                  <Button style={{cursor: 'default', visible: 'none'}} type="link" shape="circle"></Button>
                )}
              </Space>
            );
          } else {
            return null;
          }
        },
      },
    ];
    
    const onChange = (filters, sorter, extra) => {
      console.log('params', filters, sorter, extra);
    };
    

    return (
        <Table
            sticky={true}
            columns={columns}
            pagination={false}
            scroll={{
              y: window.innerHeight * 0.74,
            }}
            onChange={onChange}
            showSorterTooltip={{
            target: 'sorter-icon',
            }}
            expandable={{
              expandedRowRender: (record) => (
                <div ref={(el) => (rowRefs.current[record.task.id] = el)}>
                <DetailCard
                  categories={categories}
                  users={users}
                  data={record}
                />
                </div>
              ),
              expandedRowKeys: expandedRowKeys,
              onExpand: handleExpand,
            }}
            dataSource={tasks}
            rowKey={(record) => record.task.id}
            rowClassName={(record, index) => (index % 2 === 1 ? 'striped-row' : '')}
        />
    );
};

export default Tasks;