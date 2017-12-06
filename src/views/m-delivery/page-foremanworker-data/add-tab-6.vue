<template>
    <div class="add-tab-6">
        <div class="my-toolbar" v-if="!eidtType">
            <el-button type="primary" size="small" icon="plus" @click="add()">新增附件</el-button>
            <el-button type="danger" size="small" icon="close" @click="del()">删除</el-button>
            <el-button type="danger" size="small" icon="close" :loading="cancelLoading" @click="cancel()">作废</el-button>
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
            @cell-click="handleCellClick"
        >
        </t8t-table>
    </div>
</template>

<script>

import service from 'src/services/delivery/Service.js'
import apiCommon from 'src/services/commonApi/commonApi.js'
import api from 'src/services/delivery/foremanworker.js'
import tableConfig from './add-tab-6.js'
import Cookie from 'js-cookie'
let orderId
let pageType
export default {
    name: 'add-tab-6',
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
            columns: tableConfig.tableDebitType,
            attachParTypeId:'',
            //辅助资料配置
            commonData: {
                    attachTypeList:[],
                    statusList:[{
                        text: '生效',
                        value: 0
                    },
                    {
                        text: '无效',
                        value: 1
                    }],
            },
            uploadDialogVisible:false,
            cancelLoading:false,
        }
    },
    created() {
        this.getCommonData('41003', 'attachTypeList')
        this.setAttachParTypeId('41003').then(res =>{
            if(this.$route.query.id && this.attachParTypeId){

                this.args = {attach:{bindId:this.$route.query.id, attachTypeId:this.attachParTypeId}, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.workerAttachServiceQuery
            }
        })

    },
    watch:{
       "$route.query":function(){
               this.setAttachParTypeId('41003').then(res =>{
                if(this.$route.query.id && this.attachParTypeId){

                    this.args = {attach:{bindId:this.$route.query.id, attachTypeId:this.attachParTypeId}, sort:['id_desc']}
                    this.service = service.FOREMANWORKER.name
                    this.method = service.FOREMANWORKER.methods.workerAttachServiceQuery
                }
            })
       }
    },
    methods: {
        handleCellClick(row, column, cell, event){
            if(row.status == 1 && !this.eidtType){
                this.$refs.tableDebitType.handleFormItemBlur()
                return false;
            }
            if(column.property =="attachName" && !this.eidtType){
                  this.$emit('uploadDialogShow', row.filePath, row.attachName, this.$refs['tableDebitType'].dataSource.indexOf(row), 'tab6')
            }else if(column.property =="attachName"){
                this.showImage(row.filePath, row.attachName, row)
            }
        },
        showImage(imagePath, imageName, row){
                this.$emit('showImage', imagePath, imageName, row)
        },
        setfile(fileInfo){
            this.$refs['tableDebitType'].dataSource[fileInfo.rowNum]['filePath'] = fileInfo.filePath
            this.$refs['tableDebitType'].dataSource[fileInfo.rowNum]['attachPath'] = fileInfo.fileId
            this.$refs['tableDebitType'].dataSource[fileInfo.rowNum]['attachName'] = fileInfo.fileName
        },
        getDataForCreater(){
            let rows =  this.$refs['tableDebitType'].getActionLog(false);
            let data = rows.addedRows
            data.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                            item.attachTypeId = this.attachParTypeId
                    })
            return data
        },
        getDataForUpd(){
                let rows =  this.$refs['tableDebitType'].getActionLog(false);
                let data = {};
                data.addList = rows.addedRows
                data.updateList = rows.editedRows
                data.addList.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                            item.attachTypeId = this.attachParTypeId
                 })
                data.updateList.map(item => {
                            item.updateUser = Cookie.get('t8t-tc-uid')
                })
                data.updateList = data.updateList.filter((item) =>{
                      if(item.status == 1){
                            return false
                      }
                      return true
                })
                return data
        },
        validate(func){
             if(this.$refs['tableDebitType'].dataSource.length < 1){
                this.$message.error('请添加附件信息')
                func(false)
                 return
            }
            if(this.$refs['tableDebitType'].dataSource.length == 1 && this.$refs['tableDebitType'].dataSource[0].status == 1){
                this.$message.error('请添加一项生效的附件')
                func(false)
                 return
            }
            this.$refs['tableDebitType'].validate((isValid) => {
                func(isValid)

            }, true)
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
        setAttachParTypeId(code){
            let arg =  {
                search: {
                    propertyCode: code
                },
                 page: 1,
                 size: 1
            }
           return apiCommon.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200 && res.data.result[0]) {
                      this.attachParTypeId = res.data.result[0].id
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
        },
        cancel(){
            if(this.$refs['tableDebitType'].selectedRows.length < 1){
                    this.$message.error('请选择需要作废的数据！')
              }
             var flage = true
             var ids = []
             this.$refs['tableDebitType'].selectedRows.forEach((item) => {
                if(item.status == 1){
                     flage = false
                     return false
                }else{
                    if(item.id){
                        ids.push(item.id)
                    }
                }
             })
            if(!flage){
                this.$message.error('只能作废生效的数据！')
                return false
             }
             if(ids.length < 1){
                this.$message.error('只能作废已暂存的数据！')
                return false
             }
            let args = {"idList":ids, "updateUser":Cookie.get('t8t-tc-uid') }
            this.cancelLoading = true
            api.workerAttachServiceCancel(args).then((res) =>{
                this.cancelLoading = false
                 if(res.data.status == 200){
                        this.$message({
                                    type: 'success',
                                    message: '作废成功！'
                                })
                        this.$refs['tableDebitType'].reloadTable()
                        this.$refs['tableDebitType'].resetActionLog()
                 }else{
                        this.$message({
                                  type:'error',
                                  message:res.data.message
                               })
                 }
            })
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
