/**
 * Created by tomy.li on 2017/5/15.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default{

    //查询sku信息 gdmId:用量关系行id
    getSkuTitle(gdmId){
        return axios({
            method: Service.default.methods.getSkuTitle,
            service: Service.default.name,
            args: {"gdmId":gdmId}
        })
    },

    //查询用量关系头信息 itemCode:末班详情行code
    getGdmTitle(itemCode){
        return axios({
            method: Service.default.methods.getGdmTitle,
            service: Service.default.name,
            args: {"itemCode":itemCode}
        })
    },

    //新增
    createGdm(datas){
        return axios({
            method: Service.default.methods.createGroupDosageMapping,
            service: Service.default.name,
            args:{"groupDosageMapping":datas}
        })
    },

    //批量新增
    createGdmBatch(datas){
        return axios({
            method: Service.default.methods.createGroupDosageMappingBatch,
            service: Service.default.name,
            args:{"groupDosageMapping":datas}
        })
    },

    //修改
    updateGdm(datas){
        return axios({
            method: Service.default.methods.updateGroupDosageMapping,
            service: Service.default.name,
            args:{"groupDosageMapping":datas}
        })
    },

    //批量修改
    updateGdmBatch(datas){
        return axios({
            method: Service.default.methods.updateGroupDosageMappingBatch,
            service: Service.default.name,
            args:{"groupDosageMapping":datas}
        })
    },

    //提交 args{ ids:[], gdMappingStatus, updateUser }
    checkGdm(args){
        return axios({
            method: Service.default.methods.checkGroupDosageMapping,
            service: Service.default.name,
            args:{"groupDosageMapping":args}
        })
    },

    //启用 args{ ids:[], forbiddenStatus, updateUser }
    effectGdm(args){
        return axios({
            method: Service.default.methods.effectGroupDosageMapping,
            service: Service.default.name,
            args:{"groupDosageMapping":args}
        })
    },

    //禁用 args{ ids:[], forbiddenStatus, updateUser }
    forbiddenGdm(args){
        return axios({
            method: Service.default.methods.forbiddenGroupDosageMapping,
            service: Service.default.name,
            args:{"groupDosageMapping":args}
        })
    }


}
