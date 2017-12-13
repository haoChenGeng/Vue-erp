<template>
    <div class="t8t-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="toolbar"
                            v-if="mode != 'view'"
                            class="t8t-dark"
                            @SAVE="submit()"
                            @CANCEL="closeDialog"
                        >
                        </t8t-toolbar>
                    </div>
                </div>
                <div class="dialog2-main-container" :class="{'isHide': isTopHide}">
                    <div class="toggle-btn-container">
                        <div class="toggle-btn el-icon-d-arrow-left" @click="onTopHide"></div>
                    </div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container container-center">

                        <el-form ref="mainTable"
                                 label-position="right"
                                 label-width="120px"
                                 :model="dataSource"
                                 :show-message="mode !== 'view'"
                        >
                            <div class="field_container">
                                <base-panel
                                    :dataSource="dataSource"
                                    :fields="mainTable.fields"
                                    :mode="mode"
                                    :disabled="disabled"
                                    :options="options || {}"
                                    ref="fields_panel"
                                    @click="handleClick"
                                    @blur="handleBlur"
                                    @focus="handleFocus"
                                    @change="handleChange"
                                ></base-panel>

                            </div>

                        </el-form>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">

                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab" class="t8t-detail">

                                <el-tab-pane label="更新功能列表" :name="function_list">
                                    <div class="my-toolbar" v-if="!this.$route.query.id">
                                        <el-button type="primary" size="small" icon="plus" @click="addRow()">新增行</el-button>
                                        <el-button type="danger" size="small" icon="close" @click="delRows()">删除行</el-button>
                                    </div>
                                    <t8t-table
                                        ref="functionListTable"
                                       :commonData="options"
                                       :dataSource="listDataSource"
                                       :editable="ListTableEdit"
                                       :templateData="functionTableTemplateData"
                                       :columns="functionListColumns"
                                    >
                                    </t8t-table>
                                </el-tab-pane>

                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
    import axios from 'src/utils/axios.js'
    import DateUtils from 'src/utils/DateUtils.js'
    import schema from './version-schema'
    import Cookie from 'js-cookie'
    import commonApi from 'src/services/commonApi/commonApi.js'
    import Services from 'src/services/system/Service.js'
    import api from 'src/services/system/app.js'
    export default {
        name: 't8t-dt-view',
        components: {BasePanel},
        data () {
            return {
                id: null,
                mode: "",
                // 主表绑定数据源
                dataSource: {
                    id: null,
                    versionPlat: null,
                    versionType: null,
                    versionNumber: null,
                    versionValue: null,
                    versionMemo: null,
                    createName: null,
                    createBy: null,
                    createTime: null,
                    updateName: null,
                    updateBy: null,
                    updateTime: null
                },
                // 所有配置全部初始化在这里
                options: {
                    versionPlat: [
                        {value: 0, text: 'android'},
                        {value: 1, text: 'ios'}
                    ],
                    versionType: [],
                    developType: [
                        {value: 0, text: '原生'},
                        {value: 1, text: 'H5'}
                    ],
                    isPublic:[
                        {value: 0, text: '是'},
                        {value: 1, text: '否'}
                    ],
                    isShow:[
                        {value: 0, text: '是'},
                        {value: 1, text: '否'}
                    ],
                    isForced:[
                        {value: 0, text: '否'},
                        {value: 1, text: '是'}
                    ],
                    permissionType:[]
                },
                schema: schema,
                mainTable: schema.mainTable,
                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                ListTableEdit:true,
                // 主表tab默认激活页
                mainActiveTab: '',
                // 附表tab默认激活页
                subActiveTab: '',
                sourceMap: {},
                columns: {},
                functionListColumns:[
                    {
                        prop: 'permissionCode',
                        label: '权限编码',
                        required: true,
                        onChange(val,row,column){
                            row.permissionExtId = val.id;
                            row.permissionCode = val.permissionCode;
                            row.permissionName = val.permissionName;
                            row.developType = val.developType;
                            row.permissionType = val.permissionType;
                            row.isPublic = val.isPublic;
                            row.enableOrgName = val.enableOrgName;
                            row.isShow = val.isShow;
                            row.androidVersionValue = val.androidVersionValue;
                            row.androidVersionNumber = val.androidVersionNumber;
                            row.iosVersionValue = val.iosVersionValue;
                            row.iosVersionNumber = val.iosVersionNumber;
                        },
                        editor:{
                            rules:[{
                                    required: true,
                                    message: "请添加权限",
                                }],
                            type: "lookup",
                            service:Services.APP.name,
                            method:Services.APP.methods.permissionExtServiceQueryPage,
                            args:{search:{isDel:0}},
                            indexCol:true,
                            'columns': [
                                {
                                    'prop': 'permissionCode',
                                    'label': '权限编码'
                                },
                                {
                                    'prop': 'permissionName',
                                    'label': '权限名'
                                },
                                {
                                    'prop': 'developTypeName',
                                    'label': '开发类型',
                                },
                                {
                                    'prop': 'permissionTypeName',
                                    'label': '权限类型',
                                },
                                {
                                    'prop': 'isPublicName',
                                    'label': '是否公共权限'
                                },
                                {
                                    'prop': 'enableOrgName',
                                    'label': '启用组织'
                                },
                                {
                                    'prop': 'isShowName',
                                    'label': '是否展示'
                                },
                                {
                                    'prop': 'updateTime',
                                    'label': '更新时间',
                                    'formatter': 'dateParser'
                                },
                            ],
                            'filterMethod': function (val, args) {
                                args['search'] = {
                                    'permissionName_like': val,
                                    'isDel' : 0
                                }
                                return args
                            }
                        }

                     },
                    {prop: 'permissionName', label: '权限名', "readonly": true},
                    {prop: 'developType', label: '开发类型', "readonly": true, list:'developType'},
                    {prop: 'permissionType', label: '权限类型', "readonly": true, list:'permissionType'},
                    {prop: 'isPublic', label: '是否公共权限', "readonly": true, list:'isPublic'},
                    {prop: 'enableOrgName', label: '启用组织', "readonly": true},
                    {prop: 'isShow', label: '是否展示', "readonly": true, list:'isShow'},
                    {prop: 'isForced', label: '是否强制更新', required:true, list:'isForced', editor:{
                        "type": "select",
                        rules:[
                            {"required": true, "message": "请选择是否强制更新"}
                        ]
                    }},
                    {prop: 'memo', label: '更新描述', required:true, editor:{
                        "type": "input",
                        rules:[
                            {"required": true, "message": "更新描述不能为空"},
                            { max: 50, min:1, message: '更新描述不能超过50个字符'}
                        ]
                    }}
                ]
            }
        },
        created () {
            if(this.$route.query.versionPlat && [0, 1].includes(Number(this.$route.query.versionPlat))){
                this.dataSource.versionPlat = Number(this.$route.query.versionPlat)
            }else{
               this.dataSource.versionPlat = 0
            }
            if(this.dataSource.versionPlat == 0){

                  this.functionListColumns[0].editor.columns.push(
                    {prop: 'androidVersionNumber',label: 'Android版本号'},
                    {prop: 'androidVersionValue', label: 'Android版本值'}
                    )
                  this.functionListColumns.splice( -1, 0,
                    {prop: 'androidVersionNumber',label: 'Android版本号', "readonly": true},
                    {prop: 'androidVersionValue', label: 'Android版本值', "readonly": true}
                    )
            }else{
                this.functionListColumns[0].editor.columns.push(
                    {prop: 'iosVersionNumber',label: 'iOS版本号'},
                    {prop: 'iosVersionValue', label: 'iOS版本值'}
                    )
                  this.functionListColumns.splice( -1, 0,
                    {prop: 'iosVersionNumber',label: 'iOS版本号', "readonly": true},
                    {prop: 'iosVersionValue', label: 'iOS版本值', "readonly": true}
                    )
            }
            this.functionListColumns[0].editor.commonData = this.options
            this.mode = this.$route.query.mode || 'add'
            this.getCommonOptions('11023', 'versionType')
            this.getCommonOptions('11013', 'permissionType')
            if(this.$route.query.id){
                this.functionListColumns[0].readonly = true
                this.mainTable.fields[2].disabled = true
                this.mainTable.fields[3].disabled = true
                 this.initData(this.$route.query.id)
            }else{
                this.functionListColumns[0].readonly = false
                this.mainTable.fields[2].disabled = false
                this.mainTable.fields[3].disabled = false
            }
            if(this.mode == 'view'){
                this.ListTableEdit = false
            }
        },
        methods: {
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            handleBlur(vue, field){
            },
             /**
             * 新增行
             * @param tabName
             */
            addRow () {
                this.$refs.functionListTable.addNewRow()
            },
            /**
             * 删除行
             * @param tabName
             */
            delRows() {
                this.$refs.functionListTable.delRows()
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
                this.$router.go(-1)
                this.$emit('close')
            },
            /**
             * 点击提交后的动作处理
             */
            submit () {
               this.$refs.mainTable.validate((isValid) =>{
                    if(isValid){
                        if(this.$refs.functionListTable.dataSource.length < 1){
                            this.$message.error('请至少添加一项权限')
                            return false
                        }
                        this.$refs.functionListTable.validate((isValid) =>{
                               if(isValid){
                                    this.saveVersion()
                               }
                        })
                    }
               })
            },
            saveVersion(){
                var args = {version:this.dataSource}
                if(args.version.id){
                    args.version.updateUser = Cookie.get('t8t-tc-uid')
                    args.version.updateBy = Cookie.get('t8t-tc-username')
                    args.version.updateName = Cookie.get('t8t-tc-username')
                }else{
                    args.version.createUser = Cookie.get('t8t-tc-uid')
                    args.version.createName = Cookie.get('t8t-tc-username')
                    args.version.createBy = Cookie.get('t8t-tc-username')
                }
                args.version.versionItem = this.$refs.functionListTable.dataSource
                args.version.versionItem.map((item) => {
                     if(args.version.id){
                            item.updateName = Cookie.get('t8t-tc-username')
                            item.updateBy = Cookie.get('t8t-tc-username')
                            item.updateUser = Cookie.get('t8t-tc-uid')
                     }else{
                            item.createName = Cookie.get('t8t-tc-username')
                            item.createBy = Cookie.get('t8t-tc-username')
                            item.createUser = Cookie.get('t8t-tc-uid')
                     }
                })
                this.$confirm('是否确认更新该版本？', '提交确认', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() =>{
                    this.$refs.toolbar.disableBySymbol('SAVE')
                    if(args.version.id){
                        var request = api.versionServiceUpdate(args)
                    }else{
                        var request = api.versionServiceCreate(args)
                    }
                    request.then((res) => {
                        this.$refs.toolbar.unDisableBySymbol('SAVE')
                         if(res.data.status == 200){
                                var _this = this
                                this.$msgbox({
                                    title: '提交成功',
                                    type: 'success',
                                    message: '',
                                    showCancelButton: false,
                                    confirmButtonText: '知道了',
                                    confirmButtonClass: 'is-plain'
                                }).then((res) =>{
                                    _this.closeDialog()
                                })
                         }else{
                            this.$msgbox({
                                title: '提交失败',
                                type: 'error',
                                message: res.data.error || res.data.result,
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                              })
                         }
                    }).catch(() => {
                        this.$refs.toolbar.unDisableBySymbol('SAVE')
                        this.$msgbox({
                                title: '服务器异常',
                                type: 'error',
                                message: '',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                                confirmButtonClass: 'is-plain'
                              })
                    })
                })
            },
            initData(id){
                let args = {id:id}
                api.versionServiceFindById(args).then((res) => {
                    if(res.data.status == 200 && res.data.result.versionVO){
                         this.dataSource = res.data.result.versionVO
                         this.dataSource.versionValue = this.dataSource.versionValue.toString()
                         this.listDataSource = []
                         res.data.result.versionItemServiceVO.forEach((item) => {
                             this.listDataSource.push({
                                  id:item.versionItemVO.id,
                                  permissionCode:item.permissionExtVO.permissionCode,
                                  permissionName:item.permissionExtVO.permissionName,
                                  developType:item.permissionExtVO.developType,
                                  permissionType:item.permissionExtVO.permissionType,
                                  isPublic:item.permissionExtVO.isPublic,
                                  enableOrgName:item.permissionExtVO.enableOrgName,
                                  androidVersionNumber:item.permissionExtVO.androidVersionNumber,
                                  androidVersionValue:item.permissionExtVO.androidVersionValue,
                                  iosVersionNumber:item.permissionExtVO.iosVersionNumber,
                                  iosVersionValue:item.permissionExtVO.iosVersionValue,
                                  isShow:item.permissionExtVO.isShow,
                                  isForced:item.versionItemVO.isForced,
                                  memo:item.versionItemVO.memo,
                                  permissionExtId:item.versionItemVO.permissionExtId
                             })
                         })
                    }
                })
            },
           getCommonOptions: function(fatherCode,selectName) {
                let arg =  {
                    page: 1,
                    search: {
                        pPropertyCode: fatherCode
                    },
                    size: 100
                }
                let list = []
                commonApi.queryUnionParent(arg)
                    .then((res) => {
                        if (res.data.status === 200) {
                            res.data.result.forEach((item) => {
                                if (item.propertyStatus===1) {
                                    list.push({
                                        value: item.id,
                                        text: item.propertyName
                                    })
                                }
                            });
                            this.options[selectName] = list;
                        }
                    })
            }
        }
    };
</script>

<style lang="css" scoped>
    /*.full-dialog-form-container {*/
        /*position: relative;*/
    /*}*/
</style>

<style>

</style>
