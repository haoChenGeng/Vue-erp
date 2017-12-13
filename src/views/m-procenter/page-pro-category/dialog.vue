<template>
    <div>
        <el-dialog title="流程分类" class="proc-category-dialog" v-model="dialogVisible" @close="btnCancleClick()">

            <el-form :model="formData" label-width="125px" :rules="rules" ref="formRef" :label-position="left" >
                <el-form-item  label="分类名称："  prop="name" >
                    <el-input placeholder="请输入名称" v-model="formData.name"  :disabled="editable"></el-input>
                </el-form-item>
                <el-form-item label="分类状态：" prop="status" >
                    <!--<el-input v-model="formData.isDel" ></el-input>-->
                    <el-select v-model="formData.isDel" :disabled="editable" placeholder="--请选择--" @change="changePayType">
                        <el-option v-for="item in statusList" :label="item.text" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="父分类：" prop="parentId">
                    <el-cascader
                        :options="options"
                        :props="cascaderProps"
                        :show-all-levels="false"
                        :disabled="editable"
                        v-model="categoryList"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="分类编码：" prop="code" >
                    <el-input placeholder="请输入编码" v-model="formData.code"  :disabled="editable"></el-input>
                </el-form-item>
                <el-form-item label="分类说明：" prop="description" >
                    <el-input placeholder="请输入说明" v-model="formData.description"  :disabled="editable"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btnOKClick()" type="primary" :loading="isLoading" v-show="editType!='see'">确定</el-button>
                <el-button @click="btnCancleClick()" v-show="editType!='see'">取消</el-button>
                <el-button @click="btnCancleClick()" v-show="editType=='see'">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import APICommon from 'src/services/procenter/proCenterApi.js'
    import config from './config.json'

    export default({
        name:"proc-category-dialog",
        data(){
            return {
                cascaderProps: {
                    value:'id',
                    children:'subclass'
                },
                //分类下拉框
                options: [
                    {
                        id: 0,
                        label: "最顶级"
                    }
                ],
                dialogVisible: true,
                labelPosition: 'right',
                formLabelWidth: '120px',
                formData: {
                    code: '',
                    name: '',
                    parentId: '',
                    isDel: '',
                    description: '',
                },

                statusList:config.commonData.status,

                categoryList: [],
                isLoading: false,

                //表单验证
                rules: {
                    name: [
                        { required: true, message: '请输入分类名', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请输入状态', trigger: 'blur' },

                    ],
                    parentId: [
                        { required: true, message: '请输入父分类', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入分类编码', trigger: 'blur' },
                        { max: 10, message: '分类编码必须小于10位', trigger: 'blur' }
                    ]

                },

                varCheck:false
            };
        },
        props:['rowId','editType'],

        computed: {
            dialogVisible() {
                return true
            },
            editable() {
                return this.editType === 'see'
            }
        },

        created(){
            if(this.editType ==='add')
            {
                this.initformData(),
                    this.rowId = null
            }
            if(this.rowId)
            {
                var search ={
                    id: this.rowId
                }
                var args={
                    search:search,
                    page:1,
                    size:1
                }
                this.getCategory(args)

            }
            this.getCategoryList(args)

        },
        methods:{

            initformData()
            {
                this.formData= {
                    code: '',
                        name: '',
                        parentId: '',
                        isDel: '',
                        description: '',
                }
            },

            btnOKClick()
            {
                if(this.editType==='see')
                {
                    this.btnCancleClick()
                }
                        this.check()
                        if(this.varCheck) {

                            var editType = this.editType
                            if (editType === 'add') {
                                this.addCategory();
                            }
                            else if (editType === 'update') {
                                this.updateCategory();
                            }
                        }
                        else{
                            this.$msgbox({
                                title: '消息',
                                type: 'fail',
                                message: '操作失败,缺少数据',
                                showCancelButton: false,
                                confirmButtonText: '知道了',
                            })
                        }


            },
            btnCancleClick()
            {
                this.$emit('close')
            },

            check()
            {
                if(this.formData.code ==='')
                {
                    this.varCheck = false
                    return
                }
                if(this.formData.name==='')
                {
                    this.varCheck = false
                    return
                }
                if(this.formData.status==='')
                {
                    this.varCheck = false
                    return
                }
                if(this.formData.parentId==='')
                {
                    this.varCheck = false
                    return
                }
                this.varCheck = true

            },

            addCategory()
            {
                var req = this.formData;
                APICommon.createCategory({req}).then((res) =>{
                if(res.data.status===200)
                {
                    //隐藏正在加载
                    this.isLoading = false
                    this.$emit('close')
                    this.$msgbox({
                        title: '消息',
                        type: 'success',
                        message: '添加成功',
                        showCancelButton: false,
                        confirmButtonText: '知道了',
                        confirmButtonClass: 'is-plain'
                    })
                    this.$emit('getTableData')
                    this.$emit('seachTree')
                }
                else {
                    this.isLoading = false;
                    this.$message.error(res.data.message)
                }
            })
            },
            updateCategory()
            {
                var req = this.formData;
                APICommon.updateCategory({req}).then((res) =>{
                    if(res.data.status===200)
                    {
                        //隐藏正在加载
                        this.isLoading = false
                        this.$emit('close')
                        this.$msgbox({
                            title: '消息',
                            type: 'success',
                            message: '修改成功',
                            showCancelButton: false,
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        })
                        this.$emit('getTableData')
                        this.$emit('seachTree')
                    }
                    else {
                        debugger
                        this.isLoading = false;
                        this.$message.error(res.data.message)
                    }
                })
            },

            handleChange(value,aa,bb) {
               this.formData.parentId = value[value.length-1]
                if(this.formData.parentId === undefined)
                {
                    this.formData.parentId=0
                    this.categoryList=[0]
                }
            },

            getCategoryList(args)
            {
                APICommon.getCategoryTree(args).then((res) => {
                    if(res.data.status===200)
                    {
                        res.data.result.forEach((item) => {
                            this.options.push(
                                {
                                    id: item.id,
                                   label: item.label,
                                   subclass:item.subclass
                                }
                            )
                       })
                        console.log(this.options)
                    }
                    else
                    {
                        console.log(this.res)
                        console.log("获取数据失败")
                    }
                })
            },

            getCategoryPid(args)
            {
                if(args.categoryId==0){
                    this.categoryList =[0]
                }else{
                    APICommon.getCategoryPid(args).then((res) => {
                        if(res.data.status===200)
                        {
                            this.categoryList = res.data.result
                        }
                        else
                        {
                            console.log(this.res)
                            console.log("获取数据失败")
                        }
                    })
                }

            },

            getCategory(args)
            {
                APICommon.searchProCategory(args).then((res) => {
                    if(res.data.status===200)
                    {
                        this.formData = res.data.result.rows[0]
                        var categoryPid={
                            categoryId:this.formData.parentId
                        }

                        console.log(categoryPid)
                        this.getCategoryPid(categoryPid)
                    }
                    else
                    {
                        console.log(this.res)
                        console.log("获取数据失败")
                    }
                })

            }
        }
    })
</script>
