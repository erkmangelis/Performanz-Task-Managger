import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { UserOutlined, LockOutlined, GlobalOutlined, IdcardOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Avatar, Divider, Space } from 'antd';
import { hashPassword } from '../services/hashService';


const Profile = ({shown, onClose, onSave, loading}) => {
    const [form] = Form.useForm();
    const {user} = useUser();
    const [url, setUrl] = useState(user.url);

    
    const handleSave = (values) => {
        let newProfile = {
            "id": user.id,
            "role": user.role,
            "username": values.username,
            "password": hashPassword(values.password),
            "url": values.url,
            "name": values.name,
            "surname": values.surname,
            "isActive": user.isActive,
        };

        onSave(newProfile);
    };

    const handleOpen = () => {
        form.setFieldsValue({
            "username": user.username,
            "url": user.url,
            "name": user.name,
            "surname": user.surname,
            "password": '',
            "confirm": '',
        });
        setUrl(user.url);
    };

    const handleCancel = () => {
        onClose();
        form.resetFields();
        form.setFieldsValue(user);
        setUrl(user.url);
    };

    return (
        <Drawer
            title={<span><IdcardOutlined style={{fontSize: '20px'}}/> Kullanıcı Bilgileri</span>}
            width={450}
            getContainer={false}
            placement="left"
            onClose={handleCancel}
            open={shown}
            closable={false}
            afterOpenChange={handleOpen}
            extra={
            <Space>
                <Button onClick={handleCancel}>İptal</Button>
                <Button type="primary" onClick={() => form.submit()} loading={loading}>Kaydet</Button>
            </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                requiredMark={false}
                initialValues={{
                    "username": user.username,
                    "url": user.url,
                    "name": user.name,
                    "surname": user.surname,
                }}
                onFinish={handleSave}
            >
                <Divider style={{marginTop: "-5px"}} orientation="left">Hesap</Divider>
                <Row>
                    <Col span={5}>
                        <Avatar shape="square" size={64} src={url}>{user.name}</Avatar>
                    </Col>
                    <Col span={19}>
                        <Form.Item name="url" label="URL">
                            <Input onChange={(e) => setUrl(e.target.value)} prefix={<GlobalOutlined />}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} >
                    <Col span={12}>
                        <Form.Item name="username" label="Kullanıcı Adı" rules={[{required: true, message: 'Kullanıcı Adı zorunludur'}]}>
                            <Input prefix={<UserOutlined />}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} >
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Şifre"
                            hasFeedback
                        >
                            <Input.Password prefix={<LockOutlined />}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="confirm"
                            label="Onay"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    const password = getFieldValue('password');
                  
                                    if (!password && !value) {
                                      return Promise.resolve();
                                    }
                                    if (password && !value) {
                                      return Promise.reject(new Error('Lütfen şifreyi onaylayın.'));
                                    }
                                    if (password === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Girdiğiniz şifre uyuşmuyor.'));
                                  },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider style={{marginTop: "20px"}} orientation="left">Kişisel</Divider>
                <Row gutter={16} style={{marginTop: "15px", marginBottom: "15px"}}>
                    <Col span={12}>
                        <Form.Item name="name" label="İsim" rules={[{required: true, message: 'İsim zorunludur'}]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="surname" label="Soyisim" rules={[{required: true, message: 'Soyisim zorunludur'}]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default Profile;