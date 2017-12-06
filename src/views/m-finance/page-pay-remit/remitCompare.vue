<template>
    <div class="remit-compare">
        <el-dialog  @close="closeDialog()"
                    v-model="dialogVisible"
                    size="full"
                    class="t8t-full-dialog"
                    title="请确认以下付款是否重复">
            <div class="page-pay-plan">
                <div class="g-main-container-column remit-compare-table">
                    <t8t-table
                        :columns="columns"
                        :dataSource="checkArray"
                        :pageBar=false
                        ref="t8ttable1"
                        :commonData="selectSource"
                    ></t8t-table>
                </div>
            </div>
            <div class="page-pay-plan">
                <div class="g-main-container-column">
                    <t8t-table
                        :selectCol=false
                        :dataSource="repeatArr"
                        :columns="columns"
                        :pageBar=false
                        ref="t8ttable2"
                        :commonData="selectSource"
                    ></t8t-table>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="onPayBtn">确认付款</el-button>
                <el-button @click="onReject">驳回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import columns from './indexColumns.json'
    import baseData from 'src/services/finance/baseData.js'
    import payRemit from 'src/services/finance/payRemit.js'

    export default {
        name: "remit-compare",
        data() {
            return {
                selectArr:[],
                selectSource:{
                    statusOptions:[]
                },
                checkboxSet:false,
                dialogVisible: true,
                columns: columns.remitCompare,
                testData: [],
                repeatArr:[],
                repeatArrOrigin:[]
            }
        },
        props:['checkArray','statusOptions'],
        created() {
            this.selectSource.statusOptions = this.statusOptions
            payRemit.checkRepeat({remitOrder: this.checkArray})
                .then((res => {
                    if (res.data.status === 200) {
                        this.repeatArr = []
                        res.data.result.remitorderVO.forEach((item) => {
                            this.repeatArr.push(item)
                            this.repeatArrOrigin.push(item)
                        })
                    }
                }))
        },
        methods: {
            onPayBtn(){
                this.SelectArr = this.$refs['t8ttable1'].getSelectRows();
                if(!this.SelectArr.length){
                    this.$message.error('请勾选数据后再试')
                    return false
                }
                this.$emit('checkRemit', this.SelectArr)

            },
            onReject(){
                this.SelectArr = this.$refs['t8ttable1'].getSelectRows();
                if(!this.SelectArr.length){
                    this.$message.error('请勾选数据后再试')
                    return false;
                }
                this.$emit('rejectRemit', this.SelectArr)
                this.$emit('close')
            },
            onView() {
                let selections = this.$refs['t8ttable1'].getSelectRows()
                let that = this
                if (selections.length !== 1) {
                    this.$message.error('请勾选一行数据后再试。')
                    return
                }
                // 弹窗查看
                this.$router.push()
            },
            closeDialog() {
                this.$router.push({ path: '/finance/page-pay-remit'})
                this.$emit('close')
            },
        }
    }
</script>

<style lang="css" scope>
    .remit-compare .table-container {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
        height: 300px;

    }
    .pagenav-container{
        height:50px;
    }
    .remit-compare-table td{
        color: red;
    }
</style>
