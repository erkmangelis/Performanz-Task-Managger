import React from 'react';
import { Table, Space, Modal, Divider, Button, Avatar, List } from 'antd';
import { CrownFilled, DeleteTwoTone, EditTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';


const { confirm } = Modal;

const Users = ({ userList, deleteUser, onEditUser }) => {
    const {user} = useUser();
    

    const handleDeleteUser = (record) => {
        confirm({
          title: 'Kullanıcıyı silmek istiyor musun?',
          icon: <ExclamationCircleFilled />,
          content:
          <List
            itemLayout="horizontal"
            headerbg="#ff7d06"
          >
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={record.url}>{record.name}</Avatar>}
                title={record.username}
                description={record.name + " " + record.surname}
              />
            </List.Item>
          </List>,
          okText: 'Evet',
          okType: 'danger',
          cancelText: 'Hayır',
          onOk() {
            deleteUser(record.id);
          },
          onCancel() {
            console.log('Silme işlemi iptal edildi.');
          },
        });
      };


    const columns = [
        {
            title: '',
            align: 'center',
            dataIndex: [],
            width: 100,
            sorter: (a, b) => a.role - b.role,
            defaultSortOrder: 'ascend',
            render: (record) => {
              return record.role === 1 ? <CrownFilled style={{color: '#F94A29'}} /> : "";
            }
        },
        {
            title: 'Profil Fotoğrafı',
            align: 'center',
            width: 200,
            dataIndex: ["url"],
            render: (url, record) => (
                <Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={url}>{record.name}</Avatar>
            )
        },
        {
          title: 'Ad',
          align: 'center',
          dataIndex: ["name"],
          sorter: (a, b) => {
            return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
          },
          sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Soyad',
            align: 'center',
            dataIndex: ["surname"],
            sorter: (a, b) => {
                return a.surname.localeCompare(b.surname, 'tr', { sensitivity: 'base' });
              },
              sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Kullanıcı Adı',
            align: 'center',
            dataIndex: ["username"],
            filters: userList.map(usr => ({
                text: usr.username,
                value: usr.id,
              })),
            onFilter: (value, record) => record.id === value,
        },
        {
            title: 'Aksiyon',
            align: 'center',
            dataIndex: '',
            render: (record) => {
                return (
                    <Space>
                        {(record.role !== 1 || record.id === user.id) ? (
                        <Button type="text" shape="circle" onClick={() => onEditUser(record)}>
                            <EditTwoTone twoToneColor="#3F72AF" />
                        </Button>
                        ) : (
                        <Button style={{cursor: 'default', visible: 'none'}} type="link" shape="circle"></Button>
                        )}
                        
                        <Divider type="vertical" />
    
                        {(record.role !== 1) ? (
                        <Button type="text" shape="circle" onClick={() => handleDeleteUser(record)}>
                            <DeleteTwoTone twoToneColor="#3F72AF" />
                        </Button>
                        ) : (
                        <Button style={{cursor: 'default', visible: 'none'}} type="link" shape="circle"></Button>
                        )}
                    </Space>
                );
            }
        }
    ];

    const locale = {
        filterTitle: 'Filtre Menüsü',
        filterConfirm: 'Tamam',
        filterReset: 'Sıfırla',
        emptyText: 'Veri Bulunamadı',
        selectAll: 'Tümünü Seç',
        selectInvert: 'Seçimi Ters Çevir',
        sortTitle: 'Sıralama',
        triggerAsc: 'Artan sırayla sıralamak için tıklayın',
        triggerDesc: 'Azalan sırayla sıralamak için tıklayın', 
        cancelSort: 'Sıralamayı iptal etmek için tıklayın',
    };

    return (
        <Table
            locale={locale}
            sticky={true}
            columns={columns}
            pagination={false}
            scroll={{
              y: window.innerHeight * 0.74,
            }}
            showSorterTooltip={{
            target: 'sorter-icon',
            }}
            dataSource={userList}
            rowKey={(record) => record.id}
            rowClassName={(record, index) => (index % 2 === 1 ? 'striped-row' : '')}
        />
    );
};

export default Users;