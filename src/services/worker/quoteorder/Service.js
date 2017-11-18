/**
 * Created by tomy.li on 2017年6月1日19:21:52.
 */
let Services = {
    order: {
        //  /biz/t8t-prs-pqm/app
        name:'I1c2Cx1PxgTcpqUYzfTQualK0vhZ94S',
        methods:{
            //获取可用的子空间 views.quote.order.spaceselect
            getChildSpaces: 'MmRihb77eMIXfgGrEdPXz3TZUEsgmxRJ4F2ZGghUl_A',
            //报价单头信息及初始报价项 views.quote.order.show
            quoteOrderInfo: '5qs-2_iJlfoGFwLwKgMLgAdehHkM84SlDXT',

            //根据模板及空间获取标准报价项 views.quote.order.spacetempitem
            getQuoteTempItemBySpace: '-t65G7VbO-q2P9m0B9BadFtrpM6GhDrX1U52.IS9ry5vxee',

            //根据模板获取非标准报价项 views.quote.order.spacetempitemunstandard
            getQuoteTempItemUnstandardByTempId: 'UeaeWuZ0owkh2pNY1gtUbRMBnTEHtlCcAga81Qi-IdQQOlp9dmuntdogtV2',

            //暂存报价单 views.quote.order.quoteordercreate
            saveQuoteOrder: 'Z1whbJY9tgk5mTslpmGuXgoiEsujkAmVf4p3Mwr0JBkSDGl_fRJ',

            //搜索sku views.selectionSku.query
            selectionSku: 'ibZvmBQ1R8d1d-aX5iZFzJq3-VrMqfNHfS9',

            //获取sku详情
            getSkuInfo:'',

            //新建报价单 views.quote.order.newcreate
            newCreate: 'ruhrYAW2mRiM7oAc_0nuPyhTOpLkwdBSEVwSfXx',

            //提交报价单 views.quote.order.submit
            submitOrder: 'qj10sGZqcqh9rdDTtoEWxWnX9rERixtuih0',

            //打印报价单 views.quote.order.printQuoteOrder
            printOrder:'SaaWDpGnS77pCsNSNerZNVXM5UOBCf_NL2DPVhmA2ymO37k',

            //预览报价单 views.quote.order.previewQuoteOrder
            previewOrder:'VLeaXxzUC-MLoWu8WS0uuc-Q9oWuvLEdeeFdtsYcJKMsDeAL9un',

            //未出报价项目 views.quoteOrder.queryQuoteOrderProjectPage
            queryQuoteOrderProject: 'BJGIAJ0Du4oR_t35Pjx71J_DcUv-qE_onXCZl6obtH66siE7PLs4vb2aa89p0jh',

            //已出报价项目 views.quoteOrder.queryCompleteQuoteOrderProjectPage
            queryCompleteQuoteOrderProjectPage:'WfMcT0JtVUBmax-AGXP6eVJwnaTUrbAEsGA4nCAKe7OLsaFOMIdOQF3cP8bEviMPtONXPaR',

            //反审核报价单
            recheckQuoteOrder:'z2mlc3fYxwnYvqJh-vZHf6pYIHtdp8ntZJ6dkR-', //views.quote.order.unSubmit

            //选品单页面初始化
            quoteSelectionInfo:'DnH6MwYeTCSVoO-phT627OU1LUIs5qb4qrenK0M-nzVv9QPlrLSwilT',//views.selectionSku.querySelectionList

            //保存报价单
            saveSelectionList:'dTNdbuVMsa1RoEDKyGSG9uBselzCnLfciR-GTvRU3RWDu3DaVLz',//views.selectionSku.saveSelectionList

            //提交报价单
            submitSelectionList:'IohQLZ3IoJEmT7bYBMyWFtZWyYxLjHiIkkoIELhK2AlZxhvXeeZamPr',//views.selectionSku.submitSelectionList

            //同步报价模板中的数据到报价单和选品单
            syncTempToQuoteAndSelection:'9ZEZ9Z-dI5CPPmFAxPFAFPBtTAIoP3z1f81CoizG1i861jNV91jG2jFIoEIKWrf',//views.quoteOrder.syncTempToQuoteAndSelection

            //查询标配报价项--展示对应空间下，所有未选择的标配报价项
            getStandardQuoteItem:'zQ8MyPxYDEBUJut6BOG77G5gG17_SZLB6a8OARBAjerem5AQ4OIL95c1Bic9Nz7AshuHtCZ',//views.quoteOrder.queryUnSelectStandardQuotOrderItem

            //查询个性化报价项--展示对应空间下，所有未选择的非标配报价项
            getUnStandardQuoteItem:'PdLgBuAbnTHLLpF591Df2XTI0VUKOgpSLPWHe7TS7_r7RdKR_8iPAtlBrsuApI1XKIZVbZqT-no', //views.quoteOrder.queryUnSelectUnStandardQuotOrderItem

            //删除标配报价项
            deleteStandardQuoteItem: 'YPwMgGiJrWBRbX9P3YOHCgFJ0NETufHCBJTgU5hEagdARdr', //views.quoteOrder.deleteOrderItem

            //获取选品
            getQuoteDelivery: '2NSPGgkHDc9XXxvmMMyBqH7jXe0_ec__0RtPtEEDmbHAmRXrfMZFvxI18dPGd4cGfu_y7bJHfaCz-Ht', // views.selectionSku.querySelectionListForAddDosageMapping

            //删除选品 views.quoteOrder.deleteGroupDosageMapping
            deleteQuoteDelivery: 'CfcKYaEmOe_JpYSr4z_NHKVZef8OpXFM6P8BJhYD62oTbAKRMnJQB2O-K_n', // views.quoteOrder.deleteGroupDosageMapping

            //保存选品  views.selectionSku.insertSingeQuoteItemAndDosageDetail
            insertSingeQuoteItemAndDosageDetail:'z_7q38OHjKbbybbfN2eZREtMyPQoQ-1w8b0iXmte6z-qcv0ffcdjMXyiv9nlcWJdwinqNp6eYq-',

            //批量新增报价单行 views.quoteOrderItem.createItems
            insertQuoteItemAndDosageDetails:'okggqEd6rmh-bRIdIruew7afgBmnA9nDYjjfVK0akcjWSZN',

            //管理员权限--修改报价单状态 views.changeQuoteStatus
            changeQuoteStatus:'q271sNZxr1z3onezmjll8tclizTIHcwpPiN',
        }
    },
    project:{
        // /biz/t8t-prs-mdm/app
        name: 'azI9sv-1Owbj4ZXdwMS1EzYRRvpIBnA',
        methods:{
            //订单（项目）id批量查询订单（项目）信息 views.decorationOrder.findOrderDetailByIdList
            findOrderDetailByIds:'GNMNUyDXBxBaT0_XeI8gYCLlpQU9-a2YSQhYcH6Sh6MDMIgUvtUH7B2IM8CVA0b'
        }
    }

}

export default Services
