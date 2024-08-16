import React, { useEffect } from 'react';
import { Modal, DatePicker, Input, Select, Slider, Form, Row, Col } from 'antd';
import moment from 'moment';
import { useUser } from '../contexts/UserContext';
import { PRIORITY, STATUS } from '../config/Config.js';


const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;


const TaskModal = ({ onOpen, task, onClose, onSave }) => {

    const user = useUser();
    const [form] = Form.useForm();
    
    useEffect(() => {
        if (task) {
            let holder = [task.status, task.priority];
            task.status = STATUS[task.status];
            task.priority = PRIORITY[task.priority];
            task.dateRange = [moment(task.startDate, "DD.MM.YYYY"), moment(task.estimatedCompleteDate, "DD.MM.YYYY")];
            form.setFieldsValue(task);
            task.status = holder[0];
            task.priority = holder[1];
        } else {
            form.resetFields();
        }
    }, [task, form]);

    const handleOk = () => {
        
        form.validateFields()
          .then(values => {
            const newTask = {
              title: values.title,
              description: values.description,
              //category: values.category,
              priority: values.priority,
              status: values.status,
              progress: values.progress,
              startDate: values.dateRange[0].format("DD.MM.YYYY"),
              estimatedCompleteDate: values.dateRange[1].format("DD.MM.YYYY"),
            };

            if (task) {
                newTask.id = task.id;
            };
            //onSave(newTask);
            console.log(newTask)
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
            okText={task ? 'Kaydet' : 'Ekle'}
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

                    <span>{task ? "Görevi Düzenle" : "Görev Oluştur"}</span>
                    <Select mode="multiple" defaultValue={user.role !== "Admin" ? [user.name] : []} disabled={(task !==null || user.role !== "Admin")} style={{ width: 250, marginRight: '40px' }}>
                        <Option value="erkman">Erkman</Option>
                        <Option value="onur">Onur</Option>
                        <Option value="iliya">İliya</Option>
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
                    priority: 'Orta',
                    status: 'İşlemde',
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
                    <RangePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>
          
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Öncelik" name="priority">
                            <Select defaultValue="Orta">
                                <Option value="1">Düşük</Option>
                                <Option value="2">Orta</Option>
                                <Option value="3">Yüksek</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Durum" name="status">
                            <Select defaultValue="İşlemde">
                                <Option value="1">Ertelendi</Option>
                                <Option value="3">Beklemede</Option>
                                <Option value="2">İşlemde</Option>
                                <Option value="4">Tamamlandı</Option>
                            </Select>
                        </Form.Item>      
                    </Col>
                </Row>

                <Form.Item label="Durum" name="progress">
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