/**
 * 公式系统
 * Created by tomy.li on 2017/7/5.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {

    //公式综合查询
    formulaQuery(search) {
        return axios({
            method: Service.formula.methods.query,
            service: Service.name,
            args: {search:search}
        })
    },

    //按分类查询公式
    selectFormulaByTypeId(typeId){
        return this.formulaQuery({'typeId':typeId})
    },

    //按模块查询公式
    selectFormulaByModuleId(id){
        return this.formulaQuery({'moduleId':id})
    },

    //获取公式内容
    findById(id){
        return axios({
            method: Service.formula.methods.findById,
            service: Service.name,
            args: {id:id}
        })
    },

    //公式计算
    formulaGetResult(id,args){
        let newArgs = {
            id:id
        }
        if( JSON.stringify(args) != '{}' ){
            newArgs['args'] = args
        }else{

        }
        return axios({
            method: Service.formula.methods.getResult,
            service: Service.name,
            args: newArgs
        })
    },

    //结构化公式数据
    formatFormulaForView(items){
        let list = []
        items.forEach((item, index) => {
            list.push(
                {
                    text: item.formulaName,
                    value: item.id
                }
            )
        })
        return list
    },

    //查询常量
    constantQueryPage(search = 0, sort = 0, page = 1, size = 1){
        let args = {
            'page': page,
            'size': size,
        }

        if( search !=0 && typeof search == 'object'){
            args['search'] = search
        }

        if( sort !=0 && typeof sort == 'object'){
            args['sort'] = sort
        }

        return axios({
            method: Service.constant.queryPage,
            service: Service.name,
            args: args
        })
    },

    //查询生效的常量
    getUseInConstant(typeName, useRange, validTimeTypeCode, endTime){
        return new Promise((resolve, reject) => {

            this.constantQueryPage(
                {
                    "typeName": typeName,//常量名
                    "status": 1,//有效
                    "useRange": useRange,//板块id-业务id
                    "validTimeTypeCode": validTimeTypeCode,//生效时间类型（创建时间、签约时间）
                    "endTime": endTime //生效结束时间
                },
                ["validTime_desc"],
                1,
                1
            ).then(res => {
                if( res.data.status == 200 ){
                    resolve(res.data.result.rows)
                }else{
                    reject()
                }
            }).catch(res => {
                reject()
            })
        })


    }

}
