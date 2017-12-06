import axios from 'src/utils/axios.js'
import Service from 'src/services/supply/Service.js'

export default{
    insert:function(args){
		return axios({
            method: Service.PREVENTREPEAT.methods.insert,
            service: Service.PREVENTREPEAT.name,
            args: args
        })
	},
    update:function(args){
		return axios({
            method: Service.PREVENTREPEAT.methods.update,
            service: Service.PREVENTREPEAT.name,
            args: args
        })
	},
	query:function(args){
		return axios({
            method: Service.PREVENTREPEAT.methods.query,
            service: Service.PREVENTREPEAT.name,
            args: args
        })
	},
    findById:function(args){
        return axios({
            method: Service.PREVENTREPEAT.methods.findById,
            service: Service.PREVENTREPEAT.name,
            args: args
        })
    },
    queryPage:function(args){
        return axios({
            method: Service.PREVENTREPEAT.methods.queryPage,
            service: Service.PREVENTREPEAT.name,
            args: args
        })
    }
}
