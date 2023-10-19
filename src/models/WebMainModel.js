import {useState} from 'react'
import {useLocalStorageState} from 'ahooks'

export default function WebMainModel() {

    const [ipdomains, setIPDomains] = useState([])

    const [projectActive, setProjectActive] = useLocalStorageState("project_active", {
        project_id: '0000000000000000',
        name: 'Default',
        desc: 'Default Project',
    })
    // const [projectActive, setProjectActive] = useState({
    //     project_id: '0000000000000000',
    //     name: 'Default',
    //     desc: 'Default Project',
    // })
    return {
        ipdomains,
        setIPDomains,
        projectActive,
        setProjectActive,
    }
}
