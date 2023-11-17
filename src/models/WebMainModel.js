import { useState } from 'react'
import { useLocalStorageState } from 'ahooks'

export default function WebMainModel () {

    const [ipdomains, setIPDomains] = useState([])
    const [projectActive, setProjectActive] = useLocalStorageState('project_active', {
        project_id: '0000000000000000', name: 'Default', desc: 'Default Project',
    })
    const [projects, setProjects] = useState([])
    const [webTaskListPortScan, setWebTaskListPortScan] = useLocalStorageState('web_task_list_port_scan', [])
    const [webJobList, setWebjobList] = useState([])
    return {
        ipdomains,
        setIPDomains,
        projectActive,
        setProjectActive,
        projects,
        setProjects,
        webTaskListPortScan,
        setWebTaskListPortScan,
        webJobList,
        setWebjobList,
    }
}
