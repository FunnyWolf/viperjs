import React, { Fragment, memo, useState } from "react";
import { DeliveredProcedureOutlined, SyncOutlined } from "@ant-design/icons";
import { useRequest } from "umi";
import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Tag, Tooltip } from "antd";
import moment from "moment";
import {
  deleteMsgrpcCollectSandboxAPI, getMsgrpcCollectSandboxAPI, putMsgrpcCollectSandboxAPI
} from "@/services/apiv1";
import { formatText } from "@/utils/locales";
import { cssCalc, Downheight } from "@/utils/utils";
import { useModel } from "@@/plugin-model/useModel";

const CollectSandbox = () => {
  const [tagForm] = Form.useForm();
  console.log("CollectSandbox");
  const [collectSandList, setCollectSandList] = useState([]);
  const [collectSandTag, setCollectSandTag] = useState("");
  const {
    resizeDownHeight,
  } = useModel("Resize", model => ({
    resizeDownHeight: model.resizeDownHeight,
  }));

  const initListCollectSandReq = useRequest(getMsgrpcCollectSandboxAPI, {
    onSuccess: (result, params) => {
      setCollectSandList(result);
    }, onError: (error, params) => {
    }
  });

  const initListCollectSandTagReq = useRequest(() => getMsgrpcCollectSandboxAPI({ tag: true }), {
    onSuccess: (result, params) => {
      tagForm.setFieldsValue(result);
    }, onError: (error, params) => {
    }
  });

  const listCollectSandboxReq = useRequest(getMsgrpcCollectSandboxAPI, {
    manual: true, onSuccess: (result, params) => {
      setCollectSandList(result);
    }, onError: (error, params) => {
    }
  });

  const listCollectSandboxTagReq = useRequest(() => getMsgrpcCollectSandboxAPI({ tag: true }), {
    manual: true, onSuccess: (result, params) => {
      setCollectSandList(result);
    }, onError: (error, params) => {
    }
  });


  const updateCollectSandboxTagReq = useRequest(putMsgrpcCollectSandboxAPI, {
    manual: true, onSuccess: (result, params) => {
      listCollectSandboxTagReq.run();
    }, onError: (error, params) => {
    }
  });

  const destoryCollectSandboxReq = useRequest(deleteMsgrpcCollectSandboxAPI, {
    manual: true, onSuccess: (result, params) => {
      listCollectSandboxReq.run();
    }, onError: (error, params) => {
    }
  });

  const onUpdateCollectSandboxTag = values => {
    updateCollectSandboxTagReq.run(values);
  };

  const lHostFormLayout = {
    labelCol: { span: 4 }, wrapperCol: { span: 16 }
  };
  const buttonLHostFormLayout = {
    wrapperCol: {
      span: 16, offset: 4
    }
  };

  return (<Fragment>
      <Card style={{ marginTop: -16 }} bodyStyle={{ padding: "0px 0px 0px 0px" }}>
        <Row>
          <Col span={12}>
            <Table
              style={{
                padding: "0 0 0 0",
                overflow: auto,
                maxHeight: cssCalc(`${resizeDownHeight} - 36px`),
                minHeight: cssCalc(`${resizeDownHeight} - 36px`)
              }}
              size="small"
              bordered
              pagination={false}
              rowKey="id"
              columns={[{
                title: "IP地址", dataIndex: "ipaddress", key: "ipaddress", // width: 120,
                render: (text, record) => {
                  return <strong style={{ color: "#d8bd14" }}>{text}</strong>;
                }
              }, {
                title: "更新时间", dataIndex: "last_check", key: "last_check", width: 120, render: (text, record) => {
                  const last_check = (<Tooltip title={moment(record.updateTime * 1000).format("YYYY-MM-DD HH:mm:ss")}>
                      <Tag color="cyan">
                        {moment(record.updateTime * 1000).format("YYYY-MM-DD HH:mm")}
                      </Tag>
                    </Tooltip>);
                  return <span>{last_check}</span>;
                }
              }, {
                title: "操作",
                dataIndex: "operation",
                width: 80,
                render: (text, record) => (<div style={{ textAlign: "center" }}>
                    <Space size="middle">
                      <a
                        style={{ color: "red" }}
                        onClick={() => destoryCollectSandboxReq.run({ ipaddress: record.ipaddress })}>
                        删除
                      </a>
                    </Space>
                  </div>)
              }]}
              dataSource={collectSandList}
            />
          </Col>
          <Col span={12}>
            <Form
              style={{ margin: 8 }}
              form={tagForm}
              onFinish={onUpdateCollectSandboxTag}
              layout="inline">
              <Form.Item
                label="TAG"
                name="tag"
                rules={[{
                  required: true, message: formatText("app.systemsetting.defaultlhosttooltip")
                }]}
              >
                <Input style={{ width: "100%" }}
                       placeholder={formatText("app.systemsetting.defaultlhostplaceholder")} />
              </Form.Item>
              <Form.Item {...buttonLHostFormLayout}>
                <Button
                  icon={<DeliveredProcedureOutlined />}
                  type="primary"
                  htmlType="submit"
                  loading={updateCollectSandboxTagReq.loading}
                >
                  {formatText("app.core.update")}
                </Button>
              </Form.Item>
            </Form>
            <Button
              block
              icon={<SyncOutlined />}
              onClick={() => listCollectSandboxReq.run()}
              loading={listCollectSandboxReq.loading || updateCollectSandboxTagReq.loading || destoryCollectSandboxReq.loading}
            >
              刷新
            </Button>
          </Col>
        </Row>
      </Card>
    </Fragment>);
};
export const CollectSandboxMemo = memo(CollectSandbox);

export default CollectSandbox;
