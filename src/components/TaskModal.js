import React, { useEffect } from 'react';
import { Modal, DatePicker, Input, Select, Slider, Form, Row, Col } from 'antd';
import moment from 'moment';


const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;


const TaskModal = ({ user, onOpen, task, onClose }) => {
    const [form] = Form.useForm();
    console.log(user.name);
    useEffect(() => {
        if (task) {
            task.dateRange = [moment(task.startDate, "DD.MM.YYYY"), moment(task.estimatedCompleteDate, "DD.MM.YYYY")];
            form.setFieldsValue(task);
        } else {
            form.resetFields();
        }
    }, [task, form]);


    return (
        <Modal
            centered
            okText='Ekle'
            cancelText='İptal'
            destroyOnClose={true}
            open={onOpen}
            onOk={onClose}
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
            >

                <Form.Item label="Görev" name="title">
                    <Input placeholder="Görev giriniz" />
                </Form.Item>
          
                <Form.Item label="Detay" name="description">
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
                >
                    <RangePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>
          
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Öncelik" name="priority">
                            <Select defaultValue="medium">
                                <Option value="low">Düşük</Option>
                                <Option value="medium">Orta</Option>
                                <Option value="high">Yüksek</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Durum" name="status">
                            <Select defaultValue="İşlemde">
                                <Option value="Ertelendi">Ertelendi</Option>
                                <Option value="Beklemede">Beklemede</Option>
                                <Option value="İşlemde">İşlemde</Option>
                                <Option value="Tamamlandı">Tamamlandı</Option>
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