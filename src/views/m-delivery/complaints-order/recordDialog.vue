<template>
    <div class="recordTableDialog">
        <el-dialog @close="closeDialog()"
                   v-model="dialogVisible"
                   class="record-table-dialog"
                   :title="title">
            <div>
                <div class="g-main-container-column">
                    <t8t-table
                        :columns="columns"
                        ref="recordTables"
                        :commonData="selectSource"
                        :service="service"
                        :method="method"
                        :args="args"
                        :dataSource="dataSource"
                        :pageBar="false"
                        :selectCol="false"
                    ></t8t-table>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import schema from './complaintsOrder-schema'
    import Cookie from 'js-cookie'
    import ComplaintApi from 'src/services/delivery/complaint.js'
    //todo 接口引入

    export default {
        name: "record-table-dialog",
        data() {
            return {

                selectArr: [],
                selectSource: {
                    statusOptions: []
                },
                checkboxSet: false,
                dialogVisible: true,
                columns: [
                {
                    label: '修改内容',
                    prop: 'contents',
                },
                {
                    label: '修改时间',
                    prop: 'updataTime',
                    formatter: 'dateParser',
                    width: "130px"
                },
                {
                    label: '修改人',
                    prop: 'updataUser',
                    width: "120px"
                }],
                testData: [],
                receiptData: [],
                repeatArrOrigin: [],
                title: '操作记录',
                btnLoading: false,
                btnDisabled: false,
                dataSource:[],
                service:'',
                method:'',
                args:[],
            }
        },
        props: ["orderCode"],
        created() {
            ComplaintApi.OplQueryPage({search:{recordNo:this.orderCode},"page":1,size:100}).then(res =>{
                if(res.data.status != 200) {
                    this.$message.error("操作记录获取失败")
                    return
                }
                let _list = []
                res.data.result.rows.forEach(item => {
                    _list.push({contents:item.remark,updataUser:item.username,updataTime:item.opTime})
                })
                this.dataSource = _list
                }).catch(error => {
                        console.log(error)
                })
        },
        methods: {
            closeDialog() {
                this.$emit('close')
            },
        }
    }
</script>

<style lang="css" scope>
    .recordTableDialog .record-table-dialog .el-dialog--small {
        width: 600px;
    }

    .recordTableDialog .record-table-dialog .table-container {
        min-height: 360px;
    }

</style>
