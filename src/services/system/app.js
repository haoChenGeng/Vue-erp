import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
	permissionExtServiceListPackPerm:function(args){
		return axios({
            method: Service.APP.methods.permissionExtServiceListPackPerm,
            service: Service.APP.name,
            args: args
        })
	},
	permissionExtServiceCreate:function(args){
		return axios({
            method: Service.APP.methods.permissionExtServiceCreate,
            service: Service.APP.name,
            args: args
        })
	},
	permissionExtServiceQueryPage:function(args){
		return axios({
            method: Service.APP.methods.permissionExtServiceQueryPage,
            service: Service.APP.name,
            args: args
        })
	},
	permissionExtServiceUpdate:function(args){
		return axios({
            method: Service.APP.methods.permissionExtServiceUpdate,
            service: Service.APP.name,
            args: args
        })
	},
    permissionExtServiceUpdateIsDel:function(args){
        return axios({
            method: Service.APP.methods.permissionExtServiceUpdateIsDel,
            service: Service.APP.name,
            args: args
        })
    },
    versionServiceFindById:function(args){
        return axios({
            method: Service.APP.methods.versionServiceFindById,
            service: Service.APP.name,
            args: args
        })
    },
    versionServiceCreate:function(args){
        return axios({
            method: Service.APP.methods.versionServiceCreate,
            service: Service.APP.name,
            args: args
        })
    },
    versionServiceUpdate:function(args){
         return axios({
            method: Service.APP.methods.versionServiceUpdate,
            service: Service.APP.name,
            args: args
        }) 
    },
    versionServiceQueryPage:function(args){
        return axios({
           method: Service.APP.methods.versionServiceQueryPage,
           service: Service.APP.name,
           args: args
       }) 
   }
}