<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="statusOptions"
            @list-view="doView"
            @list-delete="beforeDoDelete"
            @list-add="doAdd"
            @list-edit="doEdit"
            @search-submit="onSearchSubmit"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
        <add-dialog v-if="dialogVisible" @closeDiaLog="readLoad">

        </add-dialog>

        <el-dialog title="作废确认" v-model="disuseDialogVisible" size="small">
            <p class="my-span">确认对所选数据进行作废处理？</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doDelete">作 废</el-button>
                <el-button @click="disuseDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import addDialog from './depositCredit-addDialog.vue'
    import depositAPI from 'src/services/finance/deposit.js'
    import Cookie from 'js-cookie'

    export default {
        components: {T8tListView, addDialog},
        data () {
            return {
                // service 和 method 目前需要加密
                service: 'J09tlUEmAKVvNVXOvOYPLiJqJ3OHyxy', // /biz/t8t-fi-qad/app
                method: 'hnpnTAAuf3NrAh6a6lQnF5abLrv', // views.credit.query
                deleteMethod: '4r4XuHd7FblJtC5pLy69SZD-5Y4tWnq_01EvRRg', // depositCredit.deleteByIds
                dialogVisible: false,
                disuseDialogVisible: false,
                tableArgs: {
                    search: {
                        id: null
                    },
                    sort: ["id_desc"]
                },
                // 表头描述
                tableColumns: [
                    {prop:'id', label:'ID'},
                    {prop: 'orgName', label: '组织'},
                    {prop: 'credit', label: '总额'},
                    {prop: 'baseDeposit', label: '固定保证金'},
                    {prop: 'status',
                        label: '状态',
                        formatter:function(val,row){
                            if(val == 1){
                              return "有效";
                            }
                            return "作废"
                        }
                    },
                    {prop: 'createName', label: '创建人'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'updateName', label: '修改人'},
                    {prop: 'updateTime', label: '修改时间', formatter: 'dateParser'},

                ],

                // 搜索项配置
                searchFields: [],
                // 面包屑
                breadcrumbData: [
                    {
                        title: '财务'
                    },
                    {
                        title: '财务基础配置'
                    },
                    {
                        title: '质保金额度配置'
                    }
                ],
                // 搜索项对应值
                searchOptions: {},

            }
        },
        methods: {
            onSearchSubmit () {

            },
            onchange (val) {

            },
            //点击作废按钮，弹出确认作废框
            beforeDoDelete(){
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                if (selections.length === 0) {
                    this.$message.error('请勾选数据后再试')
                }
                else {
                    //唤出弹出确认框
                    this.disuseDialogVisible = true
                }
            },

            //调用接口真正地作废
            doDelete () {
                let _this = this
                _this.disuseDialogVisible = false
                let selections = this.$refs['list-view'].getTableInstance().getSelectRows()
                let args = {
                    ids: [],
                    operId: parseInt(Cookie.get('t8t-tc-uid')),
                }
                selections.forEach(function (item) {
                    args.ids.push(item.id)
                })
                depositAPI.disuseDepositCredit(args)
                    .then((result) => {
                        if (result.data.status === 200 && result.data.result === 1) {

                            this.$msgbox({
                                title: '消息',
                                type: 'success',
                                message: '作废成功',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain',
                                callback: function () {
                                    _this.$refs['list-view'].getTableInstance().reloadTable()
                                }
                            })

                        }
                        else {
                            this.$alert(result.data.message, '错误提示', {
                                confirmButtonText: '确定'
                            })
                        }
                    })

            },
            doView () {
                this.$refs['list-view'].doView(this.detailRoute)
            },
            readLoad(){
                this.dialogVisible = false
                this.$refs['list-view'].getTableInstance().reloadTable()

            },
            doAdd () {
                this.dialogVisible = true
            },
            doEdit () {
                this.$refs['list-view'].doEdit(this.detailRoute)
            }
        }
    }
</script>

<style lang="css" scoped>

    .my-span {
        text-align: center;
    }


</style>
