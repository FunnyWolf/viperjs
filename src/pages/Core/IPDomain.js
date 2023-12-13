import React, { Fragment, memo, useImperativeHandle, useState } from 'react'
import moment from 'moment'
import { getLocale, useRequest } from 'umi'
import {
  deleteMsgrpcFileMsfAPI,
  deleteMsgrpcSessionioAPI,
  deleteWebdatabaseProjectAPI,
  getCoreCurrentUserAPI,
  getMsgrpcFileMsfAPI,
  getWebdatabaseIPDomainAPI,
  getWebdatabaseProjectAPI,
  postPostmodulePostModuleActuatorAPI,
  postWebdatabaseProjectAPI,
  putWebdatabaseProjectAPI,
} from '@/services/apiv1'

import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Upload,
  List,
  Typography,
  Tabs,
  Image,
  Avatar,
  Menu,
  Dropdown,
  Pagination,
  Popover,
  Form,
  Input,
  Radio,
  InputNumber,
  Select,
} from 'antd'
import {
  CopyOutlined,
  SyncOutlined,
  UploadOutlined,
  ProjectOutlined,
  SwapOutlined,
  DeleteOutlined,
  SearchOutlined,
  DeliveredProcedureOutlined,
} from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { getToken } from '@/utils/authority'
import { cssCalc, Downheight } from '@/utils/utils'
import {
  formatText,
  getModuleName,
  getSessionlocate,
  manuali18n,
  msgerror,
  msgsuccess,
  msgwarning,
} from '@/utils/locales'
import {
  DocIcon, MyIcon, SidTag, TimeTag, WebMainHeight,
} from '@/pages/Core/Common'
import { useModel } from '@@/plugin-model/useModel'
import { HostIP } from '@/config'
import { useEffect, useRef } from 'react'
import { useInterval } from 'ahooks'
import {
  CaretRightOutlined,
  SubnodeOutlined,
  AppleOutlined,
  MacCommandOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import styles from '@/utils/utils.less'
import { Descriptions } from '_antd@4.24.14@antd'

const listitemHeight = 240

const IPDomain = props => {
  console.log('IPDomain')

  const {
    projectActive,
    projects,
    setProjects,
    ipdomains,
    setIPDomains,
    webIPDomainPortWaitList,
    setWebIPDomainPortWaitList,
  } = useModel('WebMainModel', model => ({
    projectActive: model.projectActive,
    projects: model.projects,
    setProjects: model.setProjects,
    ipdomains: model.ipdomains,
    setIPDomains: model.setIPDomains,
    webIPDomainPortWaitList: model.webIPDomainPortWaitList,
    setWebIPDomainPortWaitList: model.setWebIPDomainPortWaitList,
  }))
  const initTableParams = {
    current: 1, pageSize: 10,
  }
  const [tableParams, setTableParams] = useState(initTableParams)

  const [searchParams, setSearchParams] = useState({})

  const listIPdomainReq = useRequest(getWebdatabaseIPDomainAPI, {
    manual: true, onSuccess: (result, params) => {
      setIPDomains(result.result)
      setTableParams(result.pagination)
    }, onError: (error, params) => {
    },
  })

  const listProjectReq = useRequest(getWebdatabaseProjectAPI, {
    manual: true, onSuccess: (result, params) => {
      setProjects(result)
    }, onError: (error, params) => {
    },
  })

  const switchProjectReq = useRequest(postWebdatabaseProjectAPI, {
    manual: true, onSuccess: (result, params) => {
      setIPDomains(
        ipdomains.filter(item => item.ipdomain !== params[0].ipdomain))
    }, onError: (error, params) => {
    },
  })

  const destoryProjectReq = useRequest(deleteWebdatabaseProjectAPI, {
    manual: true, onSuccess: (result, params) => {
      setIPDomains(
        ipdomains.filter(item => item.ipdomain !== params[0].ipdomain))
    }, onError: (error, params) => {
    },
  })

  const addToWebIPDomainPortWaitList = (record) => {
    const { id } = record

    if (!webIPDomainPortWaitList.some(item => item.id === id)) {
      setWebIPDomainPortWaitList([...webIPDomainPortWaitList, record])
      msgsuccess(`加入等待列表成功`, `Add to waiting list successfully`)
    } else {
      msgsuccess(`已在等待列表中`, `Already in the waiting list`)
    }
    console.log(webIPDomainPortWaitList)
  }

  const switchProject = (key, record) => {
    switchProjectReq.run({
      project_id: key, ipdomain: record.ipdomain,
    })
  }

  const handlePageChange = (page, pageSize) => {
    const pagination = { current: page, pageSize: pageSize }
    setTableParams({ ...tableParams, ...pagination })
    listIPdomainReq.run({
      project_id: projectActive.project_id,
      pagination: pagination, ...searchParams,
    })
  }

  const handleRefresh = () => {
    listIPdomainReq.run({
      project_id: projectActive.project_id,
      pagination: tableParams, ...searchParams,
    })
  }

  const handleSearch = values => {
    setSearchParams(values)
    listIPdomainReq.run({
      project_id: projectActive.project_id,
      pagination: initTableParams, ...values, // init pagination when search
    })
  }

  useEffect(() => {
    listIPdomainReq.run({
      project_id: projectActive.project_id, pagination: tableParams,
    })
  }, [projectActive])

  useEffect(() => {
    listProjectReq.run()
  }, [])

  const LocationRow = (record) => {
    if (record.location) {
      const location = record.location
      const geo_info = location.geo_info
      const isp = location.isp
      return <Space><Tag
        color="geekblue"
        style={{
          textAlign: 'center', cursor: 'pointer',
        }}
      >{isp}</Tag>
        <Tag
          color="geekblue"
          style={{
            textAlign: 'center', cursor: 'pointer',
          }}
        >{geo_info.country_cn} {geo_info.province_cn} {geo_info.city_cn}
        </Tag>{TimeTag(location.update_time)}</Space>
    } else {
      return null
    }
  }

  const IPDomainInfoRow = (record) => {

    return <Space size={0}><Tag
      color="blue"
      style={{
        textAlign: 'center', cursor: 'pointer',
      }}
    >
      {record.ipdomain}
    </Tag><Tag
      color="blue"
      style={{
        textAlign: 'center', cursor: 'pointer',
      }}
    >
      {record.ip}
    </Tag>
      {TimeTag(record.update_time)}
    </Space>

  }

  const PortInfoRow = (record) => {
    const service = record.port_info.service

    return <Space size={0}>
      <Tag
        color="green"
        style={{
          // width: 160,
          textAlign: 'center', cursor: 'pointer',
        }}
      >
        <strong>{service.port}</strong>
      </Tag>
      <Tag
        color="cyan"
        style={{
          // width: 160,
          textAlign: 'center', cursor: 'pointer',
        }}
      >
        <strong>{service.service}</strong>
      </Tag>{TimeTag(service.update_time)}
    </Space>
  }
  const ComponentRow = (record) => {
    if (record.port_info) {
      if (record.port_info.components) {
        const components = record.port_info.components

        const tagslist = components.map(component => {
          return <Tag
            // icon={<MacCommandOutlined/>}
            color="purple"
            style={{
              textAlign: 'center',
            }}
          >
            {component.product_name}
          </Tag>
        })
        return <Space wrap size={[0, 4]}>
          {tagslist}</Space>
      }
    }
    return null
  }

  const cdnRow = (record) => {
    if (record.cdn === null) {
      return null
    } else {
      if (record.cdn.flag === true) {
        return <Tag
          color="orange"
          style={{
            textAlign: 'center', cursor: 'pointer',
          }}
        >CDN</Tag>
      } else {
        return <Tag
          color="green"
          style={{
            textAlign: 'center', cursor: 'pointer',
          }}
        >No CDN</Tag>
      }
    }
  }
  const wafRow = (record) => {
    if (record.port_info) {
      if (record.port_info.waf) {
        const waf = record.port_info.waf
        if (waf.flag === true) {
          return <Tag
            color="orange"
            style={{
              textAlign: 'center', cursor: 'pointer',
            }}
          >WAF</Tag>
        }
      }
    }
    return null
  }
  const SearchRow = () => {
    const [form] = Form.useForm()

    return <Form
      form={form}
      layout="inline"
      name="form_in_modal"
      onFinish={handleSearch}
      initialValues={searchParams}
    >
      <Form.Item
        name="ipdomain"
        label="IP / Domain"
      >
        <Input/>
      </Form.Item>
      <Form.Item name="port" label="Port">
        <InputNumber min={1} max={65535}/>
      </Form.Item>
      <Form.Item name="waf_flag" label="WAF">
        <Select
          style={{
            width: 64,
          }}
          allowClear
          options={[
            {
              value: true, label: 'Yes',
            }, {
              value: false, label: 'No',
            }]}
        />
      </Form.Item>
      <Form.Item name="cdn_flag" label="CDN">
        <Select
          style={{
            width: 64,
          }}
          allowClear
          options={[
            {
              value: true, label: 'Yes',
            }, {
              value: false, label: 'No',
            }]}
        />
      </Form.Item>
      <Form.Item
        name="service"
        label="Service"
      >
        <Input/>
      </Form.Item>
      <Form.Item>
        <Button icon={<SearchOutlined/>} htmlType="submit">{formatText(
          'app.core.search')}</Button>
      </Form.Item>
      <Button
        // style={{ width: 120 }}
        icon={<SyncOutlined/>}
        onClick={() => handleRefresh()}
        loading={listIPdomainReq.loading || listIPdomainReq.loading}
      />
    </Form>
  }
  const DetailRow = (item) => {
    return <Card
      bodyStyle={{
        maxHeight: listitemHeight - 64 - 16,
        minHeight: listitemHeight - 64 - 16,
      }}
    >
      <div>111</div>
    </Card>
  }
  const httpFaviconTag = (http_favicon) => {
    if (http_favicon) {
      const src = 'data:image/png;base64,' + http_favicon.content
      return <Avatar
        shape="square"
        size={20}
        src={src}
      />
    } else {
      return null
    }
  }

  const httpBaseRow = (http_base) => {
    if (http_base) {
      return <>
        <Button type="link" size="small" shape="round"
                icon={<LinkOutlined/>}>{http_base.title}</Button>
        <Tag
          color="cyan"
          style={{
            textAlign: 'center', cursor: 'pointer',
          }}
        >
          <strong>{http_base.status_code}</strong>
        </Tag>
      </>
    }
    return null
  }

  const HttpTabPane = (record) => {
    if (record.port_info) {
      const http_base = record.port_info.http_base
      const http_favicon = record.port_info.http_favicon
      return <Tabs.TabPane tab={<span>HTTP</span>} key="HTTP">
        <Space>
          {httpFaviconTag(http_favicon)}
          {httpBaseRow(http_base)}
        </Space>
      </Tabs.TabPane>
    }
    return null
  }

  const DNSTabPane = (record) => {
    const dnsrecord = record.dnsrecord

    if (dnsrecord !== null && dnsrecord.length > 0) {

      return <Tabs.TabPane tab={<span>DNS</span>} key="DNSRecord">
        <Row
          style={{
            marginTop: -16,
          }}
        >
          <Col span={12}>
            <Table
              style={{
                overflow: 'auto',
                minHeight: listitemHeight,
                maxHeight: listitemHeight,
              }}
              columns={[
                {
                  title: 'Type', dataIndex: 'type', width: 64,
                }, {
                  title: 'Value', dataIndex: 'value',
                }]}
              dataSource={dnsrecord}
              pagination={false}
              scroll={{ y: listitemHeight - 32 }}
              size="small"
            />
          </Col>

        </Row>
      </Tabs.TabPane>
    } else {
      return null
    }
  }

  const CertTabPane = (record) => {
    if (record.port_info) {
      if (record.port_info.cert) {
        const cert = record.port_info.cert
        const subject = cert.subject

        return <Tabs.TabPane tab={<span>Cert</span>} key="Cert">
          <Row>
            <Col span={8}>
              <Descriptions
                style={{
                  marginTop: -16,
                }}
                // bordered size="small"
                column={3}
                layout="vertical">
                <Descriptions.Item
                  label="country">{subject.country}</Descriptions.Item>
                <Descriptions.Item
                  label="province">{subject.province}</Descriptions.Item>
                <Descriptions.Item
                  label="locality">{subject.locality}</Descriptions.Item>
                <Descriptions.Item label="organization"
                                   span={3}>{subject.organization}</Descriptions.Item>
                <Descriptions.Item label="common_name"
                                   span={3}>{subject.common_name}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={16}>
              <pre
                style={{
                  marginTop: -16,
                  marginBottom: 0,
                  padding: '0 0 0 0',
                  overflowX: 'hidden',
                  maxHeight: listitemHeight,
                  minHeight: listitemHeight,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  background: '#141414',
                }}
              >{cert.cert}</pre>
            </Col>
          </Row>

        </Tabs.TabPane>
      }
    }
    return null
  }

  const ScreenshotTabPane = (record) => {
    if (record.screenshot) {
      const screenshot = record.screenshot
      const src = 'data:image/png;base64,' + screenshot.content
      return <Tabs.TabPane tab={<span>Image</span>} key="Image">
        <Image
          style={{
            // marginTop: -16,
          }}
          width={listitemHeight - 16}
          height={listitemHeight - 16}
          src={src}
        />
      </Tabs.TabPane>
    } else {
      return null
    }
  }

  const ResponseTabPane = (record) => {
    if (record.port_info) {
      if (record.port_info.service) {
        if (record.port_info.service.response) {
          const response = record.port_info.service.response
          return <Tabs.TabPane tab={<span>Response</span>} key="Response">
                        <pre
                          style={{
                            marginTop: -16,
                            marginBottom: 0,
                            padding: '0 0 0 0', // overflowX: 'hidden',
                            maxHeight: listitemHeight,
                            minHeight: listitemHeight,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            background: '#141414',
                          }}
                        >{response}</pre>
          </Tabs.TabPane>
        }
      }
    }
    return null
  }
  const DomainICPTabPane = (record) => {

    if (record.domainicp) {
      const domainicp = record.domainicp
      return <Tabs.TabPane style={{ marginTop: -16 }} tab={<span>ICP</span>}
                           key="domainicp">
        <Descriptions
          size="small"
          column={12}
          bordered
        >
          <Descriptions.Item label={'unit'} span={4}>
            {domainicp.unit}
          </Descriptions.Item>
          <Descriptions.Item label={'license'} span={4}>
            {domainicp.license}
          </Descriptions.Item>
        </Descriptions>
      </Tabs.TabPane>
    } else {
      return null
    }
  }
  const IPDomainPortCard = (record) => {
    return <Card
      bodyStyle={{ padding: 0, margin: 0, minHeight: listitemHeight + 36 }}
    >
      <Row>
        <Col span={10}>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          >{IPDomainInfoRow(record)}</Row>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          >{LocationRow(record)}</Row>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          >{PortInfoRow(record)}</Row>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          >{ComponentRow(record)}</Row>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          >{cdnRow(record)}</Row>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          >{wafRow(record)}</Row>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          ><Space>
            <Dropdown
              placement="top"
              overlay={<Menu
                onClick={({ item, key, keyPath, domEvent }) => switchProject(
                  key, record)}
                items={projects.filter(
                  project => project.project_id !== projectActive.project_id).
                  map(project => {
                    return {
                      key: project.project_id,
                      label: project.name,
                      icon: <ProjectOutlined/>,
                    }
                  })}
              />}
              trigger={['click']}
            >
              <Button icon={<SwapOutlined/>}></Button>
            </Dropdown>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              onClick={() => addToWebIPDomainPortWaitList(record)}
            ></Button>
            <Button
              danger
              icon={<DeleteOutlined/>}
              onClick={() => destoryProjectReq.run(
                { ipdomain: record.ipdomain })}
            ></Button>
          </Space>
          </Row>
        </Col>
        <Col span={14}>
          <Tabs
            style={{
              marginTop: -4,
            }}
            size="small">
            {HttpTabPane(record)}
            {CertTabPane(record)}
            {ScreenshotTabPane(record)}
            {ResponseTabPane(record)}
            {DNSTabPane(record)}
          </Tabs>
        </Col>
      </Row>
    </Card>
  }
  const IPDomainOnlyCard = (record) => {
    return <Card
      bodyStyle={{ padding: 0, margin: 0, minHeight: listitemHeight + 36 }}
    >
      <Row>
        <Col span={10}>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          >
            {IPDomainInfoRow(record)}
          </Row>
          <Row
            style={{ marginTop: 4, marginLeft: 4 }}
          ><Space>
            <Dropdown
              placement="top"
              overlay={<Menu
                onClick={({ item, key, keyPath, domEvent }) => switchProject(
                  key, record)}
                items={projects.filter(
                  project => project.project_id !== projectActive.project_id).
                  map(project => {
                    return {
                      key: project.project_id,
                      label: project.name,
                      icon: <ProjectOutlined/>,
                    }
                  })}
              />}
              trigger={['click']}
            >
              <Button icon={<SwapOutlined/>}></Button>
            </Dropdown>
            <Button
              icon={<DeleteOutlined/>}
              onClick={() => addToWebIPDomainPortWaitList(record)}
            ></Button>
            <Button
              danger
              icon={<DeleteOutlined/>}
              onClick={() => destoryProjectReq.run(
                { ipdomain: record.ipdomain })}
            ></Button>
          </Space></Row>
        </Col>
        <Col span={14}>
          <Tabs
            style={{
              marginTop: -4,
            }}
            size="small">
            {DomainICPTabPane(record)}
            {DNSTabPane(record)}
          </Tabs>
        </Col>
      </Row>
    </Card>
  }
  const renderItem = record => {
    let maincard = null
    if (record.port_info) {
      maincard = IPDomainPortCard(record)
    } else {
      maincard = IPDomainOnlyCard(record)
    }
    return <List.Item
      style={{ padding: 0, margin: 0 }}
    >
      {maincard}
    </List.Item>

  }
  return (<Fragment>
    <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk"/>
    <Row
      gutter={0}
      style={{ marginTop: 0, marginBottom: 0 }}
    >
      <Col span={18}>
        <SearchRow/>
      </Col>
      <Col span={6}>
        <Space>
          <Pagination
            // style={{
            //   float: 'right',
            // }}
            {...tableParams}
            onChange={handlePageChange}
            showLessItems={true}
            showSizeChanger={false}
            responsive={false}
          />

        </Space>
      </Col>
    </Row>
    <List
      style={{
        overflow: 'auto',
        maxHeight: cssCalc(`${WebMainHeight} - 60px`),
        minHeight: cssCalc(`${WebMainHeight} - 60px`),
      }}
      rowKey={'id'}
      // bordered={true}
      split={false}
      itemLayout="vertical"
      size="small"
      dataSource={ipdomains}
      renderItem={item => renderItem(item)}
      loading={listIPdomainReq.loading}
    >
    </List>
  </Fragment>)
}
export const IPDomainMemo = memo(IPDomain)


