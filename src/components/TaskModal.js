import React, { useState, useEffect } from 'react';
import { ConfigProvider, Modal, DatePicker, Input, Select, Slider, Form, Row, Col, message, Checkbox, Tooltip } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/tr';
import trTR from 'antd/lib/locale/tr_TR';
import { useUser } from '../contexts/UserContext';
import { PRIORITY } from '../config/Config.js';
import { ADMIN } from '../config/Config.js';


const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
dayjs.locale('tr'); 
dayjs.extend(utc);
dayjs.extend(timezone);


const TaskModal = ({ categories, users, onOpen, data, onClose, onSave }) => {
    const {user} = useUser();
    const [form] = Form.useForm();
    const [assignedUser, setAssignedUser] = useState([]);
    const [checked, setChecked] = useState(false);

    
    useEffect(() => {
        if (data) {
            setAssignedUser([data.assignedUsers.map(x => x.id)]);
            const formValues = {
                "title": data.task.title,
                "description": data.task.description,
                "dateRange": [dayjs(data.task.startDate, 'YYYY-MM-DD'), dayjs(data.task.estimatedCompleteDate, 'YYYY-MM-DD')],
                "categories": data.categories.map(category => (category.id)),
                "priority": PRIORITY[data.task.priority],
                "status": data.task.status === 1 ? true : false,
                "progress": data.task.progress
            };
            form.setFieldsValue(formValues);
        } else {
            form.resetFields();
            if (user.role !== ADMIN) {
                setAssignedUser([user.id]);
            };   
        }
    }, [data]);

    function isInteger(value) {
        const parsed = Number(value);
        return !isNaN(parsed) && Number.isInteger(parsed);
      }

    const handleOk = () => {
        if (assignedUser.length === 0) {
            message.error('Görev Atanacak Kullanıcı Seçiniz!');
            return;}
        form.validateFields()
            .then(values => {
                let statistic = {isUpdate: false};
                let newTask = {
                    "id": 0,
                    "title": values.title,
                    "description": values.description,
                    "priority": values.priority,
                    "status": values.status ? 1 : 0,
                    "progress": values.progress,
                    "addedDate": dayjs().tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    "startDate": dayjs(values.dateRange[0]).add(3, 'hour'),
                    "estimatedCompleteDate": dayjs(values.dateRange[1]).add(3, 'hour'),
                    "completeDate": null,
                    "updateDate": dayjs().tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    "createdByUserId": user.id,
                };

                if (data) {
                    let completeCount = 0, processCount = 0, pendingCount = 0, postponedCount = 0;
                    newTask = {
                        ...newTask,
                        "id": data.task.id,
                        "priority": isInteger(newTask.priority) ? values.priority : data.task.priority,
                        "createdByUserId": user.role === ADMIN ? user.id : data.creator.id,
                        "addedDate": dayjs(data.task.addedDate).add(3, 'hour').toISOString(),
                    };

                    switch (data.task.status) {
                        case 1:
                            if (checked) {
                                postponedCount = 0;
                            } else {
                                postponedCount = -1;
                            };
                            break;
                        case 2:
                            if (values.progress == 0 && !checked) {
                                pendingCount = 0;
                            } else {
                                pendingCount = -1;
                            };
                            break;
                        case 3:
                            if (values.progress > 0 && values.progress < 100 && !checked) {
                                processCount = 0;
                            } else {
                                processCount = -1;
                            };
                            break;
                        case 4:
                            if (values.progress == 100 && !checked) {
                                completeCount = 0;
                            } else {
                                completeCount = -1;
                            };
                            break;
                      }

                      if (values.progress == 100 && data.task.progress != 100 && !checked) {
                        completeCount++
                      };

                      if (values.progress > 0 && values.progress < 100 && data.task.status != 3 && !checked) {
                        processCount++
                      };

                      if (values.progress == 0 && data.task.status != 2 && !checked) {
                        pendingCount++
                      };

                      if (checked && data.task.status != 1) {
                        postponedCount++
                      };

                      statistic = {
                        "isUpdate": true,
                        "completeCount": completeCount,
                        "processCount": processCount,
                        "pendingCount": pendingCount,
                        "postponedCount": postponedCount
                      }
                }
                
            onSave(newTask, assignedUser, values.categories, statistic);
            onClose();
            form.resetFields();            
          })
          .catch(errorInfo => {
            console.error('Form validation failed:', errorInfo);
          });
      };

      const handleCancel = () => {
            onClose();
      };

    return (
        <Modal
            centered
            okText={data ? 'Kaydet' : 'Ekle'}
            cancelText='İptal'
            destroyOnClose={true}
            open={onOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                    <span>{data ? "Görevi Düzenle" : "Görev Oluştur"}</span>
                    <Select
                        rules={[{ required: true }]}
                        placeholder="Kullanıcı seçiniz"
                        mode="multiple"
                        defaultValue={data ? data.assignedUsers.map(assignedUser => assignedUser.id) : (user.role !== ADMIN ? user.id : [])}
                        disabled={!(user.role === ADMIN || user.id === 3)}
                        style={{ width: 250, marginRight: '40px' }}
                        onChange={(value) => setAssignedUser(value)}
                        showSearch
                        filterOption={(input, option) => 
                            option.props.children.toString().toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {users
                        .filter(user => user.isActive) // Sadece isActive === true olan kullanıcılar
                        .map(user => (
                            <Option key={user.id} value={user.id}>
                            {user.name + " " + user.surname}
                            </Option>
                        ))}
                    </Select>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: '20px'}}
                requiredMark={false}
                initialValues={{
                    progress: 0,
                  }}
            >

                <Form.Item label="Görev" name="title" rules={[{ required: true, message: 'Görev Adı zorunludur' }]}>
                    <Input placeholder="Görev giriniz" disabled={data ? !(data.creator.id === user.id || user.role === ADMIN) : ""} />
                </Form.Item>
          
                <Form.Item label="Detay" name="description" rules={[{ required: true, message: 'Görev Detayı zorunludur' }]}>
                    <TextArea rows={4} placeholder="Detay bilgisi giriniz" disabled={data ? !(data.creator.id === user.id || user.role === ADMIN) : ""} />
                </Form.Item>
                
                <ConfigProvider locale={trTR}>
                    <Form.Item
                        name="dateRange"
                        label= {
                            <span>
                                <label>Başlangıç Tarihi</label>
                                <label style={{marginLeft: '150px'}}>Tahmini Bitiş Tarihi</label>
                            </span>
                        }
                        rules={[{ required: true, message: 'Tarih zorunludur' }]}
                    >
                        <RangePicker placeholder={['Başlangıç giriniz', 'Bitiş giriniz']} format={"DD.MM.YYYY"} style={{ width: '100%' }} disabled={data ? !(data.creator.id === user.id || user.role === ADMIN) : ""} />
                    </Form.Item>
                </ConfigProvider>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Kategoriler" name="categories" rules={[{ required: true, message: 'Kategori zorunludur' }]}>
                            <Select
                                mode="multiple"
                                placeholder="Seçin"
                                disabled={data ? !(data.creator.id === user.id || user.role === ADMIN) : ""}
                                maxTagCount="responsive"
                                maxTagPlaceholder={(omittedValues) => (
                                    <Tooltip
                                      overlayStyle={{
                                        pointerEvents: 'none',
                                      }}
                                      title={omittedValues.map(({ label }) => label[1]).join(', ')}
                                    >
                                      <span>Seçilenler</span>
                                    </Tooltip>
                                  )}
                            >
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}> {category.name} </Option>
                            ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Öncelik" name="priority" rules={[{ required: true, message: 'Öncelik zorunludur' }]}>
                            <Select placeholder="Seçin" disabled={data ? !(data.creator.id === user.id || user.role === ADMIN) : ""}>
                                <Option value="1">Düşük</Option>
                                <Option value="2">Orta</Option>
                                <Option value="3">Yüksek</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Durum" name="status" valuePropName="checked">
                            <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} disabled={data ? !(data.creator.id === user.id || user.role === ADMIN) : ""} >Ertelendi</Checkbox>
                        </Form.Item>      
                    </Col>
                </Row>

                <Form.Item label="İlerleme" name="progress">
                            <Slider
                                disabled={checked}
                                min={0}
                                max={100}
                                step={10}
                                marks={{
                                    0: '0',
                                    50: '50',
                                    100: '100',
                                }}
                                tooltip={{ placement: 'bottom' }}
                            />
                        </Form.Item>
            </Form>
        </Modal>
    );
}

export default TaskModal;