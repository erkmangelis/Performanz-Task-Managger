import React, { useRef, useState, useEffect } from 'react';
import { Table, Space, Tag, Progress, Modal, Divider, Button, Avatar, Input, Popover, DatePicker, Empty } from 'antd';
import { EditTwoTone, DeleteTwoTone, FlagFilled, ExclamationCircleFilled, ClockCircleOutlined, CrownFilled, PlusOutlined, SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import DetailCard from './DetailCard';
import dayjs from 'dayjs';
import { ADMIN } from '../config/Config.js';
import { useUser } from '../contexts/UserContext';
import { PRIORITY, STATUS } from '../config/Config.js';
import { calculateRemainingTime } from '../services/remainingTimeService';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { confirm } = Modal;

const Tasks = ({ addTask, users, categories, tasks, onEditTask, deleteTask, sFilter, setNotifications}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const rowRefs = useRef({});
  const {user} = useUser();
  const [statusFilter, setStatusFilter] = useState(sFilter); 
  const [categoriesFilter, setCategoriesFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [creatorFilter, setCreatorFilter] = useState([]);
  const [assignedUsersFilter, setAssignedUsersFilter] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(tasks);


  const filterTasks = (searchTitle, dates) => {
    const filtered = tasks.filter((item) => {
      const itemDate = dayjs(item.task.estimatedCompleteDate);
      const startDate = dates[0] ? dayjs(dates[0]) : null;
      const endDate = dates[1] ? dayjs(dates[1]) : null;
      const isWithinRange = !startDate || !endDate || (itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate));
      return item.task.title.toLowerCase().includes(searchTitle.toLowerCase()) && isWithinRange;
    });
    setFilteredTasks(filtered);
  };

  useEffect(() => {
    filterTasks(searchTitle, dateRange);
    setStatusFilter(sFilter);
  }, [sFilter, tasks]);

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    } else {
      setDateRange([]);
    };
  };

  const handleSearch = (e) => {
    if (e && e.target) {
      const newSearchText = e.target.value;
      setSearchTitle(newSearchText);
      filterTasks(newSearchText, dateRange);
    }
  };

  const handleTitleReset = () => {
    setSearchTitle('');
    filterTasks('', dateRange);
  };

  const handleDateReset = () => {
    setDateRange([]);
    filterTasks(searchTitle, []);
  };

  const handleApply = () => {
    filterTasks(searchTitle, dateRange);
  };

  const handleDeleteTask = (record) => {
    confirm({
      title: 'Görevi silmek istiyor musun?',
      icon: <ExclamationCircleFilled />,
      content: <span>{record.task.title}</span>,
      okText: 'Evet',
      okType: 'danger',
      cancelText: 'Hayır',
      onOk() {
        deleteTask(record.task);
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

  const handleCategoryAdd = () => {
    addTask(inputValue);
    setInputValue("");
  };

  const rangePresets = [
    {
      label: 'Son 3 Gün',
      value: [dayjs().add(-3, 'd'), dayjs()],
    },
    {
      label: 'Son 5 Gün',
      value: [dayjs().add(-5, 'd'), dayjs()],
    },
    {
      label: 'Son 7 Gün',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: 'Son 14 Gün',
      value: [dayjs().add(-14, 'd'), dayjs()],
    },
    {
      label: 'Son 30 Gün',
      value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
      label: 'Son 60 Gün',
      value: [dayjs().add(-60, 'd'), dayjs()],
    },
    {
      label: 'Son 90 Gün',
      value: [dayjs().add(-90, 'd'), dayjs()],
    },
  ];

  const columns = [
      {
        title: '',
        align: 'left',
        dataIndex: ['creator', 'id'],
        width: 30,
        render: (id) => {
          const user = users.find(u => u.id === id);  // Burada item.id yerine doğrudan id'yi kullanıyoruz.
          if (user) {
            return user.role === 1 ? <CrownFilled style={{color: '#F94A29'}} /> : null;
          }
          return null;
        },
        sorter: (a, b) => {
          const dateFormat = 'YYYY-MM-DD';
          const dateB = dayjs(a.task.updateDate, dateFormat);
          const dateA = dayjs(b.task.updateDate, dateFormat);
          
          if (dateA.isBefore(dateB)) return -1;
          if (dateA.isAfter(dateB)) return 1;
          return 0;
        }
      },
      {
        title: 'Görev',
        align: 'center',
        width: '20%',
        dataIndex: ['task', 'title'],
        sorter: (a, b) => {
          return a.task.title.localeCompare(b.task.title, 'tr', { sensitivity: 'base' });
        },
        sortDirections: ['ascend', 'descend'],
        render: (item) => {
          return <span style={{fontWeight: '500'}}>{item}</span>
        },
        filterDropdown: () => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Görev Ara"
              value={searchTitle}
              onChange={handleSearch}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Button type={"text"} size="small" style={{color: '#1677ff'}} onClick={handleTitleReset}>Sıfırla</Button>
          </div>
        ),
        filterIcon: <SearchOutlined />,
        onFilter: (value, record) =>
          record.task.title.toLowerCase().includes(value.toLowerCase()),
      },
      {
        title: (user.role === ADMIN || user.id === 3 ?
        <>
          <Popover 
          trigger="click"
          content={
            <Space.Compact style={{ width: '100%' }}>
              <Input value={inputValue} placeholder="Görev adı girin" onChange={(e) => setInputValue(e.target.value)} />
              <Button disabled={!inputValue} type="primary" style={{ backgroundColor: '#3F72AF' }} onClick={handleCategoryAdd}> Ekle </Button>
            </Space.Compact>}
          >
            <Button style={{padding: '10px', height: '16px', width: '16px'}} type='text' icon={<PlusOutlined />} />
          </Popover>
          <span style={{marginLeft: '6px'}}>Kategori</span>
        </> :
          <span>Kategori</span>
        ),
        align: 'center',
        dataIndex: 'categories',
        filters: categories.map(category => ({
          text: category.name,
          value: category.id,
        })),
        onFilter: (value, record) => {
          return record.categories.some(cat => cat.id === value);
        },
        filteredValue: categoriesFilter,
        filterSearch: true,
        render: (items) => (
          <Avatar.Group
            shape="circle"
            size="medium"
            max={{
              count: 1,
              style: { fontWeight: '500', color: 'white', backgroundColor: '#3F72AF', borderColor: 'rgba(0,0,0,0)', border: '4px, solid', cursor: 'default'},
            }}
          >
            {items && items.length > 0 ? (
              items.map((item) => (
                <Avatar
                  shape="square"
                  size="large"
                  key={item.id}
                  style={{ zIndex: '100', backgroundColor: 'rgba(0,0,0,0)', color: 'black', borderColor: 'rgba(0,0,0,0)', fontSize: '14px', fontWeight: '400', transform: '1' }}
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
        render: (date, record) => {
          const dateInfo = calculateRemainingTime(date);
          return record.task.progress !== 100 ? ( record.task.status !== 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: dateInfo.color}}>
              <span>{dayjs(date).format('DD.MM.YYYY')}</span>
              <span style={{fontSize: '10px'}}> {dateInfo.status} <ClockCircleOutlined /> </span>
            </div> ) : ("")
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>{dayjs(date).format('DD.MM.YYYY')}</span>
            </div>
          );
        },
        sorter: (a, b) => {
          const dateFormat = 'YYYY-MM-DD';
          const dateA = dayjs(a.task.estimatedCompleteDate, dateFormat);
          const dateB = dayjs(b.task.estimatedCompleteDate, dateFormat);
          
          if (dateA.isBefore(dateB)) return -1;
          if (dateA.isAfter(dateB)) return 1;
          return 0;
        },
        defaultSortOrder: 'ascend',
        filterDropdown: () => (
          <div style={{ padding: 8, width: '300px' }}>
            <div>
            <RangePicker
              presets={rangePresets}
              format="DD.MM.YYYYY"
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ marginBottom: 8 }}
              placeholder={['Başlangıç Tarihi', 'Bitiş Tarihi']}
              showTime={false}
            />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Button type="text" size="small" style={{color: '#1677ff'}} onClick={handleDateReset}>Sıfırla</Button>
              <Button type="primary" size="small" onClick={handleApply}>Tamam</Button>
            </div>
          </div>
        ),
        filterIcon: <CalendarOutlined />,
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
            text: 'Beklemede',
            value: 2,
          },
          {
            text: 'İşlemde',
            value: 3,
          },
          {
            text: 'Tamamlandı',
            value: 4,
          },
        ],
        onFilter: (value, record) => record.task.status === value,
        filteredValue: statusFilter,
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
        filteredValue: priorityFilter,
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
        filters: users
        .filter(user => user.isActive) // Sadece isActive === true olan kullanıcılar
        .map(user => ({
          text: user.name + " " + user.surname,
          value: user.id,
        })),
        onFilter: (value, record) => record.creator.id === value,
        filteredValue: creatorFilter,
        render: (item) => (
          <Avatar style={{ backgroundColor: '#78bf9b', verticalAlign: 'middle'}} size='large' src={item.url}>{item.name}</Avatar>
        ),
      },
      {
        title: 'Görevli Kişiler',
        align: 'center',
        dataIndex: 'assignedUsers',
        filters: users
        .filter(user => user.isActive) // Sadece isActive === true olan kullanıcılar
        .map(user => ({
          text: user.name + " " + user.surname,
          value: user.id,
        })),
        onFilter: (value, record) => {
          return record.assignedUsers.some(aUser => aUser.id === value);
        },
        filteredValue: assignedUsersFilter,
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
          const canDelete = ((user.id === record.creator.id) || (user.role === ADMIN));
    
            return (
              <Space>
                <Button type="text" shape="circle" onClick={() => onEditTask(record)}>
                  <EditTwoTone twoToneColor="#3F72AF" />
                </Button>
    
                <Divider type="vertical" />
    
                {(canDelete && record.task.progress !== 100) ? (
                  <Button type="text" shape="circle" onClick={() => handleDeleteTask(record)}>
                    <DeleteTwoTone twoToneColor="#3F72AF" />
                  </Button>
                ) : (
                  <Button style={{cursor: 'default', visible: 'none'}} type="link" shape="circle"></Button>
                )}
              </Space>
            );
        },
      },
    ];
    
    const onChange = (filters, sorter, extra) => {
      setStatusFilter(sorter['task.status'] || []);
      setPriorityFilter(sorter['task.priority'] || []);
      setCreatorFilter(sorter['creator'] || []);
      setAssignedUsersFilter(sorter['assignedUsers'] || []);
      setCategoriesFilter(sorter['categories'] || []);
    };
    
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
      emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>Görev Bulunamadı</span>}
          />
      )
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
                  setNotifications={setNotifications}
                />
                </div>
              ),
              expandedRowKeys: expandedRowKeys,
              onExpand: handleExpand,
            }}
            dataSource={filteredTasks}
            rowKey={(record) => record.task.id}
            rowClassName={(record, index) => (index % 2 === 1 ? 'striped-row' : '')}
        />
    );
};

export default Tasks;