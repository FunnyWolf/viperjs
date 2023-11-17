import React, { Fragment, memo, useState } from 'react'
import { getLocale, useModel, useRequest } from 'umi'
import { useControllableValue, useInterval } from 'ahooks'
import {
  deleteMsgrpcJobAPI,
  deleteNoticesAPI,
  deletePostmodulePostModuleResultHistoryAPI,
  getCoreUUIDJsonAPI,
  postCoreNoticesAPI,
} from '@/services/apiv1'
import {
  ClockCircleOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  SearchOutlined,
  SyncOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import {
  BackTop,
  Badge,
  Button,
  Card,
  Col,
  Input,
  List,
  Modal,
  Popover,
  Radio,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Descriptions,
} from 'antd'
import moment from 'moment'
import { DocIcon, MyIcon, SidTag } from '@/pages/Core/Common'
import { cssCalc, Downheight, Upheight } from '@/utils/utils'

import {
  formatText,
  getModuleDesc,
  getModuleName,
  getModuleResultTable,
  getOptionTag,
  getResultData,
} from '@/utils/locales'
import { postModuleOpts } from '@/pages/Core/RealTimeCard'

const { Text, Link } = Typography
const { Search } = Input

const WebModuleInfoContent = postModuleConfig => {

  const references = postModuleConfig.REFERENCES
  const referencesCom = []
  for (let i = 0; i < references.length; i++) {
    referencesCom.push(<div>
      <a href={references[i]} target="_blank">
        {references[i]}
      </a>
    </div>)
  }

  const readme = postModuleConfig.README
  const readmeCom = []
  for (let i = 0; i < readme.length; i++) {
    readmeCom.push(<div>
      <a href={readme[i]} target="_blank">
        {readme[i]}
      </a>
    </div>)
  }

  const attcks = postModuleConfig.ATTCK
  const attckCom = []
  for (let i = 0; i < attcks.length; i++) {
    attckCom.push(<Tag color="gold">{attcks[i]}</Tag>)
  }

  const authors = postModuleConfig.AUTHOR
  const authorCom = []
  for (let i = 0; i < authors.length; i++) {
    authorCom.push(<Tag color="lime">{authors[i]}</Tag>)
  }

  return (<Descriptions
    size="small"
    style={{
      padding: '0 0 0 0', marginRight: 8,
    }}
    column={8}
    bordered
  >
    <Descriptions.Item label={formatText('app.runmodule.postmodule.NAME')}
                       span={8}>
      {getModuleName(postModuleConfig)}
    </Descriptions.Item>
    <Descriptions.Item label={formatText('app.runmodule.postmodule.authorCom')}
                       span={4}>
      {authorCom}
    </Descriptions.Item>
    <Descriptions.Item label="TTPs" span={4}>
      {attckCom}
    </Descriptions.Item>
    <Descriptions.Item label={formatText('app.runmodule.postmodule.readmeCom')}
                       span={8}>
      {readmeCom}
    </Descriptions.Item>
    <Descriptions.Item
      label={formatText('app.runmodule.postmodule.referencesCom')} span={8}>
      {referencesCom}
    </Descriptions.Item>
    <Descriptions.Item span={8}
                       label={formatText('app.runmodule.postmodule.DESC')}>
        <pre
          style={{
            whiteSpace: 'pre-wrap', overflowX: 'hidden', padding: '0 0 0 0',
          }}
        >{getModuleDesc(postModuleConfig)}</pre>
    </Descriptions.Item>
  </Descriptions>)
}

const WebRealTimeJobs = () => {
  console.log('WebRealTimeJobs')

  const {
    webJobList, setWebjobList,
  } = useModel('WebMainModel', model => ({
    webJobList: model.webJobList, setWebjobList: model.setWebjobList,
  }))

  const {
    resizeDownHeight,
  } = useModel('Resize', model => ({
    resizeDownHeight: model.resizeDownHeight,
  }))
  const destoryJobReq = useRequest(deleteMsgrpcJobAPI, {
    manual: true, onSuccess: (result, params) => {
      const { uuid } = result
      setWebjobList(webJobList.filter(item => item.uuid !== uuid))
    }, onError: (error, params) => {
    },
  })

  const onDestoryJob = record => {
    destoryJobReq.run({ uuid: record.task_uuid, broker: record.broker })
  }

  const taskStatusDict = {
    running: <Tag icon={<SyncOutlined spin/>} color="processing">
      processing
    </Tag>,
    waiting: <Tag icon={<ClockCircleOutlined/>} color="default">
      waiting
    </Tag>,
  }
  return (<Fragment>
    <DocIcon url="https://www.yuque.com/vipersec/help/rokuc0"/>
    <Table
      style={{
        marginTop: -16,
        overflow: 'auto',
        maxHeight: cssCalc(resizeDownHeight),
        minHeight: cssCalc(resizeDownHeight),
      }}
      size="small"
      rowKey="job_id"
      pagination={false}
      dataSource={webJobList}
      bordered
      columns={[
        {
          title: formatText('app.realtimecard.jobtable_starttime'),
          dataIndex: 'time',
          key: 'time',
          width: 120,
          render: (text, record) => {
            return <Tag color="cyan"
                        style={{
                          textAlign: 'center', cursor: 'pointer',
                        }}>{moment(record.time * 1000).
              format('YYYY-MM-DD HH:mm:ss')}</Tag>
          },
        }, {
          title: formatText('app.realtimecard.jobtable_module'),
          dataIndex: 'module_config',
          key: 'module_config',
          width: 240,
          render: (text, record) => (<Popover
            placement="right"
            content={WebModuleInfoContent(record.module_config)}
            trigger="click"
          >
            <a>{getModuleName(record.module_config)}</a>
          </Popover>),
        }, {
          title: formatText('app.realtimecard.jobtable_params'),
          dataIndex: 'opts',
          key: 'opts',
          render: (text, record) => {
            return <Fragment>{postModuleOpts(record.opts)}</Fragment>
          },
        }, {
          title: formatText('app.realtimecard.status'),
          dataIndex: 'status',
          key: 'status',
          width: 108,
          render: (text, record) => {
            return taskStatusDict[record.status]
          },
        }, {
          dataIndex: 'operation', width: 64, render: (text, record) => {
            return <div style={{ textAlign: 'center' }}>
              <Space>
                <a style={{
                  color: 'red',
                }} onClick={() => onDestoryJob(record)}>
                  {formatText('app.core.delete')}
                </a>
              </Space>
            </div>
          },
        }]}
    /></Fragment>)
}

export const WebRealTimeJobsMemo = memo(WebRealTimeJobs)
