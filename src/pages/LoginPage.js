import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Card } from 'antd';

const LoginPage = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
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