<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            @submit="submitSearch"
            ref="t8tSearch"

        >
        </t8t-search>
        <t8t-toolbar
            @ADD = "add"
            @EDIT = "edit"
            @BEINVALID = "beInvalid"
            @INVALIDCONCEL = "invalidConcel"
        >
        </t8t-toolbar>
        <t8t-table
            :columns="columns"
            :service="service"
            :method="method"
            :args="args"
            ref="t8ttable"
            :commonData="selectSource"
            @row-double-click="edit"
        >
        </t8t-table>
        <div v-if="addDiscount">
            <el-dialog title="添加优惠单" v-model="addDiscount2" @close="closeAddDiscount" ref="addDialogRef" class="addDiscount">
                <t8t-search
                    :fields="fieldsData"
                    :selectSource="selectSourceData"
                    @submit="submitSearchData"
                     ref="t8tsearchData"
                >
                </t8t-search>
                <t8t-table
                    :columns="columnsData"
                    :service="serviceData"
                    :method="methodData"
                    :args="argsData"
                    ref="t8ttableData"
                    :commonData="selectSourceData"
                    :radioCol="true"
                >
                </t8t-table>

                <div slot="footer">
                    <el-button type="primary" @click="onAddDiscount" :loading="isLoading">确认</el-button>
                    <el-button @click="closeAddDiscount">关闭</el-button>
                </div>

            </el-dialog>
        </div>
    </div>
</template>
<script>

import Service from 'src/services/salemanager/Service.js'
import Utils from 'src/utils/Utils.js'
import api from 'src/services/salemanager/cashDiscount.js'
export default {
    data(){
        return{
            //面包屑
                isLoading: false,
                addDiscount:false,
                addDiscount2:true,
                templetId:null,
                breadcrumbData: [
                    { title: '销售管理' },
                    { title: '促销管理' },
                    { title: '优惠单' }
                ],
                //搜索表单项配置
                fields:[
                    { type: 'input' , label: '项目ID',name: 'bindId' },
                    { type: 'input' , label: '现金优惠名称',name: 'templateName_like'},
                    { type: 'input' , label: '现金优惠单编码',name: 'code' },
                    { type: 'select' , label: '使用状态',name: 'status',selectSourceKey:'useStatus' },
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSource: {
                    useStatus: [{
                        text: '未使用',
                        value: 0
                    },{
                        text: '审核',
                        value: 1
                    },{
                        text: '已使用',
                        value: 2
                    },{
                        text: '无效',
                        value: 3
                    }],
                },
                //表格

                columns: [{
                    prop: 'bindId',
                    label: '项目ID'
                },{
                    prop: 'code',
                    label: '现金优惠单编码',
                },{
                    prop: 'templateName',
                    label: '现金优惠名称',
                }, {
                    prop: 'privilegeAmount',
                    label: '优惠金额',
                }, {
                    prop: 'organizationName',
                    label: '使用组织',
                }, {
                    prop: 'paymentName',
                    label: '支付款项用途'
                },{
                    prop: 'updateTime',
                    label: '使用时间',
                    formatter: "dateParser"
                }, {
                    prop: 'status',
                    label: '状态',
                    list: 'useStatus'
                }, {
                    prop: 'createTime',
                    label: '发放时间',
                    formatter: "dateParser"
                }, {
                    prop: 'createBy',
                    label: '发放人'
                }],
                //请求参数配置
                service: Service.CASHDISCOUNT.name,
                method: Service.CASHDISCOUNT.methods.PRIVILEGEORDERLIST,
                args: {
                    search:{
                        bindId_gt:0,
                    }
                },
                //搜索表单项配置
                fieldsData:[
                    { type: 'input' , label: '现金优惠名称',name: 'name_like'},
                    { type: 'input' , label: '现金优惠ID',name: 'id' },
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSourceData: {
                    discountStatus: [{
                        text: '暂存',
                        value: 0
                    },{
                        text: '发放中',
                        value: 1
                    }],

                },
                //表格

                columnsData: [{
                    prop: 'id',
                    label: '现金优惠ID',
                }, {
                    prop: 'name',
                    label: '现金优惠名称',
                }, {
                    prop: 'privilegeRental',
                    label: '优惠总额',
                }, {
                    prop: 'providedRental',
                    label: '优惠发放总额'
                }, {
                    prop: 'beginTime',
                    label: '发放开始时间',
                    formatter: "dateParser"
                }, {
                    prop: 'endTime',
                    label: '发送结束时间',
                    formatter: "dateParser"
                }, {
                    prop: 'status',
                    label: '优惠状态',
                    list: "discountStatus"
                }],
                //请求参数配置
                serviceData: Service.CASHDISCOUNT.name,
                methodData: Service.CASHDISCOUNT.methods.PRIVILEGElIST,
                argsData:{
                    search:{
                        status:1,
                        isForbidden: 0,
                        valid:1,
                    },
                    sort:["id_desc"]
                },
        }
    },
    created() {
        if(this.$route.query.bindId!==''||this.$route.query.bindId!==undefined)
        {
            this.args.search.bindId = this.$route.query.bindId
        }

    },
    mounted () {
            this.$nextTick(() => {
                if(this.$route.query.bindId!=='')
                {
                    this.$refs.t8tSearch.setFormData({
                        bindId: this.$route.query.bindId
                    })
                }

            })
    },
    activated() {
        this.$refs['t8ttable'].reloadTable()
    },
    methods:{
        //搜索，提交搜索并且发起刷新表格数据的请求
        submitSearch(data) {

            this.args = {
                search: data
            }
        },
        submitSearchData(data)
        {
            data['status'] = 1
            data['isForbidden'] = 0
            this.argsData = {
                search: data,
                sort:["id_desc"]
            }
        },
        add()
        {
            this.$TCS.addTag('erp_scm_015001004003');
            this.addDiscount=true
        },
        edit()
        {
            // 单行判断
            if(this.checkSelection() === false) return false
            let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            if(selectRow.status !== 0){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '未使用状态才能进行编辑操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else{
                this.$router.push({path: '/salemanager/discount-bills/edit',query:{rowId:selectRow.id}})
            }
        },
        closeAddDiscount()
        {
            this.addDiscount=false
            this.isLoading = false
            this.addDiscount2 = true
        },
        onAddDiscount()
        {
            let selectRow = this.$refs['t8ttableData'].getSelectRows()[0]
            if(selectRow)
            {
                this.isLoading = true
                this.templetId = selectRow.id
                this.closeAddDiscount()
                this.$router.push({path: '/salemanager/discount-bills/add',query:{rowId:this.templetId}})

            }else{
                this.$message.error("请选择优惠单")
                return
            }

        },
        beInvalid()
        {
             // 单行判断
            if(this.checkSelection() === false) return false
            let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是启用

            if(selectRow.status !== 0){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '未使用状态才能进行设为无效操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 禁用状态弹窗确认审核
                this.$confirm('确认将所选数据设为无效？', '设为无效确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮

                    let args = {
                        orderId: selectRow.id,
                        updateUserId:+ Cookie.get('t8t-tc-uid'),
                    }
                    api.setDisable(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '设为无效成功',
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
                                message: '设为无效失败，请重试。',
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
        invalidConcel()
        {
             // 单行判断
            if(this.checkSelection() === false) return false
            let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是启用

            if(selectRow.status !== 3){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '无效状态才能进行无效取消操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 禁用状态弹窗确认审核
                this.$confirm('确认将所选数据无效取消？', '无效取消确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮

                    let args = {
                        orderId: selectRow.id,
                        updateUserId:+ Cookie.get('t8t-tc-uid'),
                    }
                    api.cancelDisable(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '无效取消成功',
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
                                message: '无效取消失败，请重试。',
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
<style lang="css" scoped>
    .addDiscount .el-dialog .el-dialog__body
    {
        height: 450px;
    }
    .addDiscount .el-dialog .el-dialog__body .t8t-table
    {
        height: 395px;
    }

</style>
<style>
    .addDiscount .el-dialog--small
    {
        width: 900px;

    }
</style>
