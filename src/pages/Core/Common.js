import React from 'react'
import { Tag, Tooltip } from 'antd-v5'
import { Avatar } from 'antd'
import {
  BugOutlined,
  CloudOutlined,
  createFromIconfontCN,
  GatewayOutlined,
  LaptopOutlined,
  QuestionCircleOutlined,
  QuestionOutlined,
  WindowsOutlined,
} from '@ant-design/icons'
import moment from 'moment/moment'

export const SidTag = sid => {
  return (<Tag
    color="purple"
    style={{
      width: 40, marginRight: 0, textAlign: 'center',
    }}
  >
    <strong>{sid}</strong>
  </Tag>)
}

export const host_type_to_avatar_table = {
  ad_server: (<Avatar
    size={22}
    shape="square"
    style={{ backgroundColor: '#177ddc', width: 80 }}
    icon={<WindowsOutlined/>}
  />), pc: (<Avatar
    size={22}
    shape="square"
    style={{ backgroundColor: '#49aa19', width: 80 }}
    icon={<LaptopOutlined/>}
  />), web_server: (<Avatar
    size={22}
    shape="square"
    style={{ backgroundColor: '#13a8a8', width: 80 }}
    icon={<CloudOutlined/>}
  />), cms: (<Avatar
    size={22}
    shape="square"
    style={{ backgroundColor: '#d84a1b', width: 80 }}
    icon={<BugOutlined/>}
  />), firewall: (<Avatar
    size={22}
    shape="square"
    style={{ backgroundColor: '#d87a16', width: 80 }}
    icon={<GatewayOutlined/>}
  />), other: (<Avatar
    size={22}
    shape="square"
    style={{ backgroundColor: '#bfbfbf', width: 80 }}
    icon={<QuestionOutlined/>}
  />),
}

//iconfont地址设置
export const MyIcon = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/c/font_1077799_candygnjo7p.js', // 在 iconfont.cn 上生成
})

export const randomstr = (length) => {
  let result = ''
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export const DocIcon = ({ url }) => {
  return (<a target="_blank" href={url}>
    <QuestionCircleOutlined
      style={{
        fontSize: 16, bottom: 16, right: 16, position: 'fixed', zIndex: 100,
      }}/>
  </a>)
}

export const DocIconInDiv = ({ url }) => {
  return (<a target="_blank" href={url}>
    <QuestionCircleOutlined
      style={{
        fontSize: 16, bottom: 16, right: 16, position: 'absolute', zIndex: 100,
      }}/>
  </a>)
}

export const DocIconInDivSessionIO = ({ url }) => {
  return (<a target="_blank" href={url}>
    <QuestionCircleOutlined
      style={{
        fontSize: 16, bottom: 48, right: 16, position: 'absolute', zIndex: 100,
      }}/>
  </a>)
}

export const TimeTag = (time) => {
  return <Tooltip title={moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')}><Tag
    color="cyan"
    style={{
      textAlign: 'center',
    }}
  >

    {moment(time * 1000).fromNow()}
  </Tag></Tooltip>
}

export const WebMainHeight = '100vh - 50px'
