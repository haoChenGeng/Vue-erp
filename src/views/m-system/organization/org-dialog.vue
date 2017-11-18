<template>
    <div class="org-dialog">
        <el-dialog :title="title" @close="closeDialog" v-model="isShow" size="large">
            <el-form :model="data" ref="dialogForm" label-width="80px" :rules="formRules">
                <el-tabs v-model="activePane" type="card">
                    <el-tab-pane label="基本信息" name="baseInfo" class="org-tab-pane">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="上级组织" prop="parentId">
                                    <el-select
                                        :disabled="inputDisabled || data.rootId === 1"
                                        clearable
                                        filterable
                                        remote
                                        v-model="data.parentId"
                                        @change="onSelectParentChange"
                                        placeholder="请输组织名称查询"
                                        :remote-method="findOrgByName"
                                        :loading="loading">
                                        <el-option
                                            v-for="item in parentOrgs"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="禁用状态">
                                    <el-select v-model="data.isDel" placeholder="请选择" :disabled="inputDisabled || data.rootId === 1">
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="组织编码">
                                    <el-input v-model="data.code" :disabled="true" placeholder="编码自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人">
                                    <input type="hidden" v-model="data.contactUser"/>
                                    <el-select
                                        :disabled="status==='view'"
                                        clearable
                                        filterable
                                        remote
                                        v-model="data.contactEmployee.enName"
                                        :value="data.contactUser"
                                        @change="onSelectChange"
                                        placeholder="请输入英文名或中文名查询"
                                        :remote-method="remoteMethod"
                                        :loading="loading">
                                        <el-option
                                            v-for="item in empName"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="组织名称" prop="name">
                                    <el-input v-model="data.name" :disabled="inputDisabled || data.rootId === 1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系电话">
                                    <el-input v-model="data.contactEmployee.phoneId" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="组织形态" prop="typeCode">
                                    <el-select placeholder="请选择" v-model="data.typeCode" :disabled="inputDisabled">
                                        <el-option v-for="item in commonData.typeCodeOptions" :label="item.text"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="邮编" prop="postCode">
                                    <el-input v-model="data.postCode" :disabled="inputDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="虚拟组织">
                                    <el-select v-model="data.isVirtual" placeholder="请选择" :disabled="inputDisabled">
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="详细地址" prop="location">
                                    <el-input class="input-wide" v-model="data.location"
                                              :disabled="inputDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="描述" prop="description">
                                    <el-input class="input-wide" v-model="data.description" type="textarea" :rows="3"
                                              resize="none" :disabled="inputDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="组织职能">
                                    <el-checkbox-group v-model="data.functionCodes">
                                        <el-checkbox v-for="item in commonData.functionCodeOptions" :label="item.value"
                                                     :disabled="inputDisabled">{{item.text}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="dialog-footer" v-if="!inputDisabled">
                            <el-button @click="btnOKClick" :loading="submitLoading" type="primary">确定</el-button>
                            <el-button @click="closeDialog">取消</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="绑定伙伴类型" name="bound" class="org-tab-pane" v-if="data.parentId === 0">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="伙伴类型">
                                    <el-select v-model="data.partnerType" placeholder="请选择" :disabled="inputDisabled"
                                               @change="selectPartnerType">
                                        <el-option v-for="item in commonData.partners"
                                                   :key="item.value"
                                                   :label="item.text"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="关联对象">
                                    <el-select
                                        :disabled="inputDisabled"
                                        clearable
                                        filterable
                                        remote
                                        v-model="data.partnerCorpId"
                                        @change="selectPartnerChange"
                                        placeholder="请输入名称查询"
                                        :remote-method="findPartnerByName"
                                        :loading="loading">
                                        <el-option
                                            v-for="item in partnerCorps"
                                            :key="item.id"
                                            :label="item.shopName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="绑定城市" name="cityInfo" class="org-tab-pane city-pane"
                                 v-if="status === 'view' || status === 'edit'">
                        <el-row :gutter="20" class="city-container">
                            <el-col :span="24">
                                <el-tag
                                    :key="city.code"
                                    v-for="city in cityNames"
                                    :closable="status==='edit'"
                                    :close-transition="false"
                                    @close="handleClose(city.code)"
                                    type="gray"
                                >
                                    {{city.name}}

                                </el-tag>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-if="status==='edit'">
                            <el-col :span="24">
                                <t8t-division
                                    changeOnSelect="true"
                                    v-model="selectedOptions"
                                    ref="divisions"
                                ></t8t-division>
                                <el-button @click="addCity(selectedOptions)" size="small">增加</el-button>
                            </el-col>
                        </el-row>
                        <div class="dialog-footer-city" v-if="status==='edit'">
                            <el-button @click="btnOKClickCity" :loading="submitLoading" type="primary">确定</el-button>
                            <el-button @click="closeDialog">取消</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="其他信息" name="otherInfo" class="org-tab-pane" v-if="status !== 'add'">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="创建人员">
                                    <el-input :value="data.createUserName" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="创建时间">
                                    <el-input :value="data.createTime | toDate" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="修改人员">
                                    <el-input :value="data.updateUserName" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="修改时间">
                                    <el-input :value="data.updateTime | toDate" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import api from 'src/services/system/organization.js'
    import GeoUtils from 'src/utils/Geo.js'
    import commonApi from 'src/services/commonApi/commonApi.js'
    export default {
        data () {
            return {
                isShow: true,
                title: '查看组织',
                activePane: 'baseInfo',
                data: {
                    contactEmployee: {
                        enName: '',
                        phoneId: ''
                    },
                    functionCodes: [],
                    typeCode: '',
                    parentId: '',
                    parentName: '',
                    isDel: '',
                    code: '',
                    name: '',
                    postCode: '',
                    isVirtual: '',
                    location: '',
                    description: '',
                    createUserName: '',
                    createTime: '',
                    updateUserName: '',
                    updateTime: '',
                    partnerType: '',
                    partnerCorpId: ''
                },
                empName: [],
                parentOrgs: [],
                loading: false,
                requestTime: 0,
                submitLoading: false,
                cities: [],
                cityNames: [],
                inputDisabled: true,
                formRules: {
                    parentId: [
                        {type: 'number', required: true, message: "请选择上级组织", trigger: 'change'}
                    ],
                    name: [
                        {type: 'string', required: true, message: "请填组织名称", trigger: 'blur'},
                        {max: 200, message: '长度不能超过 200 个字符', trigger: 'blur'}
                    ],
                    typeCode: [
                        {required: true, message: '请选择组织形态', trigger: 'change'}
                    ],
                    postCode: [
                        {max: 6, message: '长度不能超过 6 个字符', trigger: 'change'}
                    ],
                    location: [
                        {max: 200, message: '长度不能超过 200 个字符', trigger: 'blur'}
                    ],
                    description: [
                        {max: 200, message: '长度不能超过 200 个字符', trigger: 'blur'}
                    ],
//                    partnerCorpId: [
//                        { trigger: 'blur', validator: (rule, value, callback) => {
//                            api.findByCorpId({type: this.data.partnerType, corpId: value})
//                                .then((res=>{
//                                    if (res.data.status === 200 && res.data.result !== null) {
//                                        callback(new Error("合作伙伴根组织已创建：[" + res.data.result.id + "]" + res.data.result.name))
//                                    } else {
//                                      callback()
//                                    }
//                                }))
//                        }}
//                    ]
                },
                corpTypeMap: {
                    '001001003': ['01', '02', '04'], '001001004': ['03'], '001001007': ['05']
                }, // 伙伴类型映射供应链的公司类型表
                corpType2Id: [],
                corpTypeIds: [],
                partnerCorps: []
            }
        },
        props: {
            status: {
                type: String,
                default: 'view'
            },
            rowData: {
                type: Object,
                default: {}
            },
            commonData: {
                type: Object,
                default: {
                    typeCodeOptions: []
                }
            }
        },
        methods: {
            closeDialog(){
                this.$emit('close');
            },
            onSelectChange(contactUser) {
                // 初始化加载数据的时候也会触发onSelectChange事件
                if (this.requestTime > 0) this.data.contactUser = contactUser
            },
            // 加载员工数据
            remoteMethod(query) {
                if (query === '') return
                this.loading = true
                let args = {
                    search: {name: query},
                    page: 0,
                    size: 100
                }
                api.employeeQueryFull(args)
                    .then((res) => {
                        this.loading = false
                        ++this.requestTime
                        if (res.data.status === 200) {
                            this.empName = res.data.result.rows.map(item => {
                                return {id: item.id, enName: item.enName, name: (item.enName + '（' + item.name + '）')};
                            })
                        }
                    })
            },
            onSelectParentChange(data) {
                if (data) {this.data.parentId = data}
            },
            findOrgByName(query) {
                query = this.data.parentName
                if (query === '') return
                this.loading = true
                let args = {
                    search: {name_like: query, isDel: 0},
                    page: 0,
                    size: 100
                }
                api.queryPageV2(args)
                    .then((res) => {
                        this.loading = false
                        if (res.data.status === 200) {
                            this.parentOrgs = res.data.result.rows.map(item => {
                                return {id: item.id, name: item.name};
                            })
                            this.parentOrgs.unshift({id: 0, name: '作为根组织'})
                        }
                    })
            },
            btnOKClick() {
                this.$refs['dialogForm'].validate(valid => {
                    if (valid) {
                        let args = {
                            organization: this.data
                        }
                        this.submitLoading = true

                        if (this.status === 'edit') {
                            args.organization.updateUser = Cookie.get('t8t-tc-uid')
                            api.update(args)
                                .then((res) => {
                                    this.submitLoading = false
                                    if (res.data.status === 200 && res.data.result === 1) {
                                        this.closeDialog()
                                        this.$emit('success')
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        })
                                    } else {
                                        this.$message.error(res.data.message)
                                    }
                                })
                        } else if (this.status === 'add') {
                            args.organization.createUser = Cookie.get('t8t-tc-uid')
                            api.createV2(args)
                                .then((res) => {
                                    this.submitLoading = false
                                    if (res.data.status === 200 && res.data.result >= 0) {
                                        this.closeDialog()
                                        this.$emit('success')
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        })
                                    } else if (res.data.status === 90109) {
                                        this.$message.error("合作伙伴根组织已创建：[id: " + res.data.result.id + "]" + res.data.result.name)
                                    }
                                    else {
                                        this.$message.error(res.data.message)
                                    }
                                })
                        }
                    }
                })
            },
            btnOKClickCity() {
                let details = this.cities.map(function (e) {
                    return {
                        cityCode: e
                    }
                })
                //组织绑定的城市
                let args = {
                    orgId: this.data.id,
                    details: details
                }
                api.assignCity(args)
                    .then((res) => {
                        this.submitLoading = false
                        if (res.data.status === 200) {
                            this.closeDialog()
                            this.$emit('success')
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            })
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
            },
            handleClose(city) {
                this.cities.splice(this.cities.indexOf(city), 1);
                this.buildCityNames()
            },
            addCity (selectCity) {
              let cityCode = selectCity[selectCity.length - 1]
              if(this.cities.indexOf(cityCode) === -1) {
                  this.cities.push(cityCode)
                  this.buildCityNames()
              }
            },
            buildCityNames() {
                this.cityNames = this.cities.map(function (code) {
                    return {
                        code: code,
                        name: GeoUtils.getParentName(code)
                    }
                })
            },
            selectPartnerType(data){
                if (data) {
                    this.data.parterType = data
                    this.buildCorpType(data)
                }
            },
            buildCorpType(corpType) {
                if (this.corpType2Id === null || this.corpType2Id.length === 0) {
                    commonApi.queryUnionParent({search: {pPropertyCode: '11105'}, size: 1000, page: 1})
                        .then((res) => {
                            if (res.data.status === 200 && res.data.result !== null) {
                                this.corpType2Id = res.data.result
                            }
                        })
                }

                let codes = this.corpTypeMap[corpType]
                if (codes) {
                    this.corpType2Id.forEach((item) => {
                        codes.forEach(code => {
                            if (code === item.propertyCode) {
                                this.corpTypeIds.push(item.id)
                            }
                        })
                    })
                }

            },
            selectPartnerChange(corpId){
                if (corpId) {
                    this.data.partnerCorpId = corpId
                    api.findByCorpId({type: this.data.partnerType, corpId: corpId})
                        .then((res => {
                            if (res.data.status === 200 && res.data.result !== null) {
                                this.$message.error("合作伙伴根组织已创建：[id: " + res.data.result.id + "]" + res.data.result.name)
                            }
                        }))
                }
            },
            findPartnerByName(query) {
                if (this.corpTypeIds === null || this.corpTypeIds.length <= 0) {
                    this.buildCorpType(this.data.partnerType)
                }

                commonApi.queryShopUnion({search: {companyTypes: this.corpTypeIds, shopName_like: query}})
                    .then((res) => {
                        if (res.data.status === 200 && res.data.result !== null) {
                            this.partnerCorps = res.data.result.map(item => {
                                return {id: item.id, shopName: ('（' + item.shopCode + '）' + item.shopName)};
                            })
                        }
                    })
            }
        },
        created(){
            if (this.status === 'view') {
                this.title = '查看组织'
                this.inputDisabled = true
            } else if (this.status === 'edit') {
                this.title = '修改组织'
                this.inputDisabled = false
            } else if (this.status === 'add') {
                this.title = '新增组织'
                this.inputDisabled = false

                // init data
                this.data.parentId = this.rowData.parentId
                this.data.parentName = this.rowData.parentName
                this.data.rootId = this.rowData.rootId
                this.data.isVirtual = 0
                this.data.isDel = 0
                this.data.typeCode = '001003012' // 其它
                this.parentOrgs = [{id: 0, name: '作为根组织'}, {id: this.data.parentId, name: this.data.parentName}]
                return
            }

            // 根据id获取数据
            api.findById(this.rowData.id)
                .then((res) => {
                    if (res.data.status === 200 && res.data.result !== null) {
                        this.data = Object.assign(this.data, res.data.result)
                        this.parentOrgs = [{id: this.data.parentId, name: this.data.parentName}, {id: 0, name: '作为根组织'}]

                        // 获取伙伴公司
                        if (this.data.partnerCorpId !== '') {
                            commonApi.queryShop({search: {id: this.data.partnerCorpId}, page: 1, size: 1})
                                .then((res) => {
                                    if (res.data.status === 200 && res.data.result !== null) {
                                        this.partnerCorps = res.data.result.rows.map(item => {
                                            return {id: item.id, shopName: ('（' + item.shopCode + '）' + item.shopName)};
                                        })
                                    }
                                })
                        }

                        this.buildCorpType(this.data.partnerType)
                    }
                })

            //获取组织绑定的城市
            let args = {
                orgId: this.rowData.id
            }
            api.queryCityRelation(args)
                .then((res) => {
                    if (res.data.status === 200 && res.data.result !== null) {
                        this.cities = res.data.result;
                        this.buildCityNames()
                    }
                })

        }
    }
</script>

<style lang="css" scoped>
    .org-dialog .dialog-footer {
        text-align: center;
    }

    .org-dialog .org-tab-pane {
        min-height: 350px;
    }

    .org-dialog .el-input {
        width: 180px;
    }

    .org-dialog .input-wide {
        width: 490px;
    }

    .el-select {
        width: 180px;
    }

    .el-checkbox {
        margin-left: 0;
        margin-right: 15px;
    }

    .city-container {
        margin-bottom: 20px;
    }

    .org-tab-pane {
        position: relative;
    }

    .dialog-footer-city {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
    }

    .t8t-division,
    .el-tag {
        margin-left: 10px;
    }
</style>
