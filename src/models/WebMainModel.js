import { useState } from 'react'
import { useLocalStorageState } from 'ahooks'

export default function WebMainModel () {

  const [ipdomains, setIPDomains] = useState([])
  const [projectActive, setProjectActive] = useLocalStorageState(
    'project_active', {
      project_id: '0000000000000000', name: 'Default', desc: 'Default Project',
    })
  const [projects, setProjects] = useState([])
  const [webIPDomainPortWaitList, setWebIPDomainPortWaitList] = useLocalStorageState(
    'web_ipdomain_port_wait_list', [])
  const [webJobList, setWebjobList] = useState([])
  const [webTaskResultList, setWebTaskResultList] = useState([])
  const [webTaskResultListActive, setWebTaskResultListActive] = useState([])
  const [notices, setNotices] = useState([])
  return {
    ipdomains,
    setIPDomains,
    projectActive,
    setProjectActive,
    projects,
    setProjects,
    webIPDomainPortWaitList,
    setWebIPDomainPortWaitList,
    webJobList,
    setWebjobList,
    webTaskResultList,
    setWebTaskResultList,
    webTaskResultListActive,
    setWebTaskResultListActive,
    notices,
    setNotices,
  }
}
