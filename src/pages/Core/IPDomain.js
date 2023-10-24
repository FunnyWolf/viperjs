import React, { Fragment, memo, useImperativeHandle, useState } from 'react'
import moment from 'moment'
import { getLocale, useRequest } from 'umi'
import {
    deleteMsgrpcFileMsfAPI, getCoreCurrentUserAPI, getMsgrpcFileMsfAPI, postPostmodulePostModuleActuatorAPI,
} from '@/services/apiv1'

import { Button, Card, Col, Modal, Row, Space, Table, Tag, Upload, List, Typography } from 'antd'
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
    CaretRightOutlined, SubnodeOutlined,
} from '@ant-design/icons'
import { Dropdown, Tooltip } from 'antd'

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


    const IPDomainTable = () => {
        const renderItem = item => {
            return <List.Item
                key={item.id}
                style={{ padding: 4 }}
            >
                <Row>
                    <Space>
                        <Tag
                            color="cyan"
                            style={{
                                // marginLeft: -1,
                                // marginRight: 4,
                                textAlign: 'center',
                            }}
                        >
                            <strong>{moment(item.update_time * 1000).format('MM-DD HH:mm:ss')}</strong>
                        </Tag>
                        <Tag
                            color="blue"
                            style={{
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <strong>{item.ipdomain}</strong>
                        </Tag>
                        <Tag
                            color="green"
                            style={{
                                // width: 160,
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <strong>{item.port}</strong>
                        </Tag>
                        <Tag
                            color="cyan"
                            style={{
                                // width: 160,
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <strong>{item.service}</strong>
                        </Tag>
                    </Space>
                </Row>
                <Row>
                    <Col span={12}>

                    </Col>
                    <Col span={12}>

                    </Col>
                </Row>
            </List.Item>
        }


        return <List
            bordered
            style={{
                overflow: 'auto',
                maxHeight: cssCalc(`${WebMainHeight} - 96px`),
                minHeight: cssCalc(`${WebMainHeight} - 96px`),
            }}
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


