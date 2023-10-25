import React, { Fragment, memo, useImperativeHandle, useState } from 'react'
import moment from 'moment'
import { getLocale, useRequest } from 'umi'
import {
    deleteMsgrpcFileMsfAPI, getCoreCurrentUserAPI, getMsgrpcFileMsfAPI, postPostmodulePostModuleActuatorAPI,
} from '@/services/apiv1'

import { Button, Card, Col, Modal, Row, Space, Table, Tag, Upload, List, Typography, Tabs, Image } from 'antd'
import { CopyOutlined, SyncOutlined, UploadOutlined } from '@ant-design/icons'
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
    CaretRightOutlined, SubnodeOutlined, AppleOutlined, MacCommandOutlined,
} from '@ant-design/icons'
import './IPDomain.css'

let protocol = 'ws://'
let webHost = HostIP + ':8002'
if (process.env.NODE_ENV === 'production') {
    webHost = location.hostname + (location.port ? `:${location.port}` : '')
    protocol = 'wss://'
}

const IPDomain = props => {
    console.log('FileMsf')
    const {
        setHeatbeatsocketalive, heatbeatsocketalive,
    } = useModel('HostAndSessionModel', model => ({
        setHeatbeatsocketalive: model.setHeatbeatsocketalive, heatbeatsocketalive: model.heatbeatsocketalive,
    }))

    const {
        ipdomains, setIPDomains,
    } = useModel('WebMainModel', model => ({
        ipdomains: model.ipdomains, setIPDomains: model.setIPDomains,
    }))

    const listitemHeight = 240

    const IPDomainTable = () => {

        const LeftCol = (item) => {
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

                return <Space size={0}>
                    {tagslist}
                </Space>
            }
            return <Col span={12}>
                <Row
                    style={{ marginTop: 3, marginLeft: 4 }}
                >{IPDomainInfoRow(item)}</Row>
                <Row
                    style={{ marginTop: 2, marginLeft: 4 }}
                >{PortInfoRow(item)}</Row>
                <Row
                    style={{ marginTop: 2, marginLeft: 4 }}
                >{ComponentRow(item)}</Row>
            </Col>
        }

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
                                padding: '0 0 0 0',
                                overflowX: 'hidden',
                                maxHeight: listitemHeight - 14,
                                minHeight: listitemHeight - 14,
                                whiteSpace: 'pre-wrap',
                                background: '#000',
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
                                marginTop: -16,
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

            return <Col span={12}>
                <Tabs
                    style={{
                        marginTop: -4,
                    }}
                    size="small">
                    {DNSTabPane(item)}
                    {CertTabPane(item)}
                    {ScreenshotTabPane(item)}
                </Tabs>
            </Col>
        }

        const renderItem = item => {
            return <List.Item
                key={item.id}
                style={{ padding: 0, marginBottom: 4 }}
            >
                <Card
                    bodyStyle={{ padding: 0, margin: 0 }}
                >
                    <Row>
                        {LeftCol(item)}
                        {RightCol(item)}
                    </Row>
                </Card>
            </List.Item>
        }


        return <List
            style={{
                overflow: 'auto',
                maxHeight: cssCalc(`${WebMainHeight} - 64px`),
                minHeight: cssCalc(`${WebMainHeight} - 64px`),
            }}
            bordered={false}
            split={false}
            itemLayout="vertical"
            size="small"
            dataSource={ipdomains}
            renderItem={item => renderItem(item)}
        >
        </List>
    }

    return (<Fragment>
        <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk"/>
        <Row
            gutter={0}
            style={{
                // margin: 0,
            }}
        ><Col span={4}>
            <Button
                block
                icon={<SyncOutlined/>}
            >
                {formatText('app.core.refresh')}
            </Button>
        </Col>
            <Col span={8}>
                <Button
                    block
                    icon={<SyncOutlined/>}
                >
                    {formatText('app.core.refresh')}
                </Button>
            </Col>
        </Row>
        <IPDomainTable/>
    </Fragment>)
}
export const IPDomainMemo = memo(IPDomain)


