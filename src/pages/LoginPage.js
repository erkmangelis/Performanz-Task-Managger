import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        
        try {
            // DENEME
            let user;
            if (values.username === "erkman" && values.password === "123") {
                user = { "id": 2, "username": "erkman", "name": "Erkman", "surname": "Geliş", "url": "https://api.dicebear.com/7.x/miniavs/svg?seed=$10", "role": "User"};
              } else if (values.username === "okan" && values.password === "123") {
                user = { "id": 1, "username": "okan", "name": "Okan", "surname": "Eştürk", "url": "https://api.dicebear.com/7.x/miniavs/svg?seed=$2", "role": "Admin"};
              }
            if (user) {localStorage.setItem("user", JSON.stringify(user));
            navigate('/');}

            // API
            // const response = await axios.post('/api/login', values);

            // if (response.status === 200) {
            //     const { id, username, name, surname, url, role } = response.data.user;
            //     localStorage.setItem('user', JSON.stringify({ id, username, name, surname, url, role }));

            //     navigate('/');
            // }
        } catch (error) {
            if (error.response) {
                message.error(error.response.data.message || 'Giriş başarısız.');
            } else {
                message.error('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                        onFinishFailed={onFinishFailed}
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