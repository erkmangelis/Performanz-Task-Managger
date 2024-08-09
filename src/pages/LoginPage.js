import React from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { CFormInput, CForm, CButton, CCol, CContainer, CConditionalPortal } from '@coreui/react';

const LoginPage = () => {
    return (
        <div className="main-login-container">
            <div className="logo-container">
                <img id="login-logo" src="https://media.licdn.com/dms/image/C4D0BAQH82p7R8ndZ_Q/company-logo_200_200/0/1630551175241?e=2147483647&v=beta&t=pVJ8Mb6ReD7Iwf1PcjYHYUASdoTpLuL59wGguZpTL3c"></img>
            </div>
            <div className="login-form-container">
                <CForm>
                    <CCol className="login-form-item">
                        <CFormInput type="text" id="username" floatingClassName="mb-3" floatingLabel="Kullanıcı Adı" placeholder="Kullanıcı Adı" />
                    </CCol>
                    <CCol className="login-form-item">
                        <CFormInput type="password" id="password" floatingClassName="mb-3" floatingLabel="Şifre" placeholder="Şifre" />
                    </CCol>
                    <CCol className="login-form-item">
                        <CButton id="login-button" type="submit">Giriş Yap</CButton>
                    </CCol>
                </CForm>
            </div>
        </div>
    );
}

export default LoginPage;