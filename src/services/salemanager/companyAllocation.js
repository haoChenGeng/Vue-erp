import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
    queryTreeByType (args) {
        return axios({
            service: Service.ORGNAME.name,
            method: Service.ORGNAME.methods.QUERYTREEBYTYPE,
            args: args
        })
    },
    companyAllocationFindById (args) {
        return axios({
            service: Service.COMPANYALLOCATION.name,
            method: Service.COMPANYALLOCATION.methods.COMPANYALLOCATIONFINDBYID,
            args: args
        })
    },
    reAllocation(id, companyId, storeId, userId){
        return axios({
            service: Service.COMPANYALLOCATION.name,
            method: Service.COMPANYALLOCATION.methods.reAllocation,
            args: {
                'id':id,
                'companyId':companyId,
                'storeId':storeId,
                'userId':userId,
            }
        })
    }
}
