<template>
    <div class="reAllocation">
        <el-dialog title="重新分单" size="small" class="t8t-full-dialog" v-model="reallocationVisible" @close="btnCancleClick">
            <div class="my-dialog-container">
                <el-form :label-position="labelPosition"
                         :model="formData"
                         :label-width="formLabelWidth"
                         :rules="rules"
                         ref="reAllocationForm"
                         @keyup.enter.native="btnOKClick()">
                    <el-form-item prop="companyId" label="分公司">
                        <el-select v-model="formData.companyId"  filterable placeholder="分公司" @change="showStore">
                            <el-option v-for="item in dataSource.companies" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="门店" prop="storeId">
                        <el-select v-model="formData.storeId"  filterable placeholder="门店">
                            <el-option v-for="item in dataSource.stores" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="my-button">
                    <el-button
                        type="primary"
                        @click="btnOKClick"
                    >确定</el-button>
                    <el-button
                        @click="btnCancleClick"
                    > 取消</el-button>
                </div>
            </div>

    </el-dialog>
    </div>

</template>
<script>
    import Cookie from 'js-cookie'
    import DateUtils from 'src/utils/DateUtils.js'
    import Methods from 'src/services/salemanager/companyAllocation.js'
    import Storage from 'src/services/storages/storages.js'

    export default {
        name: 'receipt-dialog',
        components: {
        },
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '80px',
                reallocationVisible: true,
                formData:{
                    'id':null,
                    'companyId':'',
                    'storeId':'',
                    'userId':+Cookie.get('t8t-tc-uid'),
                },
                dataSource: {
                    stores :[

                    ],
                    companies :[

                    ],
                },
                rules: {
                    companyId: [
                        {
                            required: true,
                            message: '请选择分公司',
                        },
                    ],
                    storeId: [
                        {
                            required: true,
                            message: '请选择门店',
                        },
                    ],
                },
            }
        },
        props: {
            flowUserList:Array,
            selectionId:'',
        },
        computed: {},
        created() {
            Storage.getAllBranchCompany().then(res => {
                if( res.data.status == 200 ){
                    let list=[];
                    res.data.result.rows.forEach((item) =>{
                        list.push({
                            value:item.id,
                            text:item.name
                        })
                    })
                    this.dataSource.companies=list;
                }
            })
        },

        methods: {
            onChange: function (value, name) {
                this.formData[name] = value
            },
            onSelect: function (value, name) {
                this.formData[name] = value;
            },
            showStore(companyId){
                this.dataSource.stores=''
                this.formData.storeId=''
                Storage.getAllStoreByCompanyId(companyId).then(res => {
                    if(res.data.status == 200){
                        let list=[];
                        res.data.result.rows.forEach((item)=>{
                            list.push({
                                value:item.id,
                                text:item.name
                            })
                        })
                        this.dataSource.stores=list;
                    }
                })
            },
            btnOKClick(){
                let _this = this
                this.$refs['reAllocationForm'].validate(valid => {
                    if (valid) {
                        let formData = Object.assign({},this.formData)
                        formData.id = this.selectionId
                        Methods.reAllocation(this.selectionId, formData.companyId, formData.storeId, formData.userId).then(res => {

                            if( res.data.status == 200 ){
                                _this.$parent.$refs['list-view'].$refs['list-table'].reloadTable()
                                this.btnCancleClick()
                                return this.$message({
                                    'type' : 'success',
                                    'message': '重新分单成功'
                                })
                            }else{
                                return this.$message({
                                    'type' : 'warning',
                                    'message': res.data.message
                                })
                            }


                        }).catch(e => {
                            return this.$message({
                                'type' : 'warning',
                                'message': '调用重新分单接口失败'
                            })
                        })
                    } else {
                        return false
                    }
                })
            },
            btnCancleClick(){
                this.$emit('close')
            }
        }
    };

</script>
<style>
    .reAllocation .el-dialog--small {
        width: 350px !important;
    }
</style>
<style lang="css" scoped>
    .my-dialog2-container{
        width: 100%;
        height: 100%;
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .my-table{
        display: flex;
        flex:1;
    }
    .my-button{
        padding:10px;
        text-align: center;
        margin: 10px;
    }
    .t8t-search{
        overflow: visible;
    }

</style>
<style>
    .owner-add-dialog .owner-add-input .el-input {
    }
</style>
