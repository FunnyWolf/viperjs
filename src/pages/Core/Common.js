import React from 'react';
import { Avatar, Tag } from 'antd';
import {
  BugOutlined,
  CloudOutlined,
  createFromIconfontCN,
  GatewayOutlined,
  LaptopOutlined,
  QuestionOutlined,
  WindowsOutlined,
} from '@ant-design/icons';

export const SidTag = sid => {
  return (
    <Tag
      color="purple"
      style={{
        width: 40,
        marginRight: 0,
        textAlign: 'center',
      }}
    >
      <strong>{sid}</strong>
    </Tag>
  );
};

export const host_type_to_avatar_table = {
  ad_server: (
    <Avatar
      size={22}
      shape="square"
      style={{ backgroundColor: '#177ddc', width: 48 }}
      icon={<WindowsOutlined/>}
    />
  ),
  pc: (
    <Avatar
      size={22}
      shape="square"
      style={{ backgroundColor: '#49aa19', width: 48 }}
      icon={<LaptopOutlined/>}
    />
  ),
  web_server: (
    <Avatar
      size={22}
      shape="square"
      style={{ backgroundColor: '#13a8a8', width: 48 }}
      icon={<CloudOutlined/>}
    />
  ),
  cms: (
    <Avatar
      size={22}
      shape="square"
      style={{ backgroundColor: '#d84a1b', width: 48 }}
      icon={<BugOutlined/>}
    />
  ),
  firewall: (
    <Avatar
      size={22}
      shape="square"
      style={{ backgroundColor: '#d87a16', width: 48 }}
      icon={<GatewayOutlined/>}
    />
  ),
  other: (
    <Avatar
      size={22}
      shape="square"
      style={{ backgroundColor: '#bfbfbf', width: 48 }}
      icon={<QuestionOutlined/>}
    />
  ),
};

//iconfont地址设置
export const MyIcon = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/font_1077799_3losja1jye6.js', // 在 iconfont.cn 上生成
});
