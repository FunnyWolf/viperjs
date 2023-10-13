import { useState } from 'react'
import { useLocalStorageState } from 'ahooks'

export default function WebMainModel() {

    const [ipdomains, setIPDomains] = useState([])


    return {
        ipdomains,
        setIPDomains,
    }
}
