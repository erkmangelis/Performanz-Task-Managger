import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Space, Tag, Progress, Modal, Divider, Button } from 'antd';
import { EditTwoTone, DeleteTwoTone, FlagFilled, ExclamationCircleFilled } from '@ant-design/icons';
import DetailCard from './DetailCard';
import './tasks.css'
import TaskModal from './TaskModal';


const { confirm } = Modal;

const onDeleteTask = (record) => {
  confirm({
    title: 'Görevi silmek istiyor musun?',
    icon: <ExclamationCircleFilled />,
    content: <span>{record.title}</span>,
    okText: 'Evet',
    okType: 'danger',
    cancelText: 'Hayır',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

const Tasks = ({ userId, userRole, data, onEditTask }) => {
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [expandedRowData, setExpandedRowData] = useState(null);
  const rowRefs = useRef({});

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

    const user_id = 2;

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
          onFilter: (value, record) => record.category.indexOf(value) === 0
        },
        {
          title: 'Tahmini Bitiş Tarihi',
          align: 'center',
          dataIndex: 'estimatedFinishDate',
          defaultSortOrder: 'descend',
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
          onFilter: (value, record) => record.status.indexOf(value) === 0,
          render: (text) => {
            let color;
            
            if (text === 'Beklemede') {
              color = '#FFEA20';
            }
            if (text === 'Ertelendi') {
              color = '#F94A29';
            }
            if (text === 'İşlemde') {
              color = '#008DDA';
            }
            if (text === 'Tamamlandı') {
              color = '#88D66C';
          }
            
            return (
              <Tag color={color}> {text} </Tag>
            );
          }
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
            onFilter: (value, record) => record.priority.indexOf(value) === 0,
            render: (text) => {
                let color;
                
                if (text === 'Düşük') {
                  color = 'warning';
                } 
                if (text === 'Orta') {
                  color = 'orange';
                }
                if (text === 'Yüksek') {
                  color = 'volcano';
                }
                
                return (
                  <Tag color={color}><FlagFilled style={{marginRight: '5px'}}/> {text}</Tag>
                );
              }
        },
        {
            title: 'İlerleme',
            align: 'center',
            dataIndex: 'progress',
            sorter: (a, b) => a.progress - b.progress,
            render: (text) => 
              <div style={{ display: 'inline-block', width: 45, height: 45 }}>
                    <Progress type="circle" percent={text} size={45} />
              </div>
        },
        {
            title: 'Aksiyon',
            align: 'center',
            dataIndex: '',
            key: 'x',
            render: (text, record) => {
              const canDelete = ((userId === record.addedUser.user.id) || (userRole === "Admin"));

              if (canDelete) {
                return (
                  <Space>
                    <Button type="text" shape="circle" onClick={() => onEditTask(record)}><EditTwoTone twoToneColor="#3F72AF"/></Button>
                    <Divider type="vertical" />
                    <Button type="text" shape="circle" onClick={() => onDeleteTask(record)}><DeleteTwoTone twoToneColor="#3F72AF"/></Button>
                  </Space>);
              } else {
                return (
                  <Space>
                    <Button type="text" shape="circle" onClick={() => onEditTask(record)}><EditTwoTone twoToneColor="#3F72AF"/></Button>
                    <Divider type="vertical" />
                    <Button style={{cursor: 'default', visible: 'none'}} type="link" shape="circle"></Button>
                  </Space>);
              };
            }
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
                  data={expandedRowData && expandedRowData.id === record.id ? expandedRowData : ''}
                /></div>
              ),
              onExpand: handleExpand,
              expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            }}
            dataSource={data}
            rowKey='id'
            rowClassName={(record, index) => (index % 2 === 1 ? 'striped-row' : '')}
        />
    );
};

export default Tasks;