import React, { Fragment, memo, useImperativeHandle, useState } from 'react'
import moment from 'moment'
import { getLocale, useRequest } from 'umi'
import {
    deleteMsgrpcFileMsfAPI,
    getCoreCurrentUserAPI,
    getMsgrpcFileMsfAPI,
    postPostmodulePostModuleActuatorAPI,
} from '@/services/apiv1'

import { Button, Card, Col, Modal, Row, Space, Table, Tag, Upload } from 'antd'
import { CopyOutlined, SyncOutlined, UploadOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { getToken } from '@/utils/authority'
import { cssCalc, Downheight } from '@/utils/utils'
import {
    formatText, getSessionlocate, manuali18n, msgerror, msgsuccess, msgwarning,
} from '@/utils/locales'
import { DocIcon, MyIcon, WebMainHeight } from '@/pages/Core/Common'
import { useModel } from '@@/plugin-model/useModel'
import { HostIP } from '@/config'
import { useEffect, useRef } from 'react'
import { useInterval } from 'ahooks'
import {
    CaretRightOutlined,
    SubnodeOutlined,
} from '_@ant-design_icons@4.8.1@@ant-design/icons'
import { Dropdown, Tooltip } from '_antd@4.24.14@antd'

let protocol = 'ws://'
let webHost = HostIP + ':8002'
if (process.env.NODE_ENV === 'production') {
    webHost = location.hostname + (location.port ? `:${location.port}` : '')
    protocol = 'wss://'
}

const IPDomain = props => {
    console.log('FileMsf')
    const [msfUploading, setMsfUploading] = useState(false)
    const [fileMsfListActive, setFileMsfListActive] = useState([])
    const {
        setHeatbeatsocketalive,
        heatbeatsocketalive,
    } = useModel('HostAndSessionModel', model => ({
        setHeatbeatsocketalive: model.setHeatbeatsocketalive,
        heatbeatsocketalive: model.heatbeatsocketalive,
    }))

    const {
        ipdomains, setIPDomains,
    } = useModel('WebMainModel', model => ({
        ipdomains: model.ipdomains, setIPDomains: model.setIPDomains,
    }))

    const listCurrentUserReq = useRequest(getCoreCurrentUserAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const urlpatterns = '/ws/v1/websocket/websync/?'
    const urlargs = `&token=${getToken()}`
    const socketUrl = protocol + webHost + urlpatterns + urlargs

    const ws = useRef(null)

    const initHeartBeat = () => {
        try {
            listCurrentUserReq.run()
            ws.current = new WebSocket(socketUrl)
        } catch (error) {
            return
        }

        ws.current.onopen = () => {
            setHeatbeatsocketalive(true)
        }
        ws.current.onclose = CloseEvent => {
            setHeatbeatsocketalive(false)
        }
        ws.current.onerror = ErrorEvent => {
            setHeatbeatsocketalive(false)
        }
        ws.current.onmessage = event => {
            const response = JSON.parse(event.data)
            const { ipdomains_update } = response
            const { ipdomains } = response
            if (ipdomains_update) {
                setIPDomains(ipdomains)
            }
        }
    }

    const heartbeatmonitor = () => {
        if (ws.current !== undefined && ws.current !== null &&
            ws.current.readyState === WebSocket.OPEN) {
        } else {
            try {
                ws.current.close()
            } catch (error) {
            }
            try {
                ws.current = null
            } catch (error) {
            }
            initHeartBeat()
        }
    }
    useInterval(() => heartbeatmonitor(), 3000)
    useEffect(() => {
        initHeartBeat()
        return () => {
            try {
                ws.current.close()
            } catch (error) {
            }
            try {
                ws.current = null
            } catch (error) {
            }
        }
    }, [])

    useImperativeHandle(props.onRef, () => {
        return {
            updateData: () => {
                listFileMsfReq.run()
            },
        }
    })

    useRequest(getMsgrpcFileMsfAPI, {
        onSuccess: (result, params) => {
            setFileMsfListActive(result)
        }, onError: (error, params) => {
        },
    })

    const listFileMsfForViewReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true, onSuccess: (result, params) => {
            if (result.type === 'img') {
                Modal.info({
                    icon: null,
                    bodyStyle: { padding: '0 0 0 0' },
                    mask: false,
                    width: '80vw',
                    content: <img style={{ width: '100%' }}
                                  src={`data:image/png;base64,${result.data}`} />,
                })
            } else {
                Modal.info({
                    icon: null, style: {
                        top: 40, padding: '0px 0px 0px 0px',
                    }, mask: false, width: '70vw', content: (<Fragment>
              <pre
                  style={{
                      width: '100%', maxHeight: '60vh',
                  }}
              >
                {atob(result.data)}
              </pre>
                        <Row>
                            <Button
                                onClick={() => {
                                    copy(atob(result.data))
                                    msgsuccess('已拷贝到剪切板',
                                        'Copyed to clipboard')
                                }}
                            >
                                Copy to clipboard
                            </Button>
                        </Row>
                    </Fragment>),
                })
            }
        }, onError: (error, params) => {
        },
    })

    const listFileMsfForDownloadReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const listFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true, onSuccess: (result, params) => {
            setFileMsfListActive(result)
        }, onError: (error, params) => {
        },
    })

    const portServiceRowRender = portServiceRecord => {
        const portServiceTableColumns = [
            {
                dataIndex: 'ipaddress',
                width: 128,
                render: (text, portServiceRecord) => {
                    const session = portServiceRecord

                    const hostwithsession = JSON.parse(
                        JSON.stringify(portServiceRecord)) // deep copy
                    hostwithsession.session = session

                    return (<Button
                        onClick={() => {
                            setRunModuleModalVisable(true)
                            setActiveHostAndSession(hostwithsession)
                        }}
                        style={{
                            width: 104,
                            backgroundColor: '#274916',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                        size="small"
                    >
                        <CaretRightOutlined />
                    </Button>)
                },
            }]

        return <Table
            loading={!heatbeatsocketalive}
            dataSource={portServiceRecord.portservice}
            style={{ marginLeft: 23 }}
            size="small"
            columns={portServiceTableColumns}
            rowKey={item => item.id}
            pagination={false}
            showHeader={false}
            locale={{ emptyText: null }}
        />
    }

    return (<Fragment>
        <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk" />
        <Row
            style={{
                marginTop: -16,
            }}
            gutter={0}
        ><Col span={8}>
            <Button
                block
                icon={<SyncOutlined />}
                onClick={() => listFileMsfReq.run()}
                loading={listFileMsfReq.loading ||
                    listFileMsfForDownloadReq.loading ||
                    listFileMsfForViewReq.loading || msfUploading}
            >
                {formatText('app.core.refresh')}
            </Button>
        </Col>

        </Row>
        <Table
            style={{
                overflow: 'auto',
                maxHeight: cssCalc(`${WebMainHeight} - 64px`),
                minHeight: cssCalc(`${WebMainHeight} - 64px`),
            }}
            loading={!heatbeatsocketalive}
            scroll={{ y: cssCalc(`${WebMainHeight} - 96px`) }}
            size="small"
            bordered
            pagination={false}
            rowKey="id"
            columns={[
                {
                    title: formatText('app.filemsf.filename'),
                    dataIndex: 'ip',
                    key: 'ip',
                    sorter: (a, b) => a.ip >= b.ip,
                    render: (text, record) => <span>{record.ip}</span>,
                },
                {
                    title: formatText('app.filemsf.filename'),
                    dataIndex: 'domain',
                    key: 'domain',
                    sorter: (a, b) => a.domain >= b.domain,
                    render: (text, record) => <span>{record.domain}</span>,
                },
                {
                    title: formatText('app.filemsf.filename'),
                    dataIndex: 'source',
                    key: 'source',
                    sorter: (a, b) => a.source >= b.source,
                    render: (text, record) => <span>{record.source}</span>,
                },
                {
                    title: formatText('app.filemsf.size'),
                    dataIndex: 'source_key',
                    key: 'source_key',
                    sorter: (a, b) => a.size >= b.size,
                },
                {
                    //session信息
                    dataIndex: 'port_and_service', render: (text, record) => {
                        const port_and_service_tags = []
                        record.port_and_service.forEach(one_port_and_service => {
                            // 心跳标签
                            let one_tag = <Tag
                                color="orange"
                                style={{
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                {one_port_and_service}
                            </Tag>
                            port_and_service_tags.push(one_tag)
                        })
                        return (<div
                            style={{
                                display: 'flex', cursor: 'pointer',
                            }}
                        >{port_and_service_tags}
                        </div>)
                    },
                },
                {
                    title: formatText('app.core.updatetime'),
                    dataIndex: 'update_time',
                    key: 'update_time',
                    sorter: (a, b) => a.update_time >= b.update_time,
                    render: (text, record) => (
                        <Tag color="cyan">{moment(record.update_time * 1000).
                            format('YYYY-MM-DD HH:mm')}</Tag>),
                },
            ]}
            expandable={{
                expandRowByClick: true,
                expandedRowRender: portServiceRowRender,
                rowExpandable: record => record.portservice.length > 0,
                // expandIcon: ({ expanded, onExpand, record }) => null,
            }}

            dataSource={ipdomains}
        />
    </Fragment>)
}
export const IPDomainMemo = memo(IPDomain)


