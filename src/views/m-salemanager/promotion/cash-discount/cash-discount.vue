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
            @EDIT = "edit"
            @ADD = "add"
            @ANTI-DISABLE = "noforBid"
            @DISABLE = "forBid"
            @UNDO  = "concel"
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
    </div>
</template>
<script>

import apiCommon from 'src/services/commonApi/commonApi.js'
import Service from 'src/services/salemanager/Service.js'
import Utils from 'src/utils/Utils.js'
import api from 'src/services/salemanager/cashDiscount.js'
export default {
    data(){
        return{
                imgDialog:false,
            //面包屑
                breadcrumbData: [
                    { title: '销售管理' },
                    { title: '促销管理' },
                    { title: '现金优惠' }
                ],
                //搜索表单项配置
                fields:[
                    { type: 'input' , label: '现金优惠ID',name: 'id' },
                    { type: 'input' , label: '现金优惠名称',name: 'name_like'},
                    { type: 'select' , label: '优惠状态',name: 'status',selectSourceKey:'discountStatus' },
                    { type: 'datetime' , label: '发放开始时间',name: 'beginTime'},
                    { type: 'datetime' , label: '发放结束时间',name: 'endTime'},
                    { type: 'datetime' , label: '使用截止时间',name: 'effectiveTime'},
                    { type: 'select' , label: '可支付款项类型',name: 'effectivePayment_like',selectSourceKey:'effectivePayment'},
                    { type: 'select' , label: '可使用组织范围',name: 'effectiveOrg_like',selectSourceKey:'effectiveOrg'},
                    { type: 'select' , label: '面值类型',name: 'parValueType',selectSourceKey:'parValueType' },
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSource: {
                    discountStatus: [{
                        text: '暂存',
                        value: 0
                    },{
                        text: '发放中',
                        value: 1
                    },{
                        text: '发放已满',
                        value: 2
                    }],
                    isForbiddenStatus:[{
                        text: '启用',
                        value: 0
                    },{
                        text: '禁用',
                        value: 1
                    }],
                    parValueType:[{
                            text: '固定面值',
                            value: 1
                        },{
                            text: '随机面值',
                            value: 2
                    }],
                    effectivePayment:[],
                    effectiveOrg:[],

                },
                //表格

                columns: [{
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
                },{
                    prop: 'endTime',
                    label: '发放结束时间',
                    formatter: "dateParser"
                },{
                    prop: 'effectiveTime',
                    label: '使用截止时间',
                    formatter: "dateParser"
                },{
                    width:300,
                    prop: 'effectiveOrgNames',
                    label: '可使用组织范围',
                }, {
                    prop: 'status',
                    label: '优惠状态',
                    list: "discountStatus"
                },{
                    prop: 'isForbidden',
                    label: '状态',
                    list: "isForbiddenStatus"
                }],
                //请求参数配置
                service: Service.CASHDISCOUNT.name,
                method: Service.CASHDISCOUNT.methods.PRIVILEGElIST,
                args: {
                    search: {id: null}
                },
        }
    },
    created(){

        this.getCommonOptions('61003','effectivePayment')
        this.getEffectiveOrg('effectiveOrg')
    },
    activated() {
        this.$refs['t8ttable'].reloadTable()
    },
    methods:{
        //新增
        add()
        {
            this.$TCS.addTag('erp_scm_015001001003');
            this.$router.push({path: '/salemanager/cash-discount/add'})
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
                    message: '暂存状态才能进行编辑操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else{
                this.$router.push({path: '/salemanager/cash-discount/edit',query:{rowId:selectRow.id}})
            }

        },
        //搜索，提交搜索并且发起刷新表格数据的请求
        submitSearch(data) {
           /*
            data.effectivePayment_like = this.changeString(data.effectivePayment_like)
            data.effectiveOrg_like = this.changeString(data.effectiveOrg_like)*/
            if(data.effectivePayment_like){
                data.effectivePayment_like = data.effectivePayment_like + ''
            }
            if(data.effectiveOrg_like)
            {
                data.effectiveOrg_like = data.effectiveOrg_like + ''
            }
            this.args = {
                search: data
            }
        },
        changeString(array)
        {
                var str = ''
                if(array instanceof Array)
                {
                    for(let i=0 ; i < array.length ; i++ )
                    {
                        str = str + array[i] + ','
                    }

                }
                if(str!=='')
                {
                    str = str.substr(0,str.length-1);
                }
                return str

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
        getEffectiveOrg(selectName)
            {
                let arg =  {
                    search:{
                        typeCode_eq:'001003010',
                        isDel:'0'
                    }
                }
                let list = []
                api.queryOrg(arg)
                .then((res) => {
                    if (res.data.status === 200) {
                        res.data.result.rows.forEach((item) => {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                        })
                        this.selectSource[selectName] = list
                    }
                })
            },
        //撤销
        concel()
        {
            // 单行判断
            if(this.checkSelection() === false) return false
            let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是启用

            if(selectRow.status !== 0){
                this.$msgbox({
                    title: '消息',
                    type: 'warning',
                    message: '暂存状态才能进行撤销操作',
                    confirmButtonText: '知道了',
                    confirmButtonClass: 'is-plain'
                })
                return false
            }else {
                // 禁用状态弹窗确认审核
                this.$confirm('确认将所选数据撤销？', '撤销确认', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(() => {
                    // 点击确定按钮
                    let args = {
                        templateId: selectRow.id,
                    }
                    api.cancel(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 1){
                            // 成功弹窗
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '撤销成功',
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
                                message: '撤销失败，请重试。',
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
        //禁用
        forBid(){
            // 单行判断
            if(this.checkSelection() === false) return false
            let selectRow = this.$refs['t8ttable'].getSelectRows()[0]
            // 勾选数据不是启用

            if(selectRow.isForbidden !== 0){
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
                this.$confirm('确认将所选数据禁用？', '禁用确认', {
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
                        templateIds: idsArr,
                        updateUserId:+ Cookie.get('t8t-tc-uid'),
                    }
                    api.forBid(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 0){
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

            if(selectRow.isForbidden !== 1){
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
                this.$confirm('确认将所选数据启用？', '启用确认', {
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
                        templateIds: idsArr,
                        updateUserId:+ Cookie.get('t8t-tc-uid'),
                    }
                    api.antiForbid(args)
                    .then((res) => {
                        if(res.data.status === 200 && res.data.result === 0){
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
