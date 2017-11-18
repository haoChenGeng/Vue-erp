
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
    //新增接口
    costRecAdd(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_ADD,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //重新生成
    costRecRegen(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_REGEN,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //获取列表页面
    queryPage(args){
		return axios({
			method:Service.COSTRECON.methods.REC_ORDER_QUERY_PAGE,
			service:Service.COSTRECON.name,
			args:args
		})
	},
    //根据ID查询信息
    findById(args){
        return axios({
            method:Service.COSTRECON.methods.REC_ORDER_FIND_BY_ID,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //撤回
    costRecCancel(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_CANCEL,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //提交
    costRecSubmit(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_SUBMIT,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //收款
    costRecReceive(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_RECEIVE,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //核销
    costRecWriteOff(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_WRITEOFF,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //查看收款记录
    costRecQueryReceiveRecord(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_QUERY_RECEIVE_RECORD,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //查看收款导出
    costRecExport(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_EXPORT,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //商家驳回
    costRecReject(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_REJECT,
            service:Service.COSTRECON.name,
            args:args
        })
    },
    //商家通过审核
    costRecApprove(args){
        return axios({
            method:Service.COSTRECON.methods.COST_REC_APPROVE,
            service:Service.COSTRECON.name,
            args:args
        })
    }
}
