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
                    <t8t-form-panel ref="record"
                                    :commonData="selectSource"
                                    :dataSource="recordData"
                                    :fields="fields"
                    ></t8t-form-panel>
                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="activeTabName">
                            <el-tab-pane label="余额明细" name="one">
                                <t8t-table :columns="tableColumns"
                                           :service="service"
                                           :method="method"
                                           :args="tableArgs"
										   :selectCol="false"
                                           :indexCol="true"
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

    export default{
        data(){
            return {
                recordData:{
                    pmId:'',
                    orgName:'',
                    pmName:'',
                },
                activeTabName: 'one',
                isDialogShow: true,
                service: 'J09tlUEmAKVvNVXOvOYPLiJqJ3OHyxy',
                method: 'aWWSezdnKaZBWwJz9Ycw3mN3CuHlx1HUYJn', //views.deposit.item.query
                tableArgs: {
                    search: {
                        pmId:null,
                    },
                },
                tableColumns:[
                    {prop:'depositTypeName', label :'类型'},
                    {prop:'projectId', label:'项目ID'},
                    {prop:'balance', label:'余额'},
                ],
                fields: [
                    {prop:'orgName',type: 'input', label: '组织', disabled: true},
                    {prop:'pmId',type: 'input', label: '项目经理ID', disabled: true},
                    {prop:'pmName',type: 'input', label: '项目经理', disabled: true}
                ],

                breadcrumbData:[
                    {title:'财务'},
                    {title:'质保金管理'},
                    {title:'余额明细查询'}
                ],

            }
        },

        methods: {
            backRoute(){
              this.$router.push({
                  path: '/finance/deposit-list'
              })

            }
        },

        created(){
            this.tableArgs.search.pmId = this.$route.query.pmId
            this.recordData.orgName = this.$route.query.orgName
            this.recordData.pmId = this.$route.query.pmId
            this.recordData.pmName = this.$route.query.pmName
        }
    }
</script>
<style scoped>
    .dialog2-main-container  {
        margin-top:20px
    }
</style>
