import { useState } from 'react'
import { useLocalStorageState } from 'ahooks'

export default function HostAndSessionModel () {

  const [postModuleOptions, setPostModuleOptions] = useState([])
  const [botModuleOptions, setBotModuleOptions] = useState([])
  const [proxyHttpScanModuleOptions, setProxyHttpScanModuleOptions] = useState([])
  const [webModuleOptions, setWebModuleOptions] = useState([])

  const [llmModuleOptions, setLlmModuleOptions] = useState([])

  const [hostAndSessionList, setHostAndSessionList] = useState([])
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] })

  const [heatbeatsocketalive, setHeatbeatsocketalive] = useState(false)
  const [taskQueueLength, setTaskQueueLength] = useState(0)
  const [jobList, setJobList] = useState([])
  const [postModuleResultHistory, setPostModuleResultHistory] = useState([])
  const [postModuleResultHistoryActive, setPostModuleResultHistoryActive] = useState([])
  const [notices, setNotices] = useState([])
  const [botWaitList, setBotWaitList] = useState([])

  const [moduleOptions, setModuleOptions] = useState([])
  const [hostAndSessionActive, setHostAndSessionActive] = useState({
    ipaddress: null,
    tag: 'other',
    comment: null,
    session: {
      id: -1,
      type: 'meterpreter',
      session_host: '请选择Session',
      tunnel_local: null,
      tunnel_peer: null,
      tunnel_peer_ip: null,
      tunnel_peer_locate_zh: null,
      tunnel_peer_locate_en: null,
      tunnel_peer_asn: null,
      via_exploit: null,
      via_payload: null,
      info: null,
      user: null,
      os: null,
      os_short: null,
      arch: null,
      platform: null,
      fromnow: 0,
      available: 0,
      isadmin: null,
      pid: -1,
      job_info: {
        job_id: -1,
        PAYLOAD: null,
        LPORT: null,
        LHOST: null,
        RHOST: null,
      },
    },
  })

  const [onlyShowSession, setOnlyShowSession] = useLocalStorageState('only-show-session', false)

  const [onlyShowSessionModel, setOnlyShowSessionModel] = useState(onlyShowSession)

  return {
    postModuleOptions,
    setPostModuleOptions,

    botModuleOptions,
    setBotModuleOptions,

    proxyHttpScanModuleOptions,
    setProxyHttpScanModuleOptions,

    webModuleOptions,
    setWebModuleOptions,

    taskQueueLength,
    setTaskQueueLength,

    heatbeatsocketalive,
    setHeatbeatsocketalive,

    hostAndSessionList,
    setHostAndSessionList,

    networkData,
    setNetworkData,

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

    hostAndSessionActive,
    setHostAndSessionActive,

    moduleOptions,
    setModuleOptions,

    onlyShowSessionModel,
    setOnlyShowSessionModel,

    llmModuleOptions,
    setLlmModuleOptions,

  }
}
