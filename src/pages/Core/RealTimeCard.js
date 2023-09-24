import React, { Fragment, memo, useState } from "react";
import { getLocale, useModel, useRequest } from "umi";
import { useControllableValue, useInterval } from "ahooks";
import {
    deleteMsgrpcJobAPI,
    deleteNoticesAPI,
    deletePostmodulePostModuleResultHistoryAPI,
    getCoreUUIDJsonAPI,
    postCoreNoticesAPI
} from "@/services/apiv1";
import { DeleteOutlined, FieldTimeOutlined, SearchOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import {
    BackTop,
    Badge,
    Button,
    Card,
    Col,
    Input,
    List,
    Modal,
    Popover,
    Radio,
    Row,
    Space,
    Table,
    Tag,
    Typography
} from "antd";
import moment from "moment";
import { DocIcon, MyIcon, SidTag } from "@/pages/Core/Common";
import { cssCalc, Downheight, Upheight } from "@/utils/utils";
import { PostModuleInfoContent } from "@/pages/Core/RunModule";
import { formatText, getModuleName, getModuleResultTable, getOptionTag, getResultData } from "@/utils/locales";
import ReactJson from "react-json-view";

const { Text, Link } = Typography;
const { Search } = Input;


export const postModuleOpts = opts => {
    const optcoms = [];
    for (const key in opts) {
        optcoms.push(<div><strong>{getOptionTag(opts[key])}</strong><span> : {opts[key].data}</span></div>);
    }
    return <Space direction="horizontal" size="large">{optcoms}</Space>;
};

const RealTimeModuleResult = () => {
    console.log("RealTimeModuleResult");
    const {
        postModuleResultHistory,
        setPostModuleResultHistory,
        postModuleResultHistoryActive,
        setPostModuleResultHistoryActive
    } = useModel("HostAndSessionModel", model => ({
        postModuleResultHistory: model.postModuleResultHistory,
        setPostModuleResultHistory: model.setPostModuleResultHistory,
        postModuleResultHistoryActive: model.postModuleResultHistoryActive,
        setPostModuleResultHistoryActive: model.setPostModuleResultHistoryActive
    }));
    const {
        resizeUpHeight,
        resizeDownHeight
    } = useModel("Resize", model => ({
        resizeUpHeight: model.resizeUpHeight,
        resizeDownHeight: model.resizeDownHeight
    }));


    const [text, setText] = useState("");

    const [refresh, setRefresh] = useState(false);
    useInterval(() => setRefresh(!refresh), 60000);

    const handlePostModuleResultHistorySearch = text => {
        const reg = new RegExp(text, "gi");
        const afterFilterList = postModuleResultHistory
            .map(record => {
                let moduleNameMatch = false;
                let resultMatch = false;
                let optsMatch = false;
                let hostMatch = false;
                const optsStr = JSON.stringify(record.opts);
                try {
                    moduleNameMatch = record.NAME_EN.match(reg) || record.NAME_ZH.match(reg);
                    resultMatch = record.result.match(reg);
                    optsMatch = optsStr.match(reg);
                    hostMatch = record.ipaddress.match(reg);
                } catch (error) {
                }

                if (moduleNameMatch || resultMatch || optsMatch || hostMatch) {
                    return { ...record };
                }
                return null;
            })
            .filter(record => !!record);
        setPostModuleResultHistoryActive(afterFilterList);
    };


    const postModuleResult = results => {
        const resultComs = [];
        for (const key in results) {
            const result = results[key];
            const data = getResultData(result);
            switch (result.type) {
                case "raw":
                    resultComs.push(
                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                                overflowX: "hidden",
                                padding: "0 0 0 0"
                            }}
                        >{data}</pre>);
                    break;
                case "info":
                    resultComs.push(<Text>{data}</Text>);
                    break;
                case "good":
                    resultComs.push(<Text type="success">{data}</Text>);
                    break;
                case "warning":
                    resultComs.push(<Text type="warning">{data}</Text>);
                    break;
                case "error":
                    resultComs.push(<Text type="danger">{data}</Text>);
                    break;
                case "except":
                    resultComs.push(<Text type="danger" mark>{data}</Text>);
                    break;
                case "table":
                    resultComs.push(getModuleResultTable(result));
                    break;
                default:
                    resultComs.push(<pre
                        style={{
                            whiteSpace: "pre-wrap",
                            overflowX: "hidden",
                            padding: "0 0 0 0"
                        }}
                    >{data}</pre>);
            }
        }
        return <Space style={{ marginTop: 16, marginBottom: 8 }} direction="vertical" size={2}>{resultComs}</Space>;
    };


    const deletePostModuleResultHistoryReq = useRequest(deletePostmodulePostModuleResultHistoryAPI, {
        manual: true,
        onSuccess: (result, params) => {
            setPostModuleResultHistory([]);
            setPostModuleResultHistoryActive([]);
        },
        onError: (error, params) => {
        }
    });

    return (
        <Fragment>
            <Row style={{ marginTop: -16 }}>
                <Col span={21}>
                    <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        style={{ width: "100%" }}
                        placeholder={formatText("app.realtimecard.moduleresult_search")}
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                            handlePostModuleResultHistorySearch(e.target.value);
                        }}
                    />
                </Col>
                <Col span={3}>
                    <Button
                        block
                        danger
                        onClick={() => deletePostModuleResultHistoryReq.run()}
                        icon={<DeleteOutlined />}
                    >
                        {formatText("app.core.clear")}
                    </Button>
                </Col>
            </Row>
            <List
                id="moduleresultlist"
                bordered
                style={{
                    overflow: "auto",
                    maxHeight: cssCalc(`${resizeDownHeight} - 30px`),
                    minHeight: cssCalc(`${resizeDownHeight} - 30px`)
                }}
                itemLayout="vertical"
                size="small"
                dataSource={postModuleResultHistoryActive}
                renderItem={item => (
                    <List.Item key={item.id} style={{ padding: "4px 0px 0px 4px" }}>
                        <Space>
                            <Tag
                                color="cyan"
                                style={{
                                    // marginLeft: -1,
                                    // marginRight: 4,
                                    textAlign: "center"
                                }}
                            >
                                <strong>{moment(item.update_time * 1000).format("MM-DD HH:mm:ss")}</strong>
                            </Tag>
                            <Tag
                                color="blue"
                                style={{
                                    textAlign: "center",
                                    cursor: "pointer"
                                }}
                            >
                                <strong>{getModuleName(item)}</strong>
                            </Tag>
                            <Tag
                                color="gold"
                                style={{
                                    width: 160,
                                    textAlign: "center",
                                    cursor: "pointer"
                                }}
                            >
                                <strong>{item.ipaddress}</strong>
                            </Tag>
                            {item.sessionid === undefined || item.sessionid === -1 ? null : <Tag
                                color="purple"
                                style={{
                                    minWidth: 48,
                                    textAlign: "center",
                                    cursor: "pointer"
                                }}
                            >
                                <strong>{item.sessionid}</strong>
                            </Tag>}
                        </Space>
                        <div
                            style={{
                                marginTop: 4
                            }}
                        >
                            <Text type="secondary">{postModuleOpts(item.opts)}</Text>
                        </div>
                        {postModuleResult(item.result)}
                    </List.Item>
                )}
            >
                <BackTop
                    style={{
                        top: cssCalc(`${resizeUpHeight} + 112px`),
                        left: cssCalc("53vw - 40px")
                    }}
                    target={() => document.getElementById("moduleresultlist")}
                >
                    <div
                        style={{
                            height: 40,
                            width: 40,
                            lineHeight: "40px",
                            borderRadius: 4,
                            backgroundColor: "rgba(64, 64, 64, 0.6)",
                            color: "#fff",
                            textAlign: "center",
                            fontSize: 14
                        }}
                    >
                        <VerticalAlignTopOutlined />
                    </div>
                </BackTop>
            </List>
        </Fragment>
    );
};
export const RealTimeModuleResultMemo = memo(RealTimeModuleResult);

const KeyToUserIcon = {
    "0": "icon-yuanxingbaoshi",
    "1": "icon-sanjiaobaoshi",
    "2": "icon-shuidibaoshi",
    "3": "icon-liujiaobaoshi",
    "4": "icon-lingxingbaoshi",
    "5": "icon-duojiaobaoshi"
};
// 单独独立出来是为了不丢失焦点
const UserInput = props => {
    const [text, onInputChange] = useControllableValue({}, { defaultValue: "" });
    const userIcon = key => {
        return (
            <MyIcon
                type={KeyToUserIcon[key]}
                style={{
                    padding: "0px 0px 0px 0px",
                    marginBottom: 0,
                    marginTop: 0,
                    marginLeft: -4,
                    marginRight: 4,
                    fontSize: "18px"
                }}
            />
        );
    };
    const getUserIconKey = () => {
        let key = "0";
        if (localStorage.getItem("UserIcon") === null) {
            localStorage.setItem("UserIcon", "0");
        } else {
            key = localStorage.getItem("UserIcon");
        }
        return key;
    };
    const [iconkey, setIconkey] = useState(getUserIconKey());
    const PrefixIcon = () => {
        const onChange = e => {
            console.log("radio checked", e.target.value);
            setIconkey(e.target.value);
            localStorage.setItem("UserIcon", e.target.value);
        };
        return (
            <Popover
                content={
                    <Radio.Group onChange={onChange} value={getUserIconKey()}>
                        <Radio value="0">{userIcon("0")}</Radio>
                        <Radio value="1">{userIcon("1")}</Radio>
                        <Radio value="2">{userIcon("2")}</Radio>
                        <Radio value="3">{userIcon("3")}</Radio>
                        <Radio value="4">{userIcon("4")}</Radio>
                        <Radio value="5">{userIcon("5")}</Radio>
                    </Radio.Group>
                }
                trigger="click"
            >
                {userIcon(iconkey)}
            </Popover>
        );
    };

    return (
        <Input
            style={{ width: "100%" }}
            placeholder={formatText("app.realtimecard.sendmsg")}
            value={text}
            prefix={<PrefixIcon />}
            onPressEnter={() => {
                if (text === null || text === "") {
                    return;
                } else {
                    props.createNotice({ userkey: iconkey, content: text });
                }
                onInputChange("");
            }}
            onChange={e => onInputChange(e.target.value)}
        />
    );
};


const RealTimeNotices = () => {
    console.log("RealTimeNotices");

    const { notices, setNotices } = useModel("HostAndSessionModel", model => ({
        notices: model.notices,
        setNotices: model.setNotices
    }));
    const [refresh, setRefresh] = useState(false);
    useInterval(() => setRefresh(!refresh), 60000);
    const {
        resizeUpHeight,
        resizeDownHeight,
        setResizeDownHeight
    } = useModel("Resize", model => ({
        resizeUpHeight: model.resizeUpHeight,
        resizeDownHeight: model.resizeDownHeight,
        setResizeDownHeight: model.setResizeDownHeight
    }));

    const userIconLarge = key => {
        return (
            <MyIcon
                type={KeyToUserIcon[key]}
                style={{
                    padding: "0px 0px 0px 0px",
                    fontSize: "16px"
                }}
            />
        );
    };

    const NoticesList = props => {
        const getContent = item => {
            const content = item[getLocale()];
            if (item.level === 0) {
                return (
                    <Text style={{ color: "#49aa19", wordBreak: "break-all" }}>
                        {content}
                    </Text>
                );
            }
            if (item.level === 1) {
                return (
                    <Text style={{ color: "#13a8a8", wordBreak: "break-all" }}>
                        {content}
                    </Text>
                );
            }
            if (item.level === 2) {
                return (
                    <Text type="warning" style={{ wordBreak: "break-all" }}>
                        {content}
                    </Text>
                );
            }
            if (item.level === 3) {
                return (
                    <Text type="danger" style={{ wordBreak: "break-all" }}>
                        {content}
                    </Text>
                );
            }
            if (item.level === 4) {
                return (
                    <Text mark style={{ wordBreak: "break-all" }}>
                        {content}
                    </Text>
                );
            }
            if (item.level === 5) {
                // 提醒
                return (
                    <Text style={{ color: "#642ab5", wordBreak: "break-all" }}>
                        {content}
                    </Text>
                );
            }
            if (item.level === 6) {
                return (
                    <Space>
                        {userIconLarge(item.userkey)}
                        <Text style={{ color: "#cb2b83", wordBreak: "break-all" }}>
                            {">"} {content}
                        </Text>
                    </Space>
                );
            }
            return (
                <Text type="warning" style={{ wordBreak: "break-all" }}>
                    {content}
                </Text>
            );
        };
        return (
            <List
                id="noticescard"
                style={{
                    overflow: "auto",
                    maxHeight: cssCalc(`${resizeDownHeight} - 30px`),
                    minHeight: cssCalc(`${resizeDownHeight} - 30px`)
                }}
                split={false}
                size="small"
                bordered
                itemLayout="horizontal"
                dataSource={props.notices}
                renderItem={item => (
                    <List.Item style={{ padding: "0px 0px 0px 0px" }}>
                        <div
                            style={{
                                display: "inline",
                                marginTop: 0,
                                marginBottom: 0
                            }}
                        >
                            <Tag
                                color="cyan"
                                style={{
                                    marginLeft: -1,
                                    marginRight: 4,
                                    textAlign: "center"
                                }}
                            >
                                {moment(item.time * 1000).format("MM-DD HH:mm:ss")}
                            </Tag>
                            {getContent(item)}
                        </div>
                    </List.Item>
                )}
            >
                <BackTop
                    style={{
                        top: cssCalc(`${resizeUpHeight} + 112px`),
                        right: 24
                    }}
                    target={() => document.getElementById("noticescard")}
                >
                    <div
                        style={{
                            height: 40,
                            width: 40,
                            lineHeight: "40px",
                            borderRadius: 4,
                            backgroundColor: "rgba(64, 64, 64, 0.6)",
                            color: "#fff",
                            textAlign: "center",
                            fontSize: 14
                        }}
                    >
                        <VerticalAlignTopOutlined />
                    </div>
                </BackTop>
            </List>
        );
    };
    const createNoticeReq = useRequest(postCoreNoticesAPI, {
        manual: true,
        onSuccess: (result, params) => {

        },
        onError: (error, params) => {
        }
    });

    const deleteNoticesReq = useRequest(deleteNoticesAPI, {
        manual: true,
        onSuccess: (result, params) => {
            setNotices([]);
        },
        onError: (error, params) => {
        }
    });

    const getUUIDJsonReq = useRequest(getCoreUUIDJsonAPI, {
        manual: true,
        onSuccess: (result, params) => {
            Modal.info({
                style: { top: 32 },
                width: "50vw",
                content: (
                    <Card
                        style={{
                            overflow: "auto",
                            maxHeight: cssCalc("100vh - 240px"),
                            minHeight: cssCalc("100vh - 240px")
                        }}
                        bodyStyle={{ padding: "0px 0px 0px 0px" }}
                    >
                        <ReactJson
                            src={result}
                            theme="colors"
                            displayDataTypes={false}
                            displayObjectSize={false}
                        />
                    </Card>
                ),
                onOk() {
                }
            });
        },
        onError: (error, params) => {
        }
    });


    return (
        <Fragment>
            <DocIcon url="https://www.yuque.com/vipersec/help/vdbhlm" />
            <Row style={{ marginTop: -16 }}>
                <Col span={16}>
                    <UserInput createNotice={params => createNoticeReq.run(params)} />
                </Col>
                <Col span={4}>
                    <Popover
                        content={
                            <Search
                                placeholder="UUID"
                                size="default"
                                onSearch={value => getUUIDJsonReq.run({ uuid: value })}
                                loading={getUUIDJsonReq.loading}
                            />
                        }
                        trigger="click"
                    >
                        <Button block icon={<SearchOutlined />}>
                            RPCMSG
                        </Button>
                    </Popover>
                </Col>
                <Col span={4}>
                    <Button icon={<DeleteOutlined />} block danger onClick={() => deleteNoticesReq.run()}>
                        {formatText("app.core.clear")}
                    </Button>
                </Col>
            </Row>
            <NoticesList notices={notices} />
        </Fragment>
    );
};

export const RealTimeNoticesMemo = memo(RealTimeNotices);

const RealTimeJobs = () => {
    console.log("RealTimeJobs");
    const { jobList, setJobList } = useModel("HostAndSessionModel", model => ({
        jobList: model.jobList,
        setJobList: model.setJobList
    }));
    const {
        resizeDownHeight
    } = useModel("Resize", model => ({
        resizeDownHeight: model.resizeDownHeight
    }));
    const destoryJobReq = useRequest(deleteMsgrpcJobAPI, {
        manual: true,
        onSuccess: (result, params) => {
            const { uuid } = result;
            setJobList(jobList.filter(item => item.uuid !== uuid));
        },
        onError: (error, params) => {
        }
    });

    const onDestoryJob = record => {
        destoryJobReq.run({ uuid: record.uuid, job_id: record.job_id, broker: record.broker });
    };


    return (
        <Fragment>
            <DocIcon url="https://www.yuque.com/vipersec/help/rokuc0" />
            <Table
                style={{
                    marginTop: -16,
                    overflow: "auto",
                    maxHeight: cssCalc(resizeDownHeight),
                    minHeight: cssCalc(resizeDownHeight)
                }}
                // className={styles.jobListTable}
                size="small"
                rowKey="job_id"
                pagination={false}
                dataSource={jobList}
                bordered
                columns={[
                    {
                        title: formatText("app.realtimecard.jobtable_starttime"),
                        dataIndex: "time",
                        key: "time",
                        width: 136,
                        render: (text, record) => <Tag
                            color="cyan">{moment(record.time * 1000).format("YYYY-MM-DD HH:mm")}</Tag>
                    },
                    {
                        title: formatText("app.realtimecard.jobtable_module"),
                        dataIndex: "moduleinfo",
                        key: "moduleinfo",
                        width: 240,
                        render: (text, record) => (
                            <Popover
                                placement="right"
                                content={PostModuleInfoContent(record.moduleinfo)}
                                trigger="click"
                            >
                                <a>{getModuleName(record.moduleinfo)}</a>
                            </Popover>
                        )
                    },
                    {
                        title: "SID",
                        dataIndex: "time",
                        key: "time",
                        width: 48,
                        render: (text, record) => {
                            return SidTag(record.moduleinfo._sessionid);
                        }
                    },
                    {
                        title: formatText("app.realtimecard.jobtable_params"),
                        dataIndex: "opts",
                        key: "opts",
                        render: (text, record) => {
                            return <Fragment>{postModuleOpts(record.opts)}</Fragment>;
                        }
                    },
                    {
                        dataIndex: "operation",
                        width: 48,
                        render: (text, record) => (
                            <a style={{ color: "red" }} onClick={() => onDestoryJob(record)}>
                                {formatText("app.core.delete")}
                            </a>
                        )
                    }
                ]}
            /></Fragment>
    );
};

export const RealTimeJobsMemo = memo(RealTimeJobs);

const TaskQueueTag = () => {
    console.log("TaskQueueTag");
    const { taskQueueLength } = useModel("HostAndSessionModel", model => ({
        taskQueueLength: model.taskQueueLength
    }));
    if (taskQueueLength > 0) {
        return (
            <Badge
                showZero
                style={{
                    marginTop: -4,
                    marginLeft: -4,
                    marginRight: 10,
                    color: "#73d13d",
                    backgroundColor: "#092b00",
                    boxShadow: "0 0 0 1px #237804 inset"
                }}
                count={taskQueueLength}
            />
        );
    } else {
        return <FieldTimeOutlined />;
    }
};
export const TaskQueueTagMemo = memo(TaskQueueTag);
