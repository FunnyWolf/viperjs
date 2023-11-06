import { useModel } from '@@/plugin-model/useModel'
import { msgsuccess } from '@/utils/locales'

const addToWebTaskListPortScan = (params) => {
    const {
        webTaskListPortScan, setWebTaskListPortScan,
    } = useModel('WebMainModel', model => ({
        webTaskListPortScan: model.webTaskListPortScan, setWebTaskListPortScan: model.setWebTaskListPortScan,
    }))
    if (!webTaskListPortScan.includes(params.ipdomain)) {
        setWebTaskListPortScan([...webTaskListPortScan, params.ipdomain])
    }
    // msgsuccess(`已添加到任务队列`, `Added to task queue`)
}
const cleanWebTaskListPortScan = () => {
    const {
        setWebTaskListPortScan,
    } = useModel('WebMainModel', model => ({
        webTaskListPortScan: model.webTaskListPortScan, setWebTaskListPortScan: model.setWebTaskListPortScan,
    }))
    setWebTaskListPortScan([])
}
export { addToWebTaskListPortScan, cleanWebTaskListPortScan }