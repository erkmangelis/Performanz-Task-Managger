import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { UserOutlined, LockOutlined, GlobalOutlined, IdcardOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Avatar, Divider, Space } from 'antd';



const Profile = ({shown, onClose, onSave, loading}) => {
    const [form] = Form.useForm();
    const {user} = useUser();
    const [url, setUrl] = useState(user.url);

    
    const handleSave = (values) => {
        let newProfile = {
            "id": user.id,
            "role": user.role,
            "username": values.username,
            "password": values.password,
            "url": values.url,
            "name": values.name,
            "surname": values.surname,
        };

        onSave(newProfile);
    };

    const handleCancel = () => {
        onClose();
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
                    "password": user.password,
                    "url": user.url,
                    "name": user.name,
                    "surname": user.surname,
                }}
                onFinish={handleSave}
            >
                <Divider style={{marginTop: "-5px"}} orientation="left">Hesap</Divider>
                <Row style={{marginTop: "15px", marginBottom: "10px"}}>
                    <Col span={5}>
                        <Avatar shape="square" size={64} src={url}>{user.name}</Avatar>
                    </Col>
                    <Col span={19}>
                        <Form.Item name="url" label="URL">
                            <Input onChange={(e) => setUrl(e.target.value)} prefix={<GlobalOutlined />}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: "10px", marginBottom: "15px"}}>
                    <Col span={12}>
                        <Form.Item name="username" label="Kullanıcı Adı" rules={[{required: true, message: 'Kullanıcı Adı zorunludur'}]}>
                            <Input prefix={<UserOutlined />}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="password" label="Şifre" rules={[{required: true, message: 'Şifre zorunludur'}]}>
                            <Input.Password prefix={<LockOutlined />}/>
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