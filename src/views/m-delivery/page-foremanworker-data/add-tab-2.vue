<template>
    <div class="add-tab-2">
        <div class="my-toolbar" v-if="!eidtType">
            <el-button type="primary" size="small" icon="plus" @click="add()">新增行</el-button>
            <el-button type="danger" size="small" icon="close" @click="del()">删除行</el-button>
            <el-button type="danger" size="small" :loading="disabledLoading" icon="close" @click="disabled()">作废</el-button>
        </div>
        <t8t-table
            ref="tableDebitType"
            :args="args"
            :service="service"
            :method="method"
            :columns="columns"
            :selectCol="true"
            :indexCol="true"
            :templateData="templateData"
            :commonData="commonData"
            :editable="!eidtType"
            :pageBar="true"
            @cell-click="handleCellClick"
            >
        </t8t-table>
    </div>
</template>

<script>

import api from 'src/services/delivery/foremanworker.js'
import service from 'src/services/delivery/Service.js'
import commonApi from 'src/services/commonApi/commonApi.js'
import tableConfig from './add-tab-2.js'
import Cookie from 'js-cookie'

export default {
    name: 'add-tab-2',
    props:{
       eidtType: {
                type: Boolean,
                default: false
            },
        subOrgId:String,
        isProjectManager:{
                type: Boolean,
                default: 0
            },

    },
    data() {
        return {
            tableConfig:tableConfig,
            service: null,
            method: null,
            args: null,
            columns: tableConfig.tableDebitType,
            saveLoading:false,
            commonData:{
                 businessTypes:[],
                 debitObjects:[],
                 debitTypes:[],
                 statusList:[
                    {
                        text: '无效',
                        value: 1
                    },
                    {
                        text: '生效',
                        value: 0
                    }
                 ]
            },
            templateData:{
                   bizId:'',
                   projectManagerId:'',
                   workType:'',
                   dataStatus:0,
                   createTime:null
            },
            disabledLoading:false
        }
    },
    created() {
        this.getCommonData('41001', 'debitTypes')
        this.getCommonData('11008', 'businessTypes')
        this.getProjectManager()
        if(this.$route.query.id){
              this.args = {identity:{workerId:this.$route.query.id}, sort:['id_desc']}
              this.service = service.FOREMANWORKER.name
              this.method = service.FOREMANWORKER.methods.workerIdentityServiceQuery
        }
    },
    watch:{
        "$route.query":function(){
             if(this.$route.query.id){
                this.args = {identity:{workerId:this.$route.query.id}, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.workerIdentityServiceQuery
            }
        }
    },
    methods: {
        disabled(){
              if(this.$refs['tableDebitType'].selectedRows.length < 1){
                    this.$message.error('请选择需要作废的行！')
                    return
              }
              let rows = this.$refs['tableDebitType'].selectedRows
              var flage = true;
              var msg = ''
              var ids = []
              rows.forEach((item) => {
                    if(item.dataStatus == 1){
                        flage = false
                        msg = '请勾选生效数据进行操作'
                        return false
                    }
                    if(!item.id){
                        flage = false
                        msg = '请先进行暂存操作'
                        return false
                    }
                    ids.push(item.id)
              })
              if(flage){
                  let args = {identity:{idList:ids, updateUser:Cookie.get('t8t-tc-uid'), workerId:this.$route.query.id}}
                  this.disabledLoading = true
                   api.workerIdentityServiceCancel(args).then((res) =>{
                        this.disabledLoading = false
                        if(res.data.status == 200){
                             this.$message({
                                    type: 'success',
                                    message: '作废成功！'
                                });
                             this.$refs['tableDebitType'].reloadTable()
                             this.$refs['tableDebitType'].resetActionLog()
                        }else{
                               this.$message({
                                  type:'error',
                                  message:res.data.message
                               })
                        }
                   })
              }else{
                  this.$message.error(msg)
              }
        },
        handleCellClick(row, column, cell, event){
            if(row.id){
                this.$refs.tableDebitType.handleFormItemBlur()
                return
            }
        },
        getDataForCreater(){
            let rows =  this.$refs['tableDebitType'].getActionLog(false);
            let data = rows.addedRows
            data.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                    })
            return data
        },
        getDataForUpd(){
              let rows =  this.$refs['tableDebitType'].getActionLog(false);
                let data = {};
                data.addList = rows.addedRows
                data.addList.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                 })
                return data
        },
       validate(func){
            if(this.$refs['tableDebitType'].dataSource.length < 1 && this.isProjectManager != 1){
                  this.$message.error('请添加身份信息')
                  func(false)
                  return
            }
          this.$refs['tableDebitType'].validate((isValid) => {
                    func(isValid)
            })
        },

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
            commonApi.queryUnionParent(arg)
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
        getProjectManager(){
                 let args = {base:{subOrgId:this.subOrgId, isProjectManager:1, workerStatus:4},page:1,size:100,sort:[]}
                 api.getBaseInfoById(args).then((res) => {
                if(res.data.status == 200){
                    this.commonData.debitObjects = []
                    res.data.result.rows.forEach((item) =>{
                          this.commonData.debitObjects.push({
                                value: item.id,
                                text: item.workerName
                          })
                    })

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
              var flage = true
             this.$refs['tableDebitType'].selectedRows.forEach((item) => {
                if(item.id){
                     flage = false
                     return false
                }
             })
             if(!flage){
                this.$message.error('只能删除未暂存的行！')
                return false
             }
            this.$refs['tableDebitType'].delRows()
        }
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
