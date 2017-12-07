<template>
    <div>
        <t8t-list-view
            ref="list-view"
            :deleteMethod="deleteMethod"
            :breadcrumbData="breadcrumbData"
            :searchFields="searchFields"
            :searchOptions="searchOptions"
            :showSearchToggleBtn="true"
            :showTree="true"
            :treeData="treeData"
            :treeProps="treeProps"
            :tableColumns="tableColumns"
            :tableService="service"
            :tableArgs="tableArgs"
            :tableMethod="method"
            :tableCommonData="searchOptions"
            :tableRadioCol="true"
            @list-add="doAdd"
            @list-view="doMyView"
            @list-undo="doUndo"
            @search-submit="onSearchSubmit"
            @tree-node-click="treeNodeClick"
            @table-row-dobule-click="doMyView"
            @table-current-row-change="onTableCRC"
            :beforeSearchSubmit="beforeSubmit"
        >
        </t8t-list-view>
        <!-- 撤销确认弹窗 -->
        <el-dialog v-model="rejDialog" title="撤销" @close="closeRejDialog" ref="rejDialogRef">
            <div class="textarea-container">
                <el-input type="textarea" v-model="textareaText" :autosize="{minRows: 5, maxRows: 5}" placeholder="请输入撤销原因"></el-input>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onRejBtn">确定撤销</el-button>
                <el-button @click="closeRejDialog">取消撤销</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import T8tListView from 'src/components/t8t-list-view/index.vue'
    import api from 'src/services/delivery/refundOrder.js'
    import Cookie from 'js-cookie'
    export default {
        components: { T8tListView },
        // watch: {
        //     $route: function () {
        //         this.$refs['list-view'].getTableInstance().reloadTable()
        //     },
        // },
        activated(){
            this.$refs['list-view'].getTableInstance().reloadTable()
        },
        data () {
            return {
                // 面包屑
                breadcrumbData: [{ title: '工程管理' },{ title: '工程下单' },{ title: '工程退货' }],
                // 详情页路由地址
                detailRoute: '/tochat-delivery/refundOrder-detail',
                // service 和 method 目前需要加密
                service: '6P0Z49WQ726I5w0aLvTckhWu1K3Zc0t', // /biz/t8t-ps-pim/app
                method: 'NVSU5i6OJTRza7Cq6WDn9uUIE3KHF1SHFZuEHPV', // views.refundOrder.queryPage
                deleteMethod: 'WneQW3.MudoBmLTyS_w2DdaQzZnZGVtbDRTNgT1YBFB', // views.refundOrder.deleteByIds
                tableArgs: {
                },
                // 表头描述
                tableColumns: [
                    {prop: 'refundOrderCode', label: '退货单号'},
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'demandOrderCode', label: '要货单号'},
                    {prop: 'pmName', label: '项目经理'},
                    {prop: 'ownerName', label: '业主姓名'},
                    {prop: 'address', label: '详细地址'},
                    {prop: 'status', label: '单据状态', list: 'status'},
                    {prop: 'refundTime', label: '实际退货时间', formatter: 'dateParser'},
                    {prop: 'createTime', label: '创建时间', formatter: 'dateParser'},
                    {prop: 'materialType', label: '材料类型', list: 'status1'},
                ],
                // 搜索项配置
                searchFields: [
                    {type: 'input', label: '退货单号', name: 'refundOrderCode'},
                    {type: 'input', label: '项目ID', name: 'projectId'},
                    {type: 'input', label: '项目经理', name: 'pmName'},
                    {type: 'input', label: '业主姓名', name: 'ownerName'},
                    {type: 'select', label: '单据状态', name: 'status', selectSourceKey: 'status'},
                    {type: 'datetime', label: '创建时间', name: 'createTime', pickertype: 'datetimerange', startField: 'createTime_gte', endField: 'createTime_lt'},
                    {type: 'datetime', label: '实际退货时间', name: 'refundTime', pickertype: 'datetimerange', startField: 'refundTime_gte', endField: 'refundTime_lt'}
                ],
                // 搜索项对应值
                searchOptions: {
                    status: [
                        {value: 1, text: '退货中'},
                        {value: 2, text: '已撤销'},
                        {value: 3, text: '已关闭'}
                    ],
                    status1: [
                        {value: 1, text: '主材'},
                        {value: 2, text: '辅材'},
                    ]
                },
                // 树
                treeData: [],
                treeProps: {
                    label: 'name',
                    children: 'children'
                },
                rejDialog: false,
                textareaText: '',
                curRow: null,
                orgId: null
            }
        },
        methods: {
            onSearchSubmit (formData) {
                this.tableArgs = {
                    search: formData
                }
            },
            onchange (val) {

            },
            doMyView () {
                if(!this.curRow){
                    return this.$message("请选择一行数据！")
                }
                this.$router.push({
                    query: { id: this.curRow.id, refundOrderCode: this.curRow.refundOrderCode, mode: 'view' },
                    path: this.detailRoute
                })
            },
            doAdd () {
                // if(this.orgId==null){
                //     return this.$message("请选择新增组织！")
                // }
                this.$router.push({
                    query: {mode: 'add' },
                    path: this.detailRoute
                })
            },
            doUndo () {
                if(!this.curRow){
                    return this.$message("请选择一行数据！")
                }
                if(this.curRow.status !== 1){
                    return this.$message("退货中的单据才能撤销！")
                }
                this.rejDialog = true
            },
            onRejBtn() {
                if(this.textareaText===''){
                    this.$message('请输入撤销原因')
                    return
                }
                let args = {
                    refundOrder: {
                        orderCode: this.curRow.refundOrderCode,
                        cancelReason: this.textareaText,
                        updateUser: +Cookie.get('t8t-tc-uid'),
                        // updateBy: Cookie.get('t8t-tc-username')
                    }
                }
                api.refundOrderCancel(args)
                .then((res)=>{
                    if(res.data.status === 200&&res.data.result===1){
                        this.$message.success('撤销成功！')
                        this.rejDialog = false
                        this.$refs['list-view'].getTableInstance().reloadTable()
                    }else{
                        if(res.data.status === 41607){
                            this.$message('退货单状态有误')
                        }else if(res.data.status === 41608){
                            this.$message('更新要货单项可用数量错误')
                        }else{
                            this.$message('撤销失败！')
                        }
                    }
                })
            },
            closeRejDialog() {
                this.rejDialog = false
                this.textareaText = ''
            },
            initTree() {
                api.queryTreeByType({ 'typeCodes': ['001003010'] })
                    .then((res) => {
                        if(res.status === 200) {
                            this.treeData = [res.data.result]
                        }
                    })
            },
            treeNodeClick(data) {
                var formData = this.$refs['list-view'].getSearchInstance().getFormData()
                formData['orgId'] = data.id
                this.orgId = data.id
                this.tableArgs = {
                    search: formData
                }
            },
            // table当前行改变
            onTableCRC(curRow,oldRow) {
                this.curRow = curRow
            },
        },
        created() {
            this.initTree()
        }
    }
</script>

<style lang="css" scoped>
    .textarea-container {
        margin: 0 30px;
    }
</style>
