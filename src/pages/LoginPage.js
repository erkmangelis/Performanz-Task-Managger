import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/Config.js';


const LoginPage = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await axios.post(API_URL+'Users/login', values);
            if (response.status === 200) {
                const { id, name, surname, url, role } = response.data;
                localStorage.setItem('user', JSON.stringify({ id, name, surname, url, role, username: values.username, password: values.password }));

                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                message.error(error.response.data.message || 'Giriş başarısız.');
            } else {
                message.error('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        }
    };

    return (
        <Row
            justify="center"
            align="middle"
            style={{ minHeight: '100vh', padding: '0 16px', backgroundColor: '#DBE2EF'}}
        >
            <Col
                xs={18} sm={14} md={10} lg={6} xl={6}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            > 
                <Card
                    title="Giriş Yap"
                    style={{
                        width: '100%',
                    }}
                >
                    <Form
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        requiredMark={false}
                    >

                        <Form.Item
                            label="Kullanıcı Adı"
                            name="username"
                            rules={[{ required: true, message: 'Lütfen Kullanıcı Adı Girin!' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>

                        <Form.Item
                            label="Şifre"
                            name="password"
                            rules={[{ required: true, message: 'Lütfen Şifre Girin!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} type="password" />
                        </Form.Item>

                        <Form.Item
                            style={{ marginTop: 32 }}
                        >
                            <Button block type='primary' style={{backgroundColor: '#3F72AF'}} htmlType="submit">
                                Giriş Yap
                            </Button>
                        </Form.Item>

                    </Form>
                </Card>
            </Col>
        </Row>
    );
}

export default LoginPage;