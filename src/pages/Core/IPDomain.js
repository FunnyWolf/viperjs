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
} from 'antd'
import {
    CopyOutlined, SyncOutlined, UploadOutlined, ProjectOutlined, SwapOutlined, DeleteOutlined, SearchOutlined,
} from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { getToken } from '@/utils/authority'
import { cssCalc, Downheight } from '@/utils/utils'
import {
    formatText, getModuleName, getSessionlocate, manuali18n, msgerror, msgsuccess, msgwarning,
} from '@/utils/locales'
import { DocIcon, MyIcon, SidTag, TimeTag, WebMainHeight } from '@/pages/Core/Common'
import { useModel } from '@@/plugin-model/useModel'
import { HostIP } from '@/config'
import { useEffect, useRef } from 'react'
import { useInterval } from 'ahooks'
import {
    CaretRightOutlined, SubnodeOutlined, AppleOutlined, MacCommandOutlined, LinkOutlined,
} from '@ant-design/icons'
import styles from '@/utils/utils.less'
import { Descriptions } from '_antd@4.24.14@antd'

const listitemHeight = 240

const IPDomain = props => {
    console.log('IPDomain')

    const {
        projectActive, projects, setProjects, ipdomains, setIPDomains,
    } = useModel('WebMainModel', model => ({
        projectActive: model.projectActive,
        projects: model.projects,
        setProjects: model.setProjects,
        ipdomains: model.ipdomains,
        setIPDomains: model.setIPDomains,
    }))

    const [tableParams, setTableParams] = useState({
        current: 1, pageSize: 10,
    })

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
            setIPDomains(ipdomains.filter(item => item.ipdomain !== params[0].ipdomain))
        }, onError: (error, params) => {
        },
    })

    const destoryProjectReq = useRequest(deleteWebdatabaseProjectAPI, {
        manual: true, onSuccess: (result, params) => {
            setIPDomains(ipdomains.filter(item => item.ipdomain !== params[0].ipdomain))
        }, onError: (error, params) => {
        },
    })

    //portscan
    const {
        webTaskListPortScan, setWebTaskListPortScan,
    } = useModel('WebMainModel', model => ({
        webTaskListPortScan: model.webTaskListPortScan, setWebTaskListPortScan: model.setWebTaskListPortScan,
    }))
    const addToWebTaskListPortScan = (params) => {
        const { ipdomain, tag } = params

        if (!webTaskListPortScan.some(item => item.ipdomain === ipdomain)) {
            setWebTaskListPortScan([...webTaskListPortScan, params])
        }
        msgsuccess(`已添加到任务队列`, `Added to task queue`)
    }
    // const addToWebTaskListPortScan = (params) => {
    //     if (!webTaskListPortScan.includes(params)) {
    //         setWebTaskListPortScan([...webTaskListPortScan, params])
    //     }
    //     console.log(webTaskListPortScan)
    //     msgsuccess(`已添加到任务队列`, `Added to task queue`)
    // }
    const cleanWebTaskListPortScan = () => {
        setWebTaskListPortScan([])
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
            project_id: projectActive.project_id, pagination: pagination,
        })
    }

    const handleRefresh = () => {
        listIPdomainReq.run({
            project_id: projectActive.project_id, pagination: tableParams,
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

    const LocationTag = (item) => {

        if (item.location) {
            const location = item.location
            const geo_info = location.geo_info
            const isp = location.isp
            return <><Tag
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
                </Tag></>
        } else {
            return null
        }
    }
    const IPInfoRow = (item) => {
        return <Space size={0}>
            <Tag
              color="blue"
              style={{
                  textAlign: 'center', cursor: 'pointer',
              }}
            >
                {item.ip}
            </Tag>
            {LocationTag(item)}
            {TimeTag(item.update_time)}
        </Space>
    }

    const IPDomainInfoRow = (item) => {
        return <Space size={0}>
            <Tag
              color="blue"
              style={{
                  textAlign: 'center', cursor: 'pointer',
              }}
            >
                {item.ipdomain}
            </Tag>
        </Space>
    }

    const PortInfoRow = (item) => {
        return <Space size={0}>
            <Tag
              color="green"
              style={{
                  // width: 160,
                  textAlign: 'center', cursor: 'pointer',
              }}
            >
                <strong>{item.port}</strong>
            </Tag>
            <Tag
              color="cyan"
              style={{
                  // width: 160,
                  textAlign: 'center', cursor: 'pointer',
              }}
            >
                <strong>{item.service}</strong>
            </Tag>
        </Space>
    }
    const ComponentRow = (item) => {
        if (item.component_list) {
            const component_list = item.component_list

            const tagslist = component_list.map(component => {
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
            return <Space wrap size={[0, 4]}>{tagslist}</Space>
        } else {
            return null
        }

    }
    const SearchModel = () => {
        const [form] = Form.useForm()
        const onSearch = values => {
            setSearchParams(values)
            listIPdomainReq.run({
                project_id: projectActive.project_id, pagination: tableParams, ...values,
            })
        }

        return <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          // initialValues={searchParams}
          onFinish={onSearch}
        >
            <Form.Item
              name="ipdomain"
              label="IP / Domain"
              // rules={[
              //     {
              //         required: true,
              //         message: 'Please input the title of collection!',
              //     },
              // ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item name="port" label="Port">
                <InputNumber min={1} max={65535}/>
            </Form.Item>
            <Form.Item
            >
                <Button type="primary" block htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    }
    const DetailRow = (item) => {
        return <Card
          bodyStyle={{
              maxHeight: listitemHeight - 64 - 16, minHeight: listitemHeight - 64 - 16,
          }}
        >
            <div>111</div>
        </Card>
    }

    const HttpTabPane = (record) => {
        const cdnTag = (cdn) => {
            if (cdn === null) {
                return null
            } else {
                if (cdn.flag === true) {
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
        const httpFaviconTag = (httpfavicon) => {
            if (httpfavicon !== null) {
                const src = 'data:image/png;base64,' + httpfavicon.content
                return <Avatar
                  shape="square"
                  size={20}
                  src={src}
                />
            } else {
                return null
            }
        }
        if (record.http !== null && record.http !== undefined) {
            const http = record.http
            const httpbase = http.httpbase
            const httpfavicon = http.httpfavicon
            const cdn = http.cdn
            return <Tabs.TabPane tab={<span>HTTP</span>} key="HTTP">
                <Space>
                    {httpFaviconTag(httpfavicon)}
                    <Button type="link" size="small" shape="round" icon={<LinkOutlined/>}>{httpbase.title}</Button>
                    <Tag
                      color="cyan"
                      style={{
                          textAlign: 'center', cursor: 'pointer',
                      }}
                    >
                        <strong>{httpbase.status_code}</strong>
                    </Tag>
                    {cdnTag(cdn)}
                </Space>
            </Tabs.TabPane>
        } else {

            return null
        }
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
                              overflow: 'auto', minHeight: listitemHeight, maxHeight: listitemHeight,
                          }}
                          columns={[{
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
        if (record.cert) {
            const cert = record.cert
            return <Tabs.TabPane tab={<span>Cert</span>} key="Cert">
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
            </Tabs.TabPane>
        } else {
            return null
        }
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

        if (record.response) {
            const response = record.response

            return <Tabs.TabPane tab={<span>Response</span>} key="Response">
                        <pre
                          style={{
                              marginTop: -16, marginBottom: 0, padding: '0 0 0 0', // overflowX: 'hidden',
                              maxHeight: listitemHeight, minHeight: listitemHeight, whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#141414',
                          }}
                        >{response}</pre>
            </Tabs.TabPane>
        } else {
            return null
        }
    }
    const DomainICPTabPane = (record) => {

        if (record.domainicp) {
            const domainicp = record.domainicp
            return <Tabs.TabPane style={{ marginTop: -16 }} tab={<span>ICP</span>} key="domainicp">
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
                <Col span={12}>
                    <Row
                      style={{ marginTop: 4, marginLeft: 4 }}
                    >{IPDomainInfoRow(record)}</Row>
                    <Row
                      style={{ marginTop: 4, marginLeft: 4 }}
                    >{IPInfoRow(record)}</Row>
                    <Row
                      style={{ marginTop: 4, marginLeft: 4 }}
                    >{PortInfoRow(record)}</Row>
                    <Row
                      style={{ marginTop: 4, marginLeft: 4 }}
                    >{ComponentRow(record)}</Row>
                    <Row
                      style={{ marginTop: 4, marginLeft: 4 }}
                    ><Space>
                        <Dropdown
                          placement="top"
                          overlay={<Menu
                            onClick={({ item, key, keyPath, domEvent }) => switchProject(key, record)}
                            items={projects.filter(project => project.project_id !== projectActive.project_id).map(project => {
                                return {
                                    key: project.project_id, label: project.name, icon: <ProjectOutlined/>,
                                }
                            })}
                          />}
                          trigger={['click']}
                        >
                            <Button size="small" icon={<SwapOutlined/>}>切换</Button>
                        </Dropdown>
                        <Button size="small"
                                icon={<DeleteOutlined/>}
                                onClick={() => addToWebTaskListPortScan({ ipdomain: record.ipdomain })}
                        >PortScan</Button>

                        <Button size="small"
                                danger
                                icon={<DeleteOutlined/>}
                                onClick={() => destoryProjectReq.run({ ipdomain: record.ipdomain })}
                        >删除</Button>
                    </Space></Row>
                </Col>
                <Col span={12}>
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
                        {DomainICPTabPane(record)}
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
                <Col span={12}>
                    {IPDomainInfoRow(record)}
                    <Row
                      style={{ marginTop: 11, marginLeft: 4 }}
                    ><Space>
                        <Dropdown
                          placement="top"
                          overlay={<Menu
                            onClick={({ item, key, keyPath, domEvent }) => switchProject(key, record)}
                            items={projects.filter(project => project.project_id !== projectActive.project_id).map(project => {
                                return {
                                    key: project.project_id, label: project.name, icon: <ProjectOutlined/>,
                                }
                            })}
                          />}
                          trigger={['click']}
                        >
                            <Button size="small" icon={<SwapOutlined/>}>切换</Button>
                        </Dropdown>
                        <Button size="small"
                                icon={<DeleteOutlined/>}
                                onClick={() => addToWebTaskListPortScan({ ipdomain: record.ipdomain })}
                        >PortScan</Button>

                        <Button size="small"
                                danger
                                icon={<DeleteOutlined/>}
                                onClick={() => destoryProjectReq.run({ ipdomain: record.ipdomain })}
                        >删除</Button>
                    </Space></Row>
                </Col>
                <Col span={12}>
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
        if (record.port) {
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
        >
            <Col span={12}>
                <Button
                  block
                  icon={<SyncOutlined/>}
                >
                    {formatText('app.core.refresh')}
                </Button>
            </Col>
            <Col span={2}>
                <Popover
                  overlayInnerStyle={{ padding: 0, margin: 0 }}
                  content={SearchModel}
                  trigger="click">
                    <Button
                      block
                      icon={<SearchOutlined/>}
                    >
                        {formatText('app.core.search')}
                    </Button>
                </Popover>
            </Col>
            <Col span={2}>
                <Button
                  block
                  icon={<SyncOutlined/>}
                  onClick={() => handleRefresh()}
                  loading={listIPdomainReq.loading || listIPdomainReq.loading}
                >
                    {formatText('app.core.refresh')}
                </Button>
            </Col>
            <Col span={6}>
                <Pagination
                  // style={{
                  //     float: 'right',
                  // }}
                  {...tableParams}
                  onChange={handlePageChange}
                  showLessItems={true}
                  showSizeChanger={false}
                  responsive={true}
                />
            </Col>
        </Row>
        <List
          style={{
              overflow: 'auto', maxHeight: cssCalc(`${WebMainHeight} - 56px`), minHeight: cssCalc(`${WebMainHeight} - 56px`),
          }}
          // rowKey={record => `${record.ipdomain}:${record.port}`}
          bordered={false}
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


