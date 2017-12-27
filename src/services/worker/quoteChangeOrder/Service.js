/**
 * Created by tomy.li on 2017年9月11日14:40:14
 */
let Services = {
    order: {
        // /biz/dsp-prs-pqm/app
        name: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3',
        methods:{

            create: 'CYfdVCcvmAInVRLrotLJeTFv5J-6AR6Zs5cN9KW',  //增改变更单 views.variationOrder.create

            detail: 'nzvxYtZ3pvKtURLvgjkgK4gBVfPkR6iLQRuTcg1', //查看变更单详情 views.variationOrder.detail

            detailVerify: 'TiLaDyKVaQAsXBupUQzkPd-KUkVvrDBPxD_aZmIPcLuAL_0',  //变更单详情-有权限 views.variationOrder.detailVerify


            addList: '611_9Gnp6A1lUo0VXmUzavLiHjEo0URn2zyxWI_6ddP', //增项接口 views.variationOrder.addList

            subList: 'CML0DVyNGt2pCt1laAflbT5dYK39n-sbIl1ymLZselm', //减项接口 views.variationOrder.subList

            getQuoteOrderSpace:'X0uxaHJ8sgS-qDg7lFaengUrs0P8BxbhzjN', //报价单中用到的空间 views.quote.order.space

            submit: '8FBDfJRnK7FiR1AxEd1_oNyTnQzykM7U0W9FCOP', //提交报价单 views.variationOrder.submit

            print: 'bSRRHlNZdh9zIcT-fgEE4s_j1OHYzuX_NKXYg8q', //打印变更单 views.variationOrder.print

            VOID: 'VittbTpNiQXHygW57MHBza__aLhY8haPpV1', //变更单作废  views.variationOrder.zuo

            unSubmit: 'vsp5y7fCyeAe5gqYIgJvQAZ7d5dqcD3v7AZxpdzzqiG', //变更单反审核  views.variationOrder.unSubmit

            completeTask: 'BdJURYr_NPtgaGvFtfOM0QQ7AZ25klNRj0k', //views.wkf.completeTask 处理流程接口(通过流程Id,taskId)-前端调用工作流转发接口 views.wkf.completeTask

            submitDetail:'7J1SIAYs_A3XFszVH36YLM2HsH63ZRtJo04mD4R1UzXo5IN', //views.variationOrder.submitDetail 提交水电增项详情

            createdDetail:'8U6HJ-Xsj9CI8nQ5liNCJ0NBZtF539O6u-b73_YM7wT_qmJ71gi', //views.variationOrder.createdDetail 查询水电增项详情

            createdList:'9RGULiAMQSzR2ClU4DwOJ-Y4SELmhEUloBE3exDG3RU9m-r', //views.variationOrder.createdList 查询已创建的水电增项列表

            unCreateList:'OIJaTXsgPe0VL42Y8gNef1b-a536gVFc0O-XR5DUnGu-MDU', // views.variationOrder.unCreateList 查询未创建的水电增项列表

            list:'wm57r22Hfvg7VIfuBVNguUBo9a9pqJxyGrRynm6', //views.variationOrder.weList 查询水电增项列表
        }
    },

    //审核流相关
    workFlow:{
        // /biz/dsp-prs-pqm/app
        name: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3',
        methods: {
            getBusinessKeyDetail: 'ntwMuDkDFF1gAtmoeocMEDugiSemvf2jCaBIyMsnQDsnAUXSetOlceZlNpN', //获取审批流数据 views.changeOrderWkf.getBusinessKeyDetail
            querySignedProjects: 'Yul33uIcygqk-hcqTs4yg2b0LCUumZ2xkctvL91rUSxtI62o7VG', // 查询已签约的报价单 views.quoteOrder.querySignedProjects
            variationOrderList:'Lgkgd6NbJVHuWE00kKU9cN2EkcY1aKIIhvLvAew',//views.variationOrder.list
        }
    }
}

export default Services
