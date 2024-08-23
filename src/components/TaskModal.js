import React, { useState, useEffect } from 'react';
import { ConfigProvider, Modal, DatePicker, Input, Select, Slider, Form, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import trTR from 'antd/lib/locale/tr_TR';
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
            setAssignedUser([data.assignedUsers.map(x => x.id)]);
            const formValues = {
                "title": data.task.title,
                "description": data.task.description,
                "dateRange": [dayjs(data.task.startDate, 'YYYY-MM-DD'), dayjs(data.task.estimatedCompleteDate, 'YYYY-MM-DD')],
                "categories": data.categories.map(category => (category.id)),
                "priority": PRIORITY[data.task.priority],
                "status": STATUS[data.task.status],
                "progress": data.task.progress
            };
            form.setFieldsValue(formValues);
        } else {
            form.resetFields();
            if (user.role !== 1) {
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
            let newTask = {
                "id": 0,
                "title": values.title,
                "description": values.description,
                "priority": values.priority,
                "status": values.status,
                "progress": values.progress,
                "addedDate": new Date().toISOString(),
                "startDate": values.dateRange[0],
                "estimatedCompleteDate": values.dateRange[1],
                "completeDate": null,
                "updateDate": new Date().toISOString(),
                "createdByUserId": user.id,
            };

            if (data) {
                newTask = {
                    ...newTask,
                    "id": data.task.id,
                    "status": isInteger(newTask.status) ? values.status : data.task.status,
                    "priority": isInteger(newTask.priority) ? values.priority : data.task.priority,
                    "createdByUserId": data.creator.id,
                    "addedDate": new Date(data.task.addedDate).toISOString(),
                    "completeDate": (newTask.progress === 100 || newTask.status === "4") ? new Date().toISOString() : null,
                };
            }
            onSave(newTask, assignedUser, values.categories);
            onClose();
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
                        defaultValue={data ? data.assignedUsers.map(assignedUser => assignedUser.id) : (user.role !==1 ? user.id : [])}
                        disabled={ user.role !== 1}
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
                  }}
            >

                <Form.Item label="Görev" name="title" rules={[{ required: true }]}>
                    <Input placeholder="Görev giriniz" />
                </Form.Item>
          
                <Form.Item label="Detay" name="description" rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder="Detay bilgisi giriniz" />
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
                        rules={[{ required: true }]}
                    >
                        <RangePicker placeholder={['Başlangıç giriniz', 'Bitiş giriniz']} format={"DD.MM.YYYY"} style={{ width: '100%' }} />
                    </Form.Item>
                </ConfigProvider>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Kategoriler" name="categories" rules={[{ required: true }]}>
                            <Select mode="multiple" placeholder="Seçin">
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}> {category.name} </Option>
                            ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Öncelik" name="priority" rules={[{ required: true }]}>
                            <Select placeholder="Seçin">
                                <Option value="1">Düşük</Option>
                                <Option value="2">Orta</Option>
                                <Option value="3">Yüksek</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Durum" name="status" rules={[{ required: true }]}>
                            <Select placeholder="Seçin">
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