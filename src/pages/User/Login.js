import React from 'react';
import { history, useRequest } from 'umi';
import { Button, Form, Input } from 'antd';
import styles from './Login.less';
import { postCoreBaseauthAPI } from '@/services/apiv1';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { setAuthority, setToken } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

const LoginPage = props => {
  const createBaseauthReq = useRequest(postCoreBaseauthAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setAuthority(result.currentAuthority); // TODO 是否需要二次设置
      setToken(result.token); // TODO 是否需要二次设置
      reloadAuthorized();
      history.push('/');
    },
    onError: (error, params) => {
    },
  });

  return (
    <div className={styles.main}>
      <Form
        size="large"
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={createBaseauthReq.run}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名/Please input username(root)',
            },
          ]}
          defaultValue={'root'}
        >
          <Input prefix={<UserOutlined/>} placeholder="用户名/Username"/>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码/Please input password(docker-compose.yml)',
            },
          ]}
        >
          <Input prefix={<LockOutlined/>} type="password" placeholder="密码/Password"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={createBaseauthReq.loading}>
            登录/Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginPage;
