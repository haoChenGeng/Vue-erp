import axios from 'src/utils/axios.js'
import Service from './computeService.js'
export default {

    //发起mrp运算任务
    operate(args){
        return new Promise((resolve, reject) => {
            axios({
                service:Service.name,
                method:Service.methods.operate,
                args:args
            }).then(res => {
                if( res.data.status == 200 ){
                    resolve(res.data.result)
                }else{
                    reject(res.data.result || res.data.message || '运行出错， 请重试')
                }
            }).catch(e => {
                reject('运行出错， 请重试')
            })
        })
    },
}
