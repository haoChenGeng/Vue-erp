<template>
    <div class="add-tab-8">
    
	    <!-- 信息区 -->
	    <div class="full-dialog-form-container container-center">
            <t8t-form-panel :dataSource="formData"
                            :fields="fields"
                            :commonData="commonData"
            >
                <template slot="placeholder2">
                  <div style="height:35px"></div>
                </template>
            </t8t-form-panel>
        </div>
    </div>
</template>

<script>
import api from 'src/services/delivery/foremanworker.js'
import tableConfig from './add-tab-8.js'

export default {
    name: 'add-tab-8',
    computed: {
    	
    },
    data () {
        return {
            fields:tableConfig.fields,
        	formData:{
        		createUsername: '',
                verifyUsername: '',
                dimissionCreateUsername: '',
                dimissionVerifyUsername: '',
                createTime: '',
                verifyTime: '',
                dimissionCreateTime: '',
                dimissionVerifyTime: '',
                updateUsername: '',
                dimissionReason: '',
                updateTime: '',
        	},
            //配置
            commonData: {}
        }
    },
    created() {
        if(this.$route.query.id){
                this.getData(this.$route.query.id)
            }
    },
    methods: {
        //获取数据
        getData(id) {
            var args = {id:id}
            api.findWorkerOther(args)
                .then((res) => {
                    if (res.data.status === 200) {
	                    this.formData = res.data.result
                        this.formData.createTime = this.dateParser(this.formData.createTime)
                        this.formData.dimissionCreateTime = this.dateParser(this.formData.dimissionCreateTime)
                        this.formData.dimissionVerifyTime = this.dateParser(this.formData.dimissionVerifyTime)
                        this.formData.verifyTime = this.dateParser(this.formData.verifyTime)
                        this.formData.updateTime = this.dateParser(this.formData.updateTime)
                    }
                })
        },
        dateParser(text) {
                let dateString;
                if (text === 0 || text === null || typeof(text) == 'undefined') {
                    dateString = ""
                } else {
                    dateString = text * 1000
                }
                return dateString
        }
    }
};
</script>

<style lang="css" scoped>
    .info-container .col {
        flex: 1;
    }
    .t8t-full-dialog .el-tab-pane .my-toolbar {
        position: absolute;
        left: 30px;
        right: 30px;
        
        margin: 0 auto!important;
    }
    .t8t-full-dialog .el-tab-pane .my-toolbar .el-button--small {
        padding: 7px 9px!important;
        font-size: 12px;
    }
</style>