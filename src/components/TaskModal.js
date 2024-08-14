import React, { useEffect } from 'react';
import { Modal, DatePicker, Input, Select, Slider, Form, Row, Col } from 'antd';


const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;


const TaskModal = ({ onOpen, task, onClose }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (task) {
            form.setFieldsValue(task); // Düzenleme işlemi için formu doldur
        } else {
            form.resetFields(); // Yeni görev için formu sıfırla
        }
    }, [task, form]);

    return (
        <Modal
            centered
            okText='Ekle'
            cancelText='İptal'
            destroyOnClose='true'
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
                    <Select mode="multiple" defaultValue="erkman" disabled style={{ width: 250, marginRight: '40px' }}>
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
                style={{ marginTop: '30px'}}
            >

                <Form.Item label="Görev" name="title">
                    <Input placeholder="Görev giriniz" />
                </Form.Item>
          
                <Form.Item label="Detay" name="description">
                    <TextArea rows={5} placeholder="Detay bilgisi giriniz" />
                </Form.Item>
          
                <Form.Item name="start_date">
                    <Row>
                        <Col span={12}>
                            <label>Başlangıç Tarihi</label>
                        </Col>
                        <Col span={12}>
                            <label>Bitiş Tarihi</label>
                        </Col>
                    </Row>
                    <RangePicker style={{ width: '100%' }} />
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
                            />
                        </Form.Item>
                    </Col>
                </Row>
                
            </Form>
        </Modal>
    );
}

export default TaskModal;