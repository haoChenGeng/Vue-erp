<template>
        <div class="t8t-breadcrumb">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item v-for="item in originData">{{item.title}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button size="mini" type="" class="pageHelpButton" v-if="helpId" @click="toggleHelp">使用帮助</el-button>
    </div>
</template>

<script>

    import axios from 'src/utils/axios.js'
    export default {
        name: 't8t-breadcrumb',
        props: {
            data: {
                type: Array,
                default: []
            },
            originData: {
                type: Array,
                default: []
            },
            helpId:{
                type:Number,
                default:0,
            }
        },
        data(){
            return {
                helpId:0
            }
        },
        created () {
            let that = this
            axios({
                service: 'jjiyXF7mi11obIh-L1EZ9IGrrI1wu_n',
                method: 'ZPGTvXV3xYDk6a1Mnk5rSYxQlGhXoPfpmgsrzNR',
                args: {
                    url: '#' + this.$route.path
                }
            }).then((res) => {
                if (res.data && res.data.result) {
                    that.originData = res.data.result.map((value) => {
                        return {title: value}
                    })
                } else {
                    that.originData = that.data
                }
            }).catch((err) => {
                that.originData = that.data
            })

            this.getHelpId()
        },
        methods:{
            //获取帮助文档
            getHelpId(){
                let url = this.$route.path
                let that = this
                that.helpId = 0 //清除上次设置的内容
                this.$http.fetch('permission/queryPage',{
                        search:{
                            url: '#'+url
                        },
                        page:1,
                        size:2
                }).then(res => {
                    if( res.data.status == 200 && res.data.result  && res.data.result.rows.length > 0 ){
                        let  description = res.data.result.rows[0].description
                        if( description && description.length > 0){
                            try {
                                description = JSON.parse(description)
                                if( description.helpId ){
                                    that.helpId = description.helpId
                                }
                            }catch (e){

                            }
                        }

                    }
                })
            },

            //获取帮助内容
            getHelpDataById()
            {
                if (this.helpId) {
                    const args = {
                        id: this.helpId
                    }
                    helpApi.getDetailById(args)
                        .then(res => {
                            if (res.data.status === 200) {
                                this.helpContent = res.data.result.content ? res.data.result.content : ''
                                this.helpTitle = res.data.result.title ? res.data.result.title : ''
                            }
                        })
                }
            },

            /*展示/隐藏帮助内容*/
            toggleHelp: function (){
                window.open(window.location.origin + '/#/helpcenter/page-faq/info?id='+this.helpId,'_blank')
            },
        }
    }

</script>

<style lang="css" scoped>
    .t8t-breadcrumb {
        height: 35px;
        min-height: 35px;
        border-bottom: 1px solid #eff7fa;
        display: flex;
        align-items: center;
    }

    .t8t-breadcrumb .el-breadcrumb {
        margin-left: 20px;
        font-size: 12px;
    }
</style>


<style>
    .t8t-breadcrumb .el-breadcrumb__item__inner,
    .t8t-breadcrumb .el-breadcrumb__separator {
        color: #666!important;
    }

    .t8t-breadcrumb .el-breadcrumb__item__inner,
    .t8t-breadcrumb .el-breadcrumb__separator {
        cursor: default!important;
    }
    .t8t-breadcrumb .pageHelpButton{
        margin-left: 20px;
        border-color: rgb(232, 237, 241);
        color: rgb(50, 139, 239);
    }
</style>
