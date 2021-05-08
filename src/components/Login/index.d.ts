import { WrappedFormUtils } from 'antd/es/form/Form';
import React from 'react';
import { LoginItemProps } from './LoginItem';
import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';

export interface LoginProps {
  defaultActiveKey?: string;
  onTabChange?: (key: string) => void;
  style?: React.CSSProperties;
  onSubmit?: (error: any, values: any) => void;
  className?: string;
}

interface Login extends WrappedFormUtils {
}

declare class Login extends React.Component<LoginProps, any> {
  public static Tab: typeof LoginTab;
  public static UserName: React.FC<LoginItemProps>;
  public static Password: React.FC<LoginItemProps>;
  public static Mobile: React.FC<LoginItemProps>;
  public static Captcha: React.FC<LoginItemProps>;
  public static Submit: typeof LoginSubmit;
}

export default Login;
