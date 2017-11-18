<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search
            :fields="fields"
            :selectSource="selectSource"
            :showToggleBtn="showToggleBtn"
            @submit="submitSearch"
            >
        </t8t-search>
        <t8t-toolbar
            @VIEW="viewBtnClick"
            @CANCEL="cancelBtnClick"
        >
        </t8t-toolbar>
        <t8t-table
            ref="t8tTable"
            :columns="columns"
            :service="service"
            :method="method"
            :args="args"
            :commonData="commonData"
            @row-double-click="viewBtnClick"
        >
        </t8t-table>
    </div>
</template>

<script>
    import apiCommon from 'src/services/commonApi/commonApi.js'
    import Service from 'src/services/finance/Service.js'
    import apiVerifyCancelRecord from 'src/services/finance/verifyCancelRecord.js'
    import Cookie from 'js-cookie'
    export default {
        name: 'page-verify-cancel-record',
        data() {
            return {
                //搜索表单项配置
                fields: [
                    {type: 'input',label: '核销编号',name: 'code_like'},
                    {type: 'select',label: '核销状态',name: 'verifyStatus', selectSourceKey:'verifyCancelStatus'}
                ],
                //搜索select类型下拉列表数据，对应fields的selectSourceKey
                selectSource: {
                    verifyCancelStatus: [
                        {
                            text: "未核销",
                            value: 1
                        },
                        {
                            text: "已核销",
                            value: 3
                        },
                        {
                            text: "作废",
                            value: 4
                        }
                    ]
                },
                //搜索是否展示更多查询按钮,不配置默认展示
                showToggleBtn: false,

                //面包屑
                breadcrumbData: [
                    { title: '财务' },
                    { title: '资金管理' },
                    { title: '核销记录' }],
                //表格
                columns: [{
                    prop: 'code',
                    label: '核销编号'
                }, {
                    prop: 'verifyAmount',
                    label: '核销金额'
                }, {
                    prop: 'verifyStatus',
                    label: '核销状态',
                    list: 'verifyStatus'
                }, {
                    prop: 'verifyName',
                    label: '核销人'
                },
                {
                    prop: 'verifyTime',
                    label: '核销日期',
                    formatter: "dateParser"
                },
                {
                    prop: 'updateName',
                    label: '修改人'
                }, {
                    prop: 'updateTime',
                    label: '修改日期',
                    formatter: "dateParser"
                }],
                commonData: {
                    verifyStatus: [
                        {
                            text: "未核销",
                            value: 1
                        },
                        {
                            text: "部分核销",
                            value: 2
                        },
                        {
                            text: "已核销",
                            value: 3
                        },
                        {
                            text: "作废",
                            value: 4
                        }
                    ]
                },
                //table
                service: Service.VERIFYCANCELRECORD.name,
                method: Service.VERIFYCANCELRECORD.methods.VERIFYORDERQUERY,
                args: {
                    sort: ['id_desc']
                }
            }
        },
        methods: {
            //搜索，提交搜索并且发起刷新表格数据的请求
            submitSearch(data) {
                this.args = {
                    search: data,
                    sort: ['id_desc']
                }
            },
            //工具条安钮
            viewBtnClick: function(){
                this.$TCS.addTag('erp_finance_007005003001')
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选核销记录后再试。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条核销记录进行操作。')
                }else{
                    this.$router.push({path:'page-verify-cancel-record/see',query:{rowId:selections[0].id}})
                }
            },
            cancelBtnClick: function(){
                 this.$TCS.addTag('erp_finance_007005003002')
                let selections = this.$refs['t8tTable'].getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选核销记录后再试。')
                } else if (selections.length > 1) {
                    this.$message.error('请对单条核销记录进行操作。')
                }else if(selections[0].verifyStatus!==3){
                    this.$message.error('已核销状态才能取消核销。')
                }
                else {
                    let args = {
                        operId: parseInt(Cookie.get('t8t-tc-uid')), //操作人ID
                        verifyOrderIds: []//核销单头ID
                    }
                    args.verifyOrderIds.push(selections[0].id)
                    apiVerifyCancelRecord.verifyOrderItemAnti(args)
                    .then((res) => {
                        if (res.data.status === 200&&res.data.result===1) {
                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '取消核销成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            this.$refs['t8tTable'].reloadTable()
                        }
                        else {
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: res.data.message.split('|||')[0],
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })

                        }
                    })
                }
            }
        }
    }

</script>

<style
    lang="css"
    scoped
>
</style>

<style>

</style>
