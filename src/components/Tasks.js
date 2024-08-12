import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Space, Tag } from 'antd';
import { EditTwoTone, DeleteTwoTone, FlagFilled } from '@ant-design/icons';
import DetailCard from './DetailCard';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './tasks.css'


const Tasks = () => {
    let tasks = [
      {
        "id": 1,
        "key": 1,
        "title": "Panel UI Değiştir",
        "description": "UI daha modern olmalı, bu doğrultuda değişecek.",
        "category": "Web Panel",
        "status": "Beklemede",
        "priority": "Yüksek",
        "progress": 60,
        "start_date": "10.06.2024",
        "estimated_end_date": "15.07.2024",
        "complete_date": "17.07.2024",
        "added_date": "10.06.2024",
        "update_date": "17.07.2024"
      },
      {
        "id": 2,
        "key": 2,
        "title": "Panel'e Pop-Up Eklenecek",
        "description": "Yeni pencerede açılan eklentiler pop-up olarak değiştirilecek.",
        "category": "Web Panel",
        "status": "Tamamlandı",
        "priority": "Orta",
        "progress": 100,
        "start_date": "05.07.2024",
        "estimated_end_date": "20.07.2024",
        "complete_date": "",
        "added_date": "05.07.2024",
        "update_date": "18.07.2024"
      },
      {
        "id": 3,
        "key": 3,
        "title": "Uygulama Bluetooth Bağlantı Hatası",
        "description": "Spark cihazı bluetooth ile bağlanmaya çalışınca alınan hata düzeltilecek.",
        "category": "Spark",
        "status": "Ertelendi",
        "priority": "Düşük",
        "progress": 0,
        "start_date": "10.07.2024",
        "estimated_end_date": "20.09.2024",
        "complete_date": "",
        "added_date": "05.07.2024",
        "update_date": "10.07.2024"
      },
      {
        "id": 4,
        "key": 4,
        "title": "Zıpzıp Algoritması Yenilenecek",
        "description": "Zıpzıp cihazının sporcunun havada kalma süresini hesaplayan algoritma yenilenecek.",
        "category": "Zıpzıp",
        "status": "İşlemde",
        "priority": "Düşük",
        "progress": 10,
        "start_date": "25.06.2024",
        "estimated_end_date": "15.07.2024",
        "complete_date": "",
        "added_date": "09.06.2024",
        "update_date": "10.07.2024"
      },
      {
        "id": 5,
        "key": 5,
        "title": "Zıpzıp Algoritması Yenilenecek",
        "description": "Zıpzıp cihazının sporcunun havada kalma süresini hesaplayan algoritma yenilenecek.",
        "category": "Zıpzıp",
        "status": "İşlemde",
        "priority": "Düşük",
        "progress": 10,
        "start_date": "25.06.2024",
        "estimated_end_date": "15.07.2024",
        "complete_date": "",
        "added_date": "09.06.2024",
        "update_date": "10.07.2024"
      },
      {
        "id": 6,
        "key": 6,
        "title": "Zıpzıp Algoritması Yenilenecek",
        "description": "Zıpzıp cihazının sporcunun havada kalma süresini hesaplayan algoritma yenilenecek.",
        "category": "Zıpzıp",
        "status": "İşlemde",
        "priority": "Düşük",
        "progress": 10,
        "start_date": "25.06.2024",
        "estimated_end_date": "15.07.2024",
        "complete_date": "",
        "added_date": "09.06.2024",
        "update_date": "10.07.2024"
      },
      {
        "id": 7,
        "key": 7,
        "title": "Zıpzıp Algoritması Yenilenecek",
        "description": "Zıpzıp cihazının sporcunun havada kalma süresini hesaplayan algoritma yenilenecek.",
        "category": "Zıpzıp",
        "status": "İşlemde",
        "priority": "Düşük",
        "progress": 10,
        "start_date": "25.06.2024",
        "estimated_end_date": "15.07.2024",
        "complete_date": "",
        "added_date": "09.06.2024",
        "update_date": "10.07.2024"
      },
      {
        "id": 8,
        "key": 8,
        "title": "Zıpzıp Algoritması Yenilenecek",
        "description": "Zıpzıp cihazının sporcunun havada kalma süresini hesaplayan algoritma yenilenecek.",
        "category": "Zıpzıp",
        "status": "İşlemde",
        "priority": "Düşük",
        "progress": 10,
        "start_date": "25.06.2024",
        "estimated_end_date": "15.07.2024",
        "complete_date": "",
        "added_date": "09.06.2024",
        "update_date": "10.07.2024"
      },
      {
        "id": 9,
        "key": 9,
        "title": "Zıpzıp Algoritması Yenilenecek",
        "description": "Zıpzıp cihazının sporcunun havada kalma süresini hesaplayan algoritma yenilenecek.",
        "category": "Zıpzıp",
        "status": "İşlemde",
        "priority": "Düşük",
        "progress": 10,
        "start_date": "25.06.2024",
        "estimated_end_date": "15.07.2024",
        "complete_date": "",
        "added_date": "09.06.2024",
        "update_date": "10.07.2024"
      }
    ];
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
          dataIndex: 'estimated_end_date',
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
                <div style={{ display: 'inline-block', width: 40, height: 40, }}>
                    <CircularProgressbar value={text} text={`${text}%`} styles={buildStyles({textSize: '28px'})} />
                </div>
        },
        {
            title: 'Aksiyon',
            align: 'center',
            dataIndex: '',
            key: 'x',
            render: () =>
            <Space>
              <a><EditTwoTone twoToneColor="#ff7d06"/></a>
              <a><DeleteTwoTone twoToneColor="#ff7d06"/></a>
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
            scroll={{
              y: window.innerHeight * 0.7,
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