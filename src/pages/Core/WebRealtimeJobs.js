import React, { Fragment, memo, useState } from 'react'
import { useModel, useRequest } from 'umi'
import { useInterval } from 'ahooks'
import { deleteMsgrpcJobAPI, deleteWebTaskResultAPI } from '@/services/apiv1'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  StopOutlined,
  SyncOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import { BackTop, Button, Col, Descriptions, Input, List, Popover, Progress, Row, Space, Table, Tag, Typography } from 'antd-v5'
import moment from 'moment'
import { DocIcon, WebMainHeight } from '@/pages/Core/Common'
import { cssCalc } from '@/utils/utils'

import { formatText, getModuleDesc, getModuleName, getModuleResultTable, getResultData } from '@/utils/locales'
import { postModuleOpts } from '@/pages/Core/RealTimeCard'

const { Text } = Typography

const taskStatusDict = {
  waiting: <Tag icon={<ClockCircleOutlined/>} color="default">{formatText('webjobs.waiting')}</Tag>,
  running: <Tag icon={<SyncOutlined spin/>} color="processing">{formatText('webjobs.running')}</Tag>,
  cancel: <Tag icon={<ExclamationCircleOutlined/>} color="warning">{formatText('webjobs.cancel')}</Tag>,
  success: <Tag icon={<CheckCircleOutlined/>} color="success">{formatText('webjobs.success')}</Tag>,
  error: <Tag icon={<CloseCircleOutlined/>} color="error">{formatText('webjobs.error')}</Tag>,
}

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

  return (<Fragment>
    <DocIcon url="https://www.yuque.com/vipersec/help/rokuc0"/>
    <Row>
      <Col span={12}>
        <Table
          style={{
            overflow: 'auto', maxHeight: cssCalc(`${WebMainHeight} - 60px`), minHeight: cssCalc(`${WebMainHeight} - 60px`),
          }}
          size="small"
          rowKey="job_id"
          pagination={false}
          dataSource={webJobList}
          bordered
          columns={[
            {
              title: formatText('app.realtimecard.jobtable_starttime'), dataIndex: 'time', key: 'time', width: 120, render: (text, record) => {
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
              title: formatText('app.realtimecard.jobtable_params'), dataIndex: 'opts', key: 'opts', render: (text, record) => {
                return <Fragment>{postModuleOpts(record.opts)}</Fragment>
              },
            }, {
              title: formatText('app.realtimecard.status'), dataIndex: 'status', key: 'status', width: 108, render: (text, record) => {
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
        />
      </Col>
      <Col span={12}>
        <WebTaskResultResultMemo/>
      </Col>
    </Row></Fragment>)
}

export const WebRealTimeJobsMemo = memo(WebRealTimeJobs)

const WebTaskResult = () => {
  console.log('WebTaskResult')
  const {
    webTaskResultList, setWebTaskResultList, webTaskResultListActive, setWebTaskResultListActive,
  } = useModel('WebMainModel', model => ({
    webTaskResultList: model.webTaskResultList,
    setWebTaskResultList: model.setWebTaskResultList,
    webTaskResultListActive: model.webTaskResultListActive,
    setWebTaskResultListActive: model.setWebTaskResultListActive,
  }))

  const [text, setText] = useState('')

  const [refresh, setRefresh] = useState(false)
  useInterval(() => setRefresh(!refresh), 60000)

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

  const handleWebTaskResultSearch = text => {
    const reg = new RegExp(text, 'gi')
    const afterFilterList = webTaskResultList.map(record => {
      let moduleNameMatch = false
      let resultMatch = false
      let optsMatch = false
      const optsStr = JSON.stringify(record.opts)
      try {
        moduleNameMatch = record.NAME_EN.match(reg) || record.NAME_ZH.match(reg)
        resultMatch = record.result.match(reg)
        optsMatch = optsStr.match(reg)
      } catch (error) {
      }

      if (moduleNameMatch || resultMatch || optsMatch) {
        return { ...record }
      }
      return null
    }).filter(record => !!record)
    setWebTaskResultListActive(afterFilterList)
  }

  const OneTaskResultContent = results => {
    const resultComs = []
    for (const key in results) {
      const result = results[key]
      const data = getResultData(result)
      switch (result.type) {
        case 'raw':
          resultComs.push(<pre
            style={{
              whiteSpace: 'pre-wrap', overflowX: 'hidden', padding: '0 0 0 0',
            }}
          >{data}</pre>)
          break
        case 'info':
          resultComs.push(<Text>{data}</Text>)
          break
        case 'good':
          resultComs.push(<Text type="success">{data}</Text>)
          break
        case 'warning':
          resultComs.push(<Text type="warning">{data}</Text>)
          break
        case 'error':
          resultComs.push(<Text type="danger">{data}</Text>)
          break
        case 'except':
          resultComs.push(<Text type="danger" mark>{data}</Text>)
          break
        case 'table':
          resultComs.push(getModuleResultTable(result))
          break
        case 'progress':
          resultComs.push(<Progress percent={result.percent}/>)
          break
        default:
          resultComs.push(<pre
            style={{
              whiteSpace: 'pre-wrap', overflowX: 'hidden', padding: '0 0 0 0',
            }}
          >{data}</pre>)
      }
    }
    return <Space style={{ marginTop: 16, marginBottom: 8 }}
                  direction="vertical" size={2}>{resultComs}</Space>
  }

  const deleteWebTaskResultReq = useRequest(deleteWebTaskResultAPI, {
    manual: true, onSuccess: (result, params) => {
      setWebTaskResultList([])
      setWebTaskResultListActive([])
    }, onError: (error, params) => {
    },
  })

  const moduleResultAction = (record) => {
    if (record.status === "running" || record.status === "waiting") {
      return <Space.Compact>
        <Button
          size="small" style={{ width: 56 }}
          icon={<StopOutlined/>}
          onClick={() => {
            onDestoryJob(record)
          }}
        />
      </Space.Compact>
    }
  }

  return (<Fragment>
    <Row>
      <Col span={20}>
        <Input
          allowClear
          prefix={<SearchOutlined/>}
          style={{ width: '100%' }}
          placeholder={formatText('app.realtimecard.moduleresult_search')}
          value={text}
          onChange={e => {
            setText(e.target.value)
            handleWebTaskResultSearch(e.target.value)
          }}
        />
      </Col>
      <Col span={4}>
        <Button
          block
          danger
          onClick={() => deleteWebTaskResultReq.run()}
          icon={<DeleteOutlined/>}
        >
          <span style={{ marginLeft: 4 }}>{formatText('app.core.clear')}</span>
        </Button>
      </Col>
    </Row>
    <List
      id="moduleresultlist"
      bordered
      style={{
        overflow: 'auto', maxHeight: cssCalc(`${WebMainHeight} - 24px`), minHeight: cssCalc(`${WebMainHeight} - 24px`),
      }}
      itemLayout="vertical"
      size="small"
      dataSource={webTaskResultListActive}
      renderItem={record => (<List.Item key={record.task_uuid}
                                        style={{ padding: '4px 0px 0px 4px' }}>
        <Space>
          <Tag
            color="cyan"
            style={{
              textAlign: 'center',
            }}
          >
            <strong>{moment(record.update_time * 1000).
              format('MM-DD HH:mm:ss')}</strong>
          </Tag>
          <Tag
            color="blue"
            style={{
              textAlign: 'center', cursor: 'pointer',
            }}
          >
            <strong>{getModuleName(record)}</strong>
          </Tag>
          {taskStatusDict[record.status]}
          {moduleResultAction(record)}
        </Space>
        <div
          style={{
            marginTop: 8,
          }}
        >
          <Text type="secondary">{postModuleOpts(record.opts)}</Text>
        </div>
        {OneTaskResultContent(record.message)}
      </List.Item>)}
    >
      <BackTop
        style={{
          top: cssCalc(`112px`), right: cssCalc('40px'),
        }}
        target={() => document.getElementById('moduleresultlist')}
      >
        <div
          style={{
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: 'rgba(64, 64, 64, 0.6)',
            color: '#fff',
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          <VerticalAlignTopOutlined/>
        </div>
      </BackTop>
    </List>
  </Fragment>)
}
export const WebTaskResultResultMemo = memo(WebTaskResult)
