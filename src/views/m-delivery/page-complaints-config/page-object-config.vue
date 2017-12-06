<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-toolbar
            ref="toolbarList"
            @ADD="addBtn"
            @EDIT="editBtn"
            @ENABLE="updateStatus(1)"
            @DISABLE="updateStatus(2)"
        >
        </t8t-toolbar>

        <t8t-table
            :columns="columns"
            :dataSource="dataSource"
            :commonData="commonData"
            ref="t8tTable"
            :pageBar="false"
            :service="service"
            :args="args"
            :method="method"
            @selection-change="selectionChange"
        >
        </t8t-table>
        <div>
            <el-dialog class="order-create-dialog"
                       :title="title"
                       v-model="createDialog"
                       v-loading.body.lock="dialogLoading"
                       element-loading-text="加载中"
                       @close="closeCreateDialog"
            >
                <div class="textarea-container">
                        <el-form :label-position="right" :model="formData" :rules="rules" label-width="120px"
                             ref="createForm">
                        <el-form-item label="投诉对象类型：" prop="complaintObjectType">
                            <el-select v-model="formData.complaintObjectType" placeholder="--请选择--" :disabled="editable"
                                       @change="onElSelectChange()">
                                <el-option v-for="item in commonData.roleOption" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="formData.complaintObjectType == 2 ? '投诉对象：' : '投诉对象ID：'" prop="complaintObject">
                            <el-select v-if="formData.complaintObjectType == 2"
                                       v-model="formData.complaintObject"
                                       placeholder="--请选择--"
                                       :disabled="editable">
                                <el-option v-for="item in commonData.shopOption" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                            <t8t-form-popup
                                :bindValue="formData.complaintObject"
                                :textValue="formData.complaintObject"
                                :filedValue="item.filedValue"

                                :dialog="item.dialog"
                                @change="onChange"
                                ref="objId"
                                class="create-input"
                                v-if= "formData.complaintObjectType == 1"
                                :disabled="item.disabled"
                                :icon="item.icon"
                                @select="onSelect"
                                :readonly="true"
                                :useQuery="false"
                            >
                            </t8t-form-popup>
                        </el-form-item>
                        <el-form-item label="投诉对象名称：" prop="complaintObjectName" v-if="formData.complaintObjectType == 1">
                            <el-input v-model="formData.complaintObjectName" style="width:180px" disabled="true"
                            ></el-input>
                        </el-form-item>

                    </el-form>
                </div>
                <div slot="footer" v-if="showBtn" class="createBtn">
                    <el-button type="primary" @click="submitBtn">保存</el-button>
                    <el-button @click="closeCreateDialog">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Cookie from 'js-cookie'

    import Service from 'src/services/delivery/Service.js'
    import ComplaintApi from 'src/services/delivery/complaint.js'

    export default {
        name: 'page-order-config',
        components: {},
        data() {
            return {
                editType:null,
                item: {
                    label: '投诉对象名称',
                    prop: 'complaintObject',  //需要验证的参数
                    name: 'complaintObject', //需要传递给后台查询的数据
                    bindValue:'complaintObject',  //需要展示出来的名称
                    filedValue:'id',    //选中那条数据的ID
                    useQuery:false,
                    dialog: {
                        dialogWidth: '780px',
                        title: "查询对象编码",
                        size: 'large',
                        searchForm: {
                            fields: [
                                {
                                    type: 'input',
                                    label: '名称',
                                    name: 'name'
                                },
                            ],
                            submitSearch:function(copyData){
                                return {
                                    condition:copyData
                                }
                            },
                            resetBtnVisible: true,
                            showToggleBtn: false,
                            labelWidth: '100px'
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: 'id',
                                label: 'ID'
                            },{
                                prop: 'code',
                                label: '编码'
                            }, {
                                prop: 'name',
                                label: '名称'
                            }],
                            radioCol: true,
                            //请求参数配置
                            service: Service.PERMISSION.name,
                            method: Service.PERMISSION.methods.roleList,
                            args: {
                                condition:{
                                }
                            },
                        }
                    },
                },
                rules:{
                    complaintObjectType: [
                        {required: true, message: '请选择投诉对象类型'},
                    ],
                    complaintObject: [
                        {required: true, message: '请选择投诉对象'}
                    ]
                },
                breadcrumbData: [{
                    title: '交付'
                },
                    {
                        title: '交付基础配置'
                    },
                    {
                        title: '投诉对象配置'
                    }
                ],
                //表格
                columns: [{
                    prop: 'id',
                    label: 'ID'
                }, {
                    prop: 'complaintObjectType',
                    label: '投诉对象类型',
                    list: "roleOption"
                }, {
                    prop: 'complaintObject',
                    label: '投诉对象ID'
                }, {
                    prop: 'complaintObjectName',
                    label: '投诉对象名称'
                }, {
                    prop: 'status',
                    label: '状态',
                    list: "statusOption"
                }, {
                    prop: 'createName',
                    label: '创建人'
                }, {
                    prop: 'createTime',
                    label: '创建时间',
                    formatter: "dateParser"
                }, {
                    prop: 'updateName',
                    label: '修改人'
                }, {
                    prop: 'updateTime',
                    label: '修改时间',
                    formatter: "dateParser"
                }],
                commonData: {
                    chargeTypeOption: [
                        {text: "城市", value: 1},
                        {text: "组织", value: 2}
                    ],
                    roleOption: [
                        {
                            text: '人员',
                            value: 1
                        }, {
                            text: '商品',
                            value: 2
                        },
                    ],
                    statusOption: [
                        {
                            text: '禁用',
                            value: 2
                        }, {
                            text: '启用',
                            value: 1
                        },
                    ],
                    shopOption:[]
                },
                service: '',
                method: '',
                args: {
                    search: {},
                    size: 20,
                    page: 1
                },
                dialogLoading: false,

                dataSource: [],
                createDialog: false,
                title: null,
                formData: {
                    complaintObjectType: 1,
                    complaintObject: null,
                    complaintObjectName:null
                },
                showBtn: true,
                dealer: Cookie.get('t8t-tc-username'),
            }
        },
        created() {
            let _args =  {
                "depth": 1,
                    "fields": [],
                    "search": {
                    "depth": 0,
                        "groupCode": "02"
                }
            }
            ComplaintApi.queryGroupsAndChilds(_args).then((res) => {
                let _list = []
                if(res.data.status == 200 && res.data.result) {
                    res.data.result.forEach((item) => {
                        _list.push({text:item.groupName,value:item.id})
                    })
                }
                else{
                    this.$message.error("商品投诉对象获取失败")
                    return
                }
                this.$nextTick(() => {
                    this.commonData.shopOption = _list
                })
            }).catch((error) => {
                console.log(error)
            })
            this.getConfigList()
        },
        methods: {
            resetFormData() {
                this.formData = {
                    complaintObjectType: 1,
                    complaintObject: null,
                    complaintObjectName:null
                }
            },
            getConfigList() {
                ComplaintApi.complaintObjectQueryList({}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("配置获取失败")
                        return
                    }
                    this.dataSource = res.data.result

                }).catch(() => {
                    return
                })
            },
            addBtn() {
                this.resetFormData()
                this.editType = 'add'
                this.createDialog = true
                this.title = "新增投诉对象配置"

            },
            editBtn() {
                this.resetFormData()
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length > 0) {
                    if (selections.length > 1) {
                        this.$message.error("请选择单条配置后重试")
                        return
                    }
                    if(selections[0].complaintObjectType == 1) {
                        this.$nextTick(() => {
                            this.formData = {
                                complaintObjectType: selections[0].complaintObjectType,
                                complaintObject: selections[0].complaintObject,
                                complaintObjectName:selections[0].complaintObjectName
                            }
                        })
                    }
                    else if(selections[0].complaintObjectType == 2){
                        this.formData = {
                            complaintObjectType: selections[0].complaintObjectType,
                            complaintObject: parseInt(selections[0].complaintObject),
                            complaintObjectName:selections[0].complaintObjectName
                        }
                    }
                    else return
                    this.editType = 'edit'
                    this.createDialog = true
                    this.title = "编辑投诉对象配置"
                } else {
                    this.$message.error("请选择单条配置后重试")
                    return
                }
            },
            //表格
            getTableData() {
                this.getConfigList()
                this.$refs['t8tTable'].reloadTable()

            },
            closeCreateDialog() {
                this.createDialog = false
            },
            submitBtn() {
                //todo validate deal
                let _self = this
                this.$refs.createForm.validate((isValid) => {
                    if(isValid) {
                        let _args
                        if(this.editType === 'add') {
                            _args = {
                                "complaintObject": {
                                    "complaintObjectType": this.formData.complaintObjectType,
                                    "complaintObject": this.formData.complaintObject,
                                    "status": 1,
                                    "createBy": this.dealer,
                                    "createName":this.dealer
                                }
                            }
                            ComplaintApi.complaintObjectCreate(_args).then(res=>{
                                if(res.data.status === 200) {
                                    _self.$msgbox({
                                        title: '消息',
                                        message:  "操作成功",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.closeCreateDialog()
                                    this.getTableData()
                                }else{
                                    _self.$msgbox({
                                        title: '消息',
                                        message:  res.data.message || "操作失败",
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    return
                                }
                            }).catch(error=>{return})
                        }else if(this.editType === 'edit') {
                            let selections = this.$refs['t8tTable'].getSelectRows()
                            _args = {
                                "complaintObject": {
                                    "complaintObjectType": this.formData.complaintObjectType,
                                    "complaintObject": this.formData.complaintObject,
                                    "updateBy": this.dealer,
                                    "updateName": this.dealer,
                                    "id":selections[0].id
                                }
                            }
                            ComplaintApi.complaintObjectUpdate(_args).then(res=>{
                                if(res.data.status === 200) {
                                    _self.$msgbox({
                                        title: '消息',
                                        message:  "操作成功",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    this.closeCreateDialog()
                                    this.getTableData()
                                }else{
                                    _self.$msgbox({
                                        title: '消息',
                                        message:  res.data.message || "操作失败",
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    return
                                }
                            }).catch(error=>{return})
                        }
                    }
                })



            },
            updateStatus(status) {
                let _self = this
                let selections = this.$refs['t8tTable'].getSelectRows();
                if (selections.length > 0) {
                    let _selectList = []
                    let _args = {}
                    selections.forEach((item) => {
                        _selectList.push(item.id)
                    })
                    _args = {
                        "ids": _selectList,
                        "status": status,
                        "updateBy": this.dealer,
                        "updateName": this.dealer
                    }
                    ComplaintApi.complaintObjectStatusUpdate(_args).then(res =>{
                        if(res.data.status != 200) {
                            _self.$msgbox({
                                title: '消息',
                                message:  res.data.message || "操作失败",
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                            })
                            return
                        }
                        _self.$msgbox({
                            title: '消息',
                            message: "操作成功",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain',
                            callback: function () {
                                _self.getTableData()
                            }
                        })
                    }).catch(error => {
                        return
                    })
                }else{
                    this.$message.error("请选择需要操作的配置")
                    return
                }
            },
            onChange(){
                this.formData.complaintObjectName = this.$refs.objId.records[0].name
                this.formData.complaintObject = this.$refs.objId.records[0].code
            },
            //rowsChange
            selectionChange (rows){
                let editStatus = false,enableStatus= false,disableStatus = false
                if( rows && rows.length > 0){
                    enableStatus= true
                    disableStatus = true
                    if(rows.length === 1) {
                        editStatus = true
                    }
                }else{
                    editStatus = enableStatus= disableStatus = true
                }
                editStatus ? this.$refs['toolbarList'].unDisableBySymbol('EDIT') : this.$refs['toolbarList'].disableBySymbol('EDIT')
                enableStatus ? this.$refs['toolbarList'].unDisableBySymbol('ENABLE') : this.$refs['toolbarList'].disableBySymbol('ENABLE')
                disableStatus ? this.$refs['toolbarList'].unDisableBySymbol('DISABLE') : this.$refs['toolbarList'].disableBySymbol('DISABLE')
            },
            onElSelectChange() {
                this.formData.complaintObjectName = null
                this.formData.complaintObject = null
            }
        }
    }

</script>

<style lang="css" scoped>
    .order-create-dialog .el-dialog--small {
        height: 500px !important;
    }

    /*.order-create-dialog .el-form-item__label{*/
    /*width:130px !important;*/
    /*}*/
    .order-create-dialog .el-dialog--small .el-dialog__body .textarea-container .t8t-tree-container {
        width: 100%;
        height: 330px;
    }
    .order-create-dialog .el-dialog--small .el-dialog__body .create-input .el-autocomplete .el-input .el-input__inner{


    }
</style>

<style>
</style>
