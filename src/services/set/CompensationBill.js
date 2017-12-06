/**
 * Created by jason.yu on 2017/5/12.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {
    listObjTypeAndSettlementWay(args){
        return axios({
            method: Service.SET.M.LISTOBJTYPEANDSETTLEMENTWAY,
            service: Service.SET.S,
            args: args
        })
    },
    findByAccountId(args){
        return axios({
            service: Service.ACC.S,
            method: Service.ACC.M.FINDBYACCOUNTID,
            args: args
        })
    },
    findOrgById(args){
        return axios({
            service: Service.ACC.S,
            method: Service.ACC.M.FINDORGBYID,
            args: args
        })
    },
    listNextLevel(args){
        return axios({
            service: Service.IT.S,
            method: Service.IT.M.LISTNEXTLEVEL,
            args: args
        })
    },
    getBusinessKeyDetail(args){
        return axios({
            service: Service.WKF.S,
            method: Service.WKF.M.GETBUSINESSKEYDETAIL,
            args: args
        })
    },
    completeTaskByProcInsId(args){
        return axios({
            service: Service.SET.S,
            method: Service.SET.M.COMPLETETASKBYPROCINSID,
            args: args
        })
    }
}
