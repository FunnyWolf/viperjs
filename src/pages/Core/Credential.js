import React, { Fragment, memo, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { ChromeOutlined, MehOutlined, PlusOutlined, SyncOutlined, WindowsOutlined } from '@ant-design/icons';

import { Button, Card, Col, Collapse, Form, Input, Modal, Popover, Radio, Row, Space, Table, Tooltip } from 'antd';
import './xterm.css';
import Ellipsis from '@/components/Ellipsis';
import styles from './Credential.less';
import {
  deletePostlateralCredentialAPI,
  getPostlateralCredentialAPI,
  postPostlateralCredentialAPI,
  putPostlateralCredentialAPI,
} from '@/services/apiv1';

import { useRequest } from 'umi';

const { Panel } = Collapse;
const { Search } = Input;


//字符串格式化函数
String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};


const Credential = () => {
  console.log('Credential');
  const [createCredentialModalVisible, setCreateCredentialModalVisible] = useState(false);
  const [credentialList, setCredentialList] = useState([]);

  const initListCredentialReq = useRequest(getPostlateralCredentialAPI, {
    onSuccess: (result, params) => {
      setCredentialList(result);
    },
    onError: (error, params) => {
    },
  });

  const listCredentialReq = useRequest(getPostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCredentialList(result);
    },
    onError: (error, params) => {
    },
  });


  const createCredentialReq = useRequest(postPostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCreateCredentialModalVisible(false);
      listCredentialReq.run();
    },
    onError: (error, params) => {
    },
  });
  const updateCredentialReq = useRequest(putPostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listCredentialReq.run();
    },
    onError: (error, params) => {
    },
  });

  const destoryCredentialReq = useRequest(deletePostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listCredentialReq.run();
    },
    onError: (error, params) => {
    },
  });

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  return (
    <Fragment>
      <Row style={{ marginTop: -16 }} gutter={0}>
        <Col span={12}>
          <Button
            block
            type="dashed"
            icon={<PlusOutlined/>}
            onClick={() => setCreateCredentialModalVisible(true)}
          >
            手动添加
          </Button>
        </Col>
        <Col span={12}>
          <Button
            block
            icon={<SyncOutlined/>}
            onClick={() => listCredentialReq.run()}
            loading={listCredentialReq.loading || destoryCredentialReq.loading}
          >
            刷新
          </Button>
        </Col>
      </Row>
      <Card style={{ marginTop: 0 }} bodyStyle={{ padding: '0px 0px 0px 0px' }}>
        <Table
          className={styles.credentiallist}
          size="small"
          bordered
          pagination={false}
          rowKey="id"
          columns={[
            {
              title: '用户名',
              dataIndex: 'username',
              key: 'username',

              render: (text, record) => (
                <Ellipsis tooltip lines={2}>
                  {text}
                </Ellipsis>
              ),
            },
            {
              title: '密码',
              dataIndex: 'password',
              key: 'password',
              width: 280,
              render: (text, record) => (
                <Ellipsis tooltip lines={2}>
                  {text}
                </Ellipsis>
              ),
            },
            {
              title: '类型',
              dataIndex: 'password_type',
              key: 'password_type',
              width: 40,
              render: (text, record) => {
                const typetoicon = {
                  windows: (
                    <div style={{ textAlign: 'center' }}>
                      <WindowsOutlined/>
                    </div>
                  ),
                  userinput: (
                    <div style={{ textAlign: 'center' }}>
                      <MehOutlined/>
                    </div>
                  ),
                  browsers: (
                    <div style={{ textAlign: 'center' }}>
                      <ChromeOutlined/>
                    </div>
                  ),
                };
                if (typetoicon[text]) {
                  return typetoicon[text];
                }
                return <span>{text}</span>;
              },
            },
            {
              title: '标签',
              dataIndex: 'tag',
              key: 'tag',
              render: (text, record) => (
                <Ellipsis tooltip lines={2}>
                  {text}
                </Ellipsis>
              ),
            },
            {
              title: '模块',
              dataIndex: 'source_module',
              key: 'source_module',
              width: 200,
              render: (text, record) => {
                const test = text;
                return (
                  <Tooltip title={text}>
                    <span>{text}</span>
                  </Tooltip>
                );
              },
            },
            {
              title: '主机',
              dataIndex: 'host_ipaddress',
              key: 'host_ipaddress',
              width: 120,
              render: (text, record) => {
                const test = text;
                return <strong style={{ color: '#d8bd14' }}>{text}</strong>;
              },
            },
            {
              title: '说明',
              dataIndex: 'desc',
              key: 'desc',
              render: (text, record) => {
                const test = text;
                return (
                  <Ellipsis tooltip lines={2}>
                    {text}
                  </Ellipsis>
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
                    <Popover
                      title="说明"
                      content={
                        <Search
                          defaultValue={text}
                          enterButton="更改"
                          size="default"
                          onSearch={value => updateCredentialReq.run({ id: record.id, desc: value })}
                          loading={updateCredentialReq.loading}
                        />
                      }
                      trigger="click"
                    >
                      <a>编辑</a>
                    </Popover>
                    <a onClick={() => destoryCredentialReq.run({ id: record.id })} style={{ color: 'red' }}>
                      删除
                    </a>
                  </Space>
                </div>
              ),
            },
          ]}
          dataSource={credentialList}
        />
      </Card>
      <Modal
        title="新增凭证"
        style={{ top: 32 }}
        width="50vw"
        bodyStyle={{ padding: '0px 0px 16px 0px' }}
        footer={null}
        destroyOnClose
        visible={createCredentialModalVisible}
        onCancel={() => setCreateCredentialModalVisible(false)}
      >
        <Form onFinish={createCredentialReq.run}>
          <Collapse bordered={false} defaultActiveKey={['1', '2']}>
            <Panel header="基础信息" key="1">
              <Form.Item
                {...formLayout}
                label={<span>用户名</span>}
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名"/>
              </Form.Item>
              <Form.Item
                {...formLayout}
                label="密码/哈希"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input placeholder="请输入密码信息"/>
              </Form.Item>
            </Panel>
            <Panel header="Windows凭证" key="2">
              <Form.Item {...formLayout} label={<span>Domain</span>} name="windows-domain">
                <Input placeholder="请输入域名称"/>
              </Form.Item>

              <Form.Item {...formLayout} label={<span>凭证类型</span>} name="windows-type">
                <Radio.Group defaultValue="a" buttonStyle="solid">
                  <Radio.Button value="Password">密码</Radio.Button>
                  <Radio.Button value="Hash">哈希</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Panel>
            <Form.Item {...tailLayout}>
              <Button
                block
                icon={<PlusOutlined/>}
                type="primary"
                htmlType="submit"
                loading={createCredentialReq.loading}
              >
                添加
              </Button>
            </Form.Item>
          </Collapse>
        </Form>
      </Modal>
    </Fragment>
  );
};
export const CredentialMemo = memo(Credential);
export default Credential;
