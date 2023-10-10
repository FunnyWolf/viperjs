import React, { Fragment, memo, useState } from "react";
import { getLocale, useModel, useRequest } from "umi";
import { useLocalStorageState } from "ahooks";
import { ModalForm, ProFormTextArea } from "@ant-design/pro-form";
import {
    CaretRightOutlined,
    CheckOutlined,
    FormOutlined,
    InfoCircleOutlined,
    MinusOutlined,
    PlayCircleOutlined,
    PlusOutlined,
    SearchOutlined,
    StarOutlined,
    StarTwoTone,
    SyncOutlined
} from "@ant-design/icons";

import {
    Alert,
    Button,
    Card,
    Checkbox,
    Col,
    Descriptions,
    Divider,
    Form,
    Input,
    InputNumber,
    List,
    Modal,
    Popover,
    Radio,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography
} from "antd";
import moment from "moment";
import styles from '@/utils/utils.less';
import {
    deleteMsgrpcJobAPI,
    deletePostModuleAutoAPI,
    deleteProxyHttpScanAPI,
    getCoreNetworkSearchAPI,
    getCoreSettingAPI,
    getPostModuleAutoAPI,
    getProxyHttpScanAPI,
    postCoreSettingAPI,
    postPostModuleAutoAPI,
    postPostmodulePostModuleActuatorAPI,
    postProxyHttpScanAPI, putPostModuleAutoAPI
} from "@/services/apiv1";
import { formatText, getModuleDesc, getModuleName, getOptionDesc, getOptionTag } from "@/utils/locales";
import { postModuleOpts } from "@/pages/Core/RealTimeCard";
import { sessionTagList } from "@/pages/Core/HostAndSession";
import { DocIcon, DocIconInDiv } from "@/pages/Core/Common";
import { cssCalc, Downheight } from "@/utils/utils";

const { Title, Paragraph, Text } = Typography;
const { Search, TextArea } = Input;
const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

export const PostModuleInfoContent = postModuleConfig => {
    const platform = postModuleConfig.PLATFORM;
    const platformCom = [];
    for (let i = 0; i < platform.length; i++) {
        if (platform[i].toLowerCase() === "windows") {
            platformCom.push(<Tag color="green">{platform[i]}</Tag>);
        } else {
            platformCom.push(<Tag color="magenta">{platform[i]}</Tag>);
        }
    }

    const permissions = postModuleConfig.PERMISSIONS;
    const permissionsCom = [];
    for (let i = 0; i < permissions.length; i++) {
        if (["system", "root"].indexOf(permissions[i].toLowerCase()) >= 0) {
            permissionsCom.push(<Tag color="volcano">{permissions[i]}</Tag>);
        } else if (["administrator"].indexOf(permissions[i].toLowerCase()) >= 0) {
            permissionsCom.push(<Tag color="orange">{permissions[i]}</Tag>);
        } else {
            permissionsCom.push(<Tag color="lime">{permissions[i]}</Tag>);
        }
    }

    const references = postModuleConfig.REFERENCES;
    const referencesCom = [];
    for (let i = 0; i < references.length; i++) {
        referencesCom.push(<div>
            <a href={references[i]} target="_blank">
                {references[i]}
            </a>
        </div>);
    }

    const readme = postModuleConfig.README;
    const readmeCom = [];
    for (let i = 0; i < readme.length; i++) {
        readmeCom.push(<div>
            <a href={readme[i]} target="_blank">
                {readme[i]}
            </a>
        </div>);
    }

    const attcks = postModuleConfig.ATTCK;
    const attckCom = [];
    for (let i = 0; i < attcks.length; i++) {
        attckCom.push(<Tag color="gold">{attcks[i]}</Tag>);
    }

    const authors = postModuleConfig.AUTHOR;
    const authorCom = [];
    for (let i = 0; i < authors.length; i++) {
        authorCom.push(<Tag color="lime">{authors[i]}</Tag>);
    }

    return (<Descriptions
        size="small"
        style={{
            padding: "0 0 0 0", marginRight: 8
        }}
        column={8}
        bordered
    >
        <Descriptions.Item label={formatText("app.runmodule.postmodule.NAME")} span={8}>
            {getModuleName(postModuleConfig)}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.authorCom")} span={4}>
            {authorCom}
        </Descriptions.Item>
        <Descriptions.Item label="TTPs" span={4}>
            {attckCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.platformCom")} span={4}>
            {platformCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.permissionsCom")} span={4}>
            {permissionsCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.readmeCom")} span={8}>
            {readmeCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.referencesCom")} span={8}>
            {referencesCom}
        </Descriptions.Item>
        <Descriptions.Item span={8} label={formatText("app.runmodule.postmodule.DESC")}>
        <pre
            style={{
                whiteSpace: "pre-wrap", overflowX: "hidden", padding: "0 0 0 0"
            }}
        >{getModuleDesc(postModuleConfig)}</pre>
        </Descriptions.Item>
    </Descriptions>);
};


const getModuleOptions = (postModuleConfigActive) => {
    const options = [];
    for (const oneOption of postModuleConfigActive.OPTIONS) {
        if (oneOption.type === "str") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    initialValue={oneOption.default}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                >
                    <Input
                        style={{ width: "90%" }}
                    />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "text") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    initialValue={oneOption.default}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                >
                    <TextArea
                        style={{ width: "95%" }}
                        showCount
                        allowClear
                    />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "bool") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    valuePropName="checked"
                    initialValue={oneOption.default}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                >
                    <Checkbox style={{ width: "90%" }} defaultChecked={oneOption.default} />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "integer") {
            let rules = [{
                required: oneOption.required,
                message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
            }];

            if (oneOption.extra_data.min != null) {
                rules = [{
                    required: oneOption.required,
                    message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                }, {
                    validator: (rule, value, fn) => {
                        if (value < oneOption.extra_data.min || value > oneOption.extra_data.max) {
                            fn(`Min:${oneOption.extra_data.min} Max:${oneOption.extra_data.max}`);
                        } else {
                            fn();
                        }
                    }
                }];
            }
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    initialValue={oneOption.default}
                    rules={rules}
                    wrapperCol={{ span: 24 }}
                >
                    <InputNumber
                        style={{ width: "90%" }}
                    />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "float") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    initialValue={oneOption.default}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                    wrapperCol={{ span: 24 }}
                >
                    <InputNumber
                        step={0.1}
                        style={{ width: "90%" }}
                    />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "enum") {
            const selectOptions = [];
            for (const oneselect of oneOption.enum_list) {
                selectOptions.push(<Option value={oneselect.value}>
                    <Tooltip mouseEnterDelay={0.3} title={getOptionTag(oneselect)}>
                        {getOptionTag(oneselect)}
                    </Tooltip>
                </Option>);
            }
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    initialValue={oneOption.default}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                    wrapperCol={{ span: 24 }}
                >
                    <Select
                        allowClear
                        style={{
                            width: "90%"
                        }}
                    >
                        {selectOptions}
                    </Select>
                </Form.Item>
            </Col>);
        } else {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    initialValue={oneOption.default}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input
                        style={{ width: "90%" }}
                    />
                </Form.Item>
            </Col>);
        }
    }
    return options;
};

const getWarn = (postModuleConfigActive) => {
    const locale = getLocale();
    if (postModuleConfigActive.WARN_ZH === null || postModuleConfigActive.WARN_ZH === undefined) {
        return null;
    } else {
        if (locale === "en-US") {
            return <Col span={22}>
                <Alert
                    style={{ marginBottom: 16 }}
                    type="warning"
                    showIcon
                    message={postModuleConfigActive.WARN_EN}
                />
            </Col>;
        } else {
            return <Col span={22}>
                <Alert
                    style={{ marginBottom: 16 }}
                    type="warning"
                    showIcon
                    message={postModuleConfigActive.WARN_ZH}
                />
            </Col>;
        }
    }
};

const getPins = () => {
    if (localStorage.getItem("Pins") === null) {
        localStorage.setItem("Pins", JSON.stringify([]));
        return [];
    }
    return JSON.parse(localStorage.getItem("Pins"));
};

const changePin = loadpath => {
    const pins = getPins();
    const index = pins.indexOf(loadpath);
    if (index > -1) {
        pins.splice(index, 1);
        localStorage.setItem("Pins", JSON.stringify(pins));
        return pins;
    }
    pins.push(loadpath);
    localStorage.setItem("Pins", JSON.stringify(pins));
    return pins;
};


const ModuleInfoContent = props => {
    const { postModuleConfig } = props;
    if (postModuleConfig === undefined) {
        return null;
    }
    const platform = postModuleConfig.PLATFORM;
    const platformCom = [];
    for (let i = 0; i < platform.length; i++) {
        if (platform[i].toLowerCase() === "windows") {
            platformCom.push(<Tag color="blue">{platform[i]}</Tag>);
        } else {
            platformCom.push(<Tag color="magenta">{platform[i]}</Tag>);
        }
    }

    const permissions = postModuleConfig.PERMISSIONS;
    const permissionsCom = [];
    for (let i = 0; i < permissions.length; i++) {
        if (["system", "root"].indexOf(permissions[i].toLowerCase()) >= 0) {
            permissionsCom.push(<Tag color="volcano">{permissions[i]}</Tag>);
        } else if (["administrator"].indexOf(permissions[i].toLowerCase()) >= 0) {
            permissionsCom.push(<Tag color="orange">{permissions[i]}</Tag>);
        } else {
            permissionsCom.push(<Tag color="lime">{permissions[i]}</Tag>);
        }
    }
    const readme = postModuleConfig.README;
    const readmeCom = [];
    for (let i = 0; i < readme.length; i++) {
        readmeCom.push(<div>
            <a href={readme[i]} target="_blank">
                {readme[i]}
            </a>
        </div>);
    }

    const references = postModuleConfig.REFERENCES;
    const referencesCom = [];
    for (let i = 0; i < references.length; i++) {
        referencesCom.push(<div>
            <a href={references[i]} target="_blank">
                {references[i]}
            </a>
        </div>);
    }
    const attcks = postModuleConfig.ATTCK;
    const attckCom = [];
    for (let i = 0; i < attcks.length; i++) {
        attckCom.push(<Tag color="gold">{attcks[i]}</Tag>);
    }

    const authors = postModuleConfig.AUTHOR;
    const authorCom = [];
    for (let i = 0; i < authors.length; i++) {
        authorCom.push(<Tag color="lime">{authors[i]}</Tag>);
    }


    return (<Descriptions
        size="small"
        style={{
            padding: "0 0 0 0", marginRight: 8
        }}
        column={8}
        bordered
    >
        <Descriptions.Item label={formatText("app.runmodule.postmodule.NAME")} span={8}>
            {getModuleName(postModuleConfig)}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.authorCom")} span={4}>
            {authorCom}
        </Descriptions.Item>
        <Descriptions.Item label="TTPs" span={4}>
            {attckCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.platformCom")} span={4}>
            {platformCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.permissionsCom")} span={4}>
            {permissionsCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.readmeCom")} span={8}>
            {readmeCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.referencesCom")} span={8}>
            {referencesCom}
        </Descriptions.Item>
        <Descriptions.Item span={8} label={formatText("app.runmodule.postmodule.DESC")}>
        <pre
            style={{
                whiteSpace: "pre-wrap", overflowX: "hidden", padding: "0 0 0 0"
            }}
        >{getModuleDesc(postModuleConfig)}</pre>
        </Descriptions.Item>
    </Descriptions>);
};


export const RunModule = props => {
    console.log("RunModule");
    const { closeModel } = props;
    const { hostAndSessionActive, postModuleOptions, moduleOptions } = useModel("HostAndSessionModel", model => ({
        hostAndSessionActive: model.hostAndSessionActive,
        postModuleOptions: model.postModuleOptions,
        moduleOptions: model.moduleOptions
    }));
    const [text, setText] = useState("");

    const hasSession = hostAndSessionActive.session !== undefined && hostAndSessionActive.session !== null && hostAndSessionActive.session.id !== -1;

    let postModuleConfigListRun = postModuleOptions.map(record => {
        if (record.REQUIRE_SESSION) {
            if (hasSession) {
                return { ...record };
            }
            return null;
        }
        return { ...record };
    }).filter(record => !!record);

    const pins = getPins();

    postModuleConfigListRun = postModuleConfigListRun.map(record => {
        record.pin = pins.indexOf(record.loadpath);
        return { ...record };
    });

    postModuleConfigListRun.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

    const [postModuleConfigList, setPostModuleConfigList] = useState(postModuleConfigListRun);
    const [postModuleConfigListTmp, setPostModuleConfigListTmp] = useState(postModuleConfigListRun);
    const [postModuleConfigActive, setPostModuleConfigActive] = useState({
        NAME_ZH: null,
        NAME_EN: null,
        DESC_ZH: null,
        DESC_EN: null,
        WARN_EN: null,
        WARN_ZH: null,
        AUTHOR: [],
        OPTIONS: [],
        REQUIRE_SESSION: true,
        loadpath: null,
        PERMISSIONS: [],
        PLATFORM: [],
        REFERENCES: [],
        README: [],
        ATTCK: [],
        SEARCH: {
            FOFA: null, Quake: null
        }
    });


    const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
        manual: true, onSuccess: (result, params) => {
            closeModel();
        }, onError: (error, params) => {
        }
    });

    const onCreatePostModuleActuator = params => {
        createPostModuleActuatorReq.run({
            ipaddress: hostAndSessionActive.ipaddress,
            sessionid: hostAndSessionActive.session.id,
            loadpath: postModuleConfigActive.loadpath,
            custom_param: JSON.stringify(params)
        });
    };

    const onPostModuleConfigListChange = postModuleConfigListState => {
        const pins = getPins();
        postModuleConfigListState.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
        setPostModuleConfigList(postModuleConfigListState);
    };

    const onPostModuleConfigListPinsChange = (postModuleConfigListState, pins) => {
        postModuleConfigListState = postModuleConfigListState.map(record => {
            record.pin = pins.indexOf(record.loadpath);
            return { ...record };
        });
        setPostModuleConfigList(postModuleConfigListState);
    };

    const handleModuleSearch = value => {
        const reg = new RegExp(value, "gi");
        onPostModuleConfigListChange(postModuleConfigListTmp
            .map(record => {
                let NAMEMatch = false;
                let DESCMatch = false;
                let REFERENCESMatch = false;
                try {
                    NAMEMatch = record.NAME_ZH.match(reg) || record.NAME_EN.match(reg);
                    DESCMatch = record.DESC_ZH.match(reg) || record.DESC_EN.match(reg);
                    REFERENCESMatch = record.REFERENCES.toString().match(reg);
                } catch (error) {
                }

                if (NAMEMatch || DESCMatch || REFERENCESMatch) {
                    return {
                        ...record
                    };
                }
                return null;
            })
            .filter(record => !!record));
    };

    const moduleTypeOnChange = value => {
        if (value === undefined) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
            return;
        }
        if (value.length <= 0) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
        } else {
            const newpostModuleConfigListState = postModuleConfigListTmp.filter(item => value.indexOf(item.MODULETYPE) >= 0);
            onPostModuleConfigListChange(newpostModuleConfigListState);
        }
    };

    const postModuleConfigTableColumns = [{
        dataIndex: "loadpath", render: (text, record) => {
            let selectStyles = {};
            if (record.loadpath === postModuleConfigActive.loadpath) {
                selectStyles = {
                    color: "#d89614", fontWeight: "bolder", fontSize: 15
                };
            }
            const pins = getPins();
            const pinIcon = record.pin > -1 ? (<StarTwoTone
                twoToneColor="#d89614"
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />) : (<StarOutlined
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />);

            return (<div style={{ display: "inline" }}>
                {pinIcon}
                <a style={{ ...selectStyles }}>{getModuleName(record)}</a>
            </div>);
        }
    }];

    // session 信息
    const record = hostAndSessionActive;

    return (<Fragment>
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/lezyt4" />
        <Row>
            <Col span={8}>
                <Card bordered={false}>
                    <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        style={{ width: "100%" }}
                        placeholder={formatText("app.runmodule.postmodule.search.ph")}
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                            handleModuleSearch(e.target.value);
                        }}
                    />
                    <Radio.Group
                        defaultValue=""
                        style={{ marginTop: 8 }}
                        buttonStyle="solid"
                        onChange={(e) => moduleTypeOnChange(e.target.value)}
                    >
                        <Radio.Button value="">{formatText("app.runmodule.postmodule.moduletype.all")}</Radio.Button>
                        {/*<Radio.Button value="Reconnaissance">前期侦查</Radio.Button>*/}
                        <Radio.Button
                            value="Resource_Development">{formatText("app.runmodule.postmodule.moduletype.Resource_Development")}</Radio.Button>
                        <Radio.Button
                            value="Initial_Access">{formatText("app.runmodule.postmodule.moduletype.Initial_Access")}</Radio.Button>
                        <Radio.Button
                            value="Execution">{formatText("app.runmodule.postmodule.moduletype.Execution")}</Radio.Button>
                        <Radio.Button
                            value="Persistence">{formatText("app.runmodule.postmodule.moduletype.Persistence")}</Radio.Button>
                        <Radio.Button
                            value="Privilege_Escalation">{formatText("app.runmodule.postmodule.moduletype.Privilege_Escalation")}</Radio.Button>
                        <Radio.Button
                            value="Defense_Evasion">{formatText("app.runmodule.postmodule.moduletype.Defense_Evasion")}</Radio.Button>
                        <Radio.Button
                            value="Credential_Access">{formatText("app.runmodule.postmodule.moduletype.Credential_Access")}</Radio.Button>
                        <Radio.Button
                            value="Discovery">{formatText("app.runmodule.postmodule.moduletype.Discovery")}</Radio.Button>
                        <Radio.Button
                            value="Lateral_Movement">{formatText("app.runmodule.postmodule.moduletype.Lateral_Movement")}</Radio.Button>
                        <Radio.Button
                            value="Collection">{formatText("app.runmodule.postmodule.moduletype.Collection")}</Radio.Button>
                        {/*<Option value="Command_and_Control">命令控制</Option>*/}
                    </Radio.Group>
                    <Table
                        style={{
                            padding: "0 0 0 0",
                            marginTop: 8,
                            maxHeight: cssCalc("80vh - 128px"),
                            minHeight: cssCalc("80vh - 128px")
                        }}
                        scroll={{ y: "calc(80vh - 128px)" }}
                        rowClassName={styles.moduleTr}
                        showHeader={false}
                        onRow={record => ({
                            onClick: () => {
                                setPostModuleConfigActive(record);
                            }
                        })}
                        size="small"
                        bordered
                        pagination={false}
                        rowKey={item => item.loadpath}
                        columns={postModuleConfigTableColumns}
                        dataSource={postModuleConfigList}
                    />
                </Card>
            </Col>
            <Col span={16}>
                <Tabs defaultActiveKey="params" style={{ marginTop: 12 }}>
                    <TabPane
                        tab={<span><FormOutlined />{formatText("app.runmodule.postmodule.params")}</span>}
                        key="params"
                    >
                        <div
                            style={{
                                display: "flex", cursor: "pointer", marginBottom: 24
                            }}
                        >
                            <Fragment>
                                <Tag
                                    color="orange"
                                    style={{
                                        width: 120, textAlign: "center", cursor: "pointer"
                                    }}
                                >
                                    <strong>{record.ipaddress}</strong>
                                </Tag>
                                {sessionTagList(record.session)}
                            </Fragment>
                        </div>
                        <Form
                            style={{
                                marginBottom: 16,
                                overflow: "auto",
                                maxHeight: cssCalc("80vh - 88px"),
                                minHeight: cssCalc("80vh - 88px")
                            }}
                            layout="vertical"
                            wrapperCol={{ span: 24 }}
                            onFinish={onCreatePostModuleActuator}
                        >
                            <Row>{getModuleOptions(postModuleConfigActive)}</Row>
                            <Row>
                                {getWarn(postModuleConfigActive)}
                                <Col span={22}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        disabled={postModuleConfigActive.loadpath === null}
                                        icon={<CaretRightOutlined />}
                                        loading={createPostModuleActuatorReq.loading}
                                    >{formatText("app.runmodule.postmodule.run")}</Button>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane
                        tab={<span><InfoCircleOutlined />{formatText("app.runmodule.postmodule.desc")}</span>}
                        key="desc"
                    >
                        <ModuleInfoContent postModuleConfig={postModuleConfigActive} />
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </Fragment>);
};
export const RunModuleMemo = memo(RunModule);

export const RunAutoModule = props => {
    console.log("RunAutoModule");
    const { closeModel, listData } = props;
    const { postModuleOptions } = useModel("HostAndSessionModel", model => ({
        postModuleOptions: model.postModuleOptions
    }));
    const [text, setText] = useState("");

    let postModuleConfigAuto = postModuleOptions
        .map(record => {
            if (record.REQUIRE_SESSION) {
                return { ...record };
            } else {
                return null;
            }
        }).filter(record => !!record);

    const pins = getPins();
    postModuleConfigAuto = postModuleConfigAuto.map(record => {
        record.pin = pins.indexOf(record.loadpath);
        return { ...record };
    });

    postModuleConfigAuto.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

    const [postModuleConfigList, setPostModuleConfigList] = useState(postModuleConfigAuto);
    const [postModuleConfigListTmp, setPostModuleConfigListTmp] = useState(postModuleConfigAuto);
    const [postModuleConfigActive, setPostModuleConfigActive] = useState({
        NAME_ZH: null,
        NAME_EN: null,
        DESC_ZH: null,
        DESC_EN: null,
        WARN_ZH: null,
        WARN_EN: null,
        AUTHOR: [],
        OPTIONS: [],
        REQUIRE_SESSION: true,
        loadpath: null,
        PERMISSIONS: [],
        PLATFORM: [],
        REFERENCES: [],
        README: [],
        ATTCK: [],
        SEARCH: {
            FOFA: null, Quake: null
        }
    });


    const createPostModuleAutoReq = useRequest(postPostModuleAutoAPI, {
        manual: true, onSuccess: (result, params) => {
            closeModel();
            listData();
        }, onError: (error, params) => {
        }
    });

    const onCreatePostModuleAuto = params => {
        createPostModuleAutoReq.run({
            module_type: "auto", loadpath: postModuleConfigActive.loadpath, custom_param: JSON.stringify(params)
        });
    };

    const onPostModuleConfigListChange = postModuleConfigListState => {
        const pins = getPins();
        postModuleConfigListState.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
        setPostModuleConfigList(postModuleConfigListState);
    };

    const onPostModuleConfigListPinsChange = (postModuleConfigListState, pins) => {
        postModuleConfigListState = postModuleConfigListState.map(record => {
            record.pin = pins.indexOf(record.loadpath);
            return { ...record };
        });
        setPostModuleConfigList(postModuleConfigListState);
    };


    const handleModuleSearch = value => {
        const reg = new RegExp(value, "gi");
        onPostModuleConfigListChange(postModuleConfigListTmp.map(record => {
            let NAMEMatch = false;
            let DESCMatch = false;
            let REFERENCESMatch = false;
            try {
                NAMEMatch = record.NAME_ZH.match(reg) || record.NAME_EN.match(reg);
                DESCMatch = record.DESC_ZH.match(reg) || record.DESC_EN.match(reg);
                REFERENCESMatch = record.REFERENCES.toString().match(reg);
            } catch (error) {
            }

            if (NAMEMatch || DESCMatch || REFERENCESMatch) {
                return {
                    ...record
                };
            }
            return null;
        }).filter(record => !!record));
    };

    const moduleTypeOnChange = value => {
        if (value === undefined) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
            return;
        }
        if (value.length <= 0) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
        } else {
            const newpostModuleConfigListState = postModuleConfigListTmp.filter(item => value.indexOf(item.MODULETYPE) >= 0);
            onPostModuleConfigListChange(newpostModuleConfigListState);
        }
    };


    const postModuleConfigTableColumns = [{
        dataIndex: "loadpath", render: (text, record) => {
            let selectStyles = {};
            if (record.loadpath === postModuleConfigActive.loadpath) {
                selectStyles = {
                    color: "#d89614", fontWeight: "bolder", fontSize: 15
                };
            }
            const pinIcon = record.pin > -1 ? (<StarTwoTone
                twoToneColor="#d89614"
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />) : (<StarOutlined
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />);
            return (<div style={{ display: "inline" }}>
                {pinIcon}
                <a style={{ ...selectStyles }}>{getModuleName(record)}</a>
            </div>);
        }
    }];


    return (<Row>
        <Col span={8}>
            <Card bordered={false}>
                <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    style={{ width: "100%" }}
                    placeholder={formatText("app.runmodule.postmodule.search.ph")}
                    value={text}
                    onChange={e => {
                        setText(e.target.value);
                        handleModuleSearch(e.target.value);
                    }}
                />
                <Radio.Group
                    defaultValue=""
                    style={{ marginTop: 8 }}
                    buttonStyle="solid"
                    onChange={(e) => moduleTypeOnChange(e.target.value)}
                >
                    <Radio.Button value="">{formatText("app.runmodule.postmodule.moduletype.all")}</Radio.Button>
                    <Radio.Button
                        value="Resource_Development">{formatText("app.runmodule.postmodule.moduletype.Resource_Development")}</Radio.Button>
                    <Radio.Button
                        value="Initial_Access">{formatText("app.runmodule.postmodule.moduletype.Initial_Access")}</Radio.Button>
                    <Radio.Button
                        value="Execution">{formatText("app.runmodule.postmodule.moduletype.Execution")}</Radio.Button>
                    <Radio.Button
                        value="Persistence">{formatText("app.runmodule.postmodule.moduletype.Persistence")}</Radio.Button>
                    <Radio.Button
                        value="Privilege_Escalation">{formatText("app.runmodule.postmodule.moduletype.Privilege_Escalation")}</Radio.Button>
                    <Radio.Button
                        value="Defense_Evasion">{formatText("app.runmodule.postmodule.moduletype.Defense_Evasion")}</Radio.Button>
                    <Radio.Button
                        value="Credential_Access">{formatText("app.runmodule.postmodule.moduletype.Credential_Access")}</Radio.Button>
                    <Radio.Button
                        value="Discovery">{formatText("app.runmodule.postmodule.moduletype.Discovery")}</Radio.Button>
                    <Radio.Button
                        value="Lateral_Movement">{formatText("app.runmodule.postmodule.moduletype.Lateral_Movement")}</Radio.Button>
                    <Radio.Button
                        value="Collection">{formatText("app.runmodule.postmodule.moduletype.Collection")}</Radio.Button>
                </Radio.Group>
                <Table
                    style={{
                        padding: "0 0 0 0",
                        marginTop: 8,
                        maxHeight: cssCalc("80vh - 128px"),
                        minHeight: cssCalc("80vh - 128px")
                    }}
                    scroll={{ y: "calc(80vh - 104px)" }}
                    rowClassName={styles.moduleTr}
                    showHeader={false}
                    onRow={record => ({
                        onClick: () => {
                            setPostModuleConfigActive(record);
                        }
                    })}
                    size="small"
                    bordered
                    pagination={false}
                    rowKey={item => item.loadpath}
                    columns={postModuleConfigTableColumns}
                    dataSource={postModuleConfigList}
                />
            </Card>
        </Col>
        <Col span={16}>
            <Tabs defaultActiveKey="params" style={{ marginTop: 12 }}>
                <TabPane
                    tab={<span><FormOutlined />{formatText("app.runmodule.postmodule.params")}</span>}
                    key="params"
                >
                    <Form
                        style={{
                            marginBottom: 16,
                            overflow: "auto",
                            maxHeight: cssCalc("80vh - 88px"),
                            minHeight: cssCalc("80vh - 88px")
                        }}
                        layout="vertical"
                        wrapperCol={{ span: 24 }}
                        onFinish={onCreatePostModuleAuto}
                    >
                        <Row>{getModuleOptions(postModuleConfigActive)}</Row>
                        <Row>
                            {getWarn(postModuleConfigActive)}
                            <Col span={22}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    disabled={postModuleConfigActive.loadpath === null}
                                    icon={<PlusOutlined />}
                                    loading={createPostModuleAutoReq.loading}
                                >{formatText("app.runmodule.postmodule.add")}</Button>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane
                    tab={<span><InfoCircleOutlined />{formatText("app.runmodule.postmodule.desc")}</span>}
                    key="desc"
                >
                    <ModuleInfoContent postModuleConfig={postModuleConfigActive} />
                </TabPane>
            </Tabs>
        </Col>
    </Row>);
};
export const RunAutoModuleMemo = memo(RunAutoModule);
export const RunschedulerModule = props => {
    console.log("RunAutoModule");
    const { closeModel, listData } = props;
    const { postModuleOptions } = useModel("HostAndSessionModel", model => ({
        postModuleOptions: model.postModuleOptions
    }));
    const [text, setText] = useState("");
    const [sessionDict, setSessionDict] = useState([]);

    let postModuleConfigAuto = postModuleOptions
        .map(record => {
            if (record.REQUIRE_SESSION) {
                return { ...record };
            } else {
                return null;
            }
        }).filter(record => !!record);

    const pins = getPins();
    postModuleConfigAuto = postModuleConfigAuto.map(record => {
        record.pin = pins.indexOf(record.loadpath);
        return { ...record };
    });

    postModuleConfigAuto.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

    const [postModuleConfigList, setPostModuleConfigList] = useState(postModuleConfigAuto);
    const [postModuleConfigListTmp, setPostModuleConfigListTmp] = useState(postModuleConfigAuto);
    const [postModuleConfigActive, setPostModuleConfigActive] = useState({
        NAME_ZH: null,
        NAME_EN: null,
        DESC_ZH: null,
        DESC_EN: null,
        WARN_ZH: null,
        WARN_EN: null,
        AUTHOR: [],
        OPTIONS: [],
        REQUIRE_SESSION: true,
        loadpath: null,
        PERMISSIONS: [],
        PLATFORM: [],
        REFERENCES: [],
        README: [],
        ATTCK: [],
        SEARCH: {
            FOFA: null, Quake: null
        }
    });

    useRequest(() => getCoreSettingAPI({ kind: "lhost" }), {
        onSuccess: (result, params) => {
            setSessionDict(result.sessions);
        }, onError: (error, params) => {
        }
    });
    const sessionListOption = () => {
        let selectOptions = [];

        for (let uuid in sessionDict) {
            let session = sessionDict[uuid];
            selectOptions.push(<Radio value={session.id}>{sessionTagList(session)}</Radio>);
        }
        return <Col span={20}>
            <Form.Item
                label={formatText("app.runmodule.autoconf.scheduler.session")}
                tooltip={formatText("app.runmodule.autoconf.scheduler.session.tip")}
                name="scheduler_session"
                rules={[{
                    required: true
                }]}
            >
                <Radio.Group>
                    <Space direction="vertical">
                        {selectOptions}
                    </Space>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={formatText("app.runmodule.autoconf.interval")}
                       tooltip={formatText("app.runmodule.autoconf.interval.tip")}
                       name="scheduler_interval"
                       rules={[{
                           required: true
                       }]}
            >
                <Radio.Group>
                    <Radio value={60}>{formatText("app.runmodule.autoconf.scheduler.1min")}</Radio>
                    <Radio value={60 * 10}>{formatText("app.runmodule.autoconf.scheduler.10min")}</Radio>
                    <Radio value={60 * 60}>{formatText("app.runmodule.autoconf.scheduler.1hour")}</Radio>
                    <Radio value={60 * 60 * 24}>{formatText("app.runmodule.autoconf.scheduler.24hour")}</Radio>
                </Radio.Group>
            </Form.Item>
        </Col>;
    };

    const createPostModuleAutoReq = useRequest(postPostModuleAutoAPI, {
        manual: true, onSuccess: (result, params) => {
            closeModel();
            listData();
        }, onError: (error, params) => {
        }
    });

    const onCreatePostModuleAuto = params => {
        let { scheduler_session, scheduler_interval } = params;
        delete params.scheduler_session;
        delete params.scheduler_interval;
        createPostModuleAutoReq.run({
            module_type: "scheduler",
            loadpath: postModuleConfigActive.loadpath,
            custom_param: JSON.stringify(params),
            scheduler_session: scheduler_session,
            scheduler_interval: scheduler_interval
        });
    };

    const onPostModuleConfigListChange = postModuleConfigListState => {
        const pins = getPins();
        postModuleConfigListState.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
        setPostModuleConfigList(postModuleConfigListState);
    };

    const onPostModuleConfigListPinsChange = (postModuleConfigListState, pins) => {
        postModuleConfigListState = postModuleConfigListState.map(record => {
            record.pin = pins.indexOf(record.loadpath);
            return { ...record };
        });
        setPostModuleConfigList(postModuleConfigListState);
    };


    const handleModuleSearch = value => {
        const reg = new RegExp(value, "gi");
        onPostModuleConfigListChange(postModuleConfigListTmp.map(record => {
            let NAMEMatch = false;
            let DESCMatch = false;
            let REFERENCESMatch = false;
            try {
                NAMEMatch = record.NAME_ZH.match(reg) || record.NAME_EN.match(reg);
                DESCMatch = record.DESC_ZH.match(reg) || record.DESC_EN.match(reg);
                REFERENCESMatch = record.REFERENCES.toString().match(reg);
            } catch (error) {
            }

            if (NAMEMatch || DESCMatch || REFERENCESMatch) {
                return {
                    ...record
                };
            }
            return null;
        }).filter(record => !!record));
    };

    const moduleTypeOnChange = value => {
        if (value === undefined) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
            return;
        }
        if (value.length <= 0) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
        } else {
            const newpostModuleConfigListState = postModuleConfigListTmp.filter(item => value.indexOf(item.MODULETYPE) >= 0);
            onPostModuleConfigListChange(newpostModuleConfigListState);
        }
    };


    const postModuleConfigTableColumns = [{
        dataIndex: "loadpath", render: (text, record) => {
            let selectStyles = {};
            if (record.loadpath === postModuleConfigActive.loadpath) {
                selectStyles = {
                    color: "#d89614", fontWeight: "bolder", fontSize: 15
                };
            }
            const pinIcon = record.pin > -1 ? (<StarTwoTone
                twoToneColor="#d89614"
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />) : (<StarOutlined
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />);
            return (<div style={{ display: "inline" }}>
                {pinIcon}
                <a style={{ ...selectStyles }}>{getModuleName(record)}</a>
            </div>);
        }
    }];


    return (<Row>
        <Col span={8}>
            <Card bordered={false}>
                <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    style={{ width: "100%" }}
                    placeholder={formatText("app.runmodule.postmodule.search.ph")}
                    value={text}
                    onChange={e => {
                        setText(e.target.value);
                        handleModuleSearch(e.target.value);
                    }}
                />
                <Radio.Group
                    defaultValue=""
                    style={{ marginTop: 8 }}
                    buttonStyle="solid"
                    onChange={(e) => moduleTypeOnChange(e.target.value)}
                >
                    <Radio.Button value="">{formatText("app.runmodule.postmodule.moduletype.all")}</Radio.Button>
                    <Radio.Button
                        value="Resource_Development">{formatText("app.runmodule.postmodule.moduletype.Resource_Development")}</Radio.Button>
                    <Radio.Button
                        value="Initial_Access">{formatText("app.runmodule.postmodule.moduletype.Initial_Access")}</Radio.Button>
                    <Radio.Button
                        value="Execution">{formatText("app.runmodule.postmodule.moduletype.Execution")}</Radio.Button>
                    <Radio.Button
                        value="Persistence">{formatText("app.runmodule.postmodule.moduletype.Persistence")}</Radio.Button>
                    <Radio.Button
                        value="Privilege_Escalation">{formatText("app.runmodule.postmodule.moduletype.Privilege_Escalation")}</Radio.Button>
                    <Radio.Button
                        value="Defense_Evasion">{formatText("app.runmodule.postmodule.moduletype.Defense_Evasion")}</Radio.Button>
                    <Radio.Button
                        value="Credential_Access">{formatText("app.runmodule.postmodule.moduletype.Credential_Access")}</Radio.Button>
                    <Radio.Button
                        value="Discovery">{formatText("app.runmodule.postmodule.moduletype.Discovery")}</Radio.Button>
                    <Radio.Button
                        value="Lateral_Movement">{formatText("app.runmodule.postmodule.moduletype.Lateral_Movement")}</Radio.Button>
                    <Radio.Button
                        value="Collection">{formatText("app.runmodule.postmodule.moduletype.Collection")}</Radio.Button>
                </Radio.Group>
                <Table
                    style={{
                        padding: "0 0 0 0",
                        marginTop: 8,
                        maxHeight: cssCalc("80vh - 128px"),
                        minHeight: cssCalc("80vh - 128px")
                    }}
                    scroll={{ y: "calc(80vh - 104px)" }}
                    rowClassName={styles.moduleTr}
                    showHeader={false}
                    onRow={record => ({
                        onClick: () => {
                            setPostModuleConfigActive(record);
                        }
                    })}
                    size="small"
                    bordered
                    pagination={false}
                    rowKey={item => item.loadpath}
                    columns={postModuleConfigTableColumns}
                    dataSource={postModuleConfigList}
                />
            </Card>
        </Col>
        <Col span={16}>
            <Tabs defaultActiveKey="params" style={{ marginTop: 12 }}>
                <TabPane
                    tab={<span><FormOutlined />{formatText("app.runmodule.postmodule.params")}</span>}
                    key="params"
                >
                    <Form
                        style={{
                            marginBottom: 16,
                            overflow: "auto",
                            maxHeight: cssCalc("80vh - 88px"),
                            minHeight: cssCalc("80vh - 88px")
                        }}
                        layout="vertical"
                        wrapperCol={{ span: 24 }}
                        onFinish={onCreatePostModuleAuto}
                    >
                        {sessionListOption()}
                        <Divider></Divider>
                        <Row>{getModuleOptions(postModuleConfigActive)}</Row>
                        <Row>
                            {getWarn(postModuleConfigActive)}
                            <Col span={22}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    disabled={postModuleConfigActive.loadpath === null}
                                    icon={<PlusOutlined />}
                                    loading={createPostModuleAutoReq.loading}
                                >{formatText("app.runmodule.postmodule.add")}</Button>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane
                    tab={<span><InfoCircleOutlined />{formatText("app.runmodule.postmodule.desc")}</span>}
                    key="desc"
                >
                    <ModuleInfoContent postModuleConfig={postModuleConfigActive} />
                </TabPane>
            </Tabs>
        </Col>
    </Row>);
};
export const RunschedulerModuleMemo = memo(RunschedulerModule);


export const RunBotModule = props => {
    console.log("RunBotModule");

    const botModuleOptions = useModel("HostAndSessionModel", model => ({
        botModuleOptions: model.botModuleOptions
    })).botModuleOptions;

    const pins = getPins();
    botModuleOptions.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
    const [botModuleConfigList, setBotModuleConfigList] = useState(botModuleOptions);
    const [botModuleConfigActive, setBotModuleConfigActive] = useState({
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
        SEARCH: ""
    });
    const [inputStr, setInputStr] = useState(null);

    const [logic, setLogic] = useState(null);
    const [field, setField] = useState(null);

    const [ipportListState, setIpportListState] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [engineConfs, setEngineConfs] = useState({
        FOFA: false, Quake: false, Zoomeye: false
    });
    const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState("viper-debug-flag", false);
    useRequest(() => getCoreNetworkSearchAPI({ cmdtype: "list_config" }), {
        onSuccess: (result, params) => {
            setEngineConfs(result);
        }, onError: (error, params) => {
        }
    });


    const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        }
    });

    const onCreatePostModuleActuator = params => {
        createPostModuleActuatorReq.run({
            moduletype: "Bot",
            ipportlist: selectedRows,
            loadpath: botModuleConfigActive.loadpath,
            custom_param: JSON.stringify(params)
        });
    };

    const onPostModuleConfigListChange = botModuleConfigList => {
        const pins = getPins();
        botModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
        setBotModuleConfigList(botModuleConfigList);
    };

    const handleModuleSearch = value => {
        const reg = new RegExp(value, "gi");
        onPostModuleConfigListChange(botModuleOptions
            .map(record => {
                let NAMEMatch = false;
                let DESCMatch = false;
                let REFERENCESMatch = false;
                try {
                    NAMEMatch = record.NAME_ZH.match(reg) || record.NAME_EN.match(reg);
                    DESCMatch = record.DESC_ZH.match(reg) || record.DESC_EN.match(reg);
                    REFERENCESMatch = record.REFERENCES.toString().match(reg);
                } catch (error) {
                }

                if (NAMEMatch || DESCMatch || REFERENCESMatch) {
                    return {
                        ...record
                    };
                }
                return null;
            })
            .filter(record => !!record));
    };

    const listNetworkSearchReq = useRequest(getCoreNetworkSearchAPI, {
        manual: true, onSuccess: (result, params) => {
            console.log(result);
            setIpportListState(result);
        }, onError: (error, params) => {
        }
    });

    const searchNetworkSubmit = values => {
        listNetworkSearchReq.run({
            inputstr: inputStr, engine: values.engine, page: values.page, size: values.size
        });
    };

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const postModuleConfigTableColumns = [{
        dataIndex: "loadpath", render: (text, record) => {
            const pins = getPins();
            const pinIcon = pins.indexOf(record.loadpath) > -1 ? (<StarTwoTone
                twoToneColor="#d89614"
                onClick={() => {
                    const newpins = changePin(record.loadpath);
                    onPostModuleConfigListChange(botModuleConfigList);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />) : (<StarOutlined
                onClick={() => {
                    const newpins = changePin(record.loadpath);
                    onPostModuleConfigListChange(botModuleConfigList);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />);

            let tag = null;
            let selectStyles = {};
            if (record.loadpath === botModuleConfigActive.loadpath) {
                selectStyles = {
                    color: "#d89614", fontWeight: "bolder"
                };
            }
            return (<div
                style={{
                    display: "inline"
                }}
            >
                {pinIcon}
                <a style={{ marginLeft: 4, ...selectStyles }}>{getModuleName(record)}</a>
            </div>);
        }
    }];

    const rowSelection = {
        selectedRowKeys, onChange: onSelectChange
    };

    const onChageInputStr = (e) => {
        setInputStr(e.target.value);
    };
    const ModuleInfoContent = props => {
        const { postModuleConfig } = props;
        if (postModuleConfig === undefined) {
            return null;
        }
        const readme = postModuleConfig.README;
        const readmeCom = [];
        for (let i = 0; i < readme.length; i++) {
            readmeCom.push(<div>
                <a href={readme[i]} target="_blank">
                    {readme[i]}
                </a>
            </div>);
        }
        const references = postModuleConfig.REFERENCES;
        const referencesCom = [];
        for (let i = 0; i < references.length; i++) {
            referencesCom.push(<div>
                <a href={references[i]} target="_blank">
                    {references[i]}
                </a>
            </div>);
        }

        const authors = postModuleConfig.AUTHOR;
        const authorCom = [];
        for (let i = 0; i < authors.length; i++) {
            authorCom.push(<Tag color="lime">{authors[i]}</Tag>);
        }

        return (<Descriptions
            size="small"
            style={{
                padding: "0 0 0 0", marginRight: 8
            }}
            column={12}
            bordered
        >
            <Descriptions.Item label={formatText("app.runmodule.postmodule.NAME")} span={12}>
                {getModuleName(postModuleConfig)}
            </Descriptions.Item>
            <Descriptions.Item label={formatText("app.runmodule.postmodule.authorCom")} span={12}>
                {authorCom}
            </Descriptions.Item>
            <Descriptions.Item span={12} label="FOFA">
                <pre>{postModuleConfig.SEARCH.FOFA}</pre>
            </Descriptions.Item>
            <Descriptions.Item span={12} label="360Quake">
                <pre>{postModuleConfig.SEARCH.Quake}</pre>
            </Descriptions.Item>
            <Descriptions.Item label={formatText("app.runmodule.postmodule.readmeCom")} span={12}>
                {readmeCom}
            </Descriptions.Item>
            <Descriptions.Item label={formatText("app.runmodule.postmodule.referencesCom")} span={12}>
                {referencesCom}
            </Descriptions.Item>
            <Descriptions.Item span={12} label={formatText("app.runmodule.postmodule.DESC")}>
          <pre
              style={{
                  whiteSpace: "pre-wrap", overflowX: "hidden", padding: "0 0 0 0"
              }}
          >{getModuleDesc(postModuleConfig)}</pre>
            </Descriptions.Item>
        </Descriptions>);
    };

    const addToInputStr = (value) => {
        if (value === null || value.length === 0 || logic === null || field == null) {
            return;
        } else {
            const newinputstr = `${inputStr} ${logic} ${field}:\"${value}\"`;
            setInputStr(newinputstr);
        }
    };

    return (<Row>
        <Col span={6}>
            <Card bordered={false}
                  style={{
                      minHeight: cssCalc("100vh - 40px")
                  }}
            >
                <Search placeholder={formatText("app.runmodule.postmodule.searchmodule.ph")}
                        onSearch={value => handleModuleSearch(value)} />
                <Table
                    style={{
                        padding: "0 0 0 0",
                        maxHeight: cssCalc("100vh - 120px"),
                        minHeight: cssCalc("100vh - 120px")
                    }}
                    scroll={{ y: "calc(100vh - 120px)" }}
                    rowClassName={styles.moduleTr}
                    showHeader={false}
                    onRow={record => ({
                        onClick: () => {
                            setBotModuleConfigActive(record);
                            setInputStr(record.SEARCH.Quake);
                            setSelectedRowKeys([]);
                            setSelectedRows([]);
                        }
                    })}
                    size="small"
                    bordered
                    pagination={false}
                    rowKey={item => item.loadpath}
                    rowSelection={undefined}
                    columns={postModuleConfigTableColumns}
                    dataSource={botModuleConfigList}
                />
            </Card>
        </Col>
        <Col span={18}>
            <Tabs defaultActiveKey="ipportlist" style={{ marginTop: 12 }}>
                <TabPane
                    tab={<span><FormOutlined />{formatText("app.runmodule.postmodule.params")}</span>}
                    key="ipportlist"
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            <TextArea
                                placeholder={formatText("app.runmodule.postmodule.inputstr.ph")}
                                autoSize={{ minRows: 3, maxRows: 3 }}
                                onChange={onChageInputStr}
                                value={inputStr}
                            />
                            <Input.Group compact
                                         style={{ marginTop: 8, marginBottom: 24 }}
                            >
                                <Select style={{ width: "15%" }}
                                        onChange={(value) => setLogic(value)}
                                >
                                    <Option value="AND">AND</Option>
                                    <Option value="OR">OR</Option>
                                </Select>
                                <Select style={{ width: "25%" }}
                                        onChange={(value) => setField(value)}
                                >
                                    <OptGroup label={formatText("app.runmodule.botmodule.base")}>
                                        <Option value="ip">ip</Option>
                                        <Option value="port">port</Option>
                                        <Option value="ports">ports</Option>
                                        <Option value="domain">domain</Option>
                                        <Option value="transport">transport</Option>
                                    </OptGroup>
                                    <OptGroup label={formatText("app.runmodule.botmodule.service")}>
                                        <Option value="service">service</Option>
                                        <Option value="services">services</Option>
                                        <Option value="app">app</Option>
                                        <Option value="version">version</Option>
                                        <Option value="response">response</Option>
                                        <Option value="os">os</Option>
                                    </OptGroup>
                                    <OptGroup label={formatText("app.runmodule.botmodule.app")}>
                                        <Option value="catalog">catalog</Option>
                                        <Option value="type">type</Option>
                                        <Option value="level">level</Option>
                                        <Option value="vendor">vendor</Option>
                                    </OptGroup>
                                    <OptGroup label={formatText("app.runmodule.botmodule.location")}>
                                        <Option value="country">country</Option>
                                        <Option value="country_cn">country_cn</Option>
                                        <Option value="province">province</Option>
                                        <Option value="province_cn">province_cn</Option>
                                        <Option value="city">city</Option>
                                        <Option value="city_cn">city_cn</Option>
                                    </OptGroup>
                                    <OptGroup label={formatText("app.runmodule.botmodule.other")}>
                                        <Option value="is_latest">is_latest</Option>
                                        <Option value="is_ipv6">is_ipv6</Option>
                                        <Option value="cert">cert</Option>
                                        <Option value="owner">owner</Option>
                                        <Option value="isp">isp</Option>
                                    </OptGroup>
                                </Select>
                                <Search style={{ width: "60%" }}
                                        enterButton={<PlusOutlined />}
                                        onSearch={addToInputStr}
                                />
                            </Input.Group>
                            <Form layout="horizontal" onFinish={searchNetworkSubmit}>
                                <div style={{ display: "flex" }}>
                                    <Form.Item
                                        label={formatText("app.runmodule.postmodule.engine")}
                                        name="engine"
                                        required>
                                        <Radio.Group>
                                            {viperDebugFlag ? (<Radio.Button value="FOFA" disabled={!engineConfs.FOFA}>
                                                FOFA
                                            </Radio.Button>) : null}
                                            <Radio.Button value="Quake" disabled={!engineConfs.Quake}>
                                                Quake
                                            </Radio.Button>
                                            <Radio.Button value="Zoomeye" disabled={!engineConfs.Zoomeye}>
                                                Zoomeye
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Button type="link"
                                            target="_blank"
                                            href="https://quake.360.cn/quake/#/help?id=5eb238f110d2e850d5c6aec8&title=%E6%A3%80%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D">
                                        Quake Doc
                                    </Button>
                                    <Button type="link"
                                            target="_blank"
                                            href="https://www.zoomeye.org/doc">
                                        Zoomeye Doc
                                    </Button>
                                </div>
                                <Space
                                    size="middle"
                                >
                                    <Form.Item
                                        label={formatText("app.runmodule.postmodule.page")}
                                        name="page"
                                        required
                                        initialValue={1}
                                        rules={[{
                                            type: "number", min: 1
                                        }]}
                                    >
                                        <InputNumber />
                                    </Form.Item>
                                    <Form.Item
                                        required
                                        label={formatText("app.runmodule.postmodule.number")}
                                        initialValue={10}
                                        rules={[{
                                            type: "number", min: 1
                                        }]}
                                        name="size"
                                    >
                                        <InputNumber
                                            style={{ width: 160 }}
                                        />
                                    </Form.Item>
                                </Space>
                                <Form.Item>
                                    <Button
                                        block
                                        icon={<SearchOutlined />}
                                        type="primary"
                                        htmlType="submit"
                                        disabled={botModuleConfigActive.loadpath === null}
                                        loading={listNetworkSearchReq.loading}
                                    >{formatText("app.runmodule.postmodule.search")}</Button>
                                </Form.Item>
                            </Form>
                            <Divider />
                            <ModalForm
                                mask={false}
                                width={400}
                                trigger={<Button block
                                                 type="dashed">{formatText("app.runmodule.botmodule.manualinput")}</Button>}
                                onFinish={async (values) => {
                                    const ipportlist = values.ipporttext.split("\n").map((record, index) => {
                                        let ipportpair = record.split(":");
                                        return { index: index, ip: ipportpair[0], port: ipportpair[1] };
                                    });
                                    setIpportListState(ipportlist);
                                    return true;
                                }}
                            >
                                <ProFormTextArea
                                    name="ipporttext"
                                    label={formatText("app.runmodule.botmodule.ipporttext")}
                                    tooltip={formatText("app.runmodule.botmodule.ipporttext.tp")}
                                    placeholder={formatText("app.runmodule.botmodule.ipporttext.ph")}
                                />
                            </ModalForm>
                        </Col>
                        <Col span={12}>
                            <Table
                                loading={listNetworkSearchReq.loading}
                                style={{
                                    marginTop: 0,
                                    padding: "0px 8px 16px 0px",
                                    maxHeight: "560px",
                                    minHeight: "560px"
                                }}
                                scroll={{ y: 480 }}
                                size="small"
                                bordered
                                pagination={false}
                                rowKey="index"
                                rowSelection={rowSelection}
                                columns={[{
                                    title: "IP",
                                    dataIndex: "ip",
                                    key: "ip",
                                    width: 120,
                                    render: (text, record) => (<strong
                                        style={{
                                            color: "#13a8a8"
                                        }}
                                    >
                                        {text}
                                    </strong>)
                                }, {
                                    title: formatText("app.runmodule.botmodule.port"),
                                    dataIndex: "port",
                                    key: "port",
                                    width: 56,
                                    render: (text, record) => {
                                        return text;
                                    }
                                }, {
                                    title: formatText("app.runmodule.botmodule.protocol"),
                                    dataIndex: "protocol",
                                    key: "protocol",
                                    width: 80,
                                    render: (text, record) => {
                                        return text;
                                    }
                                }, {
                                    title: formatText("app.runmodule.botmodule.country_name"),
                                    dataIndex: "country_name",
                                    key: "country_name",
                                    width: 80,
                                    render: (text, record) => {
                                        return text;
                                    }
                                }, {
                                    title: formatText("app.runmodule.botmodule.as_organization"),
                                    dataIndex: "as_organization",
                                    key: "as_organization",
                                    render: (text, record) => {
                                        return text;
                                    }
                                }]}
                                dataSource={ipportListState}
                            />

                        </Col>
                    </Row>
                    <Form
                        layout="vertical"
                        wrapperCol={{ span: 24 }}
                        onFinish={onCreatePostModuleActuator}
                    >
                        <Row>{getModuleOptions(botModuleConfigActive)}</Row>
                        <Row>
                            <Col span={22}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    disabled={botModuleConfigActive.loadpath === null || selectedRows.length === 0}
                                    icon={<PlayCircleOutlined />}
                                    loading={createPostModuleActuatorReq.loading}
                                >{formatText("app.runmodule.postmodule.run")}</Button>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane
                    tab={<span><InfoCircleOutlined />{formatText("app.runmodule.postmodule.desc")}</span>}
                    key="desc"
                >
                    <ModuleInfoContent postModuleConfig={botModuleConfigActive} />
                </TabPane>
            </Tabs>
        </Col>
    </Row>);
};
export const RunBotModuleMemo = memo(RunBotModule);

export const BotScan = () => {
    const [runBotModuleModalVisable, setRunBotModuleModalVisable] = useState(false);
    return (<Fragment>
        <DocIcon url="https://www.yuque.com/vipersec/help/yrys61" />
        <Row style={{ marginTop: -16 }} gutter={0}>
            <Col span={24}>
                <Button
                    block
                    icon={<PlusOutlined />}
                    onClick={() => setRunBotModuleModalVisable(true)}
                >{formatText("app.runmodule.botmodule.newtask")}</Button>
            </Col>
        </Row>
        <RealTimeBotWaitListMemo />
        <Modal
            mask={false}
            style={{ top: 16 }}
            width="90vw"
            destroyOnClose
            visible={runBotModuleModalVisable}
            onCancel={() => setRunBotModuleModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: "0px 0px 0px 0px" }}
        >
            <RunBotModuleMemo />
        </Modal>
    </Fragment>);
};

const RealTimeBotWaitList = () => {
    console.log("RealTimeBotWaitList");
    const { botWaitList, setBotWaitList } = useModel("HostAndSessionModel", model => ({
        botWaitList: model.botWaitList, setBotWaitList: model.setBotWaitList
    }));
    const {
        resizeDownHeight,
    } = useModel("Resize", model => ({
        resizeDownHeight: model.resizeDownHeight,
    }));
    const destoryBotWaitReq = useRequest(deleteMsgrpcJobAPI, {
        manual: true, onSuccess: (result, params) => {
            const { uuid } = result;
            setBotWaitList(botWaitList.filter(item => item.group_uuid !== uuid));
        }, onError: (error, params) => {
        }
    });

    const onDestoryBotWait = record => {
        destoryBotWaitReq.run({
            uuid: record.group_uuid, job_id: record.job_id, broker: record.broker
        });
    };

    const taskDetail = item => {
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
        return (<Descriptions style={{ width: "80vw" }} bordered size="small" column={2}>
            {Descriptions_Items}
        </Descriptions>);
    };

    const columns = [{
        title: formatText("app.runmodule.botmodule.time"),
        dataIndex: "time",
        key: "time",
        width: 136,
        render: (text, record) => <Tag color="cyan">{moment(record.time * 1000).format("YYYY-MM-DD HH:mm")}</Tag>
    }, {
        title: formatText("app.runmodule.botmodule.module"),
        dataIndex: "moduleinfo",
        key: "moduleinfo",
        width: 240,
        render: (text, record) => (<Popover
            placement="right"
            content={<ModuleInfoMemo postModuleConfig={record.moduleinfo} />}
            trigger="click"
        >
            <a>{getModuleName(record.moduleinfo)}</a>
        </Popover>)
    }, {
        title: formatText("app.runmodule.botmodule.ip_list.count"),
        dataIndex: "ip_list",
        key: "ip_list",
        width: 120,
        render: (text, record) => {
            return (<strong
                style={{
                    color: "#13a8a8"
                }}
            >
                {record.ip_list.length} 个
            </strong>);
        }
    }, {
        title: formatText("app.runmodule.botmodule.ip_list"),
        dataIndex: "ip_list",
        key: "ip_list",
        width: 96,
        render: (text, record) => {
            return (<Popover
                placement="right"
                content={<List
                    style={{
                        padding: "0 0 0 0",
                        overflow: "auto",
                        maxHeight: cssCalc("50vh"),
                        minHeight: cssCalc("50vh")
                    }}
                    size="small"
                    bordered
                    dataSource={record.ip_list}
                    renderItem={item => <List.Item>{item}</List.Item>}
                />}
                trigger="click"
            >
                <a>{formatText("app.runmodule.botmodule.view")}</a>
            </Popover>);
        }
    }, {
        title: formatText("app.runmodule.botmodule.param"),
        dataIndex: "moduleinfo",
        key: "moduleinfo",
        render: (text, record) => {
            return (<Popover
                placement="top"
                content={taskDetail(record.moduleinfo._custom_param)}
                trigger="click"
            >
                <a>{formatText("app.runmodule.botmodule.view")}</a>
            </Popover>);
        }
    }, {
        dataIndex: "operation",
        width: 48,
        render: (text, record) => (<a style={{ color: "red" }} onClick={() => onDestoryBotWait(record)}>
            {formatText("app.core.delete")}
        </a>)
    }];

    return (<Table
        style={{
            marginTop: 0,
            overflow: "auto",
            maxHeight: cssCalc(`${resizeDownHeight} - 32px`),
            minHeight: cssCalc(`${resizeDownHeight} - 32px`)
        }}
        size="small"
        rowKey="uuid"
        pagination={false}
        dataSource={botWaitList}
        bordered
        columns={columns}
    />);
};

const RealTimeBotWaitListMemo = memo(RealTimeBotWaitList);

export const PostModule = props => {
    console.log("PostModule");
    const { loadpath, initialValues } = props;
    const {
        hostAndSessionActive, postModuleOptions
    } = useModel("HostAndSessionModel", model => ({
        hostAndSessionActive: model.hostAndSessionActive, postModuleOptions: model.postModuleOptions
    }));
    let moduleconfig = {
        NAME_ZH: null,
        NAME_EN: null,
        DESC_ZH: null,
        DESC_EN: null,
        AUTHOR: [],
        OPTIONS: [],
        REQUIRE_SESSION: true,
        loadpath: null,
        PERMISSIONS: [],
        PLATFORM: [],
        REFERENCES: [],
        ATTCK: []
    };
    for (const index in postModuleOptions) {
        if (postModuleOptions[index].loadpath === loadpath) {
            moduleconfig = postModuleOptions[index];
        }
    }
    const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        }
    });
    const onCreatePostModuleActuator = params => {
        createPostModuleActuatorReq.run({
            ipaddress: hostAndSessionActive.ipaddress,
            sessionid: hostAndSessionActive.session.id,
            loadpath: moduleconfig.loadpath,
            custom_param: JSON.stringify(params)
        });
    };
    const [form] = Form.useForm();
    const options = [];
    if (moduleconfig === undefined) {
        return [];
    }
    for (const oneOption of moduleconfig.OPTIONS) {
        form.setFieldsValue({ [oneOption.name]: oneOption.default });
        if (oneOption.type === "str") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                >
                    <Input
                        style={{ width: "90%" }}
                    />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "bool") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    valuePropName="checked"
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                >
                    <Checkbox style={{ width: "90%" }} defaultChecked={oneOption.default} />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "integer") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                    wrapperCol={{ span: 24 }}
                >
                    <InputNumber
                        style={{ width: "90%" }}
                        // defaultValue={oneOption.default}
                    />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "float") {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                    wrapperCol={{ span: 24 }}
                >
                    <InputNumber
                        step={0.1}
                        style={{ width: "90%" }}
                    />
                </Form.Item>
            </Col>);
        } else if (oneOption.type === "enum") {
            const selectOptions = [];
            for (const oneselect of oneOption.enum_list) {
                selectOptions.push(<Option value={oneselect.value}>
                    <Tooltip mouseEnterDelay={0.3} title={getOptionTag(oneselect)}>
                        {getOptionTag(oneselect)}
                    </Tooltip>
                </Option>);
            }
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                    wrapperCol={{ span: 24 }}
                >
                    <Select
                        style={{
                            width: "90%"
                        }}
                    >
                        {selectOptions}
                    </Select>
                </Form.Item>
            </Col>);
        } else {
            options.push(<Col span={oneOption.length}>
                <Form.Item
                    label={getOptionTag(oneOption)}
                    tooltip={getOptionDesc(oneOption)}
                    name={oneOption.name}
                    rules={[{
                        required: oneOption.required,
                        message: `${formatText("app.runmodule.common.rule")}${getOptionTag(oneOption)}`
                    }]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input
                        style={{ width: "90%" }}
                    />
                </Form.Item>
            </Col>);
        }
    }
    form.setFieldsValue(initialValues);
    return (<Form
        form={form}
        layout="vertical"
        wrapperCol={{ span: 24 }}
        onFinish={onCreatePostModuleActuator}
        initialValues={initialValues}
    >
        <Row>{options}</Row>
        <Row>
            <Col span={12}>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    icon={<PlayCircleOutlined />}
                    loading={createPostModuleActuatorReq.loading}
                >{formatText("app.runmodule.postmodule.run")}</Button>
            </Col>
        </Row>
    </Form>);
};

export const PostModuleMemo = memo(PostModule);

export const ModuleInfo = ({ postModuleConfig }) => {
    const references = postModuleConfig.REFERENCES;
    const referencesCom = [];
    for (let i = 0; i < references.length; i++) {
        referencesCom.push(<div>
            <a href={references[i]} target="_blank">
                {references[i]}
            </a>
        </div>);
    }

    const readme = postModuleConfig.README;
    const readmeCom = [];
    for (let i = 0; i < readme.length; i++) {
        readmeCom.push(<div>
            <a href={readme[i]} target="_blank">
                {readme[i]}
            </a>
        </div>);
    }

    const authors = postModuleConfig.AUTHOR;
    const authorCom = [];
    for (let i = 0; i < authors.length; i++) {
        authorCom.push(<Tag color="lime">{authors[i]}</Tag>);
    }

    return (<Descriptions
        size="small"
        style={{
            padding: "0 0 0 0", marginRight: 8
        }}
        column={8}
        bordered
    >
        <Descriptions.Item label={formatText("app.runmodule.postmodule.NAME")} span={8}>
            {getModuleName(postModuleConfig)}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.authorCom")} span={4}>
            {authorCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.readmeCom")} span={8}>
            {readmeCom}
        </Descriptions.Item>
        <Descriptions.Item label={formatText("app.runmodule.postmodule.referencesCom")} span={8}>
            {referencesCom}
        </Descriptions.Item>
        <Descriptions.Item span={8} label={formatText("app.runmodule.postmodule.DESC")}>
        <pre
            style={{
                whiteSpace: "pre-wrap", overflowX: "hidden", padding: "0 0 0 0"
            }}
        >{getModuleDesc(postModuleConfig)}</pre>
        </Descriptions.Item>
    </Descriptions>);
};
export const ModuleInfoMemo = memo(ModuleInfo);

const PostModuleAutoConfForm = props => {
    const [postModuleAutoConfForm] = Form.useForm();
    const [settingsPostModuleAutoConf, setSettingsPostModuleAutoConf] = useState({});

    //初始化数据
    const initListPostModuleAutoConfReq = useRequest(() => getCoreSettingAPI({ kind: "postmoduleautoconf" }), {
        onSuccess: (result, params) => {
            setSettingsPostModuleAutoConf(result);
            postModuleAutoConfForm.setFieldsValue(result);
        }, onError: (error, params) => {
        }
    });

    const updateSessionMonitorReq = useRequest(postCoreSettingAPI, {
        manual: true, onSuccess: (result, params) => {
            setSettingsPostModuleAutoConf(result);
            postModuleAutoConfForm.setFieldsValue(result);
        }, onError: (error, params) => {
        }
    });

    const onUpdateSessionMonitor = setting => {
        let params = {
            kind: "postmoduleautoconf", tag: "default", setting
        };
        updateSessionMonitorReq.run(params);
    };

    return (<Form layout="inline">
        <Form.Item label={formatText("app.runmodule.autoconf.switch")}>
            <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<MinusOutlined />}
                checked={settingsPostModuleAutoConf.flag}
                onClick={() => onUpdateSessionMonitor({ flag: !settingsPostModuleAutoConf.flag })}
            />
        </Form.Item>
        <Form.Item label={formatText("app.runmodule.autoconf.interval")}
                   tooltip={formatText("app.runmodule.autoconf.interval.tip")}>
            <Radio.Group
                onChange={e => onUpdateSessionMonitor({ interval: e.target.value })}
                value={settingsPostModuleAutoConf.interval}
            >
                <Radio value={10}>{formatText("app.runmodule.autoconf.10s")}</Radio>
                <Radio value={60}>{formatText("app.runmodule.autoconf.1min")}</Radio>
                <Radio value={600}>{formatText("app.runmodule.autoconf.10min")}</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item
            label={formatText("app.runmodule.autoconf.max_session")}
            tooltip={formatText("app.runmodule.autoconf.max_session.tip")}
        >
            <Radio.Group
                onChange={e => onUpdateSessionMonitor({ max_session: e.target.value })}
                value={settingsPostModuleAutoConf.max_session}
            >
                <Radio value={3}>3</Radio>
                <Radio value={5}>5</Radio>
            </Radio.Group>
        </Form.Item>
    </Form>);
};

const PostModuleAutoConfFormMemo = memo(PostModuleAutoConfForm);

const AutoRobot = () => {
    console.log("AutoRobot");
    const [postModuleAutoList, setPostModuleAutoList] = useState([]);
    const [postModuleSchedulerList, setPostModuleSchedulerList] = useState([]);
    const [runAutoModuleModalVisable, setRunAutoModuleModalModalVisable] = useState(false);
    const [runAutoModuleSchedulerModalVisable, setRunAutoModuleSchedulerModalModalVisable] = useState(false);
    const {
        resizeDownHeight,
    } = useModel("Resize", model => ({
        resizeDownHeight: model.resizeDownHeight,
    }));
    //初始化数据
    useRequest(getPostModuleAutoAPI, {
        onSuccess: (result, params) => {
            let { auto, scheduler } = result;
            setPostModuleAutoList(auto);
            setPostModuleSchedulerList(scheduler);
        }, onError: (error, params) => {
        }
    });

    const listPostModuleAutoReq = useRequest(getPostModuleAutoAPI, {
        manual: true, onSuccess: (result, params) => {
            let { auto, scheduler } = result;
            setPostModuleAutoList(auto);
            setPostModuleSchedulerList(scheduler);
        }, onError: (error, params) => {
        }
    });

    const createPostModuleAutoReq = useRequest(postPostModuleAutoAPI, {
        manual: true, onSuccess: (result, params) => {
            listPostModuleAutoReq.run();
        }, onError: (error, params) => {
        }
    });

    const updatePostModuleSchedulerReq = useRequest(putPostModuleAutoAPI, {
        manual: true, onSuccess: (result, params) => {
            listPostModuleAutoReq.run();
        }, onError: (error, params) => {
        }
    });

    const destoryPostModuleAutoReq = useRequest(deletePostModuleAutoAPI, {
        manual: true, onSuccess: (result, params) => {
            const { _module_uuid } = result;
            setPostModuleAutoList(postModuleAutoList.filter(item => item._module_uuid !== _module_uuid));
        }, onError: (error, params) => {
        }
    });

    const destoryPostModuleSchedulerReq = useRequest(deletePostModuleAutoAPI, {
        manual: true, onSuccess: (result, params) => {
            const { job_id } = result;
            setPostModuleSchedulerList(postModuleSchedulerList.filter(item => item.job_id !== job_id));
        }, onError: (error, params) => {
        }
    });

    return (<Tabs style={{ marginTop: -16 }} type="card" defaultActiveKey="system_info">
        <TabPane tab={formatText("app.runmodule.autoconf.auto")} key="auto">
            <DocIcon url="https://www.yuque.com/vipersec/help/gh60e1" />
            <Row gutter={0} style={{ marginTop: -16 }}>
                <Col span={12}>
                    <Button
                        block
                        icon={<PlusOutlined />}
                        onClick={() => setRunAutoModuleModalModalVisable(true)}
                    >{formatText("app.runmodule.autorobot.add")}</Button>
                </Col>
                <Col span={12}>
                    <Button
                        icon={<SyncOutlined />}
                        style={{
                            width: "100%"
                        }}
                        loading={listPostModuleAutoReq.loading || createPostModuleAutoReq.loading || destoryPostModuleAutoReq.loading}
                        onClick={() => listPostModuleAutoReq.run()}
                    >{formatText("app.core.refresh")}</Button>
                </Col>
            </Row>
            <Row gutter={0}>
                <Col span={24}>
                    <Card style={{ margin: 0 }} bodyStyle={{ padding: "4px 4px 4px 4px" }}>
                        <PostModuleAutoConfFormMemo />
                    </Card>
                    <Table
                        style={{
                            padding: "0 0 0 0",
                            overflow: "auto",
                            maxHeight: cssCalc(`${resizeDownHeight} - 108px`),
                            minHeight: cssCalc(`${resizeDownHeight} - 108px`)
                        }}
                        size="small"
                        rowKey="job_id"
                        pagination={false}
                        dataSource={postModuleAutoList}
                        bordered
                        columns={[{
                            title: formatText("app.runmodule.botmodule.module"),
                            dataIndex: "moduleinfo",
                            key: "moduleinfo",
                            width: 240,
                            render: (text, record) => (<Popover
                                placement="right"
                                content={PostModuleInfoContent(record.moduleinfo)}
                                trigger="click"
                            >
                                <a>{getModuleName(record.moduleinfo)}</a>
                            </Popover>)
                        }, {
                            title: formatText("app.runmodule.autorobot.params"),
                            dataIndex: "opts",
                            key: "opts",
                            render: (text, record) => {
                                return postModuleOpts(record.opts);
                            }
                        }, {
                            dataIndex: "operation",
                            width: 56,
                            render: (text, record) => (<div style={{ textAlign: "center" }}>
                                <a
                                    style={{ color: "red" }}
                                    onClick={() => destoryPostModuleAutoReq.run({
                                        module_type: "auto",
                                        _module_uuid: record._module_uuid
                                    })}
                                >{formatText("app.core.delete")}</a>
                            </div>)
                        }]}
                    />
                </Col>
            </Row>
            <Modal
                mask={false}
                style={{ top: 32 }}
                width="90vw"
                destroyOnClose
                visible={runAutoModuleModalVisable}
                onCancel={() => setRunAutoModuleModalModalVisable(false)}
                footer={null}
                bodyStyle={{ padding: "0px 0px 0px 0px" }}
            >
                <RunAutoModuleMemo
                    closeModel={() => {
                        setRunAutoModuleModalModalVisable(false);
                    }}
                    listData={() => {
                        listPostModuleAutoReq.run();
                    }}
                />
            </Modal>
        </TabPane>
        <TabPane tab={formatText("app.runmodule.autoconf.scheduler")} key="scheduler">
            <DocIcon url="https://www.yuque.com/vipersec/help/gh60e1" />
            <Row gutter={0} style={{ marginTop: -16 }}>
                <Col span={12}>
                    <Button
                        block
                        icon={<PlusOutlined />}
                        onClick={() => setRunAutoModuleSchedulerModalModalVisable(true)}
                    >{formatText("app.runmodule.autorobot.scheduler.add")}</Button>
                </Col>
                <Col span={12}>
                    <Button
                        icon={<SyncOutlined />}
                        style={{
                            width: "100%"
                        }}
                        loading={listPostModuleAutoReq.loading || createPostModuleAutoReq.loading || destoryPostModuleAutoReq.loading}
                        onClick={() => listPostModuleAutoReq.run()}
                    >{formatText("app.core.refresh")}</Button>
                </Col>
            </Row>
            <Row gutter={0}>
                <Col span={24}>
                    <Table
                        style={{
                            padding: "0 0 0 0",
                            overflow: "auto",
                            maxHeight: cssCalc(`${resizeDownHeight} - 72px`),
                            minHeight: cssCalc(`${resizeDownHeight} - 72px`)
                        }}
                        size="small"
                        rowKey="job_id"
                        pagination={false}
                        dataSource={postModuleSchedulerList}
                        bordered
                        columns={[{
                            title: formatText("app.runmodule.autorobot.session"),
                            dataIndex: "scheduler_session",
                            key: "scheduler_session",
                            width: 56,
                            render: (text, record) => {
                                const sessionidTag = (
                                    <Tag
                                        color="purple"
                                        style={{
                                            width: "100%",
                                            textAlign: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <strong>{record.scheduler_session}</strong>
                                    </Tag>
                                );
                                return sessionidTag;
                            }
                        },
                            {
                                title: formatText("app.runmodule.botmodule.scheduler.module"),
                                dataIndex: "moduleinfo",
                                key: "moduleinfo",
                                width: 240,
                                render: (text, record) => (<Popover
                                    placement="right"
                                    content={PostModuleInfoContent(record.moduleinfo)}
                                    trigger="click"
                                >
                                    <a>{getModuleName(record.moduleinfo)}</a>
                                </Popover>)
                            }, {
                                title: formatText("app.runmodule.autorobot.params"),
                                dataIndex: "opts",
                                key: "opts",
                                render: (text, record) => {
                                    return postModuleOpts(record.opts);
                                }
                            }, {
                                title: formatText("app.runmodule.autorobot.next_run_time"),
                                dataIndex: "next_run_time",
                                key: "next_run_time",
                                width: 120,
                                render: (text, record) => {
                                    if (record.next_run_time !== null) {
                                        return <Tag
                                            color="cyan">{moment(record.next_run_time * 1000).format("YYYY-MM-DD HH:mm")}</Tag>;
                                    } else {
                                        return <Tag
                                            color="orange">{formatText("app.runmodule.autorobot.scheduler.pause")}</Tag>;
                                    }

                                }
                            }, {
                                title: formatText("app.runmodule.autoconf.scheduler.interval"),
                                dataIndex: "interval",
                                key: "interval",
                                width: 80,
                                render: (text, record) => {
                                    return <Tag
                                        color="green">{moment.duration(record.interval, "seconds").humanize()}</Tag>;

                                }
                            }, {
                                dataIndex: "operation",
                                width: 136,
                                render: (text, record) => {
                                    let jobAction = null;
                                    if (record.next_run_time !== null) {
                                        jobAction = (
                                            <a style={{ color: "#faad14" }}
                                               onClick={() => updatePostModuleSchedulerReq.run({
                                                   job_id: record.job_id,
                                                   action: "pause"
                                               })}>
                                                {formatText("app.runmodule.autorobot.scheduler.pause")}
                                            </a>
                                        );
                                    } else {
                                        jobAction = (
                                            <a style={{ color: "#a5a5a5" }}
                                               onClick={() => updatePostModuleSchedulerReq.run({
                                                   job_id: record.job_id,
                                                   action: "resume"
                                               })}>
                                                {formatText("app.runmodule.autorobot.scheduler.resume")}
                                            </a>
                                        );
                                    }
                                    return <div style={{ textAlign: "center" }}>
                                        <Space size="middle">
                                            {jobAction}
                                            <a
                                                style={{ color: "red" }}
                                                onClick={() => destoryPostModuleSchedulerReq.run({
                                                    module_type: "scheduler",
                                                    job_id: record.job_id
                                                })}
                                            >{formatText("app.core.delete")}</a>
                                        </Space>
                                    </div>;
                                }
                            }]} />
                </Col>
            </Row>
            <Modal
                mask={false}
                style={{ top: 32 }}
                width="90vw"
                destroyOnClose
                visible={runAutoModuleSchedulerModalVisable}
                onCancel={() => setRunAutoModuleSchedulerModalModalVisable(false)}
                footer={null}
                bodyStyle={{ padding: "0px 0px 0px 0px" }}
            >
                <RunschedulerModuleMemo
                    closeModel={() => {
                        setRunAutoModuleSchedulerModalModalVisable(false);
                    }}
                    listData={() => {
                        listPostModuleAutoReq.run();
                    }}
                />
            </Modal>
        </TabPane>
    </Tabs>);
};

export const AutoRobotMemo = memo(AutoRobot);


const ProxyHttpScanConfForm = props => {
    const [proxyHttpScanConfForm] = Form.useForm();
    const [settingsProxyHttpScanConf, setSettingsProxyHttpScanConf] = useState({});

    //初始化数据
    const initListPostModuleAutoConfReq = useRequest(() => getCoreSettingAPI({ kind: "proxyhttpscanconf" }), {
        onSuccess: (result, params) => {
            setSettingsProxyHttpScanConf(result);
            proxyHttpScanConfForm.setFieldsValue(result);
        }, onError: (error, params) => {
        }
    });

    const updateSessionMonitorReq = useRequest(postCoreSettingAPI, {
        manual: true, onSuccess: (result, params) => {
            setSettingsProxyHttpScanConf(result);
            proxyHttpScanConfForm.setFieldsValue(result);
        }, onError: (error, params) => {
        }
    });

    const onUpdateProxyHttpScanConf = setting => {
        let params = {
            kind: "proxyhttpscanconf", tag: "default", setting
        };
        updateSessionMonitorReq.run(params);
    };

    return (<Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} layout="vertical">
        <Form.Item label={formatText("app.runmodule.autoconf.switch")}>
            <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<MinusOutlined />}
                checked={settingsProxyHttpScanConf.flag}
                onClick={() => onUpdateProxyHttpScanConf({ flag: !settingsProxyHttpScanConf.flag })}
            />
        </Form.Item>
        PROXY : <Text strong>Http://VPSIP:28888</Text>
    </Form>);
};

export const ProxyHttpScanModule = props => {
    console.log("RunProxyHttpScanModule");
    const { closeModel, listData } = props;
    const [text, setText] = useState("");
    const { proxyHttpScanModuleOptions } = useModel("HostAndSessionModel", model => ({
        proxyHttpScanModuleOptions: model.proxyHttpScanModuleOptions
    }));

    const pins = getPins();
    let proxyHttpScanModuleOptionsAuto = proxyHttpScanModuleOptions.map(record => {
        record.pin = pins.indexOf(record.loadpath);
        return { ...record };
    });

    proxyHttpScanModuleOptionsAuto.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

    const [postModuleConfigList, setPostModuleConfigList] = useState(proxyHttpScanModuleOptionsAuto);
    const [postModuleConfigListTmp, setPostModuleConfigListTmp] = useState(proxyHttpScanModuleOptionsAuto);
    const [postModuleConfigActive, setPostModuleConfigActive] = useState({
        NAME_ZH: null,
        NAME_EN: null,
        DESC_ZH: null,
        DESC_EN: null,
        WARN_ZH: null,
        WARN_EN: null,
        AUTHOR: [],
        OPTIONS: [],
        REQUIRE_SESSION: true,
        loadpath: null,
        PERMISSIONS: [],
        PLATFORM: [],
        REFERENCES: [],
        README: [],
        ATTCK: [],
        SEARCH: {
            FOFA: null, Quake: null
        }
    });

    const createProxyHttpScanReq = useRequest(postProxyHttpScanAPI, {
        manual: true, onSuccess: (result, params) => {
            closeModel();
            listData();
        }, onError: (error, params) => {
        }
    });

    const onCreateProxyHttpScan = params => {
        createProxyHttpScanReq.run({
            loadpath: postModuleConfigActive.loadpath, custom_param: JSON.stringify(params)
        });
    };

    const onPostModuleConfigListChange = postModuleConfigListState => {
        const pins = getPins();
        postModuleConfigListState.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
        setPostModuleConfigList(postModuleConfigListState);
    };

    const onPostModuleConfigListPinsChange = (postModuleConfigListState, pins) => {
        postModuleConfigListState = postModuleConfigListState.map(record => {
            record.pin = pins.indexOf(record.loadpath);
            return { ...record };
        });
        setPostModuleConfigList(postModuleConfigListState);
    };


    const handleModuleSearch = value => {
        const reg = new RegExp(value, "gi");
        onPostModuleConfigListChange(postModuleConfigListTmp.map(record => {
            let NAMEMatch = false;
            let DESCMatch = false;
            let REFERENCESMatch = false;
            try {
                NAMEMatch = record.NAME_ZH.match(reg) || record.NAME_EN.match(reg);
                DESCMatch = record.DESC_ZH.match(reg) || record.DESC_EN.match(reg);
                REFERENCESMatch = record.REFERENCES.toString().match(reg);
            } catch (error) {
            }

            if (NAMEMatch || DESCMatch || REFERENCESMatch) {
                return {
                    ...record
                };
            }
            return null;
        }).filter(record => !!record));
    };

    const moduleTypeOnChange = value => {
        if (value === undefined) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
            return;
        }
        if (value.length <= 0) {
            onPostModuleConfigListChange(postModuleConfigListTmp);
        } else {
            const newpostModuleConfigListState = postModuleConfigListTmp.filter(item => value.indexOf(item.MODULETYPE) >= 0);
            onPostModuleConfigListChange(newpostModuleConfigListState);
        }
    };


    const postModuleConfigTableColumns = [{
        dataIndex: "loadpath", render: (text, record) => {
            let selectStyles = {};
            if (record.loadpath === postModuleConfigActive.loadpath) {
                selectStyles = {
                    color: "#d89614", fontWeight: "bolder", fontSize: 15
                };
            }
            const pinIcon = record.pin > -1 ? (<StarTwoTone
                twoToneColor="#d89614"
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />) : (<StarOutlined
                onClick={() => {
                    const pins = changePin(record.loadpath);
                    onPostModuleConfigListPinsChange(postModuleConfigList, pins);
                }}
                style={{
                    marginTop: 4, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px"
                }}
            />);
            return (<div style={{ display: "inline" }}>
                {pinIcon}
                <a style={{ ...selectStyles }}>{getModuleName(record)}</a>
            </div>);
        }
    }];


    return (<Row>
        <Col span={8}>
            <Card bordered={false}>
                <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    style={{ width: "100%" }}
                    placeholder={formatText("app.runmodule.postmodule.search.ph")}
                    value={text}
                    onChange={e => {
                        setText(e.target.value);
                        handleModuleSearch(e.target.value);
                    }}
                />
                <Table
                    style={{
                        padding: "0 0 0 0",
                        marginTop: 8,
                        maxHeight: cssCalc("80vh - 128px"),
                        minHeight: cssCalc("80vh - 128px")
                    }}
                    scroll={{ y: "calc(80vh - 104px)" }}
                    rowClassName={styles.moduleTr}
                    showHeader={false}
                    onRow={record => ({
                        onClick: () => {
                            setPostModuleConfigActive(record);
                        }
                    })}
                    size="small"
                    bordered
                    pagination={false}
                    rowKey={item => item.loadpath}
                    columns={postModuleConfigTableColumns}
                    dataSource={postModuleConfigList}
                />
            </Card>
        </Col>
        <Col span={16}>
            <Tabs defaultActiveKey="params" style={{ marginTop: 12 }}>
                <TabPane
                    tab={<span><FormOutlined />{formatText("app.runmodule.postmodule.params")}</span>}
                    key="params"
                >
                    <Form
                        style={{
                            marginBottom: 16,
                            overflow: "auto",
                            maxHeight: cssCalc("80vh - 88px"),
                            minHeight: cssCalc("80vh - 88px")
                        }}
                        layout="vertical"
                        wrapperCol={{ span: 24 }}
                        onFinish={onCreateProxyHttpScan}
                    >
                        <Row>{getModuleOptions(postModuleConfigActive)}</Row>
                        <Row>
                            {getWarn(postModuleConfigActive)}
                            <Col span={22}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    disabled={postModuleConfigActive.loadpath === null}
                                    icon={<PlusOutlined />}
                                    loading={createProxyHttpScanReq.loading}
                                >{formatText("app.runmodule.postmodule.add")}</Button>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane
                    tab={<span><InfoCircleOutlined />{formatText("app.runmodule.postmodule.desc")}</span>}
                    key="desc"
                >
                    <ModuleInfoContent postModuleConfig={postModuleConfigActive} />
                </TabPane>
            </Tabs>
        </Col>
    </Row>);
};

const ProxyHttpScanModuleMemo = memo(ProxyHttpScanModule);

const ProxyHttpScanConfFormMemo = memo(ProxyHttpScanConfForm);

const ProxyHttpScan = () => {
    console.log("ProxyHttpScan");
    const [proxyHttpScanList, setProxyHttpScanList] = useState([]);
    const [runProxyHttpScanModuleModalVisable, setRunProxyHttpScanModuleModalVisable] = useState(false);
    const {
        resizeDownHeight,
    } = useModel("Resize", model => ({
        resizeDownHeight: model.resizeDownHeight,
    }));
    //初始化数据
    useRequest(getProxyHttpScanAPI, {
        onSuccess: (result, params) => {
            setProxyHttpScanList(result);
        }, onError: (error, params) => {
        }
    });

    const listProxyHttpScanReq = useRequest(getProxyHttpScanAPI, {
        manual: true, onSuccess: (result, params) => {
            setProxyHttpScanList(result);
        }, onError: (error, params) => {
        }
    });

    const createProxyHttpScanReq = useRequest(postProxyHttpScanAPI, {
        manual: true, onSuccess: (result, params) => {
            listProxyHttpScanReq.run();
        }, onError: (error, params) => {
        }
    });

    const destoryProxyHttpScanReq = useRequest(deleteProxyHttpScanAPI, {
        manual: true, onSuccess: (result, params) => {
            const { _module_uuid } = result;
            setProxyHttpScanList(proxyHttpScanList.filter(item => item._module_uuid !== _module_uuid));
        }, onError: (error, params) => {
        }
    });

    return (<Fragment>
        <DocIcon url="https://www.yuque.com/vipersec/help/bg1zvcdmg5f6q71e" />
        <Row gutter={0} style={{ marginTop: -16 }}>
            <Col span={12}>
                <Button
                    block
                    icon={<PlusOutlined />}
                    onClick={() => setRunProxyHttpScanModuleModalVisable(true)}
                >{formatText("app.runmodule.autorobot.add")}</Button>
            </Col>
            <Col span={12}>
                <Button
                    icon={<SyncOutlined />}
                    style={{
                        width: "100%"
                    }}
                    loading={listProxyHttpScanReq.loading || createProxyHttpScanReq.loading || destoryProxyHttpScanReq.loading}
                    onClick={() => listProxyHttpScanReq.run()}
                >{formatText("app.core.refresh")}</Button>
            </Col>
        </Row>
        <Row gutter={0}>
            <Col span={20}>
                <Table
                    style={{
                        padding: "0 0 0 0",
                        overflow: "auto",
                        maxHeight: cssCalc(`${resizeDownHeight} - 108px`),
                        minHeight: cssCalc(`${resizeDownHeight} - 108px`)
                    }}
                    size="small"
                    rowKey="job_id"
                    pagination={false}
                    dataSource={proxyHttpScanList}
                    bordered
                    columns={[{
                        title: formatText("app.runmodule.botmodule.module"),
                        dataIndex: "moduleinfo",
                        key: "moduleinfo",
                        width: 240,
                        render: (text, record) => (<Popover
                            placement="right"
                            content={PostModuleInfoContent(record.moduleinfo)}
                            trigger="click"
                        >
                            <a>{getModuleName(record.moduleinfo)}</a>
                        </Popover>)
                    }, {
                        title: formatText("app.runmodule.autorobot.params"),
                        dataIndex: "opts",
                        key: "opts",
                        render: (text, record) => {
                            return postModuleOpts(record.opts);
                        }
                    }, {
                        dataIndex: "operation",
                        width: 56,
                        render: (text, record) => (<div style={{ textAlign: "center" }}>
                            <a
                                style={{ color: "red" }}
                                onClick={() => destoryProxyHttpScanReq.run({ _module_uuid: record._module_uuid })}
                            >{formatText("app.core.delete")}</a>
                        </div>)
                    }]}
                />
            </Col>
            <Col span={4}>
                <Card style={{ marginTop: 0 }}>
                    <ProxyHttpScanConfFormMemo />
                </Card>
            </Col>
        </Row>
        <Modal
            mask={false}
            style={{ top: 32 }}
            width="90vw"
            destroyOnClose
            visible={runProxyHttpScanModuleModalVisable}
            onCancel={() => setRunProxyHttpScanModuleModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: "0px 0px 0px 0px" }}
        >
            <ProxyHttpScanModuleMemo
                closeModel={() => {
                    setRunProxyHttpScanModuleModalVisable(false);
                }}
                listData={() => {
                    listProxyHttpScanReq.run();
                }}
            />
        </Modal>
    </Fragment>);
};

export const ProxyHttpScanMemo = memo(ProxyHttpScan);
