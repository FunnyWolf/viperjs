import React, { Fragment, memo, useImperativeHandle, useState } from "react";
import {
    deleteMsgrpcWebDeliveryAPI,
    getCoreSettingAPI,
    getMsgrpcWebDeliveryAPI,
    postMsgrpcWebDeliveryAPI
} from "@/services/apiv1";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    Descriptions,
    Form,
    Input,
    InputNumber,
    Modal,
    Popover,
    Row,
    Select,
    Space,
    Table,
    Typography
} from "antd";
import { CloudDownloadOutlined, SyncOutlined } from "@ant-design/icons";
import { useRequest } from "umi";

import { DocIcon, randomstr } from "@/pages/Core/Common";
import { formatText, getOptionTag } from "@/utils/locales";
import { cssCalc, Downheight } from "@/utils/utils";
import { useModel } from "@@/plugin-model/useModel";

const { Panel } = Collapse;
const { Option } = Select;

const CreateWebDeliveryModalContent = props => {
    const { createWebDeliveryFinish } = props;
    const formLayoutLong = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    const formLayoutShort = {
        labelCol: { span: 6 },
        wrapperCol: { span: 10 }
    };
    const formLayoutVeryShort = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    };
    const formLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    };
    const buttonLayout = {
        wrapperCol: { offset: 5, span: 14 }
    };

    const [selectPayload, setSelectPayload] = useState(null);
    const [selectTarget, setSelectTarget] = useState(null);
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
        setSelectPayload(onehandler.PAYLOAD);
    };

    const changeTargetOption = (value, selectedOptions) => {
        setSelectTarget(value);
    };


    const webDevliverServerOption = () => {
        let options = [];
        if (selectPayload === null || selectPayload === undefined) {
            return null;
        }
        options.push(
            <Form.Item
                {...formLayout}
                initialValue={lhost}
                label="URIHOST"
                name="URIHOST"
                rules={[
                    {
                        required: true,
                        message: formatText("app.webdelivery.URIHOST.rule")
                    }
                ]}
            >
                <Input placeholder={formatText("app.webdelivery.URIHOST.rule")} />
            </Form.Item>
        );
        options.push(
            <Form.Item
                {...formLayout}
                label="URIPORT"
                name="URIPORT"
                rules={[
                    {
                        required: true
                    }
                ]}
            >
                <InputNumber style={{ width: 160 }} />
            </Form.Item>
        );

        options.push(
            <Form.Item
                {...formLayout}
                label="SSL"
                name="SSL"
                valuePropName="checked"
                rules={[]}
            >
                <Checkbox />
            </Form.Item>
        );
        options.push(
            <Form.Item
                {...formLayoutShort}
                label={formatText("app.webdelivery.SSLCert")}
                tooltip={formatText("app.webdelivery.SSLCert.tip")}
                name="SSLCert"
                initialValue={pem_files.length > 0 ? `/root/.msf4/loot/${pem_files[0]}` : null}
            >
                <Select placeholder={formatText("app.webdelivery.SSLCert.rule")} allowClear>
                    {pem_files.map((encoder, i) => (
                        <Option value={`/root/.msf4/loot/${encoder}`}>{encoder}</Option>
                    ))}
                </Select>
            </Form.Item>
        );
        options.push(
            <Form.Item
                {...formLayoutShort}
                label="URIPATH"
                tooltip={formatText("app.webdelivery.URIPATH.tip")}
                initialValue={randomstr(8)}
                name="URIPATH"
            >
                <Input placeholder={formatText("app.webdelivery.URIPATH.rule")} />
            </Form.Item>
        );

        if (options.length === 0) {
            return null;
        } else {
            return options;
        }
    };

    const webDevliverAdvanceOption = () => {
        let options = [];
        if (selectTarget === null || selectTarget === undefined) {
            return null;
        }
        console.log(selectTarget);
        if (selectTarget === 2) {
            options.push(
                <Form.Item
                    {...formLayout}
                    label="AMSI/SBL bypass"
                    name="Powershell::prepend_protections_bypass"
                    valuePropName="checked"
                    initialValue={true}
                    rules={[]}
                >
                    <Checkbox />
                </Form.Item>
            );
        }

        if (options.length === 0) {
            return null;
        } else {
            return options;
        }
    };
    return (
        <Form onFinish={onCreateWebDeliveryBySubmit}>
            <Collapse bordered={false} defaultActiveKey={["payload", "web"]}>
                <Panel header={formatText("app.webdelivery.payload")} key="payload">
                    <Form.Item
                        {...formLayoutVeryShort}
                        rules={[
                            {
                                required: true,
                                message: formatText("app.webdelivery.target.rule")
                            }
                        ]}
                        label="Target"
                        tooltip={formatText("app.webdelivery.target.tip")}
                        name="TARGET"
                    >
                        <Select
                            placeholder={formatText("app.webdelivery.target.rule")}
                            onChange={changeTargetOption}
                            allowClear
                        >
                            <Option value={0}>Python</Option>
                            <Option value={1}>PHP</Option>
                            <Option value={2}>PSH</Option>
                            <Option value={3}>Regsvr32</Option>
                            <Option value={4}>pubprn</Option>
                            <Option value={5}>SyncAppvPublishingServer</Option>
                            <Option value={6}>PSH (Binary)</Option>
                            <Option value={7}>Linux</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        {...formLayoutLong}
                        rules={[
                            {
                                required: true,
                                message: formatText("app.webdelivery.handlerconf.rule")
                            }
                        ]}
                        label={<span>{formatText("app.webdelivery.handlerconf")}</span>}
                        name="handlerconf"
                    >
                        <Select
                            placeholder={formatText("app.webdelivery.handlerconf.rule")}
                            onChange={changePayloadOption}
                            allowClear>
                            {handlerConf.map((handler, i) => (
                                <Option value={handler.value}>{getOptionTag(handler)}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Panel>
                <Panel header={formatText("app.webdelivery.web")} key="web">
                    {webDevliverServerOption()}
                </Panel>
                <Panel header={formatText("app.webdelivery.advance")} key="advance">
                    {webDevliverAdvanceOption()}
                </Panel>
            </Collapse>
            <Form.Item style={{ marginTop: 24 }} {...buttonLayout}>
                <Button
                    block
                    loading={createWebDeliveryReq.loading}
                    icon={<CloudDownloadOutlined />}
                    htmlType="submit"
                    type="primary"
                >
                    {formatText("app.webdelivery.submit")}
                </Button>
            </Form.Item>
        </Form>
    );
};

const showDeliveryDetail = item => {
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
    const {
        resizeDownHeight,
    } = useModel("Resize", model => ({
        resizeDownHeight: model.resizeDownHeight,
    }));
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
            <DocIcon url="https://www.yuque.com/vipersec/help/kvxr65" />
            <Row style={{ marginTop: -16 }} gutter={0}>
                <Col span={12}>
                    <Button
                        block
                        icon={<CloudDownloadOutlined />}
                        onClick={() => setCreateWebDeliveryModalVisible(true)}
                    >
                        {formatText("app.webdelivery.submit")}
                    </Button>
                </Col>
                <Col span={12}>
                    <Button
                        icon={<SyncOutlined />}
                        block
                        loading={listWebDeliveryReq.loading || createWebDeliveryReq.loading || destoryWebDeliveryReq.loading}
                        onClick={() => listWebDeliveryReq.run()}
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
                        title: formatText("app.webdelivery.payload.label"),
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
                        title: formatText("app.webdelivery.payload"),
                        dataIndex: "PAYLOAD",
                        key: "PAYLOAD",
                        render: (text, record) => {
                            const items = [];

                            if (record.LURI !== undefined && record.LURI !== null) {
                                items.push(<span>{` LURI: ${record.LURI}`}</span>);
                            }
                            if (record.HandlerSSLCert !== undefined && record.HandlerSSLCert !== null) {
                                const pos = record.HandlerSSLCert.lastIndexOf("/");
                                items.push(
                                    <span>{` ${formatText("app.payloadandhandler.pemfile")}: ${record.HandlerSSLCert.substr(pos + 1)}`}</span>);
                            }

                            if (record.RC4PASSWORD !== undefined && record.RC4PASSWORD !== null) {
                                items.push(
                                    <span>{` ${formatText("app.payloadandhandler.rc4password")}: ${record.RC4PASSWORD}`}</span>);
                            }
                            if (record.proxies !== undefined && record.proxies !== null) {
                                items.push(
                                    <span>{` ${formatText("app.payloadandhandler.proxy")}: ${record.proxies}`}</span>);
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
                                            <a style={{ color: "#faad14" }}>{formatText("app.webdelivery.onelinecmd")}</a>
                                        </Popover>
                                        <a onClick={() => showDeliveryDetail(record)}>{formatText("app.webdelivery.Detail")}</a>
                                        <a
                                            onClick={() => destoryWebDeliveryReq.run({ jobid: record.ID })}
                                            style={{ color: "red" }}
                                        >{formatText("app.core.delete")}</a>
                                    </Space>
                                </div>
                            );
                        }
                    }
                ]}
            />
            <Modal
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
