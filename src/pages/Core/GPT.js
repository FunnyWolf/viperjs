import {useModel} from "@@/plugin-model/useModel";
import {formatText, getModuleDesc, getModuleName} from "@/utils/locales";
import React, {memo, useEffect, useRef, useState} from "react";
import {
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FunctionOutlined,
  LoadingOutlined,
  OpenAIOutlined,
  SendOutlined,
  StarOutlined,
  StarTwoTone,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {Badge, Button, Card, Col, Descriptions, Flex, Input, List, Popover, Row, Space, Table, Tag, Typography} from "antd-v5";
import {cssCalc} from "@/utils/utils";
import {changePin, getPins} from "@/pages/Core/RunModule";
import {HostIP} from '@/config'
import {getToken} from '@/utils/authority'
import {useRequest} from '@@/plugin-request/request'
import {deleteLLMModuleAPI, postLLMModuleAPI} from '@/services/apiv1'
import {useInterval} from 'ahooks'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const {Title, Paragraph, Text, Link} = Typography;
let webHost = HostIP + ":8002";
let protocol = "ws://";
if (process.env.NODE_ENV === "production") {
  webHost = location.hostname + (location.port ? `:${location.port}` : "");
  protocol = "wss://";
}

const {Search, TextArea} = Input;

const ModuleInfoContent = (record) => {
  const readme = record.README;
  const readmeCom = [];
  for (let i = 0; i < readme.length; i++) {
    readmeCom.push(<div>
      <a href={readme[i]} target="_blank">
        {readme[i]}
      </a>
    </div>);
  }
  const references = record.REFERENCES;
  const referencesCom = [];
  for (let i = 0; i < references.length; i++) {
    referencesCom.push(<div>
      <a href={references[i]} target="_blank">
        {references[i]}
      </a>
    </div>);
  }

  const authors = record.AUTHOR;
  const authorCom = [];
  for (let i = 0; i < authors.length; i++) {
    authorCom.push(<Tag color="lime">{authors[i]}</Tag>);
  }
  const tags = record.TAGS;
  const tagCom = [];
  for (let i = 0; i < tags.length; i++) {
    tagCom.push(<Tag color="geekblue">{tags[i]}</Tag>);
  }
  return (<Descriptions
    size="small"
    style={{
      padding: 0, margin: 0,
    }}
    column={12}
    bordered
  >
    <Descriptions.Item label={formatText("app.runmodule.postmodule.NAME")}
                       span={12}>
      {getModuleName(record)}
    </Descriptions.Item>
    <Descriptions.Item
      label={formatText("app.runmodule.postmodule.tags")} span={12}>
      {tagCom}
    </Descriptions.Item>
    <Descriptions.Item
      label={formatText("app.runmodule.postmodule.authorCom")} span={12}>
      {authorCom}
    </Descriptions.Item>
    <Descriptions.Item
      label={formatText("app.runmodule.postmodule.readmeCom")} span={12}>
      {readmeCom}
    </Descriptions.Item>
    <Descriptions.Item
      label={formatText("app.runmodule.postmodule.referencesCom")} span={12}>
      {referencesCom}
    </Descriptions.Item>
    <Descriptions.Item
      span={12}
      label={formatText("app.runmodule.postmodule.DESC")}>
          <pre
            style={{
              whiteSpace: "pre-wrap", overflowX: "hidden", padding: "0 0 0 0",
            }}
          >{getModuleDesc(record)}</pre>
    </Descriptions.Item>
  </Descriptions>);
};

export const VGPT = props => {
  console.log("RunWebModule");
  const ws_llm_module = useRef(null);

  const {llmModuleOptions} = useModel("HostAndSessionModel", model => ({
    llmModuleOptions: model.llmModuleOptions,
  }));

  const {
    resizeDownHeight,
  } = useModel('Resize', model => ({
    resizeDownHeight: model.resizeDownHeight,
  }));

  const [llmModuleConfigList, setLlmModuleConfigList] = useState(llmModuleOptions);
  const [llmModuleConfigActive, setLlmModuleConfigActive] = useState({
    NAME_ZH: null, NAME_EN: null, DESC_ZH: null, DESC_EN: null, AUTHOR: [], OPTIONS: [], loadpath: null, REFERENCES: [], README: [], TAGS: [],
  });
  const [websocketAlive, setWebsocketAlive] = useState(true);
  const [messageList, setMessageList] = useState([]);

  const [userInputValue, setUserInputValue] = useState(null);
  const [moduleRunning, setModuleRunning] = useState(false);
  useEffect(() => {
    const element = document.getElementById('message_history_list');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messageList]);

  const pins = getPins();
  llmModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

  const destoryLLMModuleReq = useRequest(deleteLLMModuleAPI, {
    manual: true, onSuccess: (result, params) => {
      setMessageList([])
    }, onError: (error, params) => {
    },
  })

  const createLLMModuleReq = useRequest(postLLMModuleAPI, {
    manual: true, onSuccess: (result, params) => {
    }, onError: (error, params) => {
    },
  })

  const onPostModuleConfigListChange = botModuleConfigList => {
    const pins = getPins();
    botModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
    setLlmModuleConfigList(botModuleConfigList);
  };

  const handleModuleSearch = value => {
    const reg = new RegExp(value, "gi");
    onPostModuleConfigListChange(llmModuleOptions.map(record => {
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
          ...record,
        };
      }
      return null;
    }).filter(record => !!record));
  };

  const postModuleConfigTableColumns = [
    {
      dataIndex: "loadpath", render: (text, record) => {
        const pins = getPins();
        const pinIcon = pins.indexOf(record.loadpath) > -1 ? (<StarTwoTone
          twoToneColor="#d89614"
          onClick={() => {
            const newpins = changePin(record.loadpath);
            onPostModuleConfigListChange(llmModuleConfigList);
          }}
          style={{
            marginTop: 3, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px",
          }}
        />) : (<StarOutlined
          onClick={() => {
            const newpins = changePin(record.loadpath);
            onPostModuleConfigListChange(llmModuleConfigList);
          }}
          style={{
            marginTop: 3, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px",
          }}
        />);

        let selectStyles = {};
        if (record.loadpath === llmModuleConfigActive.loadpath) {
          selectStyles = {
            color: "#d89614", fontWeight: "bolder",
          };
        }
        return (<div
          style={{
            display: "inline",
          }}
        >
          {pinIcon}
          <a style={{marginLeft: 4, ...selectStyles}}>{getModuleName(record)}</a>
          <Popover content={() => ModuleInfoContent(record)} placement="right">
            <ExclamationCircleOutlined
              style={{
                marginTop: 3, marginRight: 8, float: "right", fontSize: "18px",
              }}
            />
          </Popover>
        </div>);
      },
    }];

  const ListItem = (item, index) => {

    const card_styles = {body: {padding: "12px 12px 0px 12px", maxWidth: cssCalc("75vw - 80px")}}

    const avatar_dict = {
      human: <UserOutlined style={{fontSize: '24px'}}/>,
      ai: <OpenAIOutlined style={{fontSize: '24px'}}/>,
      tool: <ToolOutlined style={{fontSize: '24px'}}/>,
      function: <FunctionOutlined style={{fontSize: '24px'}}/>,
    }
    let title = null
    if (item.type === "human") {
      title = <Flex justify="flex-end" align="flex-end" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
        {avatar_dict[item.type]}
        <Card
          style={{backgroundColor: "#434343"}}
          styles={card_styles}
        >
          <pre>{item.data.content}</pre>
        </Card>
      </Flex>
    } else if (item.type === "ai") {
      let token = item.data.usage_metadata.total_tokens
      let tool_calls = item.data.tool_calls
      // tool call
      if (tool_calls !== undefined && tool_calls.length !== 0) {
        let tool_calls = item.data.tool_calls;
        title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
          <Space>{avatar_dict["function"]}<Badge count={token} overflowCount={9999} color="#389e0d"/></Space>
          <Card
            styles={card_styles}
          >
            <pre style={{opacity: 0.5}}>{JSON.stringify(tool_calls)}</pre>
          </Card>
        </Flex>
        // man in loop特殊处理
        if (index === (messageList.length - 1)) {
          title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
            <Space>
              {avatar_dict["function"]}
              <Badge count={token} overflowCount={9999} color="#389e0d"/>
              {/*<Button icon={<CheckOutlined/>} style={{ marginTop: 16 }} ghost={true} onClick={() => handleUserDecision(true)}/>*/}
            </Space>
            <Card
              styles={card_styles}
            >
              <pre style={{opacity: 0.5}}>{JSON.stringify(tool_calls)}</pre>
            </Card>
          </Flex>
        } else {
          title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
            <Space>{avatar_dict["function"]}<Badge count={token} overflowCount={9999} color="#389e0d"/></Space>
            <Card
              styles={card_styles}
            >
              <pre style={{opacity: 0.5}}>{JSON.stringify(tool_calls)}</pre>
            </Card>
          </Flex>
        }
      } else { // normal ai message
        title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
          <Space>{avatar_dict[item.type]}<Badge count={token} overflowCount={9999} color="#389e0d"/></Space>
          <Card
            styles={card_styles}
          >
            <Markdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {item.data.content}
            </Markdown>
          </Card>
        </Flex>
      }
    } else if (item.type === "tool") {
      title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
        {avatar_dict[item.type]}
        <Card
          styles={card_styles}
        >
          <pre style={{opacity: 0.5}}>{JSON.stringify({name: item.data.name, content: item.data.content})}</pre>
        </Card>
      </Flex>
    } else if (item.type === "status") {
      if (index === (messageList.length - 1)) {
        if (item.data.content === "running") {
          setModuleRunning(true)
        } else {
          setModuleRunning(false)
        }
      }
    } else {
      title = <pre>{item.data.content}</pre>
    }
    return title
  }

  function changeActiveModule(record) {
    setLlmModuleConfigActive(record);
    setWebSocket(record);
  }

  function setWebSocket(record) {
    setWebsocketAlive(false)
    const urlpatternsMsf = "/ws/v1/websocket/llmmodule/?";
    try {
      ws_llm_module.current.close();
    } catch (error) {
    }
    try {
      ws_llm_module.current = null;
    } catch (error) {
    }

    const urlargs = `token=${getToken()}&loadpath=${record.loadpath}`;
    const socketUrlMsf = protocol + webHost + urlpatternsMsf + urlargs;

    ws_llm_module.current = new WebSocket(socketUrlMsf);

    ws_llm_module.current.onmessage = event => {
      const recv_message = JSON.parse(event.data);
      if (Array.isArray(recv_message)) {
        setMessageList(recv_message);
      } else {
        setMessageList(prevItems => [...prevItems, recv_message]);
      }
    };
    ws_llm_module.current.onopen = () => {
      setWebsocketAlive(true);
    };
    ws_llm_module.current.onclose = CloseEvent => {
      setWebsocketAlive(false);
    };
    ws_llm_module.current.onerror = ErrorEvent => {
      setWebsocketAlive(false);
    };
  }

  function handleUserInput(e) {
    let message = {user_input: e.target.value}
    setUserInputValue(null)
    // setMessageList(prevItems => [...prevItems, message]);
    createLLMModuleReq.run({message: message, loadpath: llmModuleConfigActive.loadpath});
    // ws_llm_module.current.send(JSON.stringify(message))
  }

  function handleUserDecision(decision) {
    let message = {user_decision: decision}
    createLLMModuleReq.run({message: message, loadpath: llmModuleConfigActive.loadpath});
  }

  const heartbeatmonitor = () => {
    if (llmModuleConfigActive.loadpath !== null) {
      if (ws_llm_module.current !== undefined && ws_llm_module.current !== null && ws_llm_module.current.readyState === WebSocket.OPEN) {
      } else {
        setWebSocket(llmModuleConfigActive);
      }
    }
  };
  useInterval(() => heartbeatmonitor(), 3000);

  return (<Row gutter={0}>
      <Col span={6}>
        <Search
          placeholder={formatText("app.runmodule.postmodule.searchmodule.ph")}
          onSearch={value => handleModuleSearch(value)}
        />
        <Table
          style={{
            padding: "0 0 0 0", maxHeight: cssCalc("100vh - 560px"), minHeight: cssCalc("100vh - 560px"),
          }}
          scroll={{y: "calc(100vh - 120px)"}}
          showHeader={false}
          onRow={record => ({
            onClick: () => {
              if (record.loadpath !== llmModuleConfigActive.loadpath) {
                changeActiveModule(record);
              }
            },
          })}
          size="small"
          bordered
          pagination={false}
          rowKey={item => item.loadpath}
          rowSelection={undefined}
          columns={postModuleConfigTableColumns}
          dataSource={llmModuleConfigList}
        />
      </Col>
      <Col span={18}>
        <div style={{marginLeft: 32, marginRight: 32}}>
          <List
            id="message_history_list"
            style={{
              overflow: "auto",
              maxHeight: cssCalc(`${resizeDownHeight} - 64px`), minHeight: cssCalc(`${resizeDownHeight} - 64px`),
              marginTop: 8,
            }}
            loading={!websocketAlive}
            split={false}
            itemLayout="horizontal"
            dataSource={messageList}
            renderItem={(item, index) => (ListItem(item, index))}
          />
          <Flex style={{marginTop: 8}} vertical={false}>
            <Input
              disabled={llmModuleConfigActive.loadpath === null}
              size="large"
              value={userInputValue}
              suffix={moduleRunning ? <LoadingOutlined/> : <SendOutlined/>}
              onChange={(e) => setUserInputValue(e.target.value)}
              onPressEnter={(e) => handleUserInput(e)}
            />
            <Button
              disabled={llmModuleConfigActive.loadpath === null || !websocketAlive}
              style={{width: 96}}
              size="large"
              // loading={moduleRunning}
              icon={<DeleteOutlined/>}
              onClick={() => {
                destoryLLMModuleReq.run({loadpath: llmModuleConfigActive.loadpath})
              }}
            />
          </Flex>
        </div>
      </Col>
    </Row>
  );
};

export const VGPTWindow = props => {
  console.log("RunWebModule");
  const ws_llm_module = useRef(null);

  const {llmModuleOptions} = useModel("HostAndSessionModel", model => ({
    llmModuleOptions: model.llmModuleOptions,
  }));

  const [llmModuleConfigList, setLlmModuleConfigList] = useState(llmModuleOptions);
  const [llmModuleConfigActive, setLlmModuleConfigActive] = useState({
    NAME_ZH: null, NAME_EN: null, DESC_ZH: null, DESC_EN: null, AUTHOR: [], OPTIONS: [], loadpath: null, REFERENCES: [], README: [], TAGS: [],
  });
  const [websocketAlive, setWebsocketAlive] = useState(true);
  const [messageList, setMessageList] = useState([]);

  const [userInputValue, setUserInputValue] = useState(null);
  const [moduleRunning, setModuleRunning] = useState(false);
  useEffect(() => {
    const element = document.getElementById('message_history_list');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messageList]);

  const pins = getPins();
  llmModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

  const destoryLLMModuleReq = useRequest(deleteLLMModuleAPI, {
    manual: true, onSuccess: (result, params) => {
      setMessageList([])
    }, onError: (error, params) => {
    },
  })

  const createLLMModuleReq = useRequest(postLLMModuleAPI, {
    manual: true, onSuccess: (result, params) => {
    }, onError: (error, params) => {
    },
  })

  const onPostModuleConfigListChange = botModuleConfigList => {
    const pins = getPins();
    botModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
    setLlmModuleConfigList(botModuleConfigList);
  };

  const handleModuleSearch = value => {
    const reg = new RegExp(value, "gi");
    onPostModuleConfigListChange(llmModuleOptions.map(record => {
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
          ...record,
        };
      }
      return null;
    }).filter(record => !!record));
  };

  const postModuleConfigTableColumns = [
    {
      dataIndex: "loadpath", render: (text, record) => {
        const pins = getPins();
        const pinIcon = pins.indexOf(record.loadpath) > -1 ? (<StarTwoTone
          twoToneColor="#d89614"
          onClick={() => {
            const newpins = changePin(record.loadpath);
            onPostModuleConfigListChange(llmModuleConfigList);
          }}
          style={{
            marginTop: 3, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px",
          }}
        />) : (<StarOutlined
          onClick={() => {
            const newpins = changePin(record.loadpath);
            onPostModuleConfigListChange(llmModuleConfigList);
          }}
          style={{
            marginTop: 3, marginLeft: 4, marginRight: 8, float: "left", fontSize: "18px",
          }}
        />);

        let selectStyles = {};
        if (record.loadpath === llmModuleConfigActive.loadpath) {
          selectStyles = {
            color: "#d89614", fontWeight: "bolder",
          };
        }
        return (<div
          style={{
            display: "inline",
          }}
        >
          {pinIcon}
          <a style={{marginLeft: 4, ...selectStyles}}>{getModuleName(record)}</a>
          <Popover content={() => ModuleInfoContent(record)} placement="right">
            <ExclamationCircleOutlined
              style={{
                marginTop: 3, marginRight: 8, float: "right", fontSize: "18px",
              }}
            />
          </Popover>
        </div>);
      },
    }];

  const ListItem = (item, index) => {

    const card_styles = {body: {padding: "12px 12px 0px 12px"}}

    const avatar_dict = {
      human: <UserOutlined style={{fontSize: '24px'}}/>,
      ai: <OpenAIOutlined style={{fontSize: '24px'}}/>,
      tool: <ToolOutlined style={{fontSize: '24px'}}/>,
      function: <FunctionOutlined style={{fontSize: '24px'}}/>,
    }
    let title = null
    if (item.type === "human") {
      title = <Flex justify="flex-end" align="flex-end" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
        {avatar_dict[item.type]}
        <Card
          style={{backgroundColor: "#434343"}}
          styles={card_styles}
        >
          <pre>{item.data.content}</pre>
        </Card>
      </Flex>
    } else if (item.type === "ai") {
      let token = item.data.usage_metadata.total_tokens
      let tool_calls = item.data.tool_calls
      // tool call
      if (tool_calls !== undefined && tool_calls.length !== 0) {
        let tool_calls = item.data.tool_calls;
        title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
          <Space>{avatar_dict["function"]}<Badge count={token} overflowCount={9999} color="#389e0d"/></Space>
          <Card
            styles={card_styles}
          >
            <pre style={{opacity: 0.5}}>{JSON.stringify(tool_calls)}</pre>
          </Card>
        </Flex>
        // man in loop特殊处理
        if (index === (messageList.length - 1)) {
          title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
            <Space>{avatar_dict["function"]}<Badge count={token} overflowCount={9999} color="#389e0d"/></Space>
            <Card
              styles={card_styles}
            >
              <pre style={{opacity: 0.5}}>{JSON.stringify(tool_calls)}</pre>
            </Card>
            <Button icon={<CheckOutlined/>} style={{marginTop: 16}} ghost={true} onClick={() => handleUserDecision(true)}/>
          </Flex>
        } else {
          title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
            <Space>{avatar_dict["function"]}<Badge count={token} overflowCount={9999} color="#389e0d"/></Space>
            <Card
              styles={card_styles}
            >
              <pre style={{opacity: 0.5}}>{JSON.stringify(tool_calls)}</pre>
            </Card>
          </Flex>
        }
      } else { // normal ai message
        title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
          <Space>{avatar_dict[item.type]}<Badge count={token} overflowCount={9999} color="#389e0d"/></Space>
          <Card
            styles={card_styles}
          >
            <Markdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {item.data.content}
            </Markdown>
          </Card>
        </Flex>
      }
    } else if (item.type === "tool") {
      title = <Flex justify="flex-start" align="flex-start" gap={2} vertical={true} style={{marginRight: 8, marginBottom: 8}}>
        {avatar_dict[item.type]}
        <Card
          styles={card_styles}
        >
          <pre style={{opacity: 0.5}}>{JSON.stringify({name: item.data.name, content: item.data.content})}</pre>
        </Card>
      </Flex>
    } else if (item.type === "status") {
      if (index === (messageList.length - 1)) {
        if (item.data.content === "running") {
          setModuleRunning(true)
        } else {
          setModuleRunning(false)
        }
      }
    } else {
      title = <pre>{item.data.content}</pre>
    }
    return title
  }

  function changeActiveModule(record) {
    setLlmModuleConfigActive(record);
    setWebSocket(record);
  }

  function setWebSocket(record) {
    setWebsocketAlive(false)
    const urlpatternsMsf = "/ws/v1/websocket/llmmodule/?";
    try {
      ws_llm_module.current.close();
    } catch (error) {
    }
    try {
      ws_llm_module.current = null;
    } catch (error) {
    }

    const urlargs = `token=${getToken()}&loadpath=${record.loadpath}`;
    const socketUrlMsf = protocol + webHost + urlpatternsMsf + urlargs;

    ws_llm_module.current = new WebSocket(socketUrlMsf);

    ws_llm_module.current.onmessage = event => {
      const recv_message = JSON.parse(event.data);
      if (Array.isArray(recv_message)) {
        setMessageList(recv_message);
      } else {
        setMessageList(prevItems => [...prevItems, recv_message]);
      }
    };
    ws_llm_module.current.onopen = () => {
      setWebsocketAlive(true);
    };
    ws_llm_module.current.onclose = CloseEvent => {
      setWebsocketAlive(false);
    };
    ws_llm_module.current.onerror = ErrorEvent => {
      setWebsocketAlive(false);
    };
  }

  function handleUserInput(e) {
    let message = {user_input: e.target.value}
    setUserInputValue(null)
    // setMessageList(prevItems => [...prevItems, message]);
    createLLMModuleReq.run({message: message, loadpath: llmModuleConfigActive.loadpath});
    // ws_llm_module.current.send(JSON.stringify(message))
  }

  function handleUserDecision(decision) {
    let message = {user_decision: decision}
    createLLMModuleReq.run({message: message, loadpath: llmModuleConfigActive.loadpath});
  }

  const heartbeatmonitor = () => {
    if (llmModuleConfigActive.loadpath !== null) {
      if (ws_llm_module.current !== undefined && ws_llm_module.current !== null && ws_llm_module.current.readyState === WebSocket.OPEN) {
      } else {
        setWebSocket(llmModuleConfigActive);
      }
    }
  };
  useInterval(() => heartbeatmonitor(), 3000);

  return (<Row gutter={0}>
      <Col span={6}>
        <Search
          placeholder={formatText("app.runmodule.postmodule.searchmodule.ph")}
          onSearch={value => handleModuleSearch(value)}
        />
        <Table
          style={{
            padding: "0 0 0 0", maxHeight: cssCalc("80vh - 64px"), minHeight: cssCalc("80vh - 64px"),
          }}
          scroll={{y: "calc(80vh - 120px)"}}
          showHeader={false}
          onRow={record => ({
            onClick: () => {
              if (record.loadpath !== llmModuleConfigActive.loadpath) {
                changeActiveModule(record);
              }
            },
          })}
          size="small"
          bordered
          pagination={false}
          rowKey={item => item.loadpath}
          rowSelection={undefined}
          columns={postModuleConfigTableColumns}
          dataSource={llmModuleConfigList}
        />
      </Col>
      <Col span={18}>
        <div style={{marginLeft: 16, marginRight: 16}}>
          <List
            id="message_history_list"
            style={{
              overflow: "auto",
              maxHeight: cssCalc("100vh - 64px"),
              minHeight: cssCalc("100vh - 64px"),
              marginTop: 8,
            }}
            loading={!websocketAlive}
            split={false}
            itemLayout="horizontal"
            dataSource={messageList}
            renderItem={(item, index) => (ListItem(item, index))}
          />
          <Flex style={{marginTop: 8}} vertical={false}>
            <Input
              disabled={llmModuleConfigActive.loadpath === null}
              size="large"
              value={userInputValue}
              suffix={moduleRunning ? <LoadingOutlined/> : <SendOutlined/>}
              onChange={(e) => setUserInputValue(e.target.value)}
              onPressEnter={(e) => handleUserInput(e)}
            />
            <Button
              disabled={llmModuleConfigActive.loadpath === null || !websocketAlive}
              style={{width: 96}}
              size="large"
              // loading={moduleRunning}
              icon={<DeleteOutlined/>}
              onClick={() => {
                destoryLLMModuleReq.run({loadpath: llmModuleConfigActive.loadpath})
              }}
            />
          </Flex>
        </div>
      </Col>
    </Row>
  );
};

export const VGPTMemo = memo(VGPT);
export const VGPTWindowMemo = memo(VGPTWindow);
