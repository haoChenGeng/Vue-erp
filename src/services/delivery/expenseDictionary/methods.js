/**
 * Created by tomy.li on 2017/7/10.
 */
import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default {

    //工费字典项通用查询
    getExpenseDictionaries(page = 1, size = 100, search = {}, sort = [], fields = []) {

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
            method: Service.TEMPLATE.methods.expenseDictionaryQueryPage,
            service: Service.TEMPLATE.name,
            args: args
        })
    },

    //工费字典项去重查询
    getExpenseDictionariesUniq(){
        return  axios({
            method: Service.TEMPLATE.methods.expenseDictionaryFilterWokerTypes,
            service: Service.TEMPLATE.name,
            args: {}
        })
    }
}
