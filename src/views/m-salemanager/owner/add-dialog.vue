<template>
    <div class="owner-add-dialog">
        <el-dialog title="" size="small" class="t8t-full-dialog2" v-model="addDialogVisible" @close="btnCancleClick">
            <div class="my-dialog2-container">
                <h1 class="my-title">新建业主</h1>
                <el-form :label-position="labelPosition"
                         :model="formData"
                         :label-width="formLabelWidth"
                         :rules="rules"
                         ref="addForm"
                         @keyup.enter.native="btnOKClick()">
                    <el-form-item label="称呼">
                        <el-col :span="12">
                            <el-form-item prop="appellation" class="owner-add-input">
                                <el-input v-model="formData.appellation" type="text" placeholder="请输入业主称呼"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">&nbsp;&nbsp;</el-col>
                        <el-col :span="8">
                            <el-form-item prop="sex">
                                <el-select v-model="formData.sex" placeholder="性别">
                                    <el-option label="先生" value="1"></el-option>
                                    <el-option label="女士" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone" class="owner-add-input">
                        <el-col :span="22">
                            <el-input v-model="formData.phone" type="text" class="addWidth ownerinput"
                                      placeholder="请输入业主手机号码"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="区域" prop="townIdArray">
                        <el-col :span="22">
                        <t8t-division-old
                            :changeOnSelect="true"
                            :filterable="true"
                            :clearable="true"
                            v-model="formData.townIdArray"
                            :placeholder="选择区域"
                            @change="onDivisionChange"
                        >
                        </t8t-division-old>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="楼盘" prop="estateId" class="owner-add-input">
                        <el-col :span="22">
                            <t8t-form-popup
                                :disabled="item.disabled"
                                :defaultValue="item.defaultValue"
                                :ref="item.name"
                                :bindValue="formData[item.name]"
                                :textValue="item.textValue"
                                :filedValue="item.filedValue"
                                :name="item.name"
                                :placeholder="item.placeholder"
                                :dialog="item.dialog"
                                :remote="item.remote"
                                :service="item.service"
                                :method="item.method"
                                :remoteArgs="item.remoteArgs"
                                :remoteQueryKey="item.remoteQueryKey"
                                :autoText="item.autoText"
                                :autoValue="item.autoValue"
                                :icon="false"
                                @change="onChange"
                                @select="onSelect"
                            ></t8t-form-popup>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="房号" prop="houseAddress" class="owner-add-input">
                        <el-col :span="22">
                            <el-input v-model="formData.houseAddress" auto-complete="off"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="跟进人" prop="auditId">
                        <el-col :span="22">
                            <el-select v-model="formData.auditId" placeholder="--请选择--">
                                <el-option v-for="item in flowUserList" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
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
    import ServiceApi from 'src/services/salemanager/Service.js'
    import Service from 'src/services/salemanager/salemanager.js'

    export default {
        name: 'receipt-dialog',
        components: {
        },
        data() {
            return {
                labelPosition: 'right',
                formLabelWidth: '80px',
                addDialogVisible: true,
                formData: {
                    appellation: null,
                    sex: null,
                    phone: null,
                    townIdArray: [],
                    houseAddress: null,
                    estateId: null,
                    auditId: null,
                    isPrimary: 1,  //默认为主要联系人
                    createUser: Cookie.get('t8t-tc-uid'),
                },
                item: {
                    label: '楼盘名称',
                    name: 'estateId', //需要传递给后台查询的数据
                    textValue: 'sname',  //需要展示出来的名称
                    filedValue: 'id',    //选中那条数据的ID
                    //自动补全
                    remote: true,
                    service: ServiceApi.SALES.name,
                    method: ServiceApi.SALES.methods.QUERY_ESTATE_PAGE,
                    remoteQueryKey: "estateName",
                    remoteArgs: {
                        page: 1,
                        size: 10
                    }
                },
                rules: {
                    appellation: [
                        {
                            required: true,
                            message: '请填写业主称呼',
                        },
                        {
                            pattern: /^.{1,20}$/,
                            message: "请输入1-20个中英文字符"
                        }
                    ],
                    sex: [
                        {
                            required: true,
                            message: '请选择业主性别',
                        },
                    ],
                    phone: [
                        {
                            required: true,
                            message: '请填写业主手机号码',
                        },
                        {
                            pattern: /^1[34578]\d{9}$/,
                            message: '请填写正确的手机号码',
                        }
                    ],
                    townIdArray:[
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if(value.length > 2) {
                                    callback()
                                }else{
                                    callback(false)
                                }
                            },
                            message: '请选择业主所住区域',
                        },
                    ],
                    houseAddress: [
                        {
                            required: true,
                            message: '请填写房号',
                        },
                    ],
                    estateId: [
                        {
                            required: true,
                            message: '请选择楼盘',
                        },
                    ],
                    auditId: [
                        {
                            required: true,
                            message: '请选择跟进人',
                        },
                    ],
                },
            }
        },
        props: {
            flowUserList:Array,
        },
        computed: {},
        created() {

        },

        methods: {
            onChange: function (value, name) {
                this.formData[name] = value
            },
            onSelect: function (value, name) {
                this.formData[name] = value;
            },
            btnOKClick(){
                let _this = this
                this.$refs['addForm'].validate(valid => {
                    if (valid) {
                        let args = {
                            decorationOrder: {
                                decorationOrderCreateDTO: {},
                                decorationOrderHouseCreateDTO: {},
                                decorationOrderContactCreateDTOList: []
                            },
                        }
                        let contactList = {};
                        contactList.appellation = _this.formData.appellation;
                        contactList.sex = _this.formData.sex;
                        contactList.phone = _this.formData.phone;
                        contactList.isPrimary = _this.formData.isPrimary; //新增默认为主要联系人
                        args.decorationOrder.decorationOrderCreateDTO.phone = _this.formData.phone;
//                        args.decorationOrder.decorationOrderCreateDTO.standardCityId = _this.formData.townIdArray[1];
//                        args.decorationOrder.decorationOrderCreateDTO.standardTownId = _this.formData.townIdArray[2];
                        args.decorationOrder.decorationOrderCreateDTO.cityId = _this.formData.townIdArray[1];
                        args.decorationOrder.decorationOrderCreateDTO.townId = _this.formData.townIdArray[2];
                        args.decorationOrder.decorationOrderCreateDTO.estateId = _this.formData.estateId;
                        args.decorationOrder.decorationOrderCreateDTO.auditId = _this.formData.auditId,//跟进人id
                        args.decorationOrder.decorationOrderCreateDTO.createUser = Cookie.get('t8t-tc-uid'),
                        args.decorationOrder.decorationOrderHouseCreateDTO.houseAddress = _this.formData.houseAddress;
                        args.decorationOrder.decorationOrderContactCreateDTOList[0] = contactList;
                        Service.createOrder(args)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'success',
                                        message: '新增成功',
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                    _this.btnCancleClick()
                                    this.$emit('success')
                                }
                                else {
                                    this.$msgbox({
                                        title: '消息',
                                        type: 'error',
                                        message: res.data.message,
                                        showCancelButton: false,
                                        confirmButtonText: '知道了',
                                        confirmButtonClass: 'is-plain'
                                    })
                                }
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

<style lang="css" scoped>
    .my-title{
        padding:10px;
        text-align: center;
    }
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
        width: 180px;
        line-height: 32px;
    }
</style>
