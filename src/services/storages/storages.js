/**
 * Created by tomy.li on 2017/5/3.
 * 组织机构
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'
import config from './config.js'

export default {
    // 获取用户分配的仓库分组
    getRelationStoragesByAccountId(accountId) {
        return axios({
            method: Service.STORAGES.methods.getRelationStoragesByAccountId,
            service: Service.STORAGES.name,
            args: {accountId:accountId}
        })
    },

    //查询所有分公司
    getAllBranchCompany(needInUse = false){
        return this.getOrganizationByTypeCode(config.typeCode.branchCompany, needInUse)
    },

    //查询所有分公司,门店
    getAllBranchCompanyAndStore(needInUse = false){
        return this.getOrganizationByTypeCode([config.typeCode.branchCompany,config.typeCode.store], needInUse)
    },

    //查询所有门店
    getAllStore(needInUse = false){
        return this.getOrganizationByTypeCode(config.typeCode.store, needInUse)
    },

    //根据typeCode查询
    //needInUse是否必须为启用中的 true代表搜索未禁用的 false代表搜索的数据
    getOrganizationByTypeCode(typeCode, needInUse = false){
        let args = {}
        if( typeof typeCode === 'string'){
            args = {'typeCode_eq':typeCode}
        }
        else{
            args = {'typeCode_in':typeCode}
        }

        if( needInUse ){
            args['isDel'] = 0;
        }
        return this.searchOrganization(args)
    },

    //搜索分公司下面的门店
    getAllStoreByCompanyId(companyId){
        let args = {}
        if(companyId ){
            args = {'parentId_eq': companyId , 'typeCode_eq': config.typeCode.store}
        }
        return this.searchOrganization(args)
    },

    //综合查询组织数据
    searchOrganization(search){
        return axios({
            method: Service.STORAGES.methods.organizationQuery,
            service: Service.STORAGES.name,
            args: {search:search}
        })
    },
    //按id查询组织数据
    findOrgById(id){
        return axios({
            method: Service.STORAGES.methods.findOrgById,
            service: Service.STORAGES.name,
            args: {id:id}
        })
    }
}
