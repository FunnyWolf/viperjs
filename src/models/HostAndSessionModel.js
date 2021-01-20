import { useState } from 'react';

export default function HostAndSessionModel() {

  const [postModuleConfigListStateAll, setPostModuleConfigListStateAll] = useState([]);
  const [botModuleConfigList, setBotModuleConfigList] = useState([]);

  const [hostAndSessionList, setHostAndSessionList] = useState([]);
  const [heatbeatsocketalive, setHeatbeatsocketalive] = useState(false);
  const [taskQueueLength, setTaskQueueLength] = useState(0);
  const [jobList, setJobList] = useState([]);
  const [postModuleResultHistory, setPostModuleResultHistory] = useState([]);
  const [postModuleResultHistoryActive, setPostModuleResultHistoryActive] = useState([]);
  const [notices, setNotices] = useState([]);
  const [botWaitList, setBotWaitList] = useState([]);


  return {
    postModuleConfigListStateAll,
    setPostModuleConfigListStateAll,

    botModuleConfigList,
    setBotModuleConfigList,

    taskQueueLength,
    setTaskQueueLength,

    heatbeatsocketalive,
    setHeatbeatsocketalive,

    hostAndSessionList,
    setHostAndSessionList,

    jobList,
    setJobList,

    postModuleResultHistory,
    setPostModuleResultHistory,

    postModuleResultHistoryActive,
    setPostModuleResultHistoryActive,

    notices,
    setNotices,

    botWaitList,
    setBotWaitList,
  };
}
