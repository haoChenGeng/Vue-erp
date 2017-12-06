<template>
    <div class="org-dialog">
        <el-dialog :title="title"
            @close="closeDialog"
            v-model="isShow"
            size="large">

            <el-tabs v-model="activePane"
                type="card">
                <el-tab-pane label="账号信息"
                    name="tab1">
                    <el-form :model="formData"
                        ref="dialogForm"
                        label-width="80px"
                        :rules="formRules"
                        class="form-container clearfix">
                        <el-form-item label="用户账号"
                            prop="username"
                            class="item-container">
                            <el-input v-model="formData.username"
                                :disabled="status!=='add'"></el-input>
                        </el-form-item>

                        <el-form-item v-if="status==='add'"
                            label="密码"
                            prop="password"
                            class="item-container">
                            <el-input v-model.trim="formData.password"
                                :disabled="status!=='add'"></el-input>
                        </el-form-item>

                        <el-form-item v-if="status==='add'"
                            label="用户类型"
                            prop="typeCode"
                            class="item-container">
                            <el-select v-model="formData.typeCode"
                                placeholder="请选择"
                                :disabled="false"
                                @change="onChange"
                                style="display: block">
                                <el-option v-for="(item, index) in userOptions"
                                    :key="index"
                                    :label="item.text"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="status==='add'"
                            label="关联对象"
                            prop="relatedId"
                            class="item-container">
                            <t8t-form-popup
                                v-if="reInitPopup"
                                v-model="formData.relatedId"
                                :ref="popup.name"
                                :defaultValue="popup.defaultValue"
                                :textValue="popup.textValue"
                                :filedValue="popup.filedValue"
                                :name="popup.name"
                                :placeholder="popup.placeholder"
                                :dialog="popup.dialog"
                                :service="popup.service"
                                :method="popup.method"
                                readonly
                                class="account-management-popup">
                            </t8t-form-popup>
                        </el-form-item>

                        <el-form-item v-if="status==='view'"
                            label="电话号码"
                            prop="mobile"
                            class="item-container">
                            <el-input v-model="formData.mobile"
                                :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="用户说明"
                            prop="description"
                            class="item-container w100">
                            <el-input v-model="formData.description"
                                type="textarea"
                                :rows="3"
                                resize="none"
                                :disabled="status==='view'"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="绑定信息"
                    name="tab2"
                    v-if="status === 'view' || status === 'edit'">
                    <t8t-table :dataSource="formData.bounds"
                        :commonData="commonData"
                        :columns="columns"
                        :selectCol="false"
                        :pageBar="false"
                        style="height: 250px"></t8t-table>
                </el-tab-pane>
            </el-tabs>

            <span slot="footer"
                class="dialog-footer"
                v-if="status!=='view'">
                <el-button type="primary"
                    @click="onSave">保 存</el-button>
                <el-button @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from './api.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Cookie from 'js-cookie'
    import md5 from 'md5'
    let _userOptions = [
        {text: '供应商', value: '001001003'},
        {text: '承运商', value: '001001004'},
        {text: '配送商', value: '001001007'}
    ]
    let _typeMap = {
        '001001003': [],
        '001001004': [],
        '001001007': []
    }
    export default {
        data() {
            return {
                reInitPopup: true,
                corpType2Id: [],
                corpTypeMap: {
                    '001001003': ['01', '02', '04'], '001001004': ['03'], '001001007': ['05']
                },
                userOptions: _userOptions,
                typeArr: [],
                activePane: 'tab1',
                isShow: true,
                title: '新增账号',
                formData: {
                    username: null,
                    password: null,
                    typeCode: null,
                    relatedId: null,
                    description: null,
                    mobile: null,
                    bounds: null
                },
                formRules: {
                    username: [
                        { type: 'string', pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/, required: true, message: "中文、英文、数字、下划线, 3-20位", trigger: 'blur' }
                    ],
                    password: [
                        { type: 'string', required: true, min: 6, max: 18, message: "密码6--18位", trigger: 'blur' }
                    ],
                    typeCode: [
                        { type: 'string', required: true, message: "请选择" }
                    ],
                    relatedId: [
                        { type: 'number', required: true, message: "请选择" }
                    ]
                },
                columns: [
                    { 'prop': 'typeCode', 'label': '用户类型', 'list': 'allUserOptions'},
                    { 'prop': 'relatedId', 'label': '关联对象' },
                    { 'prop': 'isDisable', 'label': '状态', 'list': 'disableOptions' },
                    { 'prop': 'createTime', 'label': '创建时间', 'formatter': 'dateParser' }
                ],
                commonData: {
                    allUserOptions: this.allUserOptions,
                    disableOptions: [
                        { text: '禁用', value: true },
                        { text: '启用', value: false }
                    ]
                },
                popup: {
                    name: 'id',
                    placeholder: '请选择关联对象',
                    defaultValue: {textValue: '', filedValue: ''},
                    textValue: '',
                    filedValue: '',
                    dialog: {
                        title: "选择关联对象",
                        searchForm: {
                            fields: [
                                { type: 'input', label: '关联对象名称', name: '' },
                            ],
                            resetBtnVisible: false
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: '',
                                label: ''
                            }, {
                                prop: '',
                                label: ''
                            }],
                            //请求参数配置
                            service: '',//
                            method: '',//
                            radioCol: true,
                            args: {
                                search: {companyTypes: ''},
                                sort: ['id_asc']
                            }
                        },
                    }
                },
                popup003: {
                    name: 'id',
                    placeholder: '请选择关联对象',
                    defaultValue: {textValue: '', filedValue: ''},
                    textValue: 'shopName',
                    filedValue: 'id',
                    dialog: {
                        title: "选择关联对象",
                        searchForm: {
                            fields: [
                                { type: 'input', label: '关联对象名称', name: '' },
                            ],
                            resetBtnVisible: false
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: 'shopCode',
                                label: '供应商编码'
                            }, {
                                prop: 'shopName',
                                label: '供应商名称'
                            }],
                            //请求参数配置
                            service: 'qVq5B_KUuBzTC3kyP9TiuA53IS1kiBn5fR5JVjR7fUS6nsTm4Zc',// /biz/supply-chain/app.supply-server
                            method: 'vWKy_iaP0BfmrFvtT4r3mmuXN2ts8rJrMLR',// shop.queryPageShopUnion
                            radioCol: true,
                            args: {
                                search: {companyTypes: _typeMap['001001003']},
                                sort: ['id_asc']
                            }
                        },
                    }
                },
                popup004: {
                    name: 'id',
                    placeholder: '请选择关联对象',
                    defaultValue: {textValue: '', filedValue: ''},
                    textValue: 'shopName',
                    filedValue: 'id',
                    dialog: {
                        title: "选择关联对象",
                        searchForm: {
                            fields: [
                                { type: 'input', label: '关联对象名称', name: '' },
                            ],
                            resetBtnVisible: false
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: 'shopCode',
                                label: '承运商编码'
                            }, {
                                prop: 'shopName',
                                label: '承运商名称'
                            }],
                            //请求参数配置
                            service: 'qVq5B_KUuBzTC3kyP9TiuA53IS1kiBn5fR5JVjR7fUS6nsTm4Zc',// /biz/supply-chain/app.supply-server
                            method: 'vWKy_iaP0BfmrFvtT4r3mmuXN2ts8rJrMLR',// shop.queryPageShopUnion
                            radioCol: true,
                            args: {
                                search: {companyTypes: _typeMap['001001004']},
                                sort: ['id_asc']
                            }
                        },
                    }
                },
                popup007: {
                    name: 'id',
                    placeholder: '请选择关联对象',
                    defaultValue: {textValue: '', filedValue: ''},
                    textValue: 'shopName',
                    filedValue: 'id',
                    dialog: {
                        title: "选择关联对象",
                        searchForm: {
                            fields: [
                                { type: 'input', label: '关联对象名称', name: '' },
                            ],
                            resetBtnVisible: false
                        },
                        table: {
                            //表格
                            columns: [{
                                prop: 'shopCode',
                                label: '配送商编码'
                            }, {
                                prop: 'shopName',
                                label: '配送商名称'
                            }],
                            //请求参数配置
                            service: 'qVq5B_KUuBzTC3kyP9TiuA53IS1kiBn5fR5JVjR7fUS6nsTm4Zc',// /biz/supply-chain/app.supply-server
                            method: 'vWKy_iaP0BfmrFvtT4r3mmuXN2ts8rJrMLR',// shop.queryPageShopUnion
                            radioCol: true,
                            args: {
                                search: {companyTypes: _typeMap['001001007']},
                                sort: ['id_asc']
                            }
                        },
                    }
                },
            }
        },
        props: {
            status: {
                type: String,
                default: 'view'
            },
            id: {
                type: Number,
                default: 0
            },
            allUserOptions: {
                type: Array,
                default: []
            }
        },
        methods: {
            closeDialog() {
                this.$emit('close');
            },
            init(status) {
                status === 'add' && (this._initAdd(),this._initType())
                status === 'view' && this._initView()
                status === 'edit' && this._initEdit()
            },
            _initAdd() {
                this.title = '新增账号'
            },
            _initView() {
                this.title = '查看账号'
                this._getData(this.id)
            },
            _initEdit() {
                this.title = '修改账号'
                this._getData(this.id)
            },
            _getData(id) {
                api.get({ id: id })
                    .then(res => {
                        if (res.data.status === 200) {
                            this.formData = res.data.result
                        } else {
                            this.$message.error('获取数据失败！')
                        }
                    })
            },
            onSave() {
                this.status === 'add' && this._onSaveAdd()
                this.status === 'edit' && this._onSaveEdit()
            },
            _onSaveAdd() {
                this.$refs['dialogForm'].validate(valid => {
                    if (!valid) {
                        return
                    }
                    api.create({
                        username: this.formData.username,
                        password: md5(this.formData.password),
                        typeCode: this.formData.typeCode,
                        relatedId: this.formData.relatedId,
                        description: this.formData.description,
                        operId: +Cookie.get('t8t-tc-uid')
                    }).then(res => {
                        if (res.data.status === 200 && res.data.result === 1) {
                            this.$message.success('新增成功')
                            this.closeDialog()
                        } else {
                            this.$message.error(res.data.message || '新增失败')
                        }
                    })
                })
            },
            _onSaveEdit() {
                api.update({
                    id: this.id,
                    description: this.formData.description,
                    operId: +Cookie.get('t8t-tc-uid')
                }).then(res => {
                    if (res.data.status === 200 && res.data.result === 1) {
                        this.$message.success('修改成功')
                        this.closeDialog()
                    } else {
                        this.$message.error(res.data.message || '修改失败')
                    }
                })
            },
            onChange(val) {
                // 供应商
                if(val === '001001003'){
                    this.popup = this.popup003
                }
                // 承运商
                if(val === '001001004'){
                    this.popup = this.popup004
                }
                // 配送商
                if(val === '001001007'){
                    this.popup = this.popup007
                }

                // 重启popup
                this.reInitPopup = false
                this.$nextTick(()=>{
                    this.reInitPopup = true
                })
            },
            //
            _initType() {
                commonApi.queryUnionParent({search: {pPropertyCode: '11105'}, size: 1000, page: 1})
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result !== null) {
                            this.corpType2Id = res.data.result
                            this.corpType2Id.forEach((item) => {
                                if(item.propertyCode === '03') {
                                    _typeMap['001001004'].push(item.id)
                                } else if(item.propertyCode === '05') {
                                    _typeMap['001001007'].push(item.id)
                                } else {
                                    _typeMap['001001003'].push(item.id)
                                }
                            })
                        }
                    })
            }
        },
        created() {
            this.init(this.status)
        }
    }
</script>

<style lang="css" scoped>
    .form-container {
        margin: 0 25px 0 0;
    }

    .item-container {
        float: left;
        width: 50%;
    }

    .w100 {
        width: 100%;
    }
</style>
<style>
    .account-management-popup .el-autocomplete {
        display: block;
    }
</style>
