<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" size="full" v-model="isDialogShow" class="t8t-full-dialog2 dialog-new">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            class="t8t-dark"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">
                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource">
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane label="分配详情" name="detail">
                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="fields"
                                            :disabled="disabled"
                                            :options="options"
                                            v-loading.body.lock="detailLoading"
                                        ></base-panel>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import Utils from 'src/utils/Utils.js'
    import allocationApi from 'src/services/salemanager/companyAllocation.js'
    import Service from 'src/services/salemanager/Service.js'
    import Cookie from 'js-cookie'

    export default {
        name: 'company-allocation-view',
        components: {BasePanel},
        data () {
            return {
                mainActiveTab: "detail",
                dataSource: {},
                fields: [
                    {
                        type: 'input',
                        label: '项目ID',
                        prop: 'projectId',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '记录ID',
                        prop: 'id',
                        disabled: "disabled",
                    }, {
                        type: 'select',
                        label: '分配结果',
                        prop: 'allocationResult',
                        disabled: "disabled",
                        list: "allocationResult"
                    }, {
                        type: 'input',
                        label: '装修公司',
                        prop: 'companyName',
                        disabled: "disabled"
                    }, {
                        type: 'input',
                        label: '装修公司ID',
                        prop: 'companyId',
                        disabled: "disabled"
                    }, {
                        type: 'datetime',
                        label: '分配装修公司时间',
                        disabled: 'disabled',
                        prop: 'allotCompanyTime',
                    }, {
                        type: 'input',
                        label: '门店',
                        disabled: 'disabled',
                        prop: 'storeName',
                    }, {
                        type: 'input',
                        label: '门店ID',
                        disabled: 'disabled',
                        prop: 'storeId'
                    }, {
                        type: 'datetime',
                        label: '分配门店时间',
                        disabled: 'disabled',
                        prop: 'allotStoreTime',
                    }],
                options: {
                    allocationResult: [
                        {value: null, text: " "},
                        {value: 1, text: "分配装修公司失败"},
                        {value: 2, text: "分配门店失败"},
                        {value: 3, text: "分配成功"},
                    ],
                },
                detailLoading: false,
                isDialogShow: true,
            }
        },
        created(){
            allocationApi.companyAllocationFindById({id:parseInt(this.$route.query.id)}).then(res =>{
                if(res.data.status != 200 ) {
                    this.$message.error("分单记录获取失败")
                    return
                }
                this.dataSource = res.data.result
                this.dataSource.storeId = res.data.result.storeId || ''
                this.dataSource.companyId = res.data.result.companyId || ''
                this.dataSource.allotCompanyTime = res.data.result.allotCompanyTime || ""
                if(res.data.result.allocationResult < 3) {
                    this.dataSource.allotCompanyTime = ""
                    this.dataSource.storeId = ""
                    this.dataSource.companyId = ""
                    this.dataSource.companyName = ""
                    this.dataSource.storeName = ""
                }
                }).catch(error=>{
                console.log(error)
            })
        },
        methods: {
            closeDialog(){
                this.$router.push({path: "/sale-manage/company-allocation-list"})
                this.$emit('close')
            }
        }
    }
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
    /*position: relative;*/
    /*}*/


</style>
