<template>
    <div class="t8t-detail-view demand-detail-view">
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 dialog-new" >
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                        <t8t-toolbar
                            ref="manageToolbar"
                            :symbolList="manageToolbarList"
                            @SUBMIT="submitBtn"
                            @SAVE="submitBtn"
                            @EDIT="editBtn"
                            @ENABLE="updateStatus(1)"
                            @DISABLE="updateStatus(2)"
                            class="t8t-dark"
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
                            <el-tabs v-model="mainActiveTab">
                                <el-tab-pane :label="mainTable.tabs[0].label" :name="mainTable.tabs[0].name">

                                    <div class="field_container">
                                        <base-panel
                                            :dataSource="dataSource"
                                            :fields="mainTable.tabs[0].fields"
                                            :mode="viewMode"
                                            :disabled="!editable"
                                            :options="options || {}"
                                            :ref="mainTable.tabs[0].name"
                                        ></base-panel>
                                    </div>

                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <div class="t8t-detail">
                            <el-tabs v-model="subActiveTab">
                                <el-tab-pane :label="subTables[0].label" :name="subTables[0].name">
                                    <div class="sub-container">
                                        <!-- 新增和编辑模式才出现按钮 -->
                                        <div class="my-toolbar" v-if="(mode === 'add' || mode == 'edit')">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                icon="plus"
                                                @click="addLine(subTables[0].name)"
                                            >新增行</el-button>
                                            <el-button
                                                type="danger"
                                                size="small"
                                                icon="close"
                                                @click="delLine(subTables[0].name)"
                                            >删除行</el-button>
                                        </div>
                                        <!--table-->
                                        <t8t-table
                                            :preLoad="false"
                                            :pageBar="false"
                                            :columns="subTables[0].fields"
                                            :service="subTables[0].service"
                                            :method="subTables[0].method"
                                            :args="subTables[0].args"
                                            :editable="editable"
                                            :ref="subTables[0].name"
                                            :commonData="options || {}"
                                            @row-click="rowClick"
                                            @cell-editor-change="onEditorChange"
                                            @cell-click="onCellClick"
                                        ></t8t-table>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane :label="subTables[1].label" :name="subTables[1].name">
                                    <div class="sub-container">
                                        <!-- 新增和编辑模式才出现按钮 -->
                                        <div class="my-toolbar" v-if="(mode === 'add' || mode == 'edit')">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                icon="plus"
                                                @click="addLine(subTables[1].name)"
                                            >新增行</el-button>
                                            <el-button
                                                type="danger"
                                                size="small"
                                                icon="close"
                                                @click="delLine(subTables[1].name)"
                                            >删除行</el-button>
                                        </div>
                                        <!--table-->
                                        <t8t-table
                                            :preLoad="false"
                                            :pageBar="false"
                                            :columns="subTables[1].fields"
                                            :service="subTables[1].service"
                                            :method="subTables[1].method"
                                            :args="subTables[1].args"
                                            :editable="editable"
                                            :ref="subTables[1].name"
                                            :commonData="options || {}"
                                            @row-click="rowClick"
                                            @cell-editor-change="onEditorChange"
                                            @cell-click="onStaffClick"
                                        ></t8t-table>
                                    </div>
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
    import schema from './complaintsManage-schema.js'
    import ComplaintApi from 'src/services/delivery/complaint.js'

    export default {
        name: 't8t-manage-view',
        components: {BasePanel},
        data () {
            return {
                mode:null,
                id: null,
                // 主表绑定数据源
                dataSource: {
                    "createBy" :null,
                    "createName" :null,
                    "createTime" :null,
                    "id" :null,
                    "objectConfigId" :null,
                    "objectName" :null,
                    "pkgName" :null,
                    "productPackageId" :null,
                    "status" :null,
                    "updateBy" :null,
                    "updateName" :null,
                    "updateTime" :null,
                },

                // 附表绑定数据源，只有panel（一对一）形式展示的需要绑定，table（一对多）的不需要
                subDataSource: {
                },
                // 所有配置全部初始化在这里
                options: {
                    productPkgOption:[],
                    objectConfigOption:[],
                    complaintContentOption:[],
                    staffTypeOption:[
                        {text:'回访人',value:1},
                        {text:'处理人',value:2},
                    ],
                    distributionTypeOption:[
                        {text:'投诉人上级',value:1},
                        {text:'项目负责人',value:2},
                    ],
                    specificSourceOption:[],
                    statusOption:[
                        {text:'启用',value:1},
                        {text:'禁用',value:2},
                    ],
                    isDefaultOption:[
                        {text:'是',value:1},
                        {text:'否',value:0},
                    ],
                },
                schema: schema,
                subTables: JSON.parse(JSON.stringify(schema.subTables)),
                mainTable: schema.mainTable,
                // 控制主表区域收缩
                isTopHide: false,
                isDialogShow: true,
                // 主表tab默认激活页
                mainActiveTab: '',
                // 附表tab默认激活页
                subActiveTab: '',
                // 点击关闭后的返回route
                goBackRoute: '/tuchat-delivery/complaints-manage-config',
                sourceMap: {},
                columns: {},
                manageToolbarList:[],
                editable:false,
                viewMode:'view',
                dealer: Cookie.get('t8t-tc-username'),
                contentSelected:[],

            }
        },
        created () {
            // 初始化通用query
            this.id = this.$route.query.id
            this.mode = this.$route.query.mode || 'view'
            this.initMode()

            this.getPkgObj()
            this.getComplaintsObj()
            this.getSourceId()
            // 初始化主附表
            this.initMainTable()
            this.initSubTable()
        },
        methods: {
            initMode(){
                switch (this.mode) {
                    case "add":
                        this.manageToolbarList = ['SUBMIT']
                        this.mainTable = schema.addTable
                        this.editable = true
                        this.viewMode = 'add'
                        break;
                    case "edit":
                        this.manageToolbarList = ['SAVE']
                        this.editable = true
                        break;
                    case "view":
                        this.manageToolbarList = ['EDIT', 'DISABLE', 'ENABLE']
                        this.editable = false
                        break
                    default:
                        this.manageToolbarList = []
                }
            },
            getPkgObj(){
                let _list = []
                ComplaintApi.productPackageQueryPage({page:1,size:100}).then((res) => {
                    if(res.data.status != 200) {
                        this.$message.error("产品包获取失败")
                        return
                    }
                    res.data.result.rows.forEach((item) => {
                        _list.push({text: item.pkgName, value: item.id})
                    })
                    this.options.productPkgOption = _list
                }).catch(()=>{
                    return
                })
            },
            getComplaintsObj() {
                let _list = []
                ComplaintApi.complaintObjectQueryList({}).then((res) => {
                    if (res.data.status != 200) {
                        this.$message.error("投诉对象获取错误")
                        return
                    }
                    res.data.result.forEach((item)=>{
                        _list.push({value:item.id,text:item.complaintObjectName})
                    })
                    this.options.objectConfigOption = _list
                }).catch(() => {
                    return
                })
            },
            getSourceId() {
                ComplaintApi.queryUnionParent({search:{pPropertyCodes:[42101,41302]},page:1,size:100}).then((res) => {
                    if(res.data.status != 200) {
                        this.$message.error("角色信息获取失败！")
                        return
                    }
                    let _contentList = []
                    let _sourceList = []
                    res.data.result.forEach((item) => {
                        if(item.pPropertyCode === '41302')
                            _contentList.push({text:item.propertyName,value:item.id,disabled:false})
                        if(item.pPropertyCode === '42101')
                            _sourceList.push({text:item.propertyName,value:item.propertyCode})
                    })
                    this.$nextTick(()=>{
                        this.options.complaintContentOption = _contentList
                        this.options.specificSourceOption = _sourceList
                    })

                }).catch((error)=>{return})

            },
            onTopHide () {
                this.isTopHide = !this.isTopHide
            },
            /**
             * 初始化附表
             */
            initSubTable () {
                let that = this, schema = this.subTables, fieldCache
                if (schema && schema.length > 0) {
                    schema.forEach((item, key) => {
                        // 附表页签初始化选中项
                        if (item.isActive || key === 0) {
                            that.subActiveTab = item.name
                        }

                        that.sourceMap[item.name] = {
                            type: item.type,
                            service: item.service,
                            method: item.method,
                            index: key,
                            name: item.name || null
                        }

                        if (!that.columns[item.name]) fieldCache = that.columns[item.name] = {}
                    })
                }
            },
            /**
             * 初始化主表
             */
            initMainTable () {
                // 初始化tab页中的激活选项
                if (this.mainTable.tabs && this.mainTable.tabs.length > 0) {
                    this.mainTable.tabs.forEach((item, key) => {
                        if (item.isActive || key === 0) {
                            this.mainActiveTab = item.name
                        }
                    })
                }

                // 在查看和修改模式下需要初始化加载数据
                if (this.mode == 'view' || this.mode == 'edit') {
                    this.mainTable.args.id = this.id
                    this.loadMainTable()
                }
            },
            /**
             * 加载主表数据
             */
            loadMainTable () {
                let self = this
                let mainTableSchema = schema.mainTable, args = mainTableSchema.args || {}

                if (mainTableSchema.service && mainTableSchema.method) {
                    this.loading = true
                    axios({
                        service: mainTableSchema.service,
                        method: mainTableSchema.method,
                        args: args
                    })
                        .then((res) => {
                            let response = res.data
                            // 数据加载成功
                            if (response && response.status == 200) {
                                this.dataSource = Object.assign({}, schema.mainTable.dataSource, response.result)
                                self.loadSubTable()
                            }
                        })
                        .catch((res) => {
                            // TODO 数据加载失败
                            console.error("panel load data failed.", res)
                            // self.$message.error('表格数据加载失败')
                        })
                } else {
                    // TODO 没有传service和method参数处理
                }
            },
            /**
             * 加载附表数据
             */
            loadSubTable () {

                if (!this.mode == 'view' || !this.mode =='edit') return

                let self = this
                let schema = this.subTables, args, service, method, temp, argsString

                schema.forEach((subSchema, key) => {

                    service = subSchema.service
                    method = subSchema.method

                    if (service && method) {
                        args = subSchema.args || {}
                        argsString = JSON.stringify(args)
                        argsString = argsString.replace(/\@([a-zA-Z]+)/g, function(word, $1) {
                            return self.dataSource[$1]
                        })
                        eval(' temp =  ' + argsString)
                        args = temp

                        // 列表查询模式
                        if (subSchema.type === 'table') {
                            args.page = subSchema.page || 1
                            args.size = subSchema.pageSize || 20
                            schema[key].args = args
                        } else {
                            args.page = 1;
                            args.size = 1;
                            axios({
                                service: service,
                                method: method,
                                args: args
                            })
                                .then((res) => {
                                    let response = res.data
                                    if (response && response.status == 200) {
                                        self.subDataSource[key] = response.result
//                                        self.schema[key].dataSource = response.result
                                    }
                                })
                                .catch((res) => {
                                    // TODO 数据加载失败
                                    console.error("load data failed.", res)
                                    // self.$message.error('表格数据加载失败')
                                })
                        }
                    }

                });
            },
            /**
             * 主表表单校验
             * @param callback
             */
            validateMainTable(callback) {
                this.$refs['mainTable'].validate((isValid) => {
                    callback && callback(isValid)
                })
            },
            /**
             * 新增行
             * @param tabName
             */
            addLine (tabName) {
                this.$refs[tabName].addNewRow()
            },
            /**
             * 删除行
             * @param tabName
             */
            delLine (tabName) {
                let _select = this.$refs[tabName].getSelectRows()
                let _pass = false
                if(_select.length > 0) {
                    _select.forEach((row) => {
                        if(row.id) {
                            _pass = true
                        }
                    })
                }
                if(_pass) {
                    this.$message.error("仅有新增的行可以删除！")
                    return
                }
                this.$refs[tabName].delRows()
            },
            /**
             * 关闭弹窗
             */
            closeDialog () {
                this.$router.push({ path: this.goBackRoute })
                this.$emit('close')
            },
            /**
             * 通过不同的mode获取不同的方法，用于不同场景的提交数据
             * @returns {*}
             */
            getMethod () {
                if (this.mode === 'add') {
                    return this.mainTable.createMethod
                } else if (this.mode === 'edit') {
                    return this.mainTable.updateMethod
                } else {
                    return this.mainTable.method
                }
            },
            /**
             * 对整个页面数据进行校验
             * @param cb 校验完成后的回调函数，回调参数为校验结果（true|false）
             */
            validate (cb) {
                let that = this
                that.validateMainTable((isValid) => {
                    if (isValid) {
                        that.validateSubTables((isSubValid) => {
                            cb && cb(isSubValid)
                        })
                    } else {
                        cb && cb(isValid)
                    }
                })
            },
            /**
             * 附表参数校验
             * @param cb 回调函数
             * @param key
             */
            validateSubTables (cb, key) {
                let k = key || 0, that = this

                if (!this.subTables || !this.subTables.length) {
                    cb && cb(true)
                    return
                }

                // 通过schema中的定义的tab.name去递归遍历校验

                this.$refs[this.subTables[k].name].validate((isValid) => {
                    if(!isValid) that.subActiveTab = that.subTables[k].name
                    k++
                    if (k >= that.subTables.length || !isValid) {
                        cb(isValid)
                        return
                    }

                    that.validateSubTables(cb, k)
                })
            },
            /**
             * 组装提交参数（将主表和附表数据以后台标准协议组装）
             */
            formatParams () {
                let args = {}, subDto = {}
                let mainDto = this.dataSource

                if (this.mode === 'edit') {
                    subDto = this.getEditForm()
                } else if (this.mode === 'add') {
                    subDto = this.getAddForm()
                } else {

                }

                args[this.mainTable.name] = Object.assign({}, mainDto, subDto)

                return args
            },
            getAddForm () {
                let key, map, formData = {}, actionLog, beanName

                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName + 'List'] = actionLog.addedRows;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
                    }
                }

                return formData
            },
            getEditForm () {
                let key, map, formData = {}, actionLog, beanName
                for (key in this.sourceMap) {
                    map = this.sourceMap[key]
                    beanName = this.sourceMap[key].name

                    // 表格是一对多，有增删改
                    if (map.type == 'table') {
                        actionLog = this.$refs[key].getActionLog(false, true)
                        formData[beanName+'List'] = [].concat(actionLog.addedRows, actionLog.editedRows);
                        formData[beanName+'DeleteIds'] = actionLog.deletedIDs;
                    }
                    // 一对一只有改
                    else {
                        formData[beanName] = this.subDataSource[map.name]
                    }
                }

                return formData
            },
            submitBtn(){
                let _self = this
                let _staffTable = this.$refs.staffConfig
                let _contentTable = this.$refs.contentConfig
                try {
                    _staffTable.handleFormItemBlur()
                    _contentTable.handleFormItemBlur()
                }catch (error){

                }
                _self.validate((isValid) => {
                    if (isValid) {
                        let roleOnly = []
                        let defaultOnly = []
                        let roleRepeat = 0
                        let defaultRepeat = 0
                        _staffTable.dataSource.forEach(item => {
                            if(roleOnly.indexOf(item.staffType+'&'+item.distributionType) > -1){
                                roleRepeat++
                            }else{
                                roleOnly.push(item.staffType+'&'+item.distributionType)
                            }
                            if(item.isDefault)
                                if(defaultOnly.indexOf(item.staffType) > -1){
                                    defaultRepeat++
                                }else{
                                    defaultOnly.push(item.staffType)
                                }
                        })
                        if(roleRepeat) {
                            this.$message.error("人员类型和分配类型不唯一")
                            return
                        }
                        if(defaultRepeat) {
                            this.$message.error("人员类型和默认不唯一")
                            return
                        }

                        let _complaintContentList = []
                        let _complaintStaffList = []
                        if(_contentTable.dataSource.length < 1) {
                            _self.$message.error("请添加投诉内容配置")
                            return
                        }
                        if(_staffTable.dataSource.length < 1) {
                            _self.$message.error("请添加投诉人员配置")
                            return
                        }
                        _staffTable.dataSource.forEach((item) => {
                            _complaintStaffList.push({id:item.id,distributionType:item.distributionType,isDefault:item.isDefault,staffType:item.staffType,status:item.status,specificCode:item.specificCode})
                        })
                        _contentTable.dataSource.forEach((item) => {
                            _complaintContentList.push({id:item.id,complaintContentId:item.complaintContentId,status:item.status})
                        })
                        let _args = {
                            "complaintManagement": {
                                "complaintContentList": _complaintContentList,
                                "complaintObjectConfigId": this.dataSource.objectConfigId,
                                "complaintStaffList": _complaintStaffList,
                                "createBy": this.dealer,
                                "createName": this.dealer,
                                "productPackageId": this.dataSource.productPackageId,
                                "status": 1
                            }
                        }
                        if(_self.mode === 'edit') {
                            _args = {
                                "complaintManagement": {
                                    "id":this.id,
                                    "complaintContentList": _complaintContentList,
                                    "complaintStaffList": _complaintStaffList,
                                    "updateName": this.dealer,
                                    "updateBy": this.dealer
                                }
                            }
                            _self.$refs['manageToolbar'].disableBySymbol('SAVE');
                            ComplaintApi.complaintManaUpdate(_args).then((res) => {
                                _self.$refs['manageToolbar'].unDisableBySymbol('SAVE');
                                if (res.data.status != 200) {
                                    _self.$msgbox({
                                        title: '消息',
                                        message: res.data.message || "操作失败",
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
                                        _self.closeDialog()
                                    }
                                })
                            }).catch(() => {
                                _self.$refs['manageToolbar'].unDisableBySymbol('SAVE');
                                return
                            })
                            return
                        }
                        _self.$refs['manageToolbar'].disableBySymbol('SUBMIT');
                        ComplaintApi.complaintManaCreate(_args).then((res) => {
                            _self.$refs['manageToolbar'].unDisableBySymbol('SUBMIT');
                            if (res.data.status != 200) {
                                _self.$msgbox({
                                    title: '消息',
                                    message: res.data.message || "操作失败",
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
                                    _self.closeDialog()
                                }
                            })
                        }).catch(() => {
                            _self.$refs['manageToolbar'].unDisableBySymbol('SUBMIT');
                            return
                        })
                    }
                })
            },
            editBtn() {
                //validate status
                this.$router.replace({
                    path: "/delivery/complaints-manage-config-detail",
                    query: {mode: "edit",id:this.id}
                })
                this.mode = "edit"
                this.editable = true
                this.initMode()
            },
            rowClick(row, column, cell, event){
                if(this.mode === 'view' || this.mode === "add") return
                if (this.mode === "edit" && row.id){
                    if(cell.property === "complaintContentId") {
                        this.$refs.contentConfig.handleFormItemBlur()
                    }
                }
            },
            updateStatus(status) {
                let _self = this
                if(status === this.dataSource.status) {
                    this.$message.error("当前装状态不能"+this.options.statusOption[status-1].text)
                    return
                }
                let _args = {
                    "ids":[this.id],
                    "status": status,
                    "updateBy": this.dealer,
                    "updateName":this.dealer
                }
                _self.$refs['manageToolbar'].disableBySymbol(status == 1 ? 'ENABLE' : 'DISABLE');
                ComplaintApi.complaintManaStatusUpdate(_args).then(res=>{
                    _self.$refs['manageToolbar'].unDisableBySymbol(status == 1 ? 'ENABLE' : 'DISABLE');
                    if (res.data.status != 200) {
                        _self.$msgbox({
                            title: '消息',
                            message: res.data.message || "操作失败",
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
                        confirmButtonClass: 'is-plain'
                    })
                    // 初始化主附表
                    this.initMainTable()
                    this.initSubTable()
                }).catch(error => {
                    _self.$refs['manageToolbar'].unDisableBySymbol(status == 1 ? 'ENABLE' : 'DISABLE');
                    return
                })
            },
            //val 编辑时去除选中的值
            setSelected(val){
                let _list = []
                this.$refs.contentConfig.dataSource.forEach(item => {
                    if(item.complaintContentId) _list.push(item.complaintContentId)
                })
                this.contentSelected = _list
                for(let i=0;i<this.options.complaintContentOption.length;i++) {
                    if(this.contentSelected.indexOf(this.options.complaintContentOption[i].value) > -1 && this.options.complaintContentOption[i].value != val) {
                        this.options.complaintContentOption[i].disabled = true
                    }else{
                        this.options.complaintContentOption[i].disabled = false
                    }
                }
            },
            onCellClick(row, column){
                if(column.property === 'complaintContentId') {
                    this.setSelected(row.complaintContentId)
                }
            },
            onStaffClick(row,column){
                if(column.property === 'specificCode') {
                    if(row.distributionType === 1) {
                        this.$refs.staffConfig.handleFormItemBlur()
                    }
                }
            },
            onEditorChange(cell,column,config) {
                switch (config.prop) {
                    case "distributionType":
                        if(column === 1) cell.row.specificCode = null
                        break;
                    default:
                        return
                }
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
    .demand-detail-view .demandRemark .el-textarea__inner{
        height: 150px !important;
    }
</style>
