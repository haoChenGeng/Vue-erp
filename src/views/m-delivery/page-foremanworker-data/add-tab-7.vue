<template>
    <div class="add-tab-7">
        <div class="my-toolbar" v-if="!eidtType">
            <el-button type="primary" size="small" icon="plus" @click="add()">新增</el-button>
            <el-button type="danger" size="small" icon="close" @click="del()">删除</el-button>
            <el-button type="danger" size="small" icon="close" :cancel="cancelLoading" @click="cancel()">作废</el-button>
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
            :editable="true"
            :pageBar="true"
            @cell-click="handleCellClick"
        >
        </t8t-table>
    </div>
</template>

<script>
import apiCommon from 'src/services/commonApi/commonApi.js'
import api from 'src/services/delivery/foremanworker.js'
import service from 'src/services/delivery/Service.js'
import tableConfig from './add-tab-7.js'
import Cookie from 'js-cookie'
export default {
    name: 'add-tab-7',
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
            args:null,
            columns: tableConfig.tableDebitType,
            commonData: {
                frozenTypeList:[],
                dataStatusList:[{
                        text: '无效',
                        value: 1
                    },
                    {
                        text: '生效',
                        value: 0
                    }]
            },
            //页面
            toolbarData: [
                { symbol: 'btn1', text: '新增' },
                { symbol: 'btn2', text: '查看' },
            ],
            isLoading: false,
            isDialogShow: true,

            activeTabName: 'one',
            formData: {},
            cancelLoading:false
        }
    },
    created() {
        this.getCommonData('41004', 'frozenTypeList')
        if(this.$route.query.id ){
                this.args = {frozen:{workerId:this.$route.query.id}, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.workerFrozenServiceQuery
        }
    },
    watch:{
        "$route.query":function(){
            if(this.$route.query.id ){
                this.args = {frozen:{workerId:this.$route.query.id}, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.workerFrozenServiceQuery
            }
        }
    },
    methods: {
        handleCellClick(row, column, cell, event){
            if(row.id){
                this.$refs.tableDebitType.handleFormItemBlur()
            }
        },
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
              var flage = true
             this.$refs['tableDebitType'].selectedRows.forEach((item) => {
                if(item.id){
                     flage = false
                     return false
                }
             })
             if(!flage){
                this.$message.error('只能删除未提交的数据！')
                return false
             }
            this.$refs['tableDebitType'].delRows()
        },
        validate(func){
            this.$refs.tableDebitType.validate((isValid) => {
                 func(isValid)
            })
        },
        getDataForCreater(){
            let rows =  this.$refs['tableDebitType'].getActionLog(false);
            let data = rows.addedRows
            data.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                    })
            return data
        },
        cancel(){
            if(this.$refs['tableDebitType'].selectedRows.length < 1){
                    this.$message.error('请选择需要作废的数据！')
              }
             var flage = true
             var ids = []
             this.$refs['tableDebitType'].selectedRows.forEach((item) => {
                if(item.dataStatus == 1){
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
             let args = {"frozen": {"idList": ids,"updateUser": Cookie.get('t8t-tc-uid'),"workerId": this.$route.query.id}}
             this.cancelLoading = true
             api.workerFrozenServiceCancel(args).then((res) =>{
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
