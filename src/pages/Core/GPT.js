import { useModel } from "@@/plugin-model/useModel";
import { formatText, getModuleDesc, getModuleName } from "@/utils/locales";
import React, { memo, useRef, useState } from "react";
import { DeleteOutlined, ExclamationCircleOutlined, SendOutlined, StarOutlined, StarTwoTone } from "@ant-design/icons";
import { Button, Col, Descriptions, Flex, Input, List, Popover, Radio, Row, Table, Tag } from "antd-v5";
import { cssCalc } from "@/utils/utils";
import { changePin, getPins } from "@/pages/Core/RunModule";
import { MyIcon } from '@/pages/Core/Common'
import { Popconfirm } from 'antd'
import { HostIP } from '@/config'
import { getToken } from '@/utils/authority'

let webHost = HostIP + ":8002";
let protocol = "ws://";
if (process.env.NODE_ENV === "production") {
  webHost = location.hostname + (location.port ? `:${location.port}` : "");
  protocol = "wss://";
}

const { Search, TextArea } = Input;

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

  const { llmModuleOptions } = useModel("HostAndSessionModel", model => ({
    llmModuleOptions: model.llmModuleOptions,
  }));

  const {
    resizeDownHeight,
  } = useModel('Resize', model => ({
    resizeDownHeight: model.resizeDownHeight,
  }));

  const [llmModuleConfigList, setLlmModuleConfigList] = useState(llmModuleOptions);
  const [llmModuleConfigActive, setLlmModuleConfigActive] = useState({
    NAME_ZH: null, NAME_EN: null, DESC_ZH: null, DESC_EN: null, AUTHOR: [], OPTIONS: [], loadpath: null, REFERENCES: [], README: [],
  });

  const [messageList, setMessageList] = useState([]);

  const [userInputValue, setUserInputValue] = useState(null);

  const pins = getPins();
  llmModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

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

  const moduleTypeOnChange = value => {
    if (value === undefined) {
      onPostModuleConfigListChange(llmModuleOptions);
      return;
    }
    if (value.length <= 0) {
      onPostModuleConfigListChange(llmModuleOptions);
    } else {
      const newpostModuleConfigListState = llmModuleOptions.filter(item => value.indexOf(item.MODULETYPE) >= 0);
      onPostModuleConfigListChange(newpostModuleConfigListState);
    }
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
          <a style={{ marginLeft: 4, ...selectStyles }}>{getModuleName(record)}</a>
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

  const ListItem = (item) => {
    const avatar_dict = {
      Human: <MyIcon type="icon-heike" style={{ fontSize: '24px' }}/>, AI: <MyIcon type="icon-rengongzhineng1" style={{ fontSize: '24px' }}/>,
    }
    return <List.Item>
      <List.Item.Meta
        avatar={avatar_dict[item.role]}
        title={<pre>{item.message}</pre>}
      />
    </List.Item>
  }

  function changeActiveModule (record) {
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
    setLlmModuleConfigActive(record);
  }

  function handleUserInput (e) {
    let message = { role: "Human", message: e.target.value }
    setUserInputValue(null)
    setMessageList(prevItems => [...prevItems, message]);

    ws_llm_module.current.send(JSON.stringify(message))
  }

  const data = [
    {
      role: 'Human', message: 'Ant Design Title 1',
    }, {
      role: 'AI',
      message: 'just for test\njust for testjust for testjust for testjust for testjust for test\njust for test111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
    }, {
      role: 'Human', message: 'Ant Design Title 1',
    }, {
      role: 'AI', message: 'just for test\njust for testjust for testjust for testjust for testjust for test\njust for test',
    }, {
      role: 'Human', message: 'Ant Design Title 1',
    }, {
      role: 'AI', message: 'just for test\njust for testjust for testjust for testjust for testjust for test\njust for test',
    }, {
      role: 'Human', message: 'Ant Design Title 1',
    }, {
      role: 'AI', message: 'just for test\njust for testjust for testjust for testjust for testjust for test\njust for test',
    }, {
      role: 'Human', message: 'Ant Design Title 1',
    }, {
      role: 'AI', message: 'just for test\njust for testjust for testjust for testjust for testjust for test\njust for test',
    }, {
      role: 'Human', message: 'Ant Design Title 1',
    }, {
      role: 'AI', message: 'just for test\njust for testjust for testjust for testjust for testjust for test\njust for test',
    }];

  return (<Row gutter={0}>
    <Col span={5}>
      <Search
        placeholder={formatText("app.runmodule.postmodule.searchmodule.ph")}
        onSearch={value => handleModuleSearch(value)}
      />
      <Radio.Group
        defaultValue=""
        onChange={(e) => moduleTypeOnChange(e.target.value)}
        style={{
          marginTop: 0,
        }}
      >
        <Radio.Button value="">{formatText("app.runmodule.postmodule.moduletype.all")}</Radio.Button>
        <Radio.Button
          value="AI_Agent">{formatText("llmmodule.agent")}</Radio.Button>
        <Radio.Button
          value="AI_RAG">{formatText("llmmodule.rag")}</Radio.Button>
        <Radio.Button
          value="AI_MULTI_RAG">{formatText("llmmodule.multi_agent")}</Radio.Button>
      </Radio.Group>
      <Table
        style={{
          padding: "0 0 0 0", maxHeight: cssCalc("100vh - 560px"), minHeight: cssCalc("100vh - 560px"),
        }}
        scroll={{ y: "calc(100vh - 120px)" }}
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
    <Col span={13}>
      <div style={{ marginLeft: 8, marginRight: 8 }}>
        <List
          style={{
            padding: "0 0 0 0", overflow: "auto", maxHeight: cssCalc(`${resizeDownHeight} - 64px`), minHeight: cssCalc(`${resizeDownHeight} - 64px`),
          }}
          itemLayout="horizontal"
          dataSource={messageList}
          renderItem={(item, index) => (ListItem(item))}
        />
        <Flex vertical={false}>
          <Input placeholder="Basic usage"
                 value={userInputValue}
                 suffix={<SendOutlined/>}
                 onChange={(e) => setUserInputValue(e.target.value)}
                 onPressEnter={(e) => handleUserInput(e)}
          />
          <Popconfirm
            description={formatText('llmmodule.delete.confirm')}
            // onConfirm={() => destoryIPDomainReq.run({ ipdomain: record.ipdomain })}
          >
            <Button
              style={{ width: 64 }}
              size="middle"
              icon={<DeleteOutlined/>}
            />
          </Popconfirm>
        </Flex>
      </div>
    </Col>
  </Row>);
};
export const VGPTMemo = memo(VGPT);
