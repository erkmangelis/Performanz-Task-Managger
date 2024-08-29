import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
const { Option } = Select;



const Profile = ({shown, onClose, onSave}) => {
    const user = useUser();
    console.log(shown);

    return (
        <Drawer
            title="Create a new account"
            width={450}
            getContainer={shown}
            placement="left"
            onClose={onClose}
            open={shown}
            styles={{
            body: {
                paddingBottom: 80,
            },
            }}
            extra={
            <Space>
                <Button>Cancel</Button>
                <Button type="primary">
                Submit
                </Button>
            </Space>
            }
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Kullanıcı Adı"
                        >
                            <Input placeholder="erkman" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default Profile;