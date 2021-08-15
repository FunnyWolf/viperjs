import React, { Fragment, memo, useImperativeHandle, useState } from "react";
import {
  deleteMsgrpcWebDeliveryAPI,
  getCoreSettingAPI,
  getMsgrpcWebDeliveryAPI,
  postMsgrpcWebDeliveryAPI
} from "@/services/apiv1";
// import { useControllableValue, useBoolean, useMount } from '@umijs/hooks';
import styles from "./WebDelivery.less";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Form as FormNew,
  Input,
  InputNumber,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography
} from "antd";
import { CloudDownloadOutlined, SyncOutlined } from "@ant-design/icons";
import { useRequest } from "umi";

const { Panel } = Collapse;
const { Option } = Select;

const randomString = (length) => {
  let result = "";
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const CreateWebDeliveryModalContent = props => {
  const { createWebDeliveryFinish } = props;
  const formLayoutLong = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
  };
  const formLayoutShort = {
    labelCol: { span: 6 },
    wrapperCol: { span: 10 }
  };
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const buttonLayout = {
    wrapperCol: { offset: 5, span: 14 }
  };

  const [selectPayload, setStateSelectPayload] = useState(null);
  const [pem_files, setPemfiles] = useState([]);
  const [lhost, setLhost] = useState(null);
  const [handlerConf, setHandlerConf] = useState([]);

  useRequest(() => getCoreSettingAPI({ kind: "lhost" }), {
    onSuccess: (result, params) => {
      if (result.lhost === null || result.lhost === "") {
        setLhost(location.hostname);
      } else {
        setLhost(result.lhost);
      }
      setPemfiles(result.pem_files);
    },
    onError: (error, params) => {
    }
  });

  useRequest(() => getCoreSettingAPI({ kind: "handlerconf" }), {
    onSuccess: (result, params) => {
      setHandlerConf(result);
    },
    onError: (error, params) => {
    }
  });

  const createWebDeliveryReq = useRequest(postMsgrpcWebDeliveryAPI, {
    manual: true,
    onSuccess: (result, params) => {
      createWebDeliveryFinish();
    },
    onError: (error, params) => {
    }
  });

  const onCreateWebDeliveryBySubmit = params => {
    createWebDeliveryReq.run({ ...params });
  };

  const changePayloadOption = (value, selectedOptions) => {
    const onehandler = JSON.parse(value);
    setStateSelectPayload(onehandler.PAYLOAD);
  };

  const webDeliveryBaseOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    if (selectPayload.includes("windows")) {
      options.push(<FormNew.Item
          {...formLayoutShort}
          rules={[
            {
              required: true,
              message: "请选择Target"
            }
          ]}
          label={
            <Tooltip title="请注意Target需要和Payload保持OS一致,如PSH只适用于Windows类型载荷">
              <span>Target</span>
            </Tooltip>
          }
          name="TARGET"
        >
          <Select placeholder="请选择Target" allowClear>
            <Option value={2}>PSH</Option>
            <Option value={3}>Regsvr32</Option>
            <Option value={4}>pubprn</Option>
            <Option value={5}>SyncAppvPublishingServer</Option>
            <Option value={6}>PSH (Binary)</Option>
          </Select>
        </FormNew.Item>
      );

    } else if (selectPayload.includes("linux")) {
      options.push(<FormNew.Item
        {...formLayoutShort}
        rules={[
          {
            required: true,
            message: "请选择Target"
          }
        ]}
        label={
          <Tooltip title="请注意Target需要和Payload保持OS一致,如PSH只适用于Windows类型载荷">
            <span>Target</span>
          </Tooltip>
        }
        name="TARGET"
      >
        <Select placeholder="请选择Target" allowClear>
          <Option value={7}>Linux</Option>
        </Select>
      </FormNew.Item>);
    }
    if (options.length === 0) {
      return null;
    } else {
      return options;
    }
  };


  const webDevliverServerOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    options.push(
      <FormNew.Item
        {...formLayout}
        initialValue={lhost}
        label="SRVHOST"
        name="SRVHOST"
        rules={[
          {
            required: true,
            message: "请输入web服务监听的IP地址"
          }
        ]}
      >
        <Input placeholder="请输入web服务监听的IP地址" />
      </FormNew.Item>
    );
    options.push(
      <FormNew.Item
        {...formLayout}
        label="SRVPORT"
        name="SRVPORT"
        rules={[
          {
            required: true,
            message: "请输入端口"
          }
        ]}
      >
        <InputNumber style={{ width: 160 }} />
      </FormNew.Item>
    );

    options.push(
      <FormNew.Item
        {...formLayout}
        label="SSL开关"
        name="SSL"
        valuePropName="checked"
        rules={[]}
      >
        <Checkbox />
      </FormNew.Item>
    );
    options.push(
      <FormNew.Item
        {...formLayoutShort}
        label={
          <Tooltip title="请选择PEM格式的证书文件,文件内容可以参考<文件列表>中www.example.com.pem,证书文件中需要同时包含公私钥,配置证书后会自动过滤http请求">
            <span>SSL证书</span>
          </Tooltip>
        }
        name="SSLCert"
        initialValue={pem_files.length > 0 ? `~/.msf4/loot/${pem_files[0]}` : null}
      >
        <Select placeholder="请选择证书文件" allowClear>
          {pem_files.map((encoder, i) => (
            <Option value={`~/.msf4/loot/${encoder}`}>{encoder}</Option>
          ))}
        </Select>
      </FormNew.Item>
    );
    options.push(
      <FormNew.Item
        {...formLayoutShort}
        label={
          <Tooltip title="The HTTP Path">
            <span>URIPATH</span>
          </Tooltip>
        }
        initialValue={randomString(8)}
        name="URIPATH"
      >
        <Input placeholder="请输入自定义的URI" />
      </FormNew.Item>
    );

    if (options.length === 0) {
      return null;
    } else {
      return options;
    }
  };
  return (
    <FormNew onFinish={onCreateWebDeliveryBySubmit}>
      <Collapse bordered={false} defaultActiveKey={["base", "advance"]}>
        <Panel header="载荷参数" key="base">
          <FormNew.Item
            {...formLayoutLong}
            rules={[
              {
                required: true,
                message: "请选择监听"
              }
            ]}
            label={<span>监听</span>}
            name="handlerconf"
          >
            <Select
              placeholder="请选择载荷"
              onChange={changePayloadOption}
              allowClear>
              {handlerConf.map((handler, i) => (
                <Option value={handler.value}>{handler.name}</Option>
              ))}
            </Select>
          </FormNew.Item>
          {webDeliveryBaseOption()}
        </Panel>
        <Panel header="Web参数" key="advance">
          {webDevliverServerOption()}
        </Panel>
      </Collapse>
      <FormNew.Item style={{ marginTop: 24 }} {...buttonLayout}>
        <Button
          block
          loading={createWebDeliveryReq.loading}
          icon={<CloudDownloadOutlined />}
          htmlType="submit"
          type="primary"
        >
          新增服务
        </Button>
      </FormNew.Item>
    </FormNew>
  );
};

const showHandlerDetail = item => {
  const Descriptions_Items = [];
  let showstr = null;
  for (const key in item) {
    if (item[key] === null || item[key] === "") {
      continue;
    } else if (item[key] === true || item[key] === false) {
      showstr = item[key] ? "True" : "False";
    } else {
      showstr = item[key];
    }
    Descriptions_Items.push(<Descriptions.Item label={key}>{showstr}</Descriptions.Item>);
  }
  Modal.info({
    mask: false,
    style: { top: 20 },
    width: "70%",
    icon: "",
    content: (
      <Descriptions
        style={{ marginTop: -32, marginRight: -24, marginLeft: -24, marginBottom: -16 }}
        bordered
        size="small"
        column={1}
      >
        {Descriptions_Items}
      </Descriptions>
    ),
    onOk() {
    }
  });
};

const WebDelivery = (props) => {
  console.log("WebDelivery");
  const [createWebDeliveryModalVisible, setCreateWebDeliveryModalVisible] = useState(false);
  const [webDeliveryList, setWebDeliveryList] = useState([]);

  //初始化数据
  useImperativeHandle(props.onRef, () => {
    return {
      updateData: () => {
        listWebDeliveryReq.run();
      }
    };
  });


  useRequest(getMsgrpcWebDeliveryAPI, {
    onSuccess: (result, params) => {
      setWebDeliveryList(result);
    },
    onError: (error, params) => {
    }
  });

  const listWebDeliveryReq = useRequest(getMsgrpcWebDeliveryAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setWebDeliveryList(result);
    },
    onError: (error, params) => {
    }
  });

  const createWebDeliveryReq = useRequest(postMsgrpcWebDeliveryAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listWebDeliveryReq.run();
    },
    onError: (error, params) => {
    }
  });


  const destoryWebDeliveryReq = useRequest(deleteMsgrpcWebDeliveryAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listWebDeliveryReq.run();
    },
    onError: (error, params) => {
    }
  });


  const createWebDeliveryFinish = () => {
    setCreateWebDeliveryModalVisible(false);
    listWebDeliveryReq.run();
  };


  return (
    <Fragment>
      <Row style={{ marginTop: -16 }} gutter={0}>
        <Col span={12}>
          <Button
            block
            icon={<CloudDownloadOutlined />}
            onClick={() => setCreateWebDeliveryModalVisible(true)}
          >
            新增服务
          </Button>
        </Col>
        <Col span={12}>
          <Button
            icon={<SyncOutlined />}
            block
            loading={listWebDeliveryReq.loading || createWebDeliveryReq.loading || destoryWebDeliveryReq.loading}
            onClick={() => listWebDeliveryReq.run()}
          >
            刷新
          </Button>
        </Col>
      </Row>
      <Table
        style={{ marginTop: 0 }}
        className={styles.handlerTable}
        size="small"
        bordered
        pagination={false}
        rowKey="ID"
        dataSource={webDeliveryList}
        columns={[
          {
            title: "URL",
            dataIndex: "URL",
            key: "URL",
            width: 320,
            render: (text, record) => record.URL
          },
          {
            title: "Target",
            dataIndex: "Target-Name",
            key: "Target-Name",
            width: 120,
            render: (text, record) => record["Target-Name"]
          },
          {
            title: "载荷",
            dataIndex: "PAYLOAD",
            key: "PAYLOAD",
            width: 280,
            render: (text, record) => record.PAYLOAD
          },
          {
            title: "LHOST/RHOST",
            dataIndex: "PAYLOAD",
            key: "PAYLOAD",
            width: 160,
            render: (text, record) => {
              if (record.RHOST !== undefined && record.RHOST !== null) {
                return <span>{record.RHOST}</span>;
              }
              if (record.LHOST !== undefined && record.LHOST !== null) {
                return <span>{record.LHOST}</span>;
              }
              return null;
            }
          },
          {
            title: "PORT",
            dataIndex: "LPORT",
            key: "LPORT",
            width: 64,
            render: (text, record) => <span>{record.LPORT}</span>
          },
          {
            title: "载荷参数",
            dataIndex: "PAYLOAD",
            key: "PAYLOAD",
            render: (text, record) => {
              const items = [];
              if (record.LURI !== undefined && record.LURI !== null) {
                items.push(<span>{` LURI: ${record.LURI}`}</span>);
              }
              if (record.HandlerSSLCert !== undefined && record.HandlerSSLCert !== null) {
                const pos = record.HandlerSSLCert.lastIndexOf("/");
                items.push(<span>{` 证书: ${record.HandlerSSLCert.substr(pos + 1)}`}</span>);
              }

              if (record.RC4PASSWORD !== undefined && record.RC4PASSWORD !== null) {
                items.push(<span>{` RC4密码: ${record.RC4PASSWORD}`}</span>);
              }
              if (record.proxies !== undefined && record.proxies !== null) {
                items.push(<span>{` 代理: ${record.proxies}`}</span>);
              }

              if (record.DOMAIN !== undefined && record.DOMAIN !== null) {
                items.push(<span>{` DOMAIN: ${record.DOMAIN}`}</span>);
              }
              if (record.REQ_TYPE !== undefined && record.REQ_TYPE !== null) {
                items.push(<span>{` REQ_TYPE: ${record.REQ_TYPE}`}</span>);
              }
              if (record.SERVER_ID !== undefined && record.SERVER_ID !== null) {
                items.push(<span>{` SERVER_ID: ${record.SERVER_ID}`}</span>);
              }
              return <Space style={{ display: "flex" }}>{items}</Space>;
            }
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: 216,
            render: (text, record) => {
              return (
                <div style={{ textAlign: "center" }}>
                  <Space size="middle">
                    <Popover placement="left" title={text} trigger="click"
                             content={
                               <Card
                                 style={{ width: "50vw" }}
                               >
                                 <Typography.Text
                                   copyable
                                 >{record["ONE-LINE-CMD"]}</Typography.Text></Card>
                             }
                    >
                      <a style={{ color: "#faad14" }}>一句话执行</a>
                    </Popover>
                    <a onClick={() => showHandlerDetail(record)}>详细参数</a>
                    <a
                      onClick={() => destoryWebDeliveryReq.run({ jobid: record.ID })}
                      style={{ color: "red" }}
                    >
                      删除
                    </a>
                  </Space>
                </div>
              );
            }
          }
        ]}
      />
      <Modal
        // title="添加监听"
        style={{ top: 20 }}
        width="60vw"
        bodyStyle={{ padding: "0px 0px 1px 0px" }}
        destroyOnClose
        visible={createWebDeliveryModalVisible}
        footer={null}
        onCancel={() => setCreateWebDeliveryModalVisible(false)}
      >
        <CreateWebDeliveryModalContent createWebDeliveryFinish={createWebDeliveryFinish} />
      </Modal>
    </Fragment>
  );
};
export const WebDeliveryMemo = memo(WebDelivery);
export default WebDelivery;
