<template>
    <div class="add-tab-5">
        <div class="my-toolbar" v-if="!eidtType">
            <el-button type="primary" size="small" icon="plus" @click="add()">申请新银行卡</el-button>
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
            :templateData="templateData"
            @cell-click="handleCellClick"
            @cell-editor-change="handleFormItemChange"
            @data-loaded="handDataLoaded"
            :editable="!eidtType"
            :pageBar="true"
        >
        </t8t-table>
    </div>
</template>

<script>
import service from 'src/services/delivery/Service.js'
import apiCommon from 'src/services/commonApi/commonApi.js'
import tableConfig from './add-tab-5.js'
import {getDivisions, getProvinces} from './utils.js'
import api from 'src/services/delivery/foremanworker.js'
import axios from 'src/utils/axios.js'
import Cookie from 'js-cookie'

export default {
    name: 'add-tab-5',
    props:{
       eidtType: {
                type: Boolean,
                default: false
            },
        subOrgId:String,
        isProjectManager:{
                type: Number,
                default: 0
            },
    },
    data() {
        return {
            service: null,
            method: null,
            args: null,
            columns: tableConfig.tableDebitType,
            old_provinceCode:'',
            division:[],
            //辅助资料配置
            commonData: {
                 provinces: [],
                cities: [],
                _cities: [],
                isDefaultList:[
                    {
                        text: '是',
                        value: 1
                    },
                    {
                        text: '否',
                        value: 0
                    }
                ],
                statusList:[
                    {
                        text: '作废',
                        value: 3
                    },
                    {
                        text: '审核通过',
                        value: 2
                    },
                     {
                        text: '待审核',
                        value: 1
                    },
                    {
                        text: '暂存',
                        value: 0
                    }
                ]
            },
            templateData:{
                    bankId:'',
                    bankBranchName:'',
                    openingAccountName:'',
                    bankAccount:'',
                    provinceCode:'',
                    cityCode:'',
                    status:'',
                    isDefault:'',
                    voucher:'',
                    createName:'',
                    createTime:null
            },
            formData: {},
            roleTypeId:'',
            cancelLoading:false,
        }
    },
    created() {
        this.getCommonData('61101', 'bankList')
        this.initDivisionData().then(res =>{
            this.commonData.provinces = getProvinces(this.division)
            this.commonData.cities = this.division.reduce((acc,i)=>{
                if([11, 12, 31,50].indexOf(i.id) > -1){
                     return acc.concat([i])
                }
                return acc.concat(i.children)
            },[])
            this.commonData.cities.map((item) =>{
                item.text = item.name
                item.value = item.id.toString()
            })
        })
        this.setRoleTypeId()
         if(this.$route.query.id){
            this.args = {workerId:this.$route.query.id, sort:['id_desc']}
            this.service = service.FOREMANWORKER.name
            this.method = service.FOREMANWORKER.methods.workerBankAccountServiceQueryByWorkerId
        }
    },
    watch:{
        "$route.query":function(){
            if(this.$route.query.id){
                this.args = {workerId:this.$route.query.id, sort:['id_desc']}
                this.service = service.FOREMANWORKER.name
                this.method = service.FOREMANWORKER.methods.workerBankAccountServiceQueryByWorkerId
            }
        }
    },
    methods: {
        initDivisionData(){
           return axios({
                    method: '9QcAm_g-pEd7h1maNn1y5_E2NYs0VOh6yyAaz2wpahZ',//standardDistrict.allTree.get
                    service: 'SAQyRkx8GNYji7u1QcT6nJGYUFe7I14',///biz/t8t-sys-dst/app
                    args: {}
                }).then((res) => {
                    if(res.data.status === 200) {
                        this.division = res.data.result
                    }
                })
        },
        handleCellClick(row, column, cell, event){
            if(row.status == 3 && !this.eidtType){
                this.$refs.tableDebitType.handleFormItemBlur()
                return false;
            }
            let provinceCode = row.provinceCode
            if(column.property == "voucher" && !this.eidtType){
                 let fileName = ''
                 if(row.voucherUrl){
                        fileName =  row.voucher ||  'voucher.png'
                }
                 this.$emit('uploadDialogShow', row.voucherUrl, fileName, this.$refs['tableDebitType'].dataSource.indexOf(row), 'tab5')
            }else if (column.property =="cityCode") {
                this.commonData._cities=getDivisions(this.division, provinceCode)
            }else if (column.property =="provinceCode") {
                this.old_provinceCode = row.provinceCode
            }
        },
        handleFormItemChange(cell, val, config, status){
                if(cell.column.property == 'provinceCode' && this.old_provinceCode != val){
                    cell.row.cityCode = null
                }
        },
        setfile(fileInfo){
            this.$refs['tableDebitType'].dataSource[fileInfo.rowNum]['voucherUrl'] = fileInfo.filePath
            this.$refs['tableDebitType'].dataSource[fileInfo.rowNum]['voucher'] = fileInfo.fileName
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
        setRoleTypeId(){
              let arg =  {
                page: 1,
                search: {
                    pPropertyCode: '61004'
                },
                size: 100
            }
            let list = []
            apiCommon.queryUnionParent(arg)
            .then((res) => {
                if (res.data.status === 200) {
                    res.data.result.forEach((item) => {
                        if (item.propertyCode=='002') {
                                this.roleTypeId = item.id
                                return false
                        }
                    })
                }
            })
        },
        getDataForCreater(){
            let rows =  this.$refs['tableDebitType'].getActionLog(false);
            let data = rows.addedRows
            data.map(item => {
                            item.createUser = Cookie.get('t8t-tc-uid')
                            item.roleTypeId = this.roleTypeId
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
                            item.roleTypeId = this.roleTypeId
                 })
                data.updateList.map(item => {
                            item.updateUser = Cookie.get('t8t-tc-uid')
                            item.roleTypeId = this.roleTypeId
                })
                data.updateList = data.updateList.filter((item) =>{
                      if(item.status == 3){
                            return false;
                      }
                      return true
                })
                return data
        },
        validate(func){
            var res = true
            if(this.$refs['tableDebitType'].dataSource.length < 1 && this.isProjectManager == 1){
                this.$message.error('请添加银行卡信息')
                func(false)
                return
            }
            var num = 0
            this.$refs['tableDebitType'].dataSource.forEach((item) =>{
                if(item.isDefault > 0){
                        num++
                }
            })
            if(res && num < 1 && this.isProjectManager == 1){
                this.$message({
                          type:'error',
                          message:'请设定一张银行卡为默认'
                 })
                 func(false)
                 return
            }
             if(res && num > 1){
                this.$message({
                          type:'error',
                          message:'只能设定一张银行卡为默认'
                 })
                 func(false)
                 return
            }
            this.$refs['tableDebitType'].validate((isValid) => {
                func(isValid)
            }, true)
        },
        handDataLoaded(){
            this.$refs['tableDebitType'].dataSource.forEach((item) =>{
                    item.voucher =  'voucher.png'
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
                if(item.status >= 1){
                     flage = false
                     return false
                }else{
                    if(item.id){
                        ids.push(item.id)
                    }
                }
             })
            if(!flage){
                this.$message.error('只能作废暂存的数据！')
                return false
             }
             if(ids.length < 1){
                this.$message.error('只能作废已暂存的数据！')
                return false
             }
            let args = {"ids":ids, "updateUser":Cookie.get('t8t-tc-uid'),workerId:this.$route.query.id }
            this.cancelLoading = true
            api.workerBankAccountServiceCancel(args).then((res) =>{
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
