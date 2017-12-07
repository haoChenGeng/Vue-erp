<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog  v-model="isDialogShow" size="full" @close="backRoute" class="t8t-full-dialog2" :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                            @EDIT-SUBMIT="submitForm"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <t8t-form-panel ref="record"
                                        :dataSource="recordData"
                                        :fields="fields"
                                        :commonData="commonData"
                        ></t8t-form-panel>
                    </div>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="收支明细" name="one">
                                <t8t-table :columns="tableColumns"
                                           :service="service"
                                           :method="method"
                                           :args="tableArgs"
                                           :indexCol="true"
                                           :selectCol="false"
                                           ref="t8tTable"
                                           class="my-table"
                                ></t8t-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
    </div>



</template>


<script>
    import dateUtils from 'src/utils/DateUtils.js'
    import apiCommon from 'src/services/commonApi/commonApi.js'

    export default{
        component: {},
        data(){
            return {
                activeTabName: 'one',
                isDialogShow: true,
                orgName: null,
                pmId: null,
                pmName: null,
                service: 'J09tlUEmAKVvNVXOvOYPLiJqJ3OHyxy',
                method: 'zq23zKYfwg3rzuOe9ksrKdnGECvqXpGt90T', //views.record.item.query
                tableArgs: {
                    search: {
                        recordId: null
                    },
                },
                tableColumns: [
                    {prop: 'projectId', label: '项目ID'},
                    {prop: 'orgName', label: '组织名称'},
                    {prop: 'bizTypeName', label: '业务类型'},
                    {prop: 'productPackageName', label: '产品包'},
                    {prop: 'customerName', label: '业主姓名'},
                    {prop: 'projectAddress', label: '项目地址'},
                    {prop: 'depositTypeName', label: '质保金类型'},
                    {prop: 'amount', label: '金额'},
                    {prop: 'useTypeName', label: '用途类型'},
                    {prop: 'accidentProjectId', label: '事故id'},
                    {prop: 'remark', label: '备注'},
                ],
                fields: [
                    {prop: 'code',type: 'input', label: '单据编码', disabled: true},
                    {prop: 'orgName',type: 'input', label: '组织', disabled: true},
                    {prop: 'pmId',type: 'input', label: '项目经理ID', disabled: true},
                    {prop: 'pmName',type: 'input', label: '项目经理', disabled: true},
                    {prop: 'bizTypeName',type: 'input', label: '业务类型', disabled:true},
                    {prop:'recordDirect',type: 'select', list:'recordDirectOptions',label: '收支类型',disabled: true},
                    {prop: 'amount',type: 'input', label: '总金额', disabled: true},
                    {prop: 'remark',type: 'input', label: '说明', disabled: true},
                ],
                recordData:{},
                commonData:{
                    recordDirectOptions:[{
                        text: '收入',
                        value: 1
                    },{
                        text: '支出',
                        value: 2
                    }
                    ]
                },
            }
        },

        methods: {
            backRoute(){
                this.$router.push({
                    path: '/tochat-finance/record-list'
                })
            },
            onChange(value, name){
                if(value){this.tableArgs.search[name]=value;}
                else{delete this.tableArgs.search[name]}
            },
            submitSearch(){
                this.$refs.t8tTable.reloadTable()
            },
            getCommonOptions: function (fatherCode, selectName) {
                let arg = {
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
                                if (item.propertyStatus === 1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            })
                            this.selectSource[selectName] = list
                        }
                    })
            }

        },
        created(){
            let record=this.$route.query
            this.tableArgs.search.recordId =record.id
            this.recordData.orgName = record.orgName
            this.recordData.pmId = record.pmId
            this.recordData.pmName = record.pmName
            this.recordData.recordDirect = record.recordDirect
            this.recordData.amount= record.amount
            this.recordData.remark = record.remark
            this.recordData.code = record.code
            this.recordData.bizTypeName = record.bizTypeName
        }

    }

</script>

<style scoped>
    .full-dialog-form-container{
        margin-top:20px;
    }
    /*.my-table{
        width: 1600px;
        height:500px;
        margin: 0 auto;
    }*/
</style>
