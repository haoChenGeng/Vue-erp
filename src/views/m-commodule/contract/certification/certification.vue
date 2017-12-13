<template>
	<div>
		<t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-toolbar
            @DISABLE = "forBid"
            @ANTI-DISABLE = "noforBid"
        >
        </t8t-toolbar>
		<t8t-table
			:columns="columns"
            :service="service"
            :method="method"
            :args="args"
            ref="t8ttable"
		>
             <template slot="sealUrl" scope="scope">
                    <el-button type="small" @click.stop="showImgDialog(scope.row['sealUrl'])">查看公章</el-button>
            </template>
		</t8t-table>
        <!-- 查看图片弹窗 -->
        <el-dialog v-model="imgDialog" @close="closeImgDialog" ref="imgDialogRef" size="full" class="g-transparent-dialog">
            <div class="g-img-container">
                <img :src="imgSrc" alt="">
            </div>
        </el-dialog>
	</div>
</template>
<script>

import apiCommon from 'src/services/commonApi/commonApi.js'
import Service from 'src/services/commodule/Service.js'
import api from 'src/services/commodule/certification.js'
import Utils from 'src/utils/Utils.js'
export default {
	name:'certification',
	data(){
		return{
                imgDialog:false,
			//面包屑
                breadcrumbData: [
                    { title: '工模售前' },
                    { title: '合同管理' },
                    { title: '实名认证库' }
                ],
                //搜索表单项配置
                fields:[
                    { type: 'input' , label: '认证ID',name: 'id' },
                    { type: 'input' , label: '角色&ID',name: 'uid',slotPosition:'prepend',slotType:'select',slotName:'roleId',selectSourceKey:'roleType'},
                    { type: 'input' , label: '名称',name: 'name_like'},
                    { type: 'select' , label: '状态',name: 'state',selectSourceKey:'certificatCode' },
                    { type: 'select' , label: '认证结果',name: 'result',selectSourceKey:'resultCode' },
                    { type: 'datepicker' , label: '认证日期',name: 'certificat',pickertype:'datetimerange',startField:'authenticTime_gte',endField:'authenticTime_lte'},   
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSource: {
                    roleType:[],
                    certificatCode: [{
                        text: '启用',
                        value: 1
                    },{
                        text: '禁用',
                        value: 2
                    }],
                    resultCode:[{
                        text: '待认证',
                        value: 0
                    },{
                        text: '认证成功',
                        value: 1
                    },{
                        text: '认证失败',
                        value: 2
                    }]

                },
                //表格

                columns: [{
                    prop: 'id',
                    label: '认证ID',
                    sortable:'true'

                }, {
                    prop: 'authenticNumber',
                    label: '数字证书',
                    width:  300,
                }, {
                    prop: 'roleName',
                    label: '角色',
                    width:  250,
                }, {
                    prop: 'uid',
                    label: '角色ID'
                }, {
                    prop: 'name',
                    label: '名称',
                    width:  250,
                }, {
                    prop: 'authenticTimeStr',
                    label: '认证时间'
                }, {
                    prop: 'sealUrl',
                    label: '公章/签名'
                }, {
                    prop: 'sourceStr',
                    label: '认证来源'
                },{
                    prop: 'modeStr',
                    label: '认证方式'
                },{
                    prop: 'resultStr',
                    label: '认证结果'
                },{
                    prop: 'times',
                    label: '认证次数',
                    formatter:this.rZtimes,
                }, {
                    prop: 'stateStr',
                    label: '状态'
                }],
                //请求参数配置
                service: Service.CERTIFICATIONRECORD.name,
                method: Service.CERTIFICATIONRECORD.methods.USER_FIND_BYID,
                args: null,
		}
	},
    created(){
        // 角色
        this.getCommonOptions('39001','roleType')
    },
    methods:{
        rZtimes(val)
        {
            return val + '次'
        },
        showImgDialog(src){
            this.imgSrc = Utils.getFullURL(src)
            this.imgDialog = true
        },
        closeImgDialog() {
            this.imgDialog = false
        },
        //搜索，提交搜索并且发起刷新表格数据的请求
        submitSearch(data) {
            if(data.authenticTime_lte < data.authenticTime_gte)
            {
                this.$message.error('开始时间需小于结束时间！')
                return false;
            }
            
            this.args = {
                search: data
            }
        },
        //获取辅助资料
        getCommonOptions: function(fatherCode,selectName) {
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
                    this.selectSource[selectName] = list
                }
            })
        },
        closeImgDialog() {
            this.imgDialog = false
        },
        //禁用
        forBid(){
            // 单行判断
            if(this.checkSelection() === false) return false
             let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是启用
           
            if(selectRow.state !== 1){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '启用状态才能进行禁用操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 禁用状态弹窗确认审核
                this.$confirm('确认将所选认证数据禁用？', '禁用确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮
                    var idsArr = [] ;
                    idsArr.push(selectRow.id)
                    let args = {
                        ids: idsArr,
                        state:2,
                    }
                    api.forBid(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '禁用成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$refs['t8ttable'].reloadTable()
                        } else {
                            // 失败弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '禁用失败，请重试。',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
                })
                .catch(() => {
                    // 关闭弹窗
                })
            }
        },
        //反禁用
        noforBid(){
              // 单行判断
            if(this.checkSelection() === false) return false
             let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是禁用
           
            if(selectRow.state !== 2){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '禁用状态才能进行启用操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 待审核状态弹窗确认审核
                this.$confirm('确认将所选认证数据启用？', '启用确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮
                    var idsArr = [] ;
                    idsArr.push(selectRow.id)
                    let args = {
                        ids: idsArr,
                        state:1,
                    }
                    api.forBid(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '启用成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$refs['t8ttable'].reloadTable()
                        } else {
                            // 失败弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: '启用失败，请重试。',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                        }
                    })
                })
                .catch(() => {
                    // 关闭弹窗
                })
            }
        },

        checkSelection() {
            let selections = this.$refs['t8ttable'].getSelectRows()
            if(selections.length===0){
                this.$message.error('请勾选记录后再试。')
                return false
            }else if(selections.length > 1){
                this.$message.error('请对单条数据进行操作。')
                return false
            }
            return true
        },
    }
}
</script>