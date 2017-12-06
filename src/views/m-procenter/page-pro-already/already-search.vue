<template>
    <div class="already-search" :class="searchMore?'h-auto':''">
        <el-form :inline="true" :model="searchValConfig" label-position="left" label-width="100px" @keyup.enter.native="handleSubmit()">
            <div class="search-left-box">
                <div class="search-group">
                    <el-form-item label="当前状态">
                        <el-select  v-model="searchValConfig.staticType"  placeholder="--请选择--">
                            <el-option v-for="p in commonOptionsConfig.staticType" :label="p.text" :value="p.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="search-group">
                    <el-form-item label="流程名">
                        <el-select  v-model="searchValConfig.procName" placeholder="--请选择--">
                            <el-option v-for="p in commonOptionsConfig.processNames" :label="p.text" :value="p.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="search-group">
                    <el-form-item label="实例ID">
                        <el-input v-model="searchValConfig.procInsId" placeholder="实例ID"></el-input>
                    </el-select>
                    </el-form-item>
                </div>
                <div class="search-group">
                    <el-form-item label="发起人">
                        <el-input v-model="searchValConfig.starter" placeholder="发起人"></el-input>
                    </el-select>
                    </el-form-item>
                </div>
                <div class="search-group">
                    <el-form-item label="发起时间">
                        <el-date-picker v-model="searchValConfig.startTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                        <el-date-picker v-model="searchValConfig.endTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                    </el-form-item>
                </div>


            </div>
            <div class="search-group-cli">
                <span class="more-serach" v-if="needSearchMoreBtn" @click="toggleSearchBtn()">更多查询 <i class="el-icon-d-arrow-left"></i></span class="more-serach">
                <el-button type="primary" @click="handleSubmit()">查询</el-button>
                <el-button @click="resetFrom()">重置</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import apiProCenter from 'src/services/procenter/proCenterApi.js'
    export default {
        name: 'already-search',
        data() {
            return {
                searchMore : false,
                setDisabled:true
            }
        },
        props: {
            searchValConfig : Object,
            commonOptionsConfig : Object,
            needSearchMoreBtn: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            toggleSearchBtn: function () {
                this.searchMore = !this.searchMore
            },
            handleSubmit: function () {
                var search = this.searchValConfig;
                var copySearch = Object.assign({},search);
                for ( var i in copySearch) {
                    if(copySearch[i]=='') {
                        copySearch[i] = null;
                    }
                }
                this.$emit('submit',copySearch)
            },
            resetFrom: function () {
                this.$emit('reset')
            }
         }
    }

</script>

<style lang="css" scoped>

</style>


<style>
.already-search{
    position: relative;
    height: 59px;
    min-height: 59px;
    padding: 22px 20px 0;
    border-bottom: 2px solid #eff7fa;
    overflow: hidden;
    font-size: 12px;
}
 .already-search .el-form {
    position: relative;
}
.already-search .search-group-cli {
    position: absolute;
    right: 32px;
    top: 3px;
    width: 221px;
    z-index: 2;
}
.search-left-box {
    float: left;
    width: 80%;
}
.already-search.h-auto {
    height: auto !important;
}
.already-search.h-auto .more-serach .el-icon-d-arrow-left {
    transform: rotate(90deg);
    vertical-align: text-top;
}
.already-search .more-serach {
    padding-right: 15px;
    color: #3396fb;
    cursor: pointer;
    -webkit-user-select: none;
}
.already-search .search-group {
    display: inline-block;
    width: auto;
    margin-right: 30px;
}

.already-search .more-serach .el-icon-d-arrow-left {
    padding-left: 5px;
    font-size: 12px;
    transform: rotate(-90deg);
    vertical-align: text-bottom;
}
.already-search .el-input {
    width: 180px;
}
.already-search .el-form--label-left .el-form-item__label {
    text-align: right;
    font-size: 12px;
}
.already-search .el-input__inner{
    font-size: 12px;
    height: 32px;
}
.already-search .el-form-item__content{
    font-size: 12px;
}
.already-search .el-button{
    padding: 8px 17px;
    font-size: 12px;
}
.already-search .el-select-dropdown__item{
    font-size: 12px;
}

</style>
