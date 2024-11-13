import React, { useEffect, useRef } from 'react';

import { ConfigProvider, theme } from 'antd-v5';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import { TabsTop } from '@/pages/Core/TabsTop';
import { useModel } from '@@/plugin-model/useModel';
import { useRequest } from '@@/plugin-request/request';
import { getCoreCurrentUserAPI } from '@/services/apiv1';
import { getToken } from '@/utils/authority';
import { useInterval } from 'ahooks';
import { HostIP } from '@/config';

let protocol = 'ws://';
let webHost = HostIP + ':8002';
if (process.env.NODE_ENV === 'production') {
  webHost = location.hostname + (location.port ? `:${location.port}` : '');
  protocol = 'wss://';
}

const WebMain = props => {
  console.log('WebMain');

  const { setHeatbeatsocketalive, setWebModuleOptions } = useModel(
    'HostAndSessionModel',
    model => ({
      setHeatbeatsocketalive: model.setHeatbeatsocketalive,
      setWebModuleOptions: model.setWebModuleOptions,
    })
  );

  const { setWebjobList, setWebTaskResultList, setWebTaskResultListActive, setNotices } = useModel(
    'WebMainModel',
    model => ({
      setNotices: model.setNotices,
      setWebjobList: model.setWebjobList,
      setWebTaskResultList: model.setWebTaskResultList,
      setWebTaskResultListActive: model.setWebTaskResultListActive,
    })
  );

  const listCurrentUserReq = useRequest(getCoreCurrentUserAPI, {
    manual: true,
    onSuccess: (result, params) => {},
    onError: (error, params) => {},
  });

  const urlpatterns = '/ws/v1/websocket/websync/?';
  const urlargs = `&token=${getToken()}`;
  const socketUrl = protocol + webHost + urlpatterns + urlargs;

  const ws = useRef(null);

  const initWebSync = () => {
    try {
      listCurrentUserReq.run();
      ws.current = new WebSocket(socketUrl);
    } catch (error) {
      return;
    }

    ws.current.onopen = () => {
      setHeatbeatsocketalive(true);
    };
    ws.current.onclose = CloseEvent => {
      setHeatbeatsocketalive(false);
    };
    ws.current.onerror = ErrorEvent => {
      setHeatbeatsocketalive(false);
    };
    ws.current.onmessage = event => {
      const response = JSON.parse(event.data);

      const { module_options } = response;
      const { module_options_update } = response;

      const { jobs_update } = response;
      const { jobs } = response;

      const { task_result_update } = response;
      const { task_result } = response;

      const { notices_update } = response;
      const { notices } = response;

      if (module_options_update) {
        setWebModuleOptions(module_options.filter(item => item.BROKER.indexOf('web_') === 0));
      }

      if (jobs_update) {
        setWebjobList(jobs);
      }

      if (task_result_update) {
        setWebTaskResultList(task_result);
        setWebTaskResultListActive(task_result);
      }

      if (notices_update) {
        setNotices(notices);
      }
    };
  };

  const websyncmonitor = () => {
    if (
      ws.current !== undefined &&
      ws.current !== null &&
      ws.current.readyState === WebSocket.OPEN
    ) {
    } else {
      try {
        ws.current.close();
      } catch (error) {}
      try {
        ws.current = null;
      } catch (error) {}
      initWebSync();
    }
  };
  useInterval(() => websyncmonitor(), 3000);
  useEffect(() => {
    initWebSync();
    return () => {
      try {
        ws.current.close();
      } catch (error) {}
      try {
        ws.current = null;
      } catch (error) {}
    };
  }, []);

  return (
    <GridContent>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
          token: {
            // fontSizeSM: 16,
          },
          components: {
            Table: {
              cellPaddingBlockSM: 4,
              headerBorderRadius: 2,
            },
            Descriptions: {},
            Tabs: {
              horizontalMargin: '0 0 0 0' /* 这里是你的组件 token */,
            },
          },
        }}
      >
        <TabsTop />
      </ConfigProvider>
    </GridContent>
  );
};
export default WebMain;
