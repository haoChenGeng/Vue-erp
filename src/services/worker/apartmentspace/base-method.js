import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    create(args) {
        return axios({
            method: Service.TEMPLATE.methods.CREATE,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    update(args) {
        return axios({
            method: Service.TEMPLATE.methods.UPDATE,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    setModuleStatus(args){
        return axios({
            method: Service.TEMPLATE.methods.SETMODULESTATUS,
            service: Service.TEMPLATE.name,
            args: args
        })
    },
    queryModuleQuotaionById(args) {
        return axios({
            method: Service.TEMPLATE.methods.queryModuleQuotaionById,
            service: Service.TEMPLATE.name,
            args: args
        })
    },

    moduleItemQueryPage(args) {
        return axios({
            method: Service.TEMPLATE.methods.QUERY,
            service: Service.TEMPLATE.name,
            args: args
        })
    },

    queryUserSpace(args){
        return axios({
            method:Service.TEMPLATE.methods.queryUserSpace,
            service:Service.TEMPLATE.name,
            args:args
        })
    },

    querySpaceConfig(args){
        return axios({
            method:Service.TEMPLATE.methods.querySpaceConfig,
            service:Service.TEMPLATE.name,
            args:args
        })
    },

    getSpaceConfigList() {
        let arg =  {
            "fields": [     // 返回字段，可不传（此时返回所有）
                "id",
                "name",
            ]
        }
        let list = []
        this.querySpaceConfig(arg).then((res) => {
            if (res.data.status === 200) {
                res.data.result.forEach((item) => {
                    list.push({
                        value: item.id,
                        text: item.name
                    })

                })

            }
        })
        return list;
    },

}
