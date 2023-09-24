import React, { Fragment, memo, useState } from "react";
import {
  ChromeOutlined,
  FormOutlined,
  MehOutlined,
  PlusOutlined,
  SyncOutlined,
  WindowsOutlined
} from "@ant-design/icons";
import { Button, Col, Collapse, Form, Input, Modal, Popover, Radio, Row, Table, Tooltip } from "antd";
import Ellipsis from "@/components/Ellipsis";
import {
  deletePostlateralCredentialAPI,
  getPostlateralCredentialAPI,
  postPostlateralCredentialAPI,
  putPostlateralCredentialAPI
} from "@/services/apiv1";
import { useRequest } from "umi";
import { formatText, getOptionTag } from "@/utils/locales";
import { DocIcon } from "@/pages/Core/Common";
import { cssCalc, Downheight } from "@/utils/utils";
import { useModel } from "@@/plugin-model/useModel";

const { Panel } = Collapse;
const { Search } = Input;

const Credential = () => {
  console.log("Credential");
  const [createCredentialModalVisible, setCreateCredentialModalVisible] = useState(false);
  const [credentialList, setCredentialList] = useState([]);
  const {
    resizeDownHeight,
  } = useModel("Resize", model => ({
    resizeDownHeight: model.resizeDownHeight,
  }));
  const initListCredentialReq = useRequest(getPostlateralCredentialAPI, {
    onSuccess: (result, params) => {
      setCredentialList(result);
    },
    onError: (error, params) => {
    }
  });

  const listCredentialReq = useRequest(getPostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCredentialList(result);
    },
    onError: (error, params) => {
    }
  });

  const createCredentialReq = useRequest(postPostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCreateCredentialModalVisible(false);
      listCredentialReq.run();
    },
    onError: (error, params) => {
    }
  });
  const updateCredentialReq = useRequest(putPostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listCredentialReq.run();
    },
    onError: (error, params) => {
    }
  });

  const destoryCredentialReq = useRequest(deletePostlateralCredentialAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listCredentialReq.run();
    },
    onError: (error, params) => {
    }
  });

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 }
  };

  return (
    <Fragment>
      <DocIcon url="https://www.yuque.com/vipersec/help/iydrqn" />
      <Row style={{ marginTop: -16 }} gutter={0}>
        <Col span={12}>
          <Button
            block
            icon={<PlusOutlined />}
            onClick={() => setCreateCredentialModalVisible(true)}
          >
            {formatText("app.credential.form.add")}
          </Button>
        </Col>
        <Col span={12}>
          <Button
            block
            icon={<SyncOutlined />}
            onClick={() => listCredentialReq.run()}
            loading={listCredentialReq.loading || destoryCredentialReq.loading}
          >
            {formatText("app.core.refresh")}
          </Button>
        </Col>
      </Row>
      <Table
        style={{
          marginTop: 0,
          padding: "0 0 0 0",
          overflow: "auto",
          maxHeight: cssCalc(`${resizeDownHeight} - 32px`),
          minHeight: cssCalc(`${resizeDownHeight} - 32px`)
        }}
        size="small"
        bordered
        pagination={false}
        rowKey="id"
        columns={[
          {
            title: formatText("app.credential.username"),
            dataIndex: "username",
            key: "username",

            render: (text, record) => (
              <Ellipsis tooltip lines={2}>
                {text}
              </Ellipsis>
            )
          },
          {
            title: formatText("app.credential.password"),
            dataIndex: "password",
            key: "password",
            width: 280,
            render: (text, record) => (
              <Ellipsis tooltip lines={2}>
                {text}
              </Ellipsis>
            )
          },
          {
            title: formatText("app.credential.passwordtype"),
            dataIndex: "password_type",
            key: "password_type",
            width: 40,
            render: (text, record) => {
              const typetoicon = {
                windows: (
                  <div style={{ textAlign: "center" }}>
                    <WindowsOutlined />
                  </div>
                ),
                userinput: (
                  <div style={{ textAlign: "center" }}>
                    <MehOutlined />
                  </div>
                ),
                browsers: (
                  <div style={{ textAlign: "center" }}>
                    <ChromeOutlined />
                  </div>
                )
              };
              if (typetoicon[text]) {
                return typetoicon[text];
              }
              return <span>{text}</span>;
            }
          },
          {
            title: formatText("app.credential.tag"),
            dataIndex: "tag",
            key: "tag",
            render: (text, record) => (
              <Ellipsis tooltip lines={2}>
                {getOptionTag(record)}
              </Ellipsis>
            )
          },
          {
            title: formatText("app.credential.sourcemodule"),
            dataIndex: "source_module",
            key: "source_module",
            render: (text, record) => {
              const test = text;
              return (
                <Tooltip title={text}>
                  <span>{text}</span>
                </Tooltip>
              );
            }
          },
          {
            title: formatText("app.credential.hostipaddress"),
            dataIndex: "host_ipaddress",
            key: "host_ipaddress",
            width: 120,
            render: (text, record) => {
              const test = text;
              return <strong style={{ color: "#d8bd14" }}>{text}</strong>;
            }
          },
          {
            title: formatText("app.credential.desc"),
            dataIndex: "desc",
            key: "desc",
            render: (text, record) => {
              const test = text;
              return (
                <Fragment>
                  <span>
                    {text}
                  </span>
                  <Popover
                    content={
                      <Search
                        defaultValue={text}
                        style={{ width: 320 }}
                        enterButton={formatText("app.core.update")}
                        size="default"
                        onSearch={value => updateCredentialReq.run({ id: record.id, desc: value })}
                        loading={updateCredentialReq.loading}
                      />
                    }
                    trigger="click"
                  >
                    <a style={{ float: "right" }}><FormOutlined /></a>
                  </Popover>
                </Fragment>
              );
            }
          },
          {
            dataIndex: "operation",
            width: 48,
            render: (text, record) => (
              <div style={{ textAlign: "center" }}>
                <a
                  onClick={() => destoryCredentialReq.run({ id: record.id })}
                  style={{ color: "red" }}
                >
                  {formatText("app.core.delete")}
                </a>
              </div>
            )
          }
        ]}
        dataSource={credentialList}
      />
      <Modal
        title={formatText("app.credential.addcred")}
        style={{ top: 32 }}
        width="50vw"
        bodyStyle={{ padding: "0px 0px 16px 0px" }}
        footer={null}
        destroyOnClose
        visible={createCredentialModalVisible}
        onCancel={() => setCreateCredentialModalVisible(false)}
      >
        <Form onFinish={createCredentialReq.run}>
          <Collapse bordered={false} defaultActiveKey={["base", "windows"]}>
            <Panel header={formatText("app.credential.base")} key="base">
              <Form.Item
                {...formLayout}
                label={<span>{formatText("app.credential.username")}</span>}
                name="username"
                rules={[{ required: true, message: formatText("app.credential.username.rule") }]}
              >
                <Input placeholder={formatText("app.credential.username.rule")} />
              </Form.Item>
              <Form.Item
                {...formLayout}
                label={formatText("app.credential.passwordandhash")}
                name="password"
                rules={[{ required: true, message: formatText("app.credential.passwordandhash.rule") }]}
              >
                <Input placeholder={formatText("app.credential.passwordandhash.rule")} />
              </Form.Item>
            </Panel>
            <Panel header={formatText("app.credential.windowscred")} key="windows">
              <Form.Item
                {...formLayout}
                label={<span>{formatText("app.credential.domain")}</span>}
                name="windows-domain">
                <Input placeholder={formatText("app.credential.domain.ph")} />
              </Form.Item>

              <Form.Item
                {...formLayout}
                label={<span>{formatText("app.credential.windowstype")}</span>}
                name="windows-type">
                <Radio.Group defaultValue="Password" buttonStyle="solid">
                  <Radio.Button value="Password">{formatText("app.credential.password")}</Radio.Button>
                  <Radio.Button value="Hash">{formatText("app.credential.hash")}</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Panel>
            <Form.Item {...tailLayout}>
              <Button
                block
                icon={<PlusOutlined />}
                type="primary"
                htmlType="submit"
                loading={createCredentialReq.loading}
              >
                {formatText("app.core.add")}
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
