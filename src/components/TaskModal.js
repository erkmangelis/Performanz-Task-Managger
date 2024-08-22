import React, { useState, useEffect } from 'react';
import { Modal, DatePicker, Input, Select, Slider, Form, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { useUser } from '../contexts/UserContext';
import { PRIORITY, STATUS } from '../config/Config.js';


const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;


const TaskModal = ({ categories, users, onOpen, data, onClose, onSave }) => {
    const user = useUser();
    const [form] = Form.useForm();
    const [assignedUser, setAssignedUser] = useState([]);

    
    useEffect(() => {
        if (data) {
            const formValues = {
                title: data.task.title,
                description: data.task.description,
                dateRange: [dayjs(data.task.startDate, 'YYYY-MM-DD'), dayjs(data.task.estimatedCompleteDate, 'YYYY-MM-DD')],
                categories: data.task.categories,
                priority: PRIORITY[data.task.priority],
                status: STATUS[data.task.status],
                progress: data.task.progress
            }
            form.setFieldsValue(formValues);
        } else {
            form.resetFields();
        }
    }, [data, form]);

    const handleOk = () => {
        form.validateFields()
          .then(values => {
            let newTask = {
                "id": 0,
                "title": values.title,
                "description": values.description,
                "priority": values.priority,
                "status": values.status,
                "progress": values.progress,
                "addedDate": "2024-08-22T14:27:07.909Z",
                "startDate": "2024-08-22T14:27:07.909Z",
                "estimatedCompleteDate": "2024-08-22T14:27:07.909Z",
                "completeDate": "2024-08-22T14:27:07.909Z",
                "updateDate": "2024-08-22T14:27:07.909Z",
                "createdByUserId": user.id,
            };

            if (data) {
                newTask = {
                    ...newTask,
                    "id": data.task.id,
                    "status": typeof newTask.status === 'string' ? data.task.status : values.status,
                    "priority": typeof newTask.priority === 'string' ? data.task.priority : values.priority,
                    "addedDate": "2024-08-22T14:27:07.909Z",
                    "createdByUserId": data.creator.id,
                };
            }
            onSave(newTask, assignedUser, values.categories);
            onClose();
            form.resetFields();
          })
          .catch(errorInfo => {
            console.error('Form validation failed:', errorInfo);
          });
      };

    return (
        <Modal
            centered
            okText={data ? 'Kaydet' : 'Ekle'}
            cancelText='İptal'
            destroyOnClose={true}
            open={onOpen}
            onOk={handleOk}
            onCancel={onClose}
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                    <span>{data ? "Görevi Düzenle" : "Görev Oluştur"}</span>
                    <Select
                        mode="multiple"
                        defaultValue={data ? data.assignedUsers.map(assignedUser => assignedUser.name) : (user.role !==1 ? user.name : [])}
                        disabled={data !== null || user.role !== 1}
                        style={{ width: 250, marginRight: '40px' }}
                        onChange={(value) => setAssignedUser(value)}
                    >
                        {users.map(user => (
                            <Option key={user.id} value={user.id}> {user.name} </Option>
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
                    priority: 2,
                    status: 2,
                  }}
            >

                <Form.Item label="Görev" name="title" rules={[{ required: true }]}>
                    <Input placeholder="Görev giriniz" />
                </Form.Item>
          
                <Form.Item label="Detay" name="description" rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder="Detay bilgisi giriniz" />
                </Form.Item>
          
                <Form.Item
                    name="dateRange"
                    label= {
                        <span>
                            <label>Başlangıç Tarihi</label>
                            <label style={{marginLeft: '150px'}}>Tahmini Bitiş Tarihi</label>
                        </span>
                    }
                    rules={[{ required: true }]}
                >
                    <RangePicker format={"DD.MM.YYYY"} style={{ width: '100%' }} />
                </Form.Item>
          
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Kategoriler" name="categories">
                            <Select mode="multiple">
                                <Option value="1">Zıpzıp</Option>
                                <Option value="2">Web Panel</Option>
                                <Option value="3">Spark</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Öncelik" name="priority">
                            <Select>
                                <Option value="1">Düşük</Option>
                                <Option value="2">Orta</Option>
                                <Option value="3">Yüksek</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Durum" name="status">
                            <Select>
                                <Option value="1">Ertelendi</Option>
                                <Option value="3">Beklemede</Option>
                                <Option value="2">İşlemde</Option>
                                <Option value="4">Tamamlandı</Option>
                            </Select>
                        </Form.Item>      
                    </Col>
                </Row>

                <Form.Item label="İlerleme" name="progress">
                            <Slider
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