/**
 * Created by tomy.li on 2017/7/12.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default{

    //根据单据类型查询项目的节点
    getProjectNodesByBillType(projectId, billType){
        return this.searchProjectNode(1,100,{"billType":billType, "projectId":projectId})
    },

    //项目排期节点列表通用查询
    searchProjectNode(page = 1, size = 100, search = {}, sort = [], fields = []) {

        let args = {
            "page": page,
            "size": size
        }

        if( sort.length ){
            args.sort = sort
        }
        if( fields.length ){
            args.fields = fields
        }
        if( JSON.stringify(search) !='{}' ){
            args.search = search
        }

        return axios({
            method: Service.methods.searchProjectNode,
            service: Service.name,
            args: args
        })
    },

    //校验节点是否可以启动
    projectNodeBillCreateVerify(projectId, nodeId){
        return axios({
            method: Service.methods.projectNodeBillCreateVerify,
            service: Service.name,
            args: {"nodeId":nodeId, "projectId":projectId}
        })
    },

    projectNodeGetByProcessId(processId){
        return axios({
            method: Service.methods.projectNodeGetByProcessId,
            service: Service.name,
            args: {"processId":processId}
        })
    }
}
