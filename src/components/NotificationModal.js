import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Form, Row, Col, Avatar, Divider, Checkbox, Tooltip } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';
import dayjs from 'dayjs';


const { Option } = Select;
const { TextArea } = Input;

const NotificationModal = ({users, onOpen, onClose, onSave, type}) => {
    const {user} = useUser();
    const [form] = Form.useForm();
    const [checked, setChecked] = useState(true);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (type === 1) {
            setChecked(true);
            setUrl(user.url);
            const formValues = {
                "everyone": true,
                "name": user.name + " " + user.surname,
                "title": user.name + " " + user.surname + " bir duyuru yaptı.",
                userSelect: []
            };
            form.setFieldsValue(formValues);
        } else {
            setChecked(true);
            setUrl(null);
            const formValues = {
                "everyone": true,
                "name": "Sistem Admin",
                "title": "Sistem Admin bir duyuru yaptı.",
                userSelect: []
            };
            form.setFieldsValue(formValues);
        }
    }, [type]);

    const handleOk = () => {
        form.validateFields()
          .then(values => {
            let assignedUsers = checked ? users.filter(u => u.id !== user.id && u.isActive !== false).map(user => user.id) : values.userSelect;
            let newNotification = {
                id: 0,
                "title": type === 1 ? user.name + " " + user.surname + " bir duyuru yaptı" : "Sistem Admin bir duyuru yaptı",
                detail: values.detail,
                date: dayjs().tz('Europe/Istanbul').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                userId: type === 1 ? user.id : 0,
            };

            onSave(newNotification, assignedUsers);
            onClose();
            setChecked(true);
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
            okText={'Gönder'}
            cancelText='İptal'
            destroyOnClose={true}
            open={onOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            title={"Bildirim Gönder"}
        >
           <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                style={{marginTop: "20px"}}
                requiredMark={false}
            >
                <Divider style={{marginTop: "-5px"}} orientation="left">Alıcı Seçenekleri</Divider>
                <Row>
                    <Col span={2}></Col>
                    <Col span={8}>
                        <Form.Item name="everyone" valuePropName="checked" initialValue={true}>
                            <Checkbox onChange={(e) => setChecked(e.target.checked)} >Herkese Gönder</Checkbox>
                        </Form.Item>  
                    </Col>
                    <Col span={14}>
                        <Form.Item name="userSelect"  rules={!checked ? [{ required: true, message: 'Kullanıcı Seçimi Zorunludur' }] : [{ required: false }]}>
                            <Select
                                mode="multiple"
                                placeholder="Kullanıcı Seçiniz"
                                disabled={checked}
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
                                showSearch
                                filterOption={(input, option) => 
                                    option.props.children.toString().toLowerCase().includes(input.toLowerCase())
                                }
                            >
                            {users.filter(u => u.id !== user.id).map(user => (
                                <Option key={user.id} value={user.id}> {user.name +" "+ user.surname} </Option>
                            ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider style={{marginTop: "15px"}} orientation="left">Bildiren Profili</Divider>
                <Row>
                    <Col span={5}>
                        <Avatar shape="square" size={64} src={url}><RobotOutlined style={{fontSize: '40px'}}/></Avatar>
                    </Col>
                    <Col span={19}>
                        <Form.Item name="name" label="İsim Bilgisi">
                            <Input disabled={true}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider style={{marginTop: "15px"}} orientation="left">Bildirim Detayı</Divider>
                <Row>
                    <Col span={24}>
                        <Form.Item name="title" label="Başlık" rules={[{ required: true, message: 'Bildirim Başlığı Zorunludur' }]}>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="detail" label="İçerik" rules={[{ required: true, message: 'Bildirim İçeriği Zorunludur' }]}>
                            <TextArea rows={2} placeholder="Duyuru içeriği giriniz" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default NotificationModal;