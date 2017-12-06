/**
 * Created by organo.xia on 2017/4/1.
 */

import axios from 'src/utils/axios.js'
import Service from '../workbench/Service.js'

// 工作台
export default {
    queryWorkBenchId (args) {
        return axios({
            method: Service.WORKBENCH.methods.LIST_BY_ACCOUNTID,
            service: Service.WORKBENCH.name,
            args: args
        })
    },
    queryWorkBenchByFatherUrl (args) {
        return axios({
            method: Service.WORKBENCH.methods.LIST_BY_ACCOUNTID_AND_FATHER_URL,
            service: Service.WORKBENCH.name,
            args: args
        })
    },
    queryUserTask (args) {
        return axios({
            method: Service.USERTASK.methods.GET_USER_TASK,
            service: Service.USERTASK.name,
            args: args
        })
    },
    queryUserTaskWeb (args) {
        return axios({
            method: Service.USERTASK.methods.GET_USER_TASK_WEB,
            service: Service.USERTASK.name,
            args: args
        })
    },
    queryUserTaskByStart (args) {
        return axios({
            method: Service.USERTASK.methods.GET_USER_TASK_BY_STARTER,
            service: Service.USERTASK.name,
            args: args
        })
    },
    queryProcInfoByStarter (args) {
        return axios({
            method: Service.USERTASK.methods.QUERY_PROCINFO_BY_STARTER,
            service: Service.USERTASK.name,
            args: args
        })
    },
    getProcessInstsWeb (args) {
        return axios({
            method: Service.USERTASK.methods.GET_PROCESS_INSTS_WEB,
            service: Service.USERTASK.name,
            args: args
        })
    },
    getVisualURL (){
        return Service.DATACENTERURL.name
    }
}

