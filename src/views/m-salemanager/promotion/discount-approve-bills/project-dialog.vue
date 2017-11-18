<template>
    <div class="project-dialog">
        <el-dialog
            :title="dialogTitle"
            v-model="dialogVisible"
            class="project-dialog"
            @close="closeDialog">
            <t8t-search
                :fields="fields"
                :ref="t8tSearch"
                :selectSource="selectSourceData"
                @submit="submitSearch"
            ></t8t-search>
            <t8t-table
                :columns="columns"
                :service="service"
                :method="method"
                :args="args"
                :radioCol="true"
                ref="t8tTable"
            ></t8t-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading">确定</el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Service from 'src/services/salemanager/Service.js'
    import cashDiscountApi from 'src/services/salemanager/cashDiscount.js'

    export default {
        name: 'project-dialog',
        data() {
            return {
                dialogTitle: '选择项目',
                dialogVisible: true,
                fields:[
                    { type: 'input',label: '项目ID',name: 'id' },
                    { type: 'select' , label: '门店',name: 'organizationId',selectSourceKey:'organization',filterable: true },
                ],
                //搜索select类型下拉列表数据，对应searchFormConfig的commonOptionsName
                selectSourceData: {
                    organization:[],
                },
                columns:[
                    {prop: 'id', label: '项目ID'},
                    {prop: 'ownerName', label: '业主称呼'},
                    {prop: 'organizationName', label: '门店'},
                    {prop: 'houseAddress', label: '详细地址'}
                ],
                service: Service.DISCOUNT_APPROVE_BILLS.name,
                method: Service.DISCOUNT_APPROVE_BILLS.methods.LIST_DECORATION_ORDERINFO,
                args:{
                    search: {
                        id: null,
                        organizationName: null
                    }
                },
                addRoute: '/salemanager/discount-approve-bills/add',
            }
        },
        created ()
        {
            this.getOrganization('organization')
        },
        methods: {
            closeDialog()
            {
                this.$emit('close')
            },
            submitSearch(formData)
            {
                this.args = {
                    search: formData
                }
            },
            btnOKClick()
            {
                let row = this.$refs.t8tTable.getSelectRow()
                if (!row || row.length === 0) {
                    this.$message.error('请勾选数据后再操作')
                }
                else {
                    this.$router.push({
                        path: this.addRoute,
                        query: { mode: 'add', yid: row.id },
                    })
                    this.closeDialog()
                }
            },
            getOrganization(selectName)
            {
                let arg =  {
                    search:{
                        typeCode_eq:'001003010',
                        isDel:'0'
                    }
                }
                let list = []
                cashDiscountApi.queryOrg(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.rows.forEach((item) => {
                                list.push({
                                    value: item.id,
                                    text: item.name
                                })
                            })
                            this.selectSourceData[selectName] = list
                        }
                    })

            },
        }
    }
</script>

<style lang="css">
    .project-dialog .el-dialog{
        width: 900px;
    }
    .project-dialog .el-dialog .el-dialog__body
    {
        height: 450px;
    }
    .project-dialog .el-dialog .el-dialog__body .t8t-table
    {
        height: 395px;
    }
</style>
