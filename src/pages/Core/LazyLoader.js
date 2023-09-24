import React, { Fragment, memo, useState } from "react";
import { DownloadOutlined, SyncOutlined } from "@ant-design/icons";
import { useRequest } from "umi";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Modal,
    Popover,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Tooltip
} from "antd";
import Ellipsis from "@/components/Ellipsis";
import moment from "moment";
import { deleteMsgrpcLazyLoaderAPI, getMsgrpcLazyLoaderAPI, putMsgrpcLazyLoaderAPI } from "@/services/apiv1";
import { cssCalc, Downheight } from "@/utils/utils";
import { useModel } from "@@/plugin-model/useModel";

const { Option } = Select;

const LazyLoader = () => {
    console.log("LazyLoader");
    const [lazyloaderList, setLazyloaderList] = useState([]);
    const [handlers, setHandlers] = useState([]);
    const {
        resizeDownHeight
    } = useModel("Resize", model => ({
        resizeDownHeight: model.resizeDownHeight
    }));
    const initListLazyloaderReq = useRequest(getMsgrpcLazyLoaderAPI, {
        onSuccess: (result, params) => {
            setLazyloaderList(result.lazyloaders);
            setHandlers(result.handlers);
        },
        onError: (error, params) => {
        }
    });

    const listLazyloaderReq = useRequest(getMsgrpcLazyLoaderAPI, {
        manual: true,
        onSuccess: (result, params) => {
            setLazyloaderList(result.lazyloaders);
            setHandlers(result.handlers);
        },
        onError: (error, params) => {
        }
    });

    const downloadLazyLoaderSourceCodeReq = useRequest(() => getMsgrpcLazyLoaderAPI({ sourcecode: true }), {
        manual: true,
        onSuccess: (result, params) => {
        },
        onError: (error, params) => {
        }
    });

    const updateLazyLoaderReq = useRequest(putMsgrpcLazyLoaderAPI, {
        manual: true,
        onSuccess: (result, params) => {
            listLazyloaderReq.run();
        },
        onError: (error, params) => {
        }
    });

    const destoryLazyLoaderReq = useRequest(deleteMsgrpcLazyLoaderAPI, {
        manual: true,
        onSuccess: (result, params) => {
            listLazyloaderReq.run();
        },
        onError: (error, params) => {
        }
    });

    const selectOptions = [];
    for (const oneselect of handlers) {
        if (oneselect.name.includes("rc4")) {
            // rc4类传输协议无法使用
        } else {
            selectOptions.push(<Option value={oneselect.value}>{oneselect.name}</Option>);
        }
    }
    const handlerDetail = item => {
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
            width: "95%",
            icon: "",
            content: (
                <Descriptions
                    style={{ marginTop: -32, marginRight: -24, marginLeft: -24, marginBottom: -16 }}
                    bordered
                    size="small"
                    column={3}
                >
                    {Descriptions_Items}
                </Descriptions>
            ),
            onOk() {
            }
        });
    };

    return (
        <Fragment>
            <Row style={{ marginTop: -16 }} gutter={0}>
                <Col span={12}>
                    <Button
                        block
                        type="dashed"
                        icon={<DownloadOutlined />}
                        onClick={() => downloadLazyLoaderSourceCodeReq.run()}
                    >
                        示例源码
                    </Button>
                </Col>
                <Col span={12}>
                    <Button
                        block
                        icon={<SyncOutlined />}
                        onClick={() => listLazyloaderReq.run()}
                        loading={listLazyloaderReq.loading || updateLazyLoaderReq.loading || destoryLazyLoaderReq.loading}
                    >
                        刷新
                    </Button>
                </Col>
            </Row>
            <Card style={{ marginTop: 0 }} bodyStyle={{ padding: "0px 0px 0px 0px" }}>
                <Table
                    style={{
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
                            title: "UUID",
                            dataIndex: "uuid",
                            key: "uuid",
                            width: 160,
                            render: (text, record) => (
                                <Ellipsis tooltip lines={2}>
                                    {text}
                                </Ellipsis>
                            )
                        },
                        {
                            title: "IP地址",
                            dataIndex: "ipaddress",
                            key: "ipaddress",
                            width: 120,
                            render: (text, record) => {
                                return <strong style={{ color: "#d8bd14" }}>{text}</strong>;
                            }
                        },
                        {
                            title: "更新时间",
                            dataIndex: "last_check",
                            key: "last_check",
                            width: 136,
                            render: (text, record) => {
                                const last_check = (
                                    <Tooltip title={moment(record.last_check * 1000).format("YYYY-MM-DD HH:mm:ss")}>
                                        <Tag color="cyan">
                                            {moment(record.last_check * 1000).format("YYYY-MM-DD HH:mm")}
                                        </Tag>
                                    </Tooltip>
                                );
                                return <span>{last_check}</span>;
                            }
                        },
                        {
                            title: "最小间隔",
                            dataIndex: "interval",
                            key: "interval",
                            width: 80,
                            render: (text, record) => {
                                let com = (
                                    <Tag
                                        color="green"
                                        style={{
                                            width: 56,
                                            textAlign: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {record.interval} 秒
                                    </Tag>
                                );
                                if (record.interval < 60) {
                                    com = (
                                        <Tag
                                            color="orange"
                                            style={{
                                                width: 56,
                                                textAlign: "center",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {record.interval} 秒
                                        </Tag>
                                    );
                                }
                                return com;
                            }
                        },
                        {
                            title: "载荷(reverse_https)",
                            dataIndex: "payload",
                            key: "payload",
                            render: (text, item) => {
                                if (item.payload === undefined || item.payload === null) {
                                    return null;
                                } else {
                                    return <a onClick={() => handlerDetail(item.payload)}>详情</a>;
                                }
                            }
                        },
                        {
                            title: "载荷状态",
                            dataIndex: "send_payload",
                            key: "send_payload",
                            width: 80,
                            render: (text, record) => {
                                let sendpayloadcom = record.send_payload ? (
                                    <Tag
                                        color="green"
                                        style={{
                                            // width: 32,
                                            textAlign: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        已发送
                                    </Tag>
                                ) : (
                                    <Tag
                                        color="orange"
                                        style={{
                                            // width: 32,
                                            textAlign: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        未发送
                                    </Tag>
                                );
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {sendpayloadcom}
                                    </div>
                                );
                            }
                        },
                        {
                            title: "操作",
                            dataIndex: "operation",
                            width: 200,
                            render: (text, record) => (
                                <div style={{ textAlign: "center" }}>
                                    <Space size="middle">
                                        <Popover
                                            content={
                                                <Table
                                                    size="small"
                                                    bordered
                                                    pagination={false}
                                                    rowKey="name"
                                                    columns={[
                                                        {
                                                            title: "监听",
                                                            dataIndex: "name",
                                                            key: "name",
                                                            render: text => <span>{text}</span>
                                                        },
                                                        {
                                                            title: "操作",
                                                            dataIndex: "operation",
                                                            width: 64,
                                                            render: (text, inlinerecord) => {
                                                                if (inlinerecord.name.includes("reverse_https")) {
                                                                    return (
                                                                        <div style={{ textAlign: "center" }}>
                                                                            <a
                                                                                onClick={() => updateLazyLoaderReq.run({
                                                                                    uuid: record.uuid,
                                                                                    field: "payload",
                                                                                    data: inlinerecord.value
                                                                                })
                                                                                }
                                                                            >
                                                                                加载
                                                                            </a>
                                                                        </div>
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    ]}
                                                    dataSource={handlers}
                                                />
                                            }
                                            trigger="click"
                                        >
                                            <a>加载载荷</a>
                                        </Popover>
                                        <Switch
                                            style={{ marginTop: -4 }}
                                            checkedChildren={"循环"}
                                            unCheckedChildren={"退出"}
                                            checked={!record.exit_loop}
                                            onClick={() => updateLazyLoaderReq.run({
                                                uuid: record.uuid,
                                                field: "exit_loop",
                                                data: !record.exit_loop
                                            })}
                                        />
                                        <a
                                            style={{ color: "red" }}
                                            onClick={() => destoryLazyLoaderReq.run({ uuid: record.uuid })}>
                                            删除
                                        </a>
                                    </Space>
                                </div>
                            )
                        }
                    ]}
                    dataSource={lazyloaderList}
                />
            </Card>
        </Fragment>
    );
};
export const LazyLoaderMemo = memo(LazyLoader);

export default LazyLoader;
