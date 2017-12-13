<template>
    <div >
            <el-form :model="formData"   ref="formRef" :label-position="top"  >
             <!--   <el-form-item  label="流程名："  prop="procName" >
                    <el-input  v-model="procName"  :disabled="true" ></el-input>
                </el-form-item> -->
                <el-form-item  label="节点Id："  prop="nodeId" >
                    <el-input  v-model="nodeId"  :disabled="true" ></el-input>
                </el-form-item>

                <el-form-item label="节点名：" prop="nodeName" >
                    <el-input  v-model="nodeName"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="任务生成时间：" prop="createTime" >
                    <el-input  v-model="createTime"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="任务结束时间：" prop="completeTime" >
                    <el-input  v-model="completeTime"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="处理人：" prop="executableNamesStr" >
                    <el-input  v-model="executableNamesStr"  :disabled="true" type="textarea"></el-input>
                 </el-form-item>
                </el-form>
        </div>
    </template>

    <script>
        import APICommon from 'src/services/procenter/proCenterApi.js'

        export default({
            name:"right-form",
            data(){
                return {
                };
            },
            computed: {
           },
            props:['nodeId','nodeName','executableNamesStr','createTime','completeTime','procName'],

            created(){
            },
            methods:{
            }
        })
    </script>
