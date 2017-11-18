/*
 * 获取流程分类树列表
 * @param
 * @param string
 * @return array
 */

import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
    //参数获取
    property(args){
		return axios({
			method:Service.SALES.methods.SALES_PURCHASE_PROPERTY,
			service:Service.SALES.name,
			args:args
		})
	},
    //详情获取
    queryById(args){
		return axios({
			method:Service.SALES.methods.SALES_PURCHASE_FINDBYID,
			service:Service.SALES.name,
			args:args
		})
	},
    //列表导出
    purchaseExport(args){
        return axios({
            method:Service.SALES.methods.SALES_PURCHASE_EXPORT_BY_QUERY,
            service:Service.SALES.name,
            args:args
        })
    },
    //SALES_GET_PRICE_AGAIN
    getPriceAgain(args){
        return axios({
            method:Service.SALES.methods.SALES_GET_PRICE_AGAIN,
            service:Service.SALES.name,
            args:args
        })
    },





}
