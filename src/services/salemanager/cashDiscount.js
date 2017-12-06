import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    forBid(args) {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGEFORBID,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    antiForbid(args){
    	return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGEANTIFORBID,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    createSave(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGECREATESAVE,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    getOne(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGEGETONE,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    createSubmit(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGECREATESUBMIT,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    updateSave(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGEUPDATESAVE,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    findOrgById(args)
    {
        return axios({
            method: Service.ORGNAME.methods.FINDORDBYID,
            service: Service.ORGNAME.name,
            args: args
        })
    },
    updateSubmit(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGEUPDATESUBMIT,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    queryOrg(args)
    {
        return axios({
            method: Service.ORGNAME.methods.QUERY,
            service: Service.ORGNAME.name,
            args: args
        })
    },
    cancel(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGECANCEL,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    queryDetailPage(args)
    {
        return axios({
            method: Service.SALES.methods.QUERYDETAILPAGE,
            service: Service.SALES.name,
            args: args
        })
    },
    createOrder(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGECREATEORDER,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    setDisable(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGESETDISABLE,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    cancelDisable(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGECANCELDISABLE,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    getOrder(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGEGETORDER,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    },
    updateOrder(args)
    {
        return axios({
            method: Service.CASHDISCOUNT.methods.PRIVILEGEUPDATEORDER,
            service: Service.CASHDISCOUNT.name,
            args: args
        })
    }
}