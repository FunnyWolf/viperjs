import { useModel } from '@@/plugin-model/useModel'
import { formatText, getModuleDesc, getModuleName, msgsuccess } from '@/utils/locales'
import React, { memo, useState } from 'react'
import { useRequest } from 'umi'
import { postPostmodulePostModuleActuatorAPI } from '@/services/apiv1'
import { DeleteOutlined, ExclamationCircleOutlined, PlayCircleOutlined, QuestionCircleOutlined, StarOutlined, StarTwoTone } from '@ant-design/icons'
import { Button, Col, Descriptions, Form, Popover, Row, Table, Tag, Input, Segmented } from 'antd'
import { cssCalc } from '@/utils/utils'
import styles from '@/utils/utils.less'
import { changePin, getModuleOptions, getPins } from '@/pages/Core/RunModule'
import { Radio } from '_antd@4.24.14@antd'

const { Search, TextArea } = Input

export const RunPortScanModule = props => {
    console.log('RunPortScanModule')

    const { webModuleOptions } = useModel('HostAndSessionModel', model => ({
        webModuleOptions: model.webModuleOptions,
    }))

    const {
        webTaskListPortScan, setWebTaskListPortScan,
    } = useModel('WebMainModel', model => ({
        webTaskListPortScan: model.webTaskListPortScan, setWebTaskListPortScan: model.setWebTaskListPortScan,
    }))

    const [webModuleConfigList, setWebModuleConfigList] = useState(webModuleOptions)
    const [webModuleConfigActive, setWebModuleConfigActive] = useState({
        NAME_ZH: null,
        NAME_EN: null,
        DESC_ZH: null,
        DESC_EN: null,
        AUTHOR: [],
        OPTIONS: [],
        REQUIRE_SESSION: true,
        loadpath: null,
        REFERENCES: [],
        README: [],
        SEARCH: '',
    })

    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    const pins = getPins()
    webModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath))

    // useRequest(() => getCoreNetworkSearchAPI({ cmdtype: 'list_config' }), {
    //     onSuccess: (result, params) => {
    //         setEngineConfs(result)
    //     }, onError: (error, params) => {
    //     },
    // })

    const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const onCreateWebModuleActuator = params => {
        createPostModuleActuatorReq.run({
            moduletype: 'Web', input_list: selectedRows, loadpath: webModuleConfigActive.loadpath, custom_param: JSON.stringify(params),
        })
    }

    const onPostModuleConfigListChange = botModuleConfigList => {
        const pins = getPins()
        botModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath))
        setWebModuleConfigList(botModuleConfigList)
    }

    const handleModuleSearch = value => {
        const reg = new RegExp(value, 'gi')
        onPostModuleConfigListChange(webModuleOptions.map(record => {
            let NAMEMatch = false
            let DESCMatch = false
            let REFERENCESMatch = false
            try {
                NAMEMatch = record.NAME_ZH.match(reg) || record.NAME_EN.match(reg)
                DESCMatch = record.DESC_ZH.match(reg) || record.DESC_EN.match(reg)
                REFERENCESMatch = record.REFERENCES.toString().match(reg)
            } catch (error) {
            }

            if (NAMEMatch || DESCMatch || REFERENCESMatch) {
                return {
                    ...record,
                }
            }
            return null
        }).filter(record => !!record))
    }

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys)
        setSelectedRows(selectedRows)
    }

    const moduleTypeOnChange = value => {
        if (value === undefined) {
            onPostModuleConfigListChange(webModuleOptions)
            return
        }
        if (value.length <= 0) {
            onPostModuleConfigListChange(webModuleOptions)
        } else {
            const newpostModuleConfigListState = webModuleOptions.filter(item => value.indexOf(item.MODULETYPE) >= 0)
            onPostModuleConfigListChange(newpostModuleConfigListState)
        }
    }

    const postModuleConfigTableColumns = [{
        dataIndex: 'loadpath', render: (text, record) => {
            console.log(record)
            const pins = getPins()
            const pinIcon = pins.indexOf(record.loadpath) > -1 ? (<StarTwoTone
              twoToneColor="#d89614"
              onClick={() => {
                  const newpins = changePin(record.loadpath)
                  onPostModuleConfigListChange(webModuleConfigList)
              }}
              style={{
                  marginTop: 3, marginLeft: 4, marginRight: 8, float: 'left', fontSize: '18px',
              }}
            />) : (<StarOutlined
              onClick={() => {
                  const newpins = changePin(record.loadpath)
                  onPostModuleConfigListChange(webModuleConfigList)
              }}
              style={{
                  marginTop: 3, marginLeft: 4, marginRight: 8, float: 'left', fontSize: '18px',
              }}
            />)

            let selectStyles = {}
            if (record.loadpath === webModuleConfigActive.loadpath) {
                selectStyles = {
                    color: '#d89614', fontWeight: 'bolder',
                }
            }
            return (<div
              style={{
                  display: 'inline',
              }}
            >
                {pinIcon}
                <a style={{ marginLeft: 4, ...selectStyles }}>{getModuleName(record)}</a>
                <Popover content={() => ModuleInfoContent(record)} placement="right">
                    <ExclamationCircleOutlined
                      style={{
                          marginTop: 3, marginRight: 8, float: 'right', fontSize: '18px',
                      }}
                    />
                </Popover>
            </div>)
        },
    }]

    const rowSelection = {
        selectedRowKeys, onChange: onSelectChange,
    }

    const ModuleInfoContent = (record) => {
        const readme = record.README
        const readmeCom = []
        for (let i = 0; i < readme.length; i++) {
            readmeCom.push(<div>
                <a href={readme[i]} target="_blank">
                    {readme[i]}
                </a>
            </div>)
        }
        const references = record.REFERENCES
        const referencesCom = []
        for (let i = 0; i < references.length; i++) {
            referencesCom.push(<div>
                <a href={references[i]} target="_blank">
                    {references[i]}
                </a>
            </div>)
        }

        const authors = record.AUTHOR
        const authorCom = []
        for (let i = 0; i < authors.length; i++) {
            authorCom.push(<Tag color="lime">{authors[i]}</Tag>)
        }

        return (<Descriptions
          size="small"
          style={{
              padding: '0 0 0 0',
          }}
          column={12}
          bordered
        >
            <Descriptions.Item label={formatText('app.runmodule.postmodule.NAME')} span={12}>
                {getModuleName(record)}
            </Descriptions.Item>
            <Descriptions.Item label={formatText('app.runmodule.postmodule.authorCom')} span={12}>
                {authorCom}
            </Descriptions.Item>
            <Descriptions.Item span={12} label="FOFA">
                <pre>{record.SEARCH.FOFA}</pre>
            </Descriptions.Item>
            <Descriptions.Item span={12} label="360Quake">
                <pre>{record.SEARCH.Quake}</pre>
            </Descriptions.Item>
            <Descriptions.Item label={formatText('app.runmodule.postmodule.readmeCom')} span={12}>
                {readmeCom}
            </Descriptions.Item>
            <Descriptions.Item label={formatText('app.runmodule.postmodule.referencesCom')} span={12}>
                {referencesCom}
            </Descriptions.Item>
            <Descriptions.Item span={12} label={formatText('app.runmodule.postmodule.DESC')}>
          <pre
            style={{
                whiteSpace: 'pre-wrap', overflowX: 'hidden', padding: '0 0 0 0',
            }}
          >{getModuleDesc(record)}</pre>
            </Descriptions.Item>
        </Descriptions>)
    }

    const addListToWebTaskListPortScan = (params) => {
        let addipdomains = params.ipdomaintext.split('\n')
        addipdomains = addipdomains.filter(record => !webTaskListPortScan.some(item => item.ipdomain === record))
        addipdomains = addipdomains.map((record, index) => {
            return { ipdomain: record }
        })
        setWebTaskListPortScan([...webTaskListPortScan, ...addipdomains])
        msgsuccess(`已添加到任务队列`, `Added to task queue`)
    }

    const deleteSelectedWebTaskListPortScan = () => {

        setWebTaskListPortScan(webTaskListPortScan.filter(item => {
            return !selectedRowKeys.includes(item.ipdomain)
        }))
    }

    const addIPDomainForm = () => {
        return <Form

          onFinish={addListToWebTaskListPortScan}
          // layout="inline"
        >
            <Form.Item
              name="ipdomaintext"
              // rules={[
              //     {
              //         required: true,
              //         // message: 'Please input your username!',
              //     },
              // ]}
            >
                <TextArea
                  style={{
                      width: 240,
                  }}
                  placeholder={formatText('ipdomain.portscan.ipdomainlist.ph')}
                  autoSize={{ minRows: 3, maxRows: 10 }}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    添加
                </Button>
            </Form.Item>
        </Form>
    }

    return (<Row style={{ marginTop: -16 }} gutter={0}>
        <Col span={6}>
            <Search placeholder={formatText('app.runmodule.postmodule.searchmodule.ph')}
                    onSearch={value => handleModuleSearch(value)}/>
            <Radio.Group
              defaultValue=""
              buttonStyle="solid"
              onChange={(e) => moduleTypeOnChange(e.target.value)}
            >
                <Radio.Button value="">{formatText('app.runmodule.postmodule.moduletype.all')}</Radio.Button>
                <Radio.Button
                  value="Web_PortService_Scan">{formatText('webmodule.portscan')}</Radio.Button>
                <Radio.Button
                  value="Web_Subdomain_Scan">{formatText('webmodule.subdomain')}</Radio.Button>
            </Radio.Group>
            <Table
              style={{
                  padding: '0 0 0 0', maxHeight: cssCalc('100vh - 560px'), minHeight: cssCalc('100vh - 560px'),
              }}
              scroll={{ y: 'calc(100vh - 480px)' }}
              // rowClassName={styles.moduleTr}
              showHeader={false}
              onRow={record => ({
                  onClick: () => {
                      setWebModuleConfigActive(record)
                      setSelectedRowKeys([])
                      setSelectedRows([])
                  },
              })}
              size="small"
              bordered
              pagination={false}
              rowKey={item => item.loadpath}
              rowSelection={undefined}
              columns={postModuleConfigTableColumns}
              dataSource={webModuleConfigList}
            />
        </Col>
        <Col span={12}>
            <Row gutter={8}>
                <Col span={12}>
                    <Row>
                        <Popover content={addIPDomainForm} trigger="click">
                            <Button>添加目标</Button>
                        </Popover>
                        <Button
                          icon={<DeleteOutlined/>}
                          onClick={() => deleteSelectedWebTaskListPortScan()}
                        >Clean</Button>
                    </Row>
                    <Table
                      // loading={listNetworkSearchReq.loading}
                      style={{
                          // marginTop: 0,
                          // maxHeight: '560px', minHeight: '560px',
                      }}
                      scroll={{ y: 480 }}
                      size="small"
                      bordered
                      pagination={false}
                      rowKey="ipdomain"
                      rowSelection={rowSelection}
                      columns={[{
                          title: 'IPDomain', dataIndex: 'ipdomain', key: 'ipdomain', width: 120, render: (text, record) => (<strong
                            style={{
                                color: '#13a8a8',
                            }}
                          >
                              {text}
                          </strong>),
                      }]}
                      dataSource={webTaskListPortScan}
                    />
                </Col>
            </Row>
            <Form
              layout="vertical"
              wrapperCol={{ span: 24 }}
              onFinish={onCreateWebModuleActuator}
            >
                <Row>{getModuleOptions(webModuleConfigActive)}</Row>
                <Row>
                    <Col span={22}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          disabled={webModuleConfigActive.loadpath === null || selectedRows.length === 0}
                          icon={<PlayCircleOutlined/>}
                          loading={createPostModuleActuatorReq.loading}
                        >{formatText('app.runmodule.postmodule.run')}</Button>
                    </Col>
                </Row>
            </Form>
        </Col>
    </Row>)
}
export const RunPortScanModuleMemo = memo(RunPortScanModule)