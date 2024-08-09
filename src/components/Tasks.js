import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Space, Tag } from 'antd';
import { EditTwoTone, DeleteTwoTone, MessageTwoTone } from '@ant-design/icons';
import DetailCard from './DetailCard';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Tasks = () => {
    let tasks = [];
    const user_id = 2;
    useEffect(() => {
        axios.get('http://localhost:3000/task-user?user_id='+user_id)
        .then(res => {
            res.data.forEach(item => {
                axios.get('http://localhost:3000/tasks?id='+item.task_id)
                .then(res2 => {
                    tasks.push(res2.data[0]);
                })
            })
        })
    }, [tasks]);

    const columns = [
        {
          title: 'Görev',
          dataIndex: 'title',
          sorter: (a, b) => a.title.length - b.title.length,
          sortDirections: ['descend'],
        },
        {
          title: 'Kategori',
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
          dataIndex: 'estimated_end_date',
          defaultSortOrder: 'descend',
        },
        {
          title: 'Durum',
          dataIndex: 'status',
          filters: [
            {
              text: 'Ertelendi',
              value: 'Ertelendi',
            },
            {
              text: 'Çalışılıyor',
              value: 'Çalışılıyor',
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
        },
        {
            title: 'Öncelik',
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
                  <Tag color={color}> {text} </Tag>
                );
              }
        },
        {
            title: 'İlerleme',
            dataIndex: 'progress',
            sorter: (a, b) => a.progress - b.progress,
            render: (text) => 
                <div style={{ width: 40, height: 40 }}>
                    <CircularProgressbar value={text} text={`${text}%`} />
                </div>
        },
        {
            title: 'Aksiyon',
            dataIndex: '',
            key: 'x',
            render: () =>
            <Space>
              <a><EditTwoTone twoToneColor="#ff7d06"/></a>
              <a><DeleteTwoTone twoToneColor="#ff7d06"/></a>
              <a><MessageTwoTone twoToneColor="#ff7d06"/></a>
            </Space>,
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
            onChange={onChange}
            showSorterTooltip={{
            target: 'sorter-icon',
            }}
            expandable={{
                expandedRowRender: (record) => (
                  <DetailCard />
                )
            }}
            dataSource={tasks}
        />
    );
};

export default Tasks;