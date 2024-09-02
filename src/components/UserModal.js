import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Form, Row, Col, Avatar, Divider } from 'antd';
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';


const { Option } = Select;

const UserModal = ({onOpen, data, onClose, onSave}) => {
    const [form] = Form.useForm();
    const {user} = useUser();
    const [url, setUrl] = useState(null);
    const [role, setRole] = useState(2);


    useEffect(() => {
        if (data) {
            setUrl(data.url);
            setRole(data.role);
            const formValues = {
                "name": data.name,
                "surname": data.surname,
                "username": data.username,
                "password": data.password,
                "url": data.url,
                "role": data.role
            };
            form.setFieldsValue(formValues);
        } else {
            form.resetFields();
        }
    }, [data]);

    const handleOk = () => {
        form.validateFields()
          .then(values => {
            let newUser = {
                "id": 0,
                "name": values.name,
                "surname": values.surname,
                "username": values.username,
                "password": values.password,
                "url": url,
                "role": role,
            };

            if (data) {
                newUser = {
                    ...newUser,
                    "id": data.id,
                };
            }

            onSave(newUser);
            onClose();
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
            okText={data ? 'Kaydet' : 'Ekle'}
            cancelText='İptal'
            destroyOnClose={true}
            open={onOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <span>{data ? "Kullanıcıyı Düzenle" : "Kullanıcı Oluştur"}</span>
                    <Select
                        placeholder="Rol seçiniz"
                        defaultValue={(data ? data.role : 2)}
                        onChange={(value) => setRole(value)}
                        style={{ width: 100, marginRight: '40px' }}
                    >
                        <Option key={1} value={1}>Admin</Option>
                        <Option key={2} value={2}>Kullanıcı</Option>
                    </Select>
                </div>
            }
        >
           <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                style={{marginTop: "20px"}}
                requiredMark={false}
            >
                <Divider style={{marginTop: "-5px"}} orientation="left">Hesap</Divider>
                <Row style={{marginTop: "15px", marginBottom: "10px"}}>
                    <Col span={5}>
                        <Avatar shape="square" size={64} src={url}>{(data?data.name:"")}</Avatar>
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
        </Modal>
    );
};

export default UserModal;