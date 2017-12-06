/**
* Created by tomy.li on 2017/9/9.
*/
<template>
    <div class="loginLog">
        <t8t-search
            ref="searchForm"
            :fields="fields"
            :selectSource="commonData"
            :showToggleBtn="false"
            @submit="submitSearch"
        >
        </t8t-search>
        <t8t-table
            :service="service"
            :method="method"
            :columns="columns"
            :args="args"
            :selectCol="false"
            ref="loginLogMainTable"
            :commonData="commonData"
        >
        </t8t-table>
    </div>
</template>
<script>
    import config from './config.js'
    import Service from 'src/services/operationdata/Service.js'
    export default {
        name: "登录日志",
        created() {
        },
        methods: {
            //搜素
            submitSearch(objForm) {
                let obj = Object.assign({},objForm);

                let argsObj = Object.assign({},this.args)
                argsObj.search = obj;
                this.args = argsObj;
            },
        },
        data() {
            return {
                args:{},
                service:Service.LOGINLOG.name,
                method:Service.LOGINLOG.methods.query,
                columns: config.columns,
                fields:[
                    {type: 'input',label: 'UID',name: 'uid'},
                    {type: 'input',label: '用户名',name: 'userName'},
                    {type: 'select',label: '登录平台',name: 'loginType',selectSourceKey:'loginType'},
                ],
                commonData:{
                    loginType: [
                        {
                            value:1,
                            text:'erp'
                        },
                        {
                            value:2,
                            text:'商家后台'
                        }
                    ],
                }
            }
        }

    }
</script>
