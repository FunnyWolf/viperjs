import React, { Fragment, memo, useImperativeHandle, useState } from 'react'
import moment from 'moment'
import { getLocale, useRequest } from 'umi'
import {
    deleteMsgrpcFileMsfAPI, deleteMsgrpcSessionioAPI, deleteWebdatabaseProjectAPI,
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
} from 'antd'
import {
    CopyOutlined, SyncOutlined, UploadOutlined, ProjectOutlined, SwapOutlined, DeleteOutlined,
} from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { getToken } from '@/utils/authority'
import { cssCalc, Downheight } from '@/utils/utils'
import {
    formatText, getModuleName, getSessionlocate, manuali18n, msgerror, msgsuccess, msgwarning,
} from '@/utils/locales'
import { DocIcon, MyIcon, WebMainHeight } from '@/pages/Core/Common'
import { useModel } from '@@/plugin-model/useModel'
import { HostIP } from '@/config'
import { useEffect, useRef } from 'react'
import { useInterval } from 'ahooks'
import {
    CaretRightOutlined, SubnodeOutlined, AppleOutlined, MacCommandOutlined, LinkOutlined,
} from '@ant-design/icons'
import styles from '@/utils/utils.less'

const listitemHeight = 240

const RightCol = (item) => {
    const DNSTabPane = (item) => {
        const dnsrecord = item.dnsrecord

        if (dnsrecord !== null) {
            const a = dnsrecord.a
            const cname = dnsrecord.cname

            const ATable = (a) => {
                if (a !== null && a.length > 0) {
                    return <Table
                        style={{
                            overflow: 'auto', minHeight: listitemHeight, maxHeight: listitemHeight,
                        }}
                        columns={[{
                            title: 'A', dataIndex: 'domain', // sorter: (a, b) => a.pid >= b.pid,
                        }]}
                        dataSource={a.map(record => {
                            return { 'domain': record }
                        })}
                        pagination={false}
                        scroll={{ y: listitemHeight - 32 }}
                        size="small"
                    />
                } else {
                    return null
                }
            }
            const CNameTable = (cname) => {
                if (cname !== null && cname.length > 0) {
                    return <Table
                        columns={[{
                            title: 'CNAME', dataIndex: 'domain', // sorter: (a, b) => a.pid >= b.pid,
                        }]}
                        dataSource={cname.map(record => {
                            return { 'domain': record }
                        })}
                        pagination={false}
                        scroll={{ y: 168 }}
                        size="small"
                    />
                } else {
                    return null
                }
            }
            return <Tabs.TabPane tab={<span>DNS</span>} key="DNSRecord">
                <Row
                    style={{
                        marginTop: -16,
                    }}
                >
                    <Col span={12}>
                        {ATable(a)}
                    </Col>
                    <Col span={12}>
                        {CNameTable(cname)}
                    </Col>
                </Row>
            </Tabs.TabPane>
        } else {
            return null
        }
    }

    const CertTabPane = (item) => {
        const cert = item.cert
        if (cert !== null) {
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
                                background: '#141414',
                            }}
                        >{cert.cert}</pre>
            </Tabs.TabPane>
        } else {
            return null
        }
    }

    const ScreenshotTabPane = (item) => {
        const screenshot = item.screenshot
        if (screenshot !== null) {
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
    const ResponseTabPane = (item) => {
        const http = item.http
        if (http !== null) {
            const http = item.http
            const httpbase = http.httpbase

            return <Tabs.TabPane tab={<span>Response</span>} key="Response">
                        <pre
                            style={{
                                marginTop: -16,
                                marginBottom: 0,
                                padding: '0 0 0 0',
                                overflowX: 'hidden',
                                maxHeight: listitemHeight,
                                minHeight: listitemHeight,
                                whiteSpace: 'pre-wrap',
                                background: '#141414',
                            }}
                        >{httpbase.response}</pre>
            </Tabs.TabPane>
        } else {
            return null
        }
    }
    return <Col span={12}>
        <Tabs
            style={{
                marginTop: -4,
            }}
            size="small">
            {DNSTabPane(item)}
            {CertTabPane(item)}
            {ScreenshotTabPane(item)}
            {ResponseTabPane(item)}
        </Tabs>
    </Col>
}


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


    const switchProject = (key, record) => {
        switchProjectReq.run({
            project_id: key, ipdomain: record.ipdomain,
        })
    }

    const handlePageChange = (page, pageSize) => {
        const pagination = { current: page, pageSize: pageSize }
        listIPdomainReq.run({
            project_id: projectActive.project_id, pagination: pagination,
        })
        setTableParams(pagination)
    }

    useEffect(() => {
        listIPdomainReq.run({
            project_id: projectActive.project_id, pagination: tableParams,
        })
    }, [projectActive])

    useEffect(() => {
        listProjectReq.run()
    }, [])

    const IPDomainInfoRow = (item) => {
        const LocationTag = (item) => {
            const location = item.location
            const geo_info = location.geo_info
            const isp = location.isp
            if (item.location !== null) {
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
        return <Space size={0}>
            <Tag
                color="blue"
                style={{
                    textAlign: 'center', cursor: 'pointer',
                }}
            >
                {item.ipdomain}
            </Tag>
            {LocationTag(item)}
            <Tag
                color="cyan"
                style={{
                    textAlign: 'center',
                }}
            >
                {moment(item.update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
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
        return <Space size={0}>{tagslist}</Space>
    }
    const HttpRow = (item) => {
        const cndTag = (cdn) => {
            if (cdn !== null) {
                return <Tag
                    color="cyan"
                    style={{
                        textAlign: 'center', cursor: 'pointer',
                    }}
                >
                    <strong>CDN</strong>
                </Tag>
            } else {
                return null
            }
        }

        if (item.http !== null) {
            const http = item.http
            const httpbase = http.httpbase
            const httpfavicon = http.httpfavicon
            const cdn = http.cdn
            const src = 'data:image/png;base64,' + httpfavicon.content
            return <Space>
                <Avatar
                    shape="square"
                    size={20}
                    src={src}
                />
                <Button type="link" size="small" shape="round" icon={<LinkOutlined/>}>{httpbase.title}</Button>
                <Tag
                    color="cyan"
                    style={{
                        textAlign: 'center', cursor: 'pointer',
                    }}
                >
                    <strong>{httpbase.status_code}</strong>
                </Tag>
                {cndTag(cdn)}
            </Space>
        } else {
            return null
        }
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


    const renderItem = record => {
        return <List.Item
            key={record.id}
            style={{ padding: 0, margin: 0 }}
        >
            <Card
                bodyStyle={{ padding: 0, margin: 0 }}
            >
                <Row>
                    <Col span={12}>
                        <Row
                            style={{ marginTop: 3, marginLeft: 4 }}
                        >{IPDomainInfoRow(record)}</Row>
                        <Row
                            style={{ marginTop: 2, marginLeft: 4 }}
                        >{PortInfoRow(record)}</Row>
                        <Row
                            style={{ marginTop: 3, marginLeft: 4 }}
                        >{ComponentRow(record)}</Row>
                        <Row
                            style={{ marginTop: 3, marginLeft: 4 }}
                        >{HttpRow(record)}</Row>
                        {/*<Row*/}
                        {/*  style={{ marginTop: 3, marginLeft: 4 }}*/}
                        {/*>{DetailRow(item)}</Row>*/}
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
                                    danger
                                    icon={<DeleteOutlined/>}
                                    onClick={() => destoryProjectReq.run({ ipdomain: record.ipdomain })}
                            >删除</Button>
                        </Space></Row>
                    </Col>
                    {RightCol(record)}
                </Row>
            </Card>
        </List.Item>
    }
    return (<Fragment>
        <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk"/>
        <Row
            gutter={0}
            style={{
                // margin: 0,
            }}
        >
            <Col span={4}>
                <Button
                    block
                    icon={<SyncOutlined/>}
                >
                    {formatText('app.core.refresh')}
                </Button>
            </Col>
            <Col span={14}>
                <Button
                    block
                    icon={<SyncOutlined/>}
                >
                    {formatText('app.core.refresh')}
                </Button>
            </Col>
            <Col span={6}>
                <Pagination
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
                overflow: 'auto',
                maxHeight: cssCalc(`${WebMainHeight} - 56px`),
                minHeight: cssCalc(`${WebMainHeight} - 56px`),
            }}
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


