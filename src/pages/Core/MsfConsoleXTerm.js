import React, { Fragment, memo, useEffect, useRef } from "react";

import { ClearOutlined, InteractionOutlined } from "@ant-design/icons";

import { Button, Space } from "antd";
import copy from "copy-to-clipboard";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "./xterm.css";
import { getToken } from "@/utils/authority";
import { useInterval } from "ahooks";
import { DocIcon } from "@/pages/Core/Common";
import { HostIP } from "@/config";
import { cssCalc, Downheight } from "@/utils/utils";
import { useModel } from "@@/plugin-model/useModel";
//websocket连接地址设置
let webHost = HostIP + ":8002";
let protocol = "ws://";
if (process.env.NODE_ENV === "production") {
  webHost = location.hostname + (location.port ? `:${location.port}` : "");
  protocol = "wss://";
}


const Msfconsole = props => {
  console.log("Msfconsole");
  const fitAddon = useRef(new FitAddon());
  const msfConsoleTerm = useRef(null);
  const wsmsf = useRef(null);
  const terminalRef = useRef(null);
  const {
    resizeDownHeight,
  } = useModel("Resize", model => ({
    resizeDownHeight: model.resizeDownHeight,
  }));
  const urlargs = `&token=${getToken()}`;
  const urlpatternsMsf = "/ws/v1/websocket/msfconsole/?";
  const socketUrlMsf = protocol + webHost + urlpatternsMsf + urlargs;

  const consolemonitor = () => {
    if (
      wsmsf.current !== undefined &&
      wsmsf.current !== null &&
      wsmsf.current.readyState === WebSocket.OPEN
    ) {
    } else {
      try {
        wsmsf.current.close();
      } catch (error) {
      }
      try {
        wsmsf.current = null;
      } catch (error) {
      }
      wsmsf.current = new WebSocket(socketUrlMsf);
      wsmsf.current.onmessage = event => {
        const recv_message = JSON.parse(event.data);
        msfConsoleTerm.current.write(recv_message.data);
      };
    }
  };

  useInterval(() => consolemonitor(), 3000);

  useEffect(() => {
    if (terminalRef.current) {
      initMsfconsole();
    }
    return () => {
      try {
        wsmsf.current.close();
        msfConsoleTerm.current.close();
        msfConsoleTerm.current.dispose();
      } catch (error) {
      }
    };
  }, []);

  const clearConsole = () => {
    msfConsoleTerm.current.clear();
  };
  const resetBackendConsole = () => {
    const sendMessage = { status: 0, cmd: "reset" };
    const sendData = JSON.stringify(sendMessage);
    wsmsf.current.send(sendData);
  };

  const initMsfconsole = () => {
    wsmsf.current = new WebSocket(socketUrlMsf);
    wsmsf.current.onopen = () => {
      if (msfConsoleTerm.current === null) {
        msfConsoleTerm.current = new Terminal({
          allowTransparency: false,
          useStyle: true,
          cursorBlink: true
        });

        msfConsoleTerm.current.attachCustomKeyEventHandler(e => {
          if (e.keyCode === 39 || e.keyCode === 37) {
            return false;
          }
          return !(e.keyCode === 45 || e.keyCode === 36);

        });
      }
      msfConsoleTerm.current.open(terminalRef.current);
      msfConsoleTerm.current.loadAddon(fitAddon.current);
      fitAddon.current.fit();

      msfConsoleTerm.current.onData(data => {
        const sendMessage = { status: 0, data };
        const sendData = JSON.stringify(sendMessage);
        try {
          wsmsf.current.send(sendData);
        } catch (error) {
        }
      });
      msfConsoleTerm.current.onSelectionChange(e => {
        if (msfConsoleTerm.current.hasSelection()) {
          copy(msfConsoleTerm.current.getSelection());
        }
      });

      const firstMessage = { status: 0, data: "\r" };
      const firstData = JSON.stringify(firstMessage);
      wsmsf.current.send(firstData);
    };

    wsmsf.current.onclose = CloseEvent => {
      try {
      } catch (error) {
      }
    };

    wsmsf.current.onmessage = event => {
      const recv_message = JSON.parse(event.data);
      msfConsoleTerm.current.write(recv_message.data);
    };
  };
  return (
    <Fragment>
      <DocIcon url="https://www.yuque.com/vipersec/help/tzugzn" />
      <Space
        style={{
          top: "calc(16vh + 184px)",
          right: 8,
          position: "fixed",
          zIndex: 100
        }}
        direction="vertical"
      >
        <Button
          style={{
            backgroundColor: "rgba(40,40,40,0.7)"
          }}
          size="large"
          onClick={() => clearConsole()}
          icon={<ClearOutlined />}
        />
        <Button
          style={{
            backgroundColor: "rgba(40,40,40,0.7)"
          }}
          size="large"
          icon={<InteractionOutlined />}
          onClick={() => resetBackendConsole()}
        />
      </Space>
      <div
        style={{
          marginTop: -16,
          padding: "0 0 0 4px",
          maxHeight: cssCalc(resizeDownHeight),
          minHeight: cssCalc(resizeDownHeight)
        }}
        ref={terminalRef}
      />
    </Fragment>
  );
};

export const MsfconsoleMemo = memo(Msfconsole);


const MsfconsoleWindows = props => {
  console.log("MsfconsoleWindows");
  const fitAddon = useRef(new FitAddon());
  const msfConsoleTerm = useRef(null);
  const wsmsf = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      initMsfconsole();
    }
    return () => {
      try {
        wsmsf.current.close();
        msfConsoleTerm.current.close();
        msfConsoleTerm.current.dispose();
      } catch (error) {
      }
    };
  }, []);

  const clearConsole = () => {
    msfConsoleTerm.current.clear();
  };
  const resetBackendConsole = () => {
    const sendMessage = { status: 0, cmd: "reset" };
    const sendData = JSON.stringify(sendMessage);
    wsmsf.current.send(sendData);
  };

  const initMsfconsole = () => {
    const urlargs = `&token=${getToken()}`;
    const urlpatternsMsf = "/ws/v1/websocket/msfconsole/?";
    const socketUrlMsf = protocol + webHost + urlpatternsMsf + urlargs;
    wsmsf.current = new WebSocket(socketUrlMsf);

    wsmsf.current.onopen = () => {
      if (msfConsoleTerm.current === null) {
        msfConsoleTerm.current = new Terminal({
          allowTransparency: false,
          useStyle: true,
          cursorBlink: true
        });

        msfConsoleTerm.current.attachCustomKeyEventHandler(e => {
          if (e.keyCode === 39 || e.keyCode === 37) {
            return false;
          }
          return !(e.keyCode === 45 || e.keyCode === 36);

        });
      }

      msfConsoleTerm.current.open(terminalRef.current);
      msfConsoleTerm.current.loadAddon(fitAddon.current);
      fitAddon.current.fit();

      msfConsoleTerm.current.onData(data => {
        const sendMessage = { status: 0, data };
        const sendData = JSON.stringify(sendMessage);
        wsmsf.current.send(sendData);
      });
      msfConsoleTerm.current.onSelectionChange(e => {
        if (msfConsoleTerm.current.hasSelection()) {
          copy(msfConsoleTerm.current.getSelection());
        }
      });

      const firstMessage = { status: 0, data: "\r" };
      const firstData = JSON.stringify(firstMessage);
      wsmsf.current.send(firstData);
    };

    wsmsf.current.onclose = CloseEvent => {
      try {
        msfConsoleTerm.current.close();
        msfConsoleTerm.current.dispose();
      } catch (error) {
      }
    };

    wsmsf.current.onmessage = event => {
      const recv_message = JSON.parse(event.data);
      msfConsoleTerm.current.write(recv_message.data);
    };
  };

  return (
    <div
      style={{
        padding: "0 0 0 0",
        height: "100%"
      }}
      ref={terminalRef}
    >
      <Space
        style={{
          top: "calc(8vh)",
          right: 8,
          position: "absolute",
          zIndex: 100
        }}
        direction="vertical"
      >
        <Button
          style={{
            backgroundColor: "rgba(40,40,40,0.7)"
          }}
          size="large"
          onClick={() => clearConsole()}
          icon={<ClearOutlined />}
        />
        <Button
          style={{
            backgroundColor: "rgba(40,40,40,0.7)"
          }}
          size="large"
          icon={<InteractionOutlined />}
          onClick={() => resetBackendConsole()}
        />
      </Space>
    </div>
  );
};

const MsfConsoleXTermMemo = memo(MsfconsoleWindows);

export default MsfConsoleXTermMemo;
