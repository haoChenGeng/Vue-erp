<template>
    <div class="add-tab-4">
        <div class="my-toolbar" v-if="!eidtType">
            <el-button
                type="primary"
                size="small"
                icon="plus"
                @click="add()"
            >新增</el-button>
            <el-button
                type="danger"
                size="small"
                icon="close"
                @click="del()"
            >删除</el-button>
        </div>
        <t8t-table
            ref="tableDebitType"
            :args="args"
            :service="service"
            :method="method"
            :columns="columns"
            :selectCol="true"
            :indexCol="true"
            :commonData="commonData"
            :editable="!eidtType"
            :pageBar="true"
        >
        </t8t-table>
    </div>
</template>

<script>

import api from 'src/services/delivery/foremanworker.js'
import service from 'src/services/delivery/Service.js'
import apiCommon from 'src/services/commonApi/commonApi.js'
import InputPhone from 'src/components/t8t-form/inputPhone.vue'
import tableConfig from './add-tab-4.js'
import Cookie from 'js-cookie'
import RSA from 'src/utils/RSA.js'
import utils from 'src/utils/Utils.js'

export default {
    name: 'add-tab-4',
    components:{
             InputPhone
    },
    props:{
       eidtType: {
                type: Boolean,
                default: false
            },
        subOrgId:String
    },
    data() {
        return {
            service: null,
            method: null,
            args: null,
            //辅助资料配置
            commonData: {
                relationList: []
            },
            saveLoading:false,
            columns:tableConfig.tableDebitType,
            templateData:{
                   emergencyName:'',
                   emergencyPhone:'',
                   emergencyEmail:'',
                   emergencyRelationName:'',
                   createTime:null,
                   emergencyPhoneCode:''
            }
        }
    },
    created() {
            utils.getPublicKey(function(res) {
                  if(res.data.status == 200){
                      RSA.encrypt.setPublicKey(res.data.result.key)
                  }
            })
        this.getCommonData('41002', 'relationList')
        if(this.$route.query.id){
                this.args = {emergency:{workerId:this.$route.query.id}, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.workerEmergencyServiceQuery
        }
    },
    watch:{
        "$route.query":function(){
            if(this.$route.query.id){
                this.args = {emergency:{workerId:this.$route.query.id}, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.workerEmergencyServiceQuery
            }
        }
    },
    methods: {
        //辅助资料
        getCommonData: function(fatherCode,selectName) {
            let arg =  {
                page: 1,
                search: {
                    pPropertyCode: fatherCode
                },
                size: 100
            }
            let list = []
            apiCommon.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyStatus===1) {
                            list.push({
                                value: item.id,
                                text: item.propertyName
                            })
                        };
                    })
                    this.commonData[selectName] = list
                }
            })
        },
        //处理选择行变化
        add() {
            this.$refs['tableDebitType'].addNewRow()
        },
        del() {
            if(this.$refs['tableDebitType'].selectedRows.length < 1){
                this.$message.error('请选择需要删除的行！')
            }
            var ids = []
            this.$refs['tableDebitType'].selectedRows.forEach((item) =>{
                if(item.id){
                    ids.push(item.id)
                }
            })
            if(ids.length > 0){
                  let args = {emergency:{idList:ids, updateUser:Cookie.get('t8t-tc-uid'), workerId:this.$route.query.id}}
                  api.workerEmergencyServiceCancel(args).then((res) =>{
                        if(res.data.status == 200){
                            this.$message({
                                    type:'success',
                                    message:'删除成功！'
                                 })
                            this.$refs['tableDebitType'].delRows()
                        }else{
                            this.$message({
                                    type:'error',
                                    message:res.data.message
                                 })
                        }
                  })
            }else{
                this.$refs['tableDebitType'].delRows()
            }
        },
        getDataForUpd(){
                let rows =  this.$refs['tableDebitType'].getActionLog(false);
                let data = {};
                data.addList = rows.addedRows
                data.updateList = rows.editedRows
                data.addList.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                            item.emergencyPhoneEncode =  RSA.encryptfun(item.emergencyPhone)
                 })
                data.updateList.map(item => {
                            item.updateUser = Cookie.get('t8t-tc-uid')
                            item.emergencyPhoneEncode =  RSA.encryptfun(item.emergencyPhone)
                })
                return data
        },
        getDataForCreater(){
            let rows =  this.$refs['tableDebitType'].getActionLog(false);
            let data = rows.addedRows
            data.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                            item.emergencyPhoneEncode =  RSA.encryptfun(item.emergencyPhone)
                    })
            return data
        },
        validate(func){
            if(this.$refs['tableDebitType'].dataSource.length < 1){
                this.$message.error('请添加紧急联系人信息')
                func(false)
                return
            }
            this.$refs['tableDebitType'].validate((isValid) => {
                func(isValid)
            })
        },
    }
};
</script>

<style lang="css" scoped>
	.my-toolbar{
	    position: absolute;
		left: 50px;
	}
	.t8t-full-dialog .t8t-table{
		top: 50px;
		bottom: 10px;
		left: 50px;
		right: 50px;
		position: absolute;
	}
</style>
