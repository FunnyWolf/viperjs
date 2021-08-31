import React, { Fragment, memo, useState } from 'react';
import { useModel, useRequest } from 'umi';
import { useControllableValue, useInterval } from 'ahooks';
import {
  deleteMsgrpcJobAPI,
  deleteNoticesAPI,
  deletePostmodulePostModuleResultHistoryAPI,
  postCoreNoticesAPI,
} from '@/services/apiv1';
import { DeleteOutlined, FieldTimeOutlined, SearchOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import {
  BackTop,
  Badge,
  Button,
  Col,
  Input,
  List,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import moment from 'moment';
import { MyIcon, SidTag } from '@/pages/Core/Common';
import styles from './RealTimeCard.less';
import { Upheight } from '@/utils/utils';
import { PostModuleInfoContent } from '@/pages/Core/RunModule';

const { Text } = Typography;
const { Paragraph } = Typography;
const { Option } = Select;
const ButtonGroup = Button.Group;
const { Search, TextArea } = Input;
const { TabPane } = Tabs;

String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};

const RealTimeModuleResult = () => {
  console.log('RealTimeModuleResult');
  const {
    postModuleResultHistory,
    setPostModuleResultHistory,
    postModuleResultHistoryActive,
    setPostModuleResultHistoryActive,
  } = useModel('HostAndSessionModel', model => ({
    postModuleResultHistory: model.postModuleResultHistory,
    setPostModuleResultHistory: model.setPostModuleResultHistory,
    postModuleResultHistoryActive: model.postModuleResultHistoryActive,
    setPostModuleResultHistoryActive: model.setPostModuleResultHistoryActive,
  }));

  const [text, setText] = useState('');

  const [refresh, setRefresh] = useState(false);
  useInterval(() => setRefresh(!refresh), 60000);

  const handlePostModuleResultHistorySearch = text => {
    const reg = new RegExp(text, 'gi');
    const afterFilterList = postModuleResultHistory
      .map(record => {
        let moduleNameMatch = false;
        let resultMatch = false;
        let optsMatch = false;
        let hostMatch = false;
        const optsStr = JSON.stringify(record.opts);
        try {
          moduleNameMatch = record.module_name.match(reg);
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

  const postModuleOpts = opts => {
    let optStr = '';
    for (const key in opts) {
      optStr = `${optStr}  ${key}: ${opts[key]}`;
    }
    return <div className={styles.moduleresultoptions}>{optStr}</div>;
  };

  const deletePostModuleResultHistoryReq = useRequest(deletePostmodulePostModuleResultHistoryAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setPostModuleResultHistory([]);
      setPostModuleResultHistoryActive([]);
    },
    onError: (error, params) => {
    },
  });

  return (
    <Fragment>
      <Row style={{ marginTop: -16 }}>
        <Col span={21}>
          <Input
            allowClear
            prefix={<SearchOutlined/>}
            style={{ width: '100%' }}
            placeholder=" 主机IP/模块/参数/结果"
            value={text}
            onChange={e => {
              setText(e.target.value);
              handlePostModuleResultHistorySearch(e.target.value);
            }}
          />
        </Col>
        <Col span={3}>
          <Tooltip mouseEnterDelay={0.3} title="清空结果">
            <Button
              block
              danger
              onClick={() => deletePostModuleResultHistoryReq.run()}
              icon={<DeleteOutlined/>}
            >
              清空
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <List
        id="moduleresultlist"
        bordered
        className={styles.moduleresultlist}
        itemLayout="vertical"
        size="small"
        dataSource={postModuleResultHistoryActive}
        renderItem={item => (
          <List.Item key={item.id} style={{ padding: '4px 0px 0px 4px' }}>
            <div>
              <Tooltip title={moment(item.update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}>
                <Tag style={{ width: '68px' }} color="cyan">
                  {moment(item.update_time * 1000).fromNow()}
                </Tag>
              </Tooltip>
              <strong
                style={{
                  color: '#642ab5',
                }}
              >
                {item.module_name}
              </strong>
              <strong
                style={{
                  color: '#d8bd14',
                  width: 120,
                  marginLeft: 8,
                }}
              >
                {item.ipaddress}
              </strong>
            </div>
            <div
              style={{
                marginTop: 0,
              }}
            >
              {postModuleOpts(item.opts)}
            </div>
            <Row>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowX: 'hidden',
                    padding: '0 0 0 0',
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  {item.result}
                </pre>
            </Row>
          </List.Item>
        )}
      >
        <BackTop
          style={{
            top: 'calc({0} + 112px)'.format(Upheight),
            right: 'calc(41vw + 32px)',
          }}
          target={() => document.getElementById('moduleresultlist')}
        >
          <div
            style={{
              height: 40,
              width: 40,
              lineHeight: '40px',
              borderRadius: 4,
              backgroundColor: 'rgba(64, 64, 64, 0.6)',
              color: '#fff',
              textAlign: 'center',
              fontSize: 14,
            }}
          >
            <VerticalAlignTopOutlined/>
          </div>
        </BackTop>
      </List>

    </Fragment>
  );
};
export const RealTimeModuleResultMemo = memo(RealTimeModuleResult);

const KeyToUserIcon = {
  '0': 'icon-yuanxingbaoshi',
  '1': 'icon-sanjiaobaoshi',
  '2': 'icon-shuidibaoshi',
  '3': 'icon-liujiaobaoshi',
  '4': 'icon-lingxingbaoshi',
  '5': 'icon-duojiaobaoshi',
};
// 单独独立出来是为了不丢失焦点
const UserInput = props => {
  const [text, onInputChange] = useControllableValue(
    {},
    {
      defaultValue: '',
    },
  );
  const userIcon = key => {
    return (
      <MyIcon
        type={KeyToUserIcon[key]}
        style={{
          padding: '0px 0px 0px 0px',
          marginBottom: 0,
          marginTop: 0,
          marginLeft: -4,
          marginRight: 4,
          fontSize: '18px',
        }}
      />
    );
  };
  const getUserIconKey = () => {
    let key = '0';
    if (localStorage.getItem('UserIcon') === null) {
      localStorage.setItem('UserIcon', '0');
    } else {
      key = localStorage.getItem('UserIcon');
    }
    return key;
  };
  const [iconkey, setIconkey] = useState(getUserIconKey());
  const PrefixIcon = () => {
    const onChange = e => {
      console.log('radio checked', e.target.value);
      setIconkey(e.target.value);
      localStorage.setItem('UserIcon', e.target.value);
    };
    return (
      <Popover
        content={
          <Radio.Group onChange={onChange} value={getUserIconKey()}>
            <Radio value="0">{userIcon('0')}</Radio>
            <Radio value="1">{userIcon('1')}</Radio>
            <Radio value="2">{userIcon('2')}</Radio>
            <Radio value="3">{userIcon('3')}</Radio>
            <Radio value="4">{userIcon('4')}</Radio>
            <Radio value="5">{userIcon('5')}</Radio>
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
      style={{ width: '100%' }}
      placeholder="发送消息"
      value={text}
      prefix={<PrefixIcon/>}
      onPressEnter={() => {
        props.createNotice({ userkey: iconkey, content: text });
        onInputChange('');
      }}
      onChange={e => onInputChange(e.target.value)}
    />
  );
};

const RealTimeNotices = () => {
  console.log('RealTimeNotices');

  const { notices, setNotices } = useModel('HostAndSessionModel', model => ({
    notices: model.notices,
    setNotices: model.setNotices,
  }));
  const [refresh, setRefresh] = useState(false);
  useInterval(() => setRefresh(!refresh), 60000);

  const userIconLarge = key => {
    return (
      <MyIcon
        type={KeyToUserIcon[key]}
        style={{
          fontSize: '18px',
        }}
      />
    );
  };

  const NoticesList = props => {
    const getContent = item => {
      if (item.level === 0) {
        return (
          <Text style={{ color: '#49aa19' }} className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 1) {
        return (
          <Text style={{ color: '#13a8a8' }} className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 2) {
        return (
          <Text type="warning" className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 3) {
        return (
          <Text type="danger" className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 4) {
        return (
          <Text mark className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 5) {
        // 提醒
        return (
          <Text style={{ color: '#642ab5' }} className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 6) {
        // 用户输入
        return (
          <Text style={{ color: '#cb2b83' }} className={styles.wordBreakClass}>
            <Space>
              {userIconLarge(item.userkey)}
              {item.content}
              {userIconLarge(item.userkey)}
            </Space>
          </Text>
        );
      }
      return (
        <Text type="warning" className={styles.wordBreakClass}>
          {item.content}
        </Text>
      );
    };
    return (
      <List
        id="noticescard"
        className={styles.noticelist}
        split={false}
        size="small"
        bordered
        itemLayout="horizontal"
        dataSource={props.notices}
        renderItem={item => (
          <List.Item style={{ padding: '0px 0px 0px 0px' }}>
            <div
              style={{
                display: 'inline',
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <Tooltip title={moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')}>
                <Tag
                  color="cyan"
                  style={{
                    marginLeft: -1,
                    width: 68,
                    marginRight: 4,
                  }}
                >
                  {moment(item.time * 1000).fromNow()}
                </Tag>
              </Tooltip>
              {getContent(item)}
            </div>
          </List.Item>
        )}
      >
        <BackTop
          style={{
            top: 'calc({0} + 112px)'.format(Upheight),
            right: 24,
          }}
          target={() => document.getElementById('noticescard')}
        >
          <div
            style={{
              height: 40,
              width: 40,
              lineHeight: '40px',
              borderRadius: 4,
              backgroundColor: 'rgba(64, 64, 64, 0.6)',
              color: '#fff',
              textAlign: 'center',
              fontSize: 14,
            }}
          >
            <VerticalAlignTopOutlined/>
          </div>
        </BackTop>
      </List>
    );
  };
  const createNoticeReq = useRequest(postCoreNoticesAPI, {
    manual: true,
    onSuccess: (result, params) => {
      // notices.unshift(result);
      // setNotices(notices);
    },
    onError: (error, params) => {
    },
  });

  const deleteNoticesReq = useRequest(deleteNoticesAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setNotices([]);
    },
    onError: (error, params) => {
    },
  });

  return (
    <Fragment>
      <Row style={{ marginTop: -16 }}>
        <Col span={20}>
          <UserInput createNotice={params => createNoticeReq.run(params)}/>
        </Col>
        <Col span={4}>
          <Tooltip mouseEnterDelay={0.3} title="清空日志">
            <Button icon={<DeleteOutlined/>} block danger onClick={() => deleteNoticesReq.run()}>
              清空
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <NoticesList notices={notices}/>
    </Fragment>
  );
};

export const RealTimeNoticesMemo = memo(RealTimeNotices);

const RealTimeJobs = () => {
  console.log('RealTimeJobs');
  const { jobList, setJobList } = useModel('HostAndSessionModel', model => ({
    jobList: model.jobList,
    setJobList: model.setJobList,
  }));

  const destoryJobReq = useRequest(deleteMsgrpcJobAPI, {
    manual: true,
    onSuccess: (result, params) => {
      const { uuid } = result;
      setJobList(jobList.filter(item => item.uuid !== uuid));
    },
    onError: (error, params) => {
    },
  });

  const onDestoryJob = record => {
    destoryJobReq.run({ uuid: record.uuid, job_id: record.job_id, broker: record.broker });
  };

  return (
    <Table
      style={{ marginTop: -16 }}
      className={styles.jobListTable}
      size="small"
      rowKey="job_id"
      pagination={false}
      dataSource={jobList}
      bordered
      columns={[
        {
          title: '开始时间',
          dataIndex: 'time',
          key: 'time',
          width: 80,
          render: (text, record) => <Tag color="cyan">{moment(record.time * 1000).fromNow()}</Tag>,
        },
        {
          title: '模块',
          dataIndex: 'moduleinfo',
          key: 'moduleinfo',
          width: 240,
          render: (text, record) => (
            <Popover
              placement="right"
              content={PostModuleInfoContent(record.moduleinfo)}
              trigger="click"
            >
              <a>{record.moduleinfo.NAME}</a>
            </Popover>
          ),
        },
        {
          title: 'SID',
          dataIndex: 'time',
          key: 'time',
          width: 48,
          render: (text, record) => {
            return SidTag(record.moduleinfo._sessionid);
          },
        },
        {
          title: '参数',
          dataIndex: 'moduleinfo',
          key: 'moduleinfo',
          render: (text, record) => {
            const component = [];
            for (const key in record.moduleinfo._custom_param) {
              const item = record.moduleinfo._custom_param[key];
              component.push(
                <span>
                  {' '}
                  <strong>{key}: </strong>
                  {item}{' '}
                </span>,
              );
            }
            return <Fragment>{component}</Fragment>;
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 48,
          render: (text, record) => (
            <a style={{ color: 'red' }} onClick={() => onDestoryJob(record)}>
              删除
            </a>
          ),
        },
      ]}
    />
  );
};

export const RealTimeJobsMemo = memo(RealTimeJobs);

const TaskQueueTag = () => {
  console.log('TaskQueueTag');
  const { taskQueueLength } = useModel('HostAndSessionModel', model => ({
    taskQueueLength: model.taskQueueLength,
  }));
  if (taskQueueLength > 0) {
    return (
      <Badge
        showZero
        style={{
          marginTop: -4,
          marginLeft: -4,
          marginRight: 10,
          color: '#73d13d',
          backgroundColor: '#092b00',
          boxShadow: '0 0 0 1px #237804 inset',
        }}
        count={taskQueueLength}
      />
    );
  } else {
    return <FieldTimeOutlined/>;
  }
};
export const TaskQueueTagMemo = memo(TaskQueueTag);
