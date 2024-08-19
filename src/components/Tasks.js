import React, { useRef, useState } from 'react';
import { Table, Space, Tag, Progress, Modal, Divider, Button, Avatar } from 'antd';
import { EditTwoTone, DeleteTwoTone, FlagFilled, ExclamationCircleFilled } from '@ant-design/icons';
import DetailCard from './DetailCard';
import './tasks.css'
import moment from 'moment';
import { useUser } from '../contexts/UserContext';
import { PRIORITY, STATUS } from '../config/Config.js';


const { confirm } = Modal;

const Tasks = ({ tasks, onEditTask, deleteTask}) => {
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [expandedRowData, setExpandedRowData] = useState(null);
  const rowRefs = useRef({});
  const user = useUser();
  
  const handleDeleteTask = (record) => {
    confirm({
      title: 'Görevi silmek istiyor musun?',
      icon: <ExclamationCircleFilled />,
      content: <span>{record.title}</span>,
      okText: 'Evet',
      okType: 'danger',
      cancelText: 'Hayır',
      onOk() {
        console.log('OK');
        deleteTask(record.id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKey(record.id);
      setExpandedRowData(record);

      setTimeout(() => {
        const rowElement = rowRefs.current[record.id];
        if (rowElement) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);

    } else {
      // Eğer collapse ediliyorsa ve başka bir satır expand edilmiyorsa state'i sıfırla
      if (expandedRowKey === record.id) {
        setExpandedRowKey(null);
        setExpandedRowData(null);
    }
  };
      }


    const columns = [
      {
        title: 'Görev',
        align: 'center',
        dataIndex: 'title',
        sorter: (a, b) => a.title.length - b.title.length,
        sortDirections: ['descend'],
      },
      {
        title: 'Kategori',
        align: 'center',
        dataIndex: 'category',
        filters: [
          {
            text: 'Spark',
            value: 'Spark',
          },
          {
            text: 'Zıpzıp',
            value: 'Zıpzıp',
          },
          {
            text: 'Web Panel',
            value: 'Web Panel',
          },
        ],
        onFilter: (value, record) => record.category.indexOf(value) === 0,
      },
      {
        title: 'Tahmini Bitiş Tarihi',
        align: 'center',
        dataIndex: 'estimatedCompleteDate',
        sorter: (a, b) => {
          const dateFormat = 'DD.MM.YYYY';
          return moment(a.estimatedCompleteDate, dateFormat).diff(moment(b.estimatedCompleteDate, dateFormat));
        },
      },
      {
        title: 'Durum',
        align: 'center',
        dataIndex: 'status',
        filters: [
          {
            text: 'Ertelendi',
            value: 'Ertelendi',
          },
          {
            text: 'İşlemde',
            value: 'İşlemde',
          },
          {
            text: 'Beklemede',
            value: 'Beklemede',
          },
          {
            text: 'Tamamlandı',
            value: 'Tamamlandı',
          },
        ],
        onFilter: (value, record) => STATUS[record.status].indexOf(value) === 0,
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
        dataIndex: 'priority',
        filters: [
          {
            text: 'Düşük',
            value: 'Düşük',
          },
          {
            text: 'Orta',
            value: 'Orta',
          },
          {
            text: 'Yüksek',
            value: 'Yüksek',
          },
        ],
        onFilter: (value, record) => PRIORITY[record.priority].indexOf(value) === 0,
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
        dataIndex: 'progress',
        sorter: (a, b) => a.progress - b.progress,
        render: (text) => (
          <div style={{ display: 'inline-block', width: 45, height: 45 }}>
            <Progress type="circle" percent={text} size={45} />
          </div>
        ),
      },
      {
        title: 'Ekleyen',
        align: 'center',
        dataIndex: 'creator',
        render: (item) => (
          <Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={"item.url"}>{"item.name"}</Avatar>
        ),
      },
      {
        title: 'Görev Sahibi',
        align: 'center',
        dataIndex: 'owners',
        render: (items) => (
          <div>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <Avatar
                  key={index}
                  style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle' }}
                  size='large'
                  src={item.url}
                >
                  {item.name}
                </Avatar>
              ))
            ) : ''} 
          </div>
        ),
      },
      {
        title: 'Aksiyon',
        align: 'center',
        dataIndex: '',
        key: 'x',
        render: (text, record) => {
          const canDelete = true;
    
          if (record.progress !== 100) {
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
            pagination={{
                position: ['none', 'none']
            }}
            scroll={{
              y: window.innerHeight * 0.74,
            }}
            onChange={onChange}
            showSorterTooltip={{
            target: 'sorter-icon',
            }}
            expandable={{
              expandedRowRender: (record) => (
              <div ref={(el) => (rowRefs.current[record.id] = el)}>
                <DetailCard
                  isCompleted={record.progress === 100}
                  data={expandedRowData && expandedRowData.id === record.id ? expandedRowData : ''}
                /></div>
              ),
              onExpand: handleExpand,
              expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            }}
            dataSource={tasks}
            rowKey='id'
            rowClassName={(record, index) => (index % 2 === 1 ? 'striped-row' : '')}
        />
    );
};

export default Tasks;