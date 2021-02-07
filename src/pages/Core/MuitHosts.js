import React, { Fragment, memo, useState } from 'react';
import copy from 'copy-to-clipboard';
import { formatMessage, useRequest } from 'umi';
import moment from 'moment';
import '@ant-design/compatible/assets/index.css';
import { Avatar, Button, Card, Col, Form, Input, message, Modal, Radio, Row, Space, Table, Tag } from 'antd';
import {
  BugOutlined,
  CloudOutlined,
  CopyOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  GatewayOutlined,
  LaptopOutlined,
  QuestionOutlined,
  SearchOutlined,
  SyncOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import { deleteCoreHostAPI, getCoreHostAPI, putCoreHostAPI } from '@/services/apiv1';

import styles from './MuitHosts.less';

String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};

const { Search } = Input;

const host_type_to_avatar = {
  ad_server: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: '#177ddc' }}
      icon={<WindowsOutlined/>}
    />
  ),
  pc: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: '#49aa19' }}
      icon={<LaptopOutlined/>}
    />
  ),
  web_server: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: '#13a8a8' }}
      icon={<CloudOutlined/>}
    />
  ),
  cms: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: '#d84a1b' }}
      icon={<BugOutlined/>}
    />
  ),
  firewall: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: '#d87a16' }}
      icon={<GatewayOutlined/>}
    />
  ),
  other: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: '#bfbfbf' }}
      icon={<QuestionOutlined/>}
    />
  ),
};

const MuitHosts = () => {
  console.log('MuitHosts');
  const [updateHostModalVisable, setUpdateHostModalVisable] = useState(false);
  const [hostList, setHostList] = useState([]);
  const [hostListTmp, setHostListTmp] = useState([]);
  const [hostAcvtive, setHostAcvtive] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [text, setText] = useState('');
  const initListHostReq = useRequest(getCoreHostAPI, {
    onSuccess: (result, params) => {
      setHostList(result);
      setHostListTmp(result);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    },
    onError: (error, params) => {
    },
  });

  const listHostReq = useRequest(getCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setHostList(result);
      setHostListTmp(result);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    },
    onError: (error, params) => {
    },
  });

  const showUpdateHostModal = record => {
    setUpdateHostModalVisable(true);
    setHostAcvtive(record);

  };
  const closeUpdateHostModal = () => {
    setUpdateHostModalVisable(false);
  };

  const updateHostReq = useRequest(putCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
      closeUpdateHostModal();
      listHostReq.run();
    },
    onError: (error, params) => {
    },
  });


  const destoryHostReq = useRequest(deleteCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHostReq.run();
    },
    onError: (error, params) => {
    },
  });

  const getSelectHostIPaddress = () => {
    const ipaddressArray = [];
    for (let i = 0; i < selectedRows.length; i += 1) {
      ipaddressArray.push(selectedRows[i].ipaddress);
    }
    copy(ipaddressArray.join());
    message.success(
      `${ipaddressArray.join()} ${formatMessage({ id: 'app.response.copytoclipboard' })}`,
    );
  };

  const reloadSearch = () => {
    setHostList(hostListTmp);
    setText('');
  };

  const handleSearch = value => {
    const templist = hostListTmp;
    const reg = new RegExp(value, 'gi');
    setHostList(
      templist.map(record => {
        let ipaddressMatch = false;
        let commentMatch = false;
        let techMatch = false;
        try {
          ipaddressMatch = record.ipaddress.includes(value);
          if (record.comment === null) {
            commentMatch = false;
          } else {
            commentMatch = record.comment.includes(value);
          }

          for (let i = 0; i < record.portService.length; i++) {
            const portServiceStr = JSON.stringify(record.portService[i]);
            techMatch = portServiceStr.match(reg);
            if (techMatch) {
              break;
            }
          }
        } catch (error) {
        }

        if (ipaddressMatch || commentMatch || techMatch) {
          return {
            ...record,
          };
        }
        return null;
      }).filter(record => !!record),
    );
  };


  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const expandedRowRender = record => {
    const portsColumns = [
      {
        title: '端口',
        dataIndex: 'port',
        width: 80,
        render: (val, record) => <span>{val}</span>,
      },
      {
        title: '服务',
        dataIndex: 'service',
        // width: '15%',
      },
      {
        title: 'Banner',
        dataIndex: 'banner',
        // width: '20%',
      },
      {
        title: '代理主机',
        dataIndex: 'proxy',
        key: 'proxy',
        width: 120,
        render: (text, record) => {
          try {
            return (
              <strong
                style={{
                  color: '#d8bd14',
                }}
              >
                {record.proxy.data.session_host}
              </strong>
            );
          } catch (e) {
            return null;
          }
        },
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        width: 80,
        render: val => <Tag color="cyan">{moment(val * 1000).fromNow()}</Tag>,
      },
    ];

    return (
      <Table
        bordered
        style={{ marginLeft: 82 }}
        size="small"
        columns={portsColumns}
        rowKey={item => item.id}
        dataSource={record.portService}
        pagination={false}
      />
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { offset: 3, span: 18 },
  };

  const hostTypeToAvatar = {
    ad_server: (
      <Avatar shape="square" style={{ backgroundColor: '#177ddc' }} icon={<WindowsOutlined/>}/>
    ),
    pc: (
      <Avatar shape="square" style={{ backgroundColor: '#49aa19' }} icon={<LaptopOutlined/>}/>
    ),
    web_server: (
      <Avatar shape="square" style={{ backgroundColor: '#13a8a8' }} icon={<CloudOutlined/>}/>
    ),
    cms: <Avatar shape="square" style={{ backgroundColor: '#d84a1b' }} icon={<BugOutlined/>}/>,
    firewall: (
      <Avatar shape="square" style={{ backgroundColor: '#d87a16' }} icon={<GatewayOutlined/>}/>
    ),
    other: (
      <Avatar shape="square" style={{ backgroundColor: '#bfbfbf' }} icon={<QuestionOutlined/>}/>
    ),
  };

  return (
    <Fragment>
      <Row
        gutter={0}
        style={{
          marginTop: -16,
        }}
      >
        <Col span={10}>
          <Input
            allowClear
            prefix={<SearchOutlined/>}
            style={{ width: '100%' }}
            placeholder="搜索 : IP地址/端口/服务"
            value={text}
            onChange={e => {
              setText(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </Col>
        <Col span={2}>
          <Button
            onClick={() => getSelectHostIPaddress()}
            block
            disabled={selectedRowKeys.length === 0}
            icon={<CopyOutlined/>}
          >
            拷贝
          </Button>
        </Col>
        <Col span={2}>
          <Button
            onClick={() => destoryHostReq.run({ hid: selectedRowKeys.toString() })}
            block
            disabled={selectedRowKeys.length === 0}
            danger
          >
            <DeleteOutlined/> 删除
          </Button>
        </Col>
        <Col span={10}>
          <Button icon={<SyncOutlined/>} onClick={() => listHostReq.run()} block
                  loading={listHostReq.loading || destoryHostReq.loading}>
            刷新
          </Button>
        </Col>

      </Row>
      <Card bordered bodyStyle={{ padding: '0px 0px 0px 0px' }} style={{ marginTop: 0 }}>
        <Table
          className={styles.muitHostsTable}
          size="small"
          bordered
          pagination={false}
          rowKey="id"
          expandable={{
            expandedRowRender: expandedRowRender,
            rowExpandable: record => record.portService.length > 0,
          }}
          rowSelection={rowSelection}
          columns={[
            {
              title: '主机',
              dataIndex: 'ipaddress',
              key: 'ipaddress',
              width: 120,
              render: (text, record) => (
                <strong
                  style={{
                    color: '#d8bd14',
                  }}
                >
                  {text}
                </strong>
              ),
            },
            {
              title: '端口数',
              dataIndex: 'portService',
              key: 'portService',
              width: 80,
              sorter: (a, b) => a.portService.length >= b.portService.length,
              render: (text, record) => {
                return <strong
                  style={{
                    color: '#13a8a8',
                  }}
                >
                  {record.portService.length} 个
                </strong>;
              },
            },
            {
              title: '备注',
              dataIndex: 'comment',
              key: 'comment',
              // width: '10%',
              render: (text, record) => {
                return (
                  <Fragment>
                    {host_type_to_avatar[record.tag]}
                    <span style={{ marginLeft: 8 }}>{text}</span>
                  </Fragment>
                );
              },
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 96,
              render: (text, record) => (
                <div style={{ textAlign: 'center' }}>
                  <Space size="middle">
                    <a onClick={() => showUpdateHostModal(record)}>编辑</a>
                    <a onClick={() => destoryHostReq.run({ hid: record.id })} style={{ color: 'red' }}>
                      删除
                    </a>
                  </Space>
                </div>
              ),
            },
          ]}
          dataSource={hostList}
        />
      </Card>
      <Modal
        width="50vw"
        bodyStyle={{ padding: '32px 8px 8px 1px' }}
        destroyOnClose
        visible={updateHostModalVisable}
        footer={null}
        style={{ top: '30vh' }}
        onCancel={closeUpdateHostModal}
      >
        <Form
          initialValues={{
            hid: hostAcvtive.id,
            tag: hostAcvtive.tag,
            comment: hostAcvtive.comment,
          }}
          onFinish={updateHostReq.run}
        >
          <Form.Item
            label={<span>HID</span>}
            name="hid"
            rules={[{ required: true, message: '请输入' }]}
            style={{ display: 'None' }}
            {...formLayout}
          >
            <span>{hostAcvtive.id}</span>
          </Form.Item>
          <Form.Item
            label={<span>标签</span>}
            name="tag"
            rules={[{ required: true, message: '请选择标签' }]}
            {...formLayout}
          >
            <Radio.Group>
              <Radio value="ad_server">{hostTypeToAvatar.ad_server}</Radio>
              <Radio value="pc">{hostTypeToAvatar.pc}</Radio>
              <Radio value="web_server">{hostTypeToAvatar.web_server}</Radio>
              <Radio value="cms">{hostTypeToAvatar.cms}</Radio>
              <Radio value="firewall">{hostTypeToAvatar.firewall}</Radio>
              <Radio value="other">{hostTypeToAvatar.other}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={<span>注释</span>}
            name="comment"
            rules={[{ message: '最多支持二十个字符', max: 20 }]}
            {...formLayout}
          >
            <Input placeholder="最大支持二十个字符"/>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              block
              type="primary"
              htmlType="submit"
              loading={updateHostReq.loading}
            >
              更新
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export const MuitHostsMemo = memo(MuitHosts);
export default MuitHosts;
