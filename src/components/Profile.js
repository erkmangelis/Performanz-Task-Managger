import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { UserOutlined, LockOutlined, GlobalOutlined, IdcardOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Avatar, Divider, Space } from 'antd';



const Profile = ({shown, onClose, onSave}) => {
    const [form] = Form.useForm();
    const user = useUser();

    return (
        <Drawer
            title={<span><IdcardOutlined style={{fontSize: '20px'}}/> Kullanıcı Bilgileri</span>}
            width={450}
            getContainer={false}
            placement="left"
            onClose={onClose}
            open={shown}
            closable={false}
            extra={
            <Space>
                <Button>İptal</Button>
                <Button type="primary" onClick={() => (console.log(form.name))}>Kaydet</Button>
            </Space>
            }
        >
            <Form form={form} layout="vertical" autoComplete="off" requiredMark={false}>
                <Divider style={{marginTop: "-5px"}} orientation="left">Hesap</Divider>
                <Row style={{marginTop: "15px", marginBottom: "10px"}}>
                    <Col span={5}>
                        <Avatar shape="square" size={64} src={user.url}/>
                    </Col>
                    <Col span={19}>
                        <Form.Item label="URL">
                            <Input defaultValue={user.url} prefix={<GlobalOutlined />}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: "10px", marginBottom: "15px"}}>
                    <Col span={12}>
                        <Form.Item name="username" label="Kullanıcı Adı" rules={[{required: true, message: 'Kullanıcı Adı zorunludur'}]}>
                            <Input defaultValue={user.username} prefix={<UserOutlined />}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="password" label="Şifre" rules={[{required: true, message: 'Şifre zorunludur'}]}>
                            <Input.Password defaultValue={user.password} prefix={<LockOutlined />}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider style={{marginTop: "20px"}} orientation="left">Kişisel</Divider>
                <Row gutter={16} style={{marginTop: "15px", marginBottom: "15px"}}>
                    <Col span={12}>
                        <Form.Item name="name" label="İsim" rules={[{required: true, message: 'İsim zorunludur'}]}>
                            <Input defaultValue={user.name}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="surname" label="Soyisim" rules={[{required: true, message: 'Soyisim zorunludur'}]}>
                            <Input defaultValue={user.surname}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default Profile;