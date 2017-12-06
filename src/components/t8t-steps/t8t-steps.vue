<template>
    <div class="t8t-steps">
        <el-steps :active="active" finish-status="wait" direction="vertical" center="true" align-center="true">
            <el-step :icon="getIcon(item.status)" :class="getIcon(item.status)" v-for="item in stepsData">
                <div slot="description" class="description">
                    <i class="arrow"></i>
                    <el-row class="step-header">
                      <el-col :span="4"><span class="t8t-steps-title">{{item.title}}</span></el-col>
                      <el-col :span="20">
                          <el-col :span="8" class="span-item" v-for="spanItem in item.span">{{spanItem.text}}</el-col>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="comment">{{item.message}}</el-col>
                    </el-row>
                </div>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
export default {

    name: 't8t-steps',

    data () {
        return {
            active: 1000
        }
    },
    props: {
        stepsData: {
            type: Array,
            default: []
        }
    },
    methods: {
        getIcon(status){
            if(status === 'done') return 'circle-check'
            if(status === 'suspend') return 'warning'
            if(status === 'process') return 'time'
            return 'circle-check'
        }
    }
}
</script>

<style lang="css" scoped>
    .t8t-steps .description{
        margin-top: 5px;
        margin-left: 60px;
        padding: 10px 25px;
        width: 1100px;
        border: 1px solid rgb(212, 220, 231);
        transform: translateY(-50px);
        min-height: 70px;
        position: relative;
        box-sizing: border-box;
    }
    .t8t-steps .el-steps{
        padding-top: 50px;
    }
    .t8t-steps .step-header{
        display: flex;
        align-items: center;
        min-height: 48px;
    }
    .t8t-steps .t8t-steps-title{
        font-size: 18px;
        line-height: 1.5;
        font-weight: bold;
    }
    .t8t-steps .span-item{
        line-height: 2;
    }
    .t8t-steps .comment{
        line-height: 2;
        padding-top: 10px;
    }
</style>

<style>
    .t8t-steps{

    }
    .t8t-steps .el-step__description.is-success,
    .t8t-steps .el-step__description.is-wait {
        color: #8391a5;
    }
    .t8t-steps .arrow{
        position: absolute;
        display: inline-block;
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
        top: 28px;
        left: -6px;
        border-bottom: 1px solid rgb(212, 220, 231);
        border-left: 1px solid rgb(212, 220, 231);
        background-color: #fff;
    }
    .t8t-steps .circle-check .el-step__icon{
        color: rgb(31, 199, 140)
    }
    .t8t-steps .warning .el-step__icon{
        color: rgb(255, 167, 67)
    }
    .t8t-steps .time .el-step__icon{
        color: rgb(245, 120, 2)
    }
    .t8t-steps .el-step__line{
        background-color: rgb(31, 199, 140)
    }
    .el-step__icon{
        margin-top: -1px;
        margin-left: 2px;
    }
</style>
