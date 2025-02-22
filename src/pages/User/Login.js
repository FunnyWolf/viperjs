import React from "react";
import { history, useRequest } from "umi";
import { Button, Form, Input } from "antd";
import styles from "./Login.less";
import { postCoreBaseauthAPI } from "@/services/apiv1";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { setAuthority, setToken } from "@/utils/authority";
import { reloadAuthorized } from "@/utils/Authorized";
import { formatText, LangSwitch } from "@/utils/locales";
import { DocIconInDiv } from "@/pages/Core/Common";

const LoginPage = props => {
  const createBaseauthReq = useRequest(postCoreBaseauthAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setAuthority(result.currentAuthority); // TODO 是否需要二次设置
      setToken(result.token); // TODO 是否需要二次设置
      reloadAuthorized();
      history.push("/");
    },
    onError: (error, params) => {
    }
  });

  return (
    <div className={styles.main}>
      <div
        style={{
          top: 32,
          right: 32,
          position: "fixed",
          zIndex: 100
        }}
      >
        <LangSwitch />
      </div>
      <DocIconInDiv url="https://www.yuque.com/vipersec/help/oktwb7" />
      <Form
        size="large"
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true
        }}
        onFinish={createBaseauthReq.run}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: formatText("app.login.userName.tip")
            }
          ]}
          defaultValue={"root"}
        >
          <Input prefix={<UserOutlined />} placeholder={formatText("app.login.userName")} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: formatText("app.login.password.tip")
            }
          ]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder={formatText("app.login.password")} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={createBaseauthReq.loading}>
            {formatText("app.login.login")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginPage;
