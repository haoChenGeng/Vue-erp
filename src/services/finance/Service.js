// 财务模块
let Services = {

    //款项管理
    REFUND_MANAGE_CONFIG: {
        // /biz/dsp-prs-fdm/app
        name: 'd5Ntj1SDGmf5W_hdZIOup2eWBmvNCID',
        methods: {
            // views.roundOrder.refunds 返轮单费列表
            ROUND_ORDER_REFUNDS: 'z7o7hMT2i6FQwpZm19o7xlPZ2uydh7XvusI',

            // views.roundOrder.backRoundOrder  返轮单费申请返款
            BACK_ROUND_ORDER_REFOUNDS: 'dzvgfnCYtu37Ea4kMYkdlps0sjiM9lkM30t5EOLayRymbKL',

            // views.trusteeFee.refunds 返托管款列表
            TRUSTEE_FEE_REFUND: 'fm3o1PeuvdbLh3nmbrqnZk8KZxMoZH6x4n4',

            // views.trusteeFee.trustFeeInfo 项目托管款信息列表
            TRUSTEE_FEE_INFO: '29Q_1WR0GDwxjCdAPwbsI-w9TM2PFtZGsHL_DPFxVVX',

            // views.trusteeFee.backTrusteeFee 返托管款申请返款
            BACK_TRUSTEE_FEE_REFUND: '9FDBOmpaQznn4VuD6SwHF4wVRTHz5eBl7R6UYvG1C5E3sxv',
        }
    },

    DEBITCHANNEL: {
        // /biz/t8t-fi-fcm/app
        name: 'niz-D89-bg7zuH4V_XEQ5J3gfP4es_t',
        methods: {
            // debitChannel.create
            CREATE: 'N8LxpSi9bJT-PkTue0QuVmPMMskaGl5',
            // debitChannel.update
            UPDATE: 'sZan4wrmKzZbGy9dwl7cDsLKKtlHIiZ',
            // debitChannel.queryPage
            PAYMETHOD_QUERY: 'fKfmTjLLnPN6TtgmTQtKP7dhNygAN0yiYM4',
            // debitChannel.status.update
            STATUSUPDATE: 'VBPLAUJ-A_56nUQO_TGk2wTR6bLZq0bV6KaH_77',
            //batchDebitChannel.status.update
            BATCHSTATUSUPDATE: 'VNDxAvHBRLCUVAFTAPvrAUetWVdOZSARArHfWAYS8CbXNo5',
            // debitType.queryPage
            DEBITTYPE_QUERYPAGE: 'TS8-ZWQ9OdQ5cySscBWVGzKv8jS86f_',
            // debitType.create
            DEBITTYPE_CREATE: 'VxDUZSSR_JDBQ1jKrXWEwWP34b7',
            // debitType.update
            DEBITTYPE_UPDATE: 'kgjt0zqkiomgbAYGi94ok_zeLla',
            // batchDebitType.status.update
            BATCHDEBITTYPE_STATUS_UPDATE: 'VeyxFyf_B-0Sct9yoG6F-rUkOOZFQbzS-vBy-eY694l',
            //款项用途
            //fundPurpose.create
            FUNDPERPOSE_CREATE: 'tpsDqe9VHId3UHyOVzoHc5aumF2',
            //fundPurpose.queryPage
            FUNDPERPOSE_QUERY_PAGE: '2itdfkd7LsTe21eAayedfuixbUOgU_c',
            //fundPurpose.status.update
            FUNDPERPOSE_STATUS_UPDATE: 'j1e_lWXL_rk_6qwfF7pELrrQ-m_dxf_WEQCTbNN',
            //batchfundPurpose.status.update
            FUNDPERPOSE_BATCH_STATUS_UPDATE: 'YnHgGhvqOnZT0RR1UhwXxqzaUlhIzGwaS5rLWwfDERm',
            //fundPurpose.update
            FUNDPERPOSE_UPDATE: 'ivqDuHNXKnxYeM5Ua1j1Jtgsm.6'
        }
    },
    // 财务基础数据服务
    FINA_BASEDATA: {
        // /biz/t8t-fi-fmd/app
        name: 'MB4Ke6f494fflDr2l8r4NlN3WxyAE.R',
        methods: {
            // bankAccount.queryPage
            QUERY_PAGE: 's1UwuBX1bHQGeqisrnbo5r2nklovSwo',
            // bankAccount.update
            BANK_UPDATE: 'X82nC9DZ3-JyOb-NkOu2hIo5llI',
            // batch.bankAccount.update
            BANK_BATCH_UPDATE: 'PtS6Tvo8mdQ0WuUemFEsi0WpWfPyPigYXeh',
            // bankAccount.excel.query
            EXCEL_QUERY: 'IAtXi1eiQIjXf1R9MyE_RTz-ZJG0CVSJBOa'
        }
    },
    //收款方式分配
    DEBITWAYDISTRIBUTION: {
        // /biz/t8t-fi-fcm/app
        name: 'Q2VkTJ8qT30vdX2QPHDE2YqRvb2tfMp',
        methods: {
            // debitWayDistribution.queryPage
            QUERYPAGE: 'idi9-z2w02vyNl3pP3ux8r07ksC6VVM0kew8DArjtm8',
            // debitWayDistribution.status.update
            STATUSUPDATE: 'xerGiv_ov8vMo-A1YJMd-61t1-DNQS10e1FGv5gxAtIvqacwokY',
            //batchDebitWayDistribution.status.update
            BATCHSTATUSUPDATE: 'ga8T2Q64WHHjOTdR4hslWHxQuTqeLM_VQZjOmE6f8NoUZEySaLciLFY',
            // debitWayDistribution.create
            CREATE_ALLOT: 'SFNdVAMSVOMkDZOIXuWeNbcPLMkExzrPeIkPSLf',
            // debitWayDistribution.update
            UPDATE_ALLOT: '8rpI7-iA89aIWDAgwJy57FCr3KCHmhSD6TNBqm7',
            //receipt.order.and.item.query
            RECEIPT_ORDER_AND_ITEM_QUERY: 'Pj5tqev9EyVP0x5n_0UpTAou-Xzzvl6uo-GwsvKlqHT'
        }
    },
    //收款计划单
    RECEIPTPLANORDER: {
        ///biz/t8t-fi-rvm/app
        name: 'wdb7BHhaftcyRtM1N8Q-SyIXTBkmRKK',
        methods: {
            // receipt.plan.order.update
            RECEIPT_PLAN_ORDER_UPDATE: 'AEK-KrB_HTEVZVtoBmWePgW9v8a0J4XsmqG7xoT',
            // views.receipt.plan.order.item.queryByPlanId
            RECEIPT_PLAN_ORDER_ITEM_QUERY: 'tD2GATtc7425Fo4HHTugIA4XmRnHKOJpq3BtIIF3lELt44B90BSC3QO65KnoQdR',

            // receipt.plan.order.cancel
            RECEIPT_PLAN_ORDER_CANCEL: 'KDIOGyUM9fjN-6zgyd9Stg25AfnKVpB4QqEIbvy',
            // receipt.plan.order.query
            QUERYPAGE: 'YhRePUhsI84XZ_DBm0NOluUCQoJjBg1TWw3',
            //verify.order.query
            VERIFYORDERQUERY: 'r0U_vYRkEGvN9jjCQBGxWDnWG33',
            //verify.order.item.create.by.receipt
            VERIFY_ORDER_ITEM_CREATE: 'Gc7sRNUtEeK-nX_78Xw8bPdP8ulPy9eQB2LANueARyb-wMgX7J4',
            //verify.order.query.item
            VERIFY_ORDER_QUERY_ITEM: 'goQxbZX0IqsgFD4XeMkA4bSIj6OkgxwdFis',
            //verify.order.left.join.query
            VERIFY_ORDER_LEFT_JOIN_QUERY: 'IN8Hv_u4M2NRbsaqzdHw6IQAOlDD7QUC2iExrAXynrn',
            // 供测试方使用的页面
            //receipt.plan.order.create
            VERIFY_ORDER_ADD: 'GgCCULWChpFt4pUAD9oGP6cTF9v3iGaEV-tTI67'
        }
    },
    //收款计划单 - 新增
    RECEIPTPLANORDER_ADD: {
        ///biz/t8t-fi-rvm/app
        name: 'MnzGUabreIzhNtETjsagUuIzwsVuqB6',
        methods: {
            // 供测试方使用的页面
            //receipt.plan.order.create
            VERIFY_ORDER_ADD: 'GgCCULWChpFt4pUAD9oGP6cTF9v3iGaEV-tTI67'
        }
    },
    // 收款单服务
    FINA_BILLS: {
        // /biz/t8t-fi-rvm/app
        name: 'UwU1ZdHqIBZolrtjjil2FWBMRrXK2z6',
        methods: {
            // receipt.order.and.item.query
            QUERY: 'jnETaMYkyQCs0dYPkLui4ocVAhcWGTYbF-yPUUhePHB',
            // receipt.order.query
            ORDER_QUERY: 'GDDM2GOK2bDTeKGD9N3Aib6E-PO5arZ',
            // receipt.order.item.query
            ITEM_QUERY: 'JmOlZXmrZx1tcj_gJPjWd_SXtMoAxI.3TH5',
            // receipt.order.audit.notify
            AUDIT: 'riTtWjitaTH-aMblzfxqdFwZUbmq_2rsFgoY1wO',
            // receipt.order.anti.audit
            ANTIAUDIT: 'xoXzco3AwWKAb1glskV62dzphsd4VIWtX2z',
            // receipt.order.audit.reject
            REJECT: '8w_ukyb4ItUOGiqkm3toL12vS-CiVRCrrArcKiR',
            // receipt.order.left.join.query
            QUERYFLAT: 'CcJYTIZmV4fm_YDYDGawSPKOu9affnQ8vJROJIMAeK2',
            // receipt.plan.order.query
            PLAN_QUERY: '7VHQLyRf8NxoZKyvJ4BImRI4CknT0l1IGyo',
            // receipt.order.item.create
            CREATE: 'khcwmexAsJ0q4Ueg9wVe1xYNwi6TydBgROsRfL5',
            // verify.order.item.audited.create
            VERIFY: 'TdvLsERSy2c3qR7AcAOdqQMuYTQOPQRJdOtjnYEevLYTA-7',
            // receipt.plan.order.query.orOper
            OR_QUERY: 'gBYm0w5EYhZ9GeZfHjpY210JYNl7Z5wbf8eAVWKWSFAfjba',
            // receipt.order.item.update
            UPDATE: 'eqbWIWnuNF8ygpCl4KiT4CrhMIcLpTgcJI4cBAu',
            // verify.query.by.receipt.order
            RECEIPT_ORDER_QUERY: 'ORRJiJEEt6GhmJH5koCoE2q2b5UGhJY7jBeLn0B3E5r',
            //views.receiptInfo.sendToCloud
            SEND_TO_CLOUD:'8WRCKl4i6aCVMLFO-yZOMSuSKOtRNDjrXKmbe7kLmclFdtu'
        }
    },
    //核销记录
    VERIFYCANCELRECORD: {
        // /biz/t8t-fi-rvm/app
        name: 'I1KqcRD6Sw3TgKWpsPlIqK3GumLGG3E',
        methods: {
            // systemCode.list
            SYS_CODE_LIST: 'vPnFi_QA4HeBWeU61ZjQPCn',
            //verify.order.query.detail
            VERIFY_ORDER_QUERY_DETAIL: 'YgsItUQRuw9e1tQ-oLtGf9wTKEzFeIXV-AgT277',
            //verify.order.query
            VERIFYORDERQUERY: 'r0U_vYRkEGvN9jjCQBGxWDnWG33',
            //verify.order.item.anti.verify
            VERIFY_ORDER_ITEM_ANTI: 'QM7tAP_9xCMlYO6KrD-KZHn_8vUR8xrA6frNMCh9bXm',
            //verify.order.query.item
            VERIFYORDERQUERYITEM: '7SbJYCIAByEd4lP-LrFK7qOLvh9OetHQRn2',
            //verify.order.left.join.source
            VERIFY_ORDER_LEFT_JOIN_SOURCE: 'HQCjFvyhkEqOE2SwN6OCYhPDUBZz_lC5PVeLSwh0m-q'
        }
    },
    //付款单服务
    PAYREMIT:{
        // /biz/t8t-fi-pvm/app
        name: 'oOQH76H9Yiv249sE1dh5Kj9jN0KJKTa',
        methods:{
            //remitOrderService.create
            REMIT_ORDER_SERVICE_CREATE: 'v0S3ZTjNc1OhvyI0n3Z8mkzetUJHlnhUN4V',
            // 驳回 remitOrderService.disapprove
            REMIT_ORDER_SERVICE_DISAPPROVE: 'MjUZHFOKJiQnK-gQUH3TVZVV1AbHDggUWDeXpshFMw9',

            //批量驳回 remitOrderService.batchDisapprove
            REMIT_ORDER_SERVICE_BATCH_DISAPPROVE: 'qvg2pmigtwjuZ1LzYxW3hBd9n3lWFiIqBqVbadmaEP7mAo0',
            //remitOrderService.tryOffline
            REMIT_ORDER_SERVICE_TRYOFFLINE: 'zFIqAE8-1kw-pKDOxODx6uA6hrQEreNrO-NEqODslXi',
            //remitOrderService.tryOnline
            REMIT_ORDER_SERVICE_TRYONLINE: '9H1aO3zxdBDiH_JtDG4ImK5W1L5nPXewHbP-2aB',
            //remitOrderService.queryPage
            REMIT_ORDER_SERVICE_QUERYPAGE: '9EILN8JHv_UCJSKZpASLY3K2p0QON1IKYS-MJKU',
            //remitOrderService.findById
            REMIT_ORDER_SERVICE_FINDBYID: 'ACzQrzucx7K0EysxIoB7L2N0U3_1DyN9noJexsf',
            //重复校验 remitOrderService.checkRepeat
            REMIT_ORDER_SERVICE_CHECKREPEAT: 'ltd3jmebUyIvkhZcIi-0UQyf-e3nDtdkt3aVj4rlSZH',
            //remitOrderItemService.query
            REMIT_ORDER_ITEM_SERVICE_QUERY: 'IA_IGDr9JA_xRV5-xQkJGO_zBkiGw7SlVxSzC5p',
            //remitOrderItemService.queryPage
            REMIT_ORDER_ITEM_SERVICE_QUERY_PAGE: '2wiHPoiyx9Fu04BxoS0xPtjkjEl3vGqEUR2jynUvgfxmqOL',
            //remitOrderService.count
            REMIT_ORDER_SERVICE_COUNT: 'Qd2cOGI_QH1b9cCTAcLdPXDiHHtt5p-8LGh',
            //remitOrderService.batchDistributeForWkf
            REMIT_ORDER_SERVICE_BATCH_DISTRIBUTE_FOR_WKF: 'SVId86DJy_HtYHGNFtaPc3fHpEQ7YoXKsC163CnREbRQHzIDJgkLXeG',
            //remitOrderService.submitForWkf
            REMIT_ORDER_SERVICE_SUBMIT_FOR_WKF: "fradeLZRQhsTWQl-tq7NuisM-Ffe3WnhYWoRXFjc_wa",
            //上传K/3 views.remitOrderService.sendRemitOrdersToCloud
            REMIT_ORDER_SERVICE_SEND_TO_CLOUD:"93KIsFyN5G1P-7xdvLYuFtKw0DqN4G4SW2SAWjB-ip2A50C5WmE55tX1UQo4mOa8POm"
        }
    },
    // 工作流
    WKF: {
        // /biz/t8t-wkf-ctl/app
        name: 'J0AjJN7yEv7kiYzph3PFyZ53MHF-27p',
        methods: {
            // startProcess
            startProcess: 'LWEkwROUAxRarEH3CpV',
            // completeTask
            completeTask: 'iw3jS8ntm-NbphRjCyt'
        }
    },

    //付款方式配置板块
    FINA_PAY_METHOD_CONFIG: {
        // /biz/t8t-fi-pvm/app
        name: 'VmHS1srPCZUThqolu6uXm3c_R-lSOfL',
        methods: {
            // remitChannelService.query
            QUERY: 'PFGudKLCv4DzygOaKDa0SIl8XVTNDlPKDHlS-ug',
            // remitChannelService.queryPage
            QUERY_PAGE: 'SdfximiHNffOOjTwe1Da7hoUwavkID2lfKqoeKneCK3',
            // remitChannelService.findIdsCodesAndNamesById
            FIND_BY_ID_NAMES: 'lShTnTO8uC8CsGkSjTKdAoYkfcQ9kOQT3PQT94p3hzfXRG4GR5EVUgjZb_g9ML-',
            // remitChannelService.findById
            FIND_BY_ID: 'mPG133vrioeP8pz03uYOi89GvBAxsY0ygHydGwjxNKg',
            // remitChannelService.create
            CREATE: 'D76_93SzqBbXrV9Jy1NpKmZyL3G50gKx48DAm1V',
            // remitChannelService.update
            UPDATE: '9JzKR5osk6UeUKoGD4IvDjTAEJCqtaVqVtu9pwb',
            // remitChannelService.status
            CHANGE_STATUS:'i9p2iIgaY2KqJ1h5xo0c_x406uribOPhKM6wqUI',
            // remitChannelService.status.batch
            CHANGE_STATUS_BATCH:'OaLgPMIc9T5oUCf8eHpMkRcYYOJzseQprbW-H-hLd3oOpV1'
        }
    },

    //付款类型配置板块
    FINA_PAY_TYPE_CONFIG: {
        // /biz/t8t-fi-pvm/app
        name: 'VmHS1srPCZUThqolu6uXm3c_R-lSOfL',
        methods: {
            // remitTypeService.query
            QUERY: '3GeQrUVKAUW8hQtTbFNPNRNt3rbPBoidL88',
            // remitTypeService.queryPage
            QUERY_PAGE: 'ktbvPbakcWMLuHudH8merrgY7mhfdqTfKUR-eJn',
            // remitTypeService.findIdsCodesAndNamesById
            FIND_BY_ID_NAMES: 'FhSlap_LMFdUBlRuPeVQdMUPxmCQxjPWRwIwpcDP28YZeR2SO0ic0GxMCIq',
            // remitTypeService.findById
            FIND_BY_ID: 'YxP7pnRekXgJecyhssubxffkMH1qjJdZveRVM6R',
            // remitTypeService.create
            CREATE: 'XzOIzmkfaoUQGdPvh3VztemL_vp0bXlWLM7',
            // remitTypeService.update
            UPDATE: '-UFdNK-EfAE1bIYFmAEYFHCpoPzBDKq6K00',
            // remitTypeService.status
            CHANGE_STATUS:'q_0K5vby3R3OGfEwNqsGFxyxWS1QjNr9ktL',
            // remitTypeService.status.batch
            CHANGE_STATUS_BATCH:'NV3aGKEH9041VECj0PzRbUUI0mfQ54T-LrcFFioNlRv'
        }
    },

    //付款方式分配板块
    FINA_PAY_METHOD_DISTRIBUTION: {
        // /biz/t8t-fi-pvm/app
        name: 'VmHS1srPCZUThqolu6uXm3c_R-lSOfL',
        methods: {
            // channelDistributionService.queryPage
            QUERY_PAGE: 'PDYXigvrlf7ajmDL3gQsOsq9b2VbTvTwTzkwZ0WcMyTdsJKOcnc',
            // channelDistributionService.findIdsCodesAndNamesById
            FIND_BY_ID_NAMES: 'OaSTSGwJMzIMKlxoJK5rB3Xm7cxWLe8XGWKdyNWbSK2cETY-eQpoDhkwMoYDcpeLOt5CFUb',
            // channelDistributionService.create
            CREATE: 'juanhuHzqrNe2V-buijCAV_r1jzb0l0mifAQJ2lwUdRdXit',
            // channelDistributionService.update
            UPDATE: 'AjHFGpOhNGe6_DRoXEv0dKsJayDN1Q2QvQyNZ5Y2CpR-78N',
            // channelDistributionService.status
            CHANGE_STATUS:'-O4395Q7uum_HM7Zw9vb1d7Ru8j4G8vUtrg7mEDhd350d3G',
            // channelDistributionService.status.batch
            CHANGE_STATUS_BATCH:'4Ytxp0WG9TccM5HxC418mV_S19pCuSHry8GoWkM7UxDpXjBoHrwopq4',
            // channelDistributionService.query
            QUERY: 'iT3726WuxMaD3PqKxzbm_6c_KvCWJ7kwzEwP.sF50fCyB_U'


        }
    },

    //应付核算-采购发票
    PURCHASE_INVOICE: {
        // /biz/t8t-fi-acp/app
        name: '9VmYJ_vP44Cc5WOXI2tiqbT0b5ybKVq',
        methods: {
            // views.invoice.query  采购发票分页查询
            INVOICE_QUERY: 'w9lptPg9qo8NZu390vk5E0WZC2kPQdp',
            // views.invoice.item.query  采购发票单项查询
            INVOICE_ITEM_QUERY: 'meCZZT6E6kK8vf_CsuNVyyV6JjOfR_PNaC9',
            // views.invoice.findById 根据ID查询信息
            INVOICE_FIND_BY_ID: '6_54r58p0xrC80K_owaPDzq_HAVErgluJGZ',
            // views.invoice.detail.query 查询发票单的头跟项
            INVOICE_DETAIL_QUERY: 'Vs0x0awF2XlEAT_imflezzncjgeTP4rrifdlkgM',
            // views.invoice.manual.transit 采购发票暂存（手动新增）
            INVOICE_MANUAL_TRANSIT: 'PWjqP4PrdUQo4cpmWzKXD5fIU-nZZtxb2LiOoAnOAyw',
            // views.invoice.manual.submit 采购发票提交接口（手动新增）
            INVOICE_MANUAL_SUBMIT: 'fRenZzGoEUB2xUvUYfU_zvDP7txUQqoH0QbUFhv',
            // views.invoice.depend.transit 采购发票暂存（参照对账单新增）
            INVOICE_DEPEND_TRANSIT: '4JBQ25GcK-jZF7Xx-utn2H_8zSBq2sSqnYB8zo3BObj',
            // views.invoice.depend.submit 采购发票提交接口（参照对账单新增）
            INVOICE_DEPEND_SUBMIT: '_G0wqDn5m3bWR5XzLD5gZG5mIMynBb69ZwA8kFU',
            // views.invoice.start.audit 审核接口
            INVOICE_START_AUDIT: 'TnoXS7N3ga8j3RsXLriEApeJ3nhDCnhZSfTyIjJ',
            // views.invoice.batch.submit 批量提交接口
            INVOICE_BATCH_SUBMIT: 'KISRQjAPMzXpOiZWiFyqP6FE9WG2al608gGVLDs',
            // views.invoice.anti.audit 反审核接口
            INVOICE_ANTI_AUDIT: 'JWEQ8k-LHznWHSBCzJDWVNLG8I4Yiiy20Fg',
            // views.invoice.neutralize 红冲接口
            INVOICE_NEUTRALIZE: 'eYWlKN6QwfF80dopjaXpvLIVhmfqHxZJann',
            // views.invoice.disuse 作废接口
            INVOICE_DISUSE: 'jAr6xNjIgyN5NhNsqucDq0diJyNuGLg',
            // views.invoice.create.byRecon.query 依据对账单新增采购发票前的查询接口
            INVOICE_CREATE_BY_RECON_QUERY: 'u5wkpVCJukSHDtEzyjQFF0v.xUtoDU4U1yknkc5ZuKEoVh9bQK8',
            // views.recon.beforeVerify.query 手动核销前对账单的查询接口
            RECON_BEFORE_VERIFY_QUERY: 'XfjiJx0JrZOTPHIivY3Rl-gU1GRPOSvCUFm3evuYADy',
            // views.manual.verify 手动核销
            MANUAL_VERIFY: 'JZEYLWsg7x3hI238bpsCFRPFYU9wySg',
            // views.invoice.can.neutralize 判断采购发票是否可以核销
            INVOICE_CAN_NEUTRALIZE: 'csWib96yeJ7nO1YmePZ-ieH10s.hUZ5QJ6Ua5o_WV_G',
            // views.invoice.workflow.query 通过实例ID查询审批流
            INVOICE_WORK_FLOW_QUERY: 'lwuvRBMT4PLvCBS8osGjby_lATfjt7kSoFojZe8nJIK',
            //views.invoice.sendInvoiceToCloud 采购发票传K/3
            INVOICE_SEND_TO_CLOUD:'GeMfCgyqWKMxvACqZeO70cR9zJ781yPueKNJ4Mk5xanEQ1p',
            //采购核销单
            // views.verify.order.query
            VERIFY_ORDER_QUERY: '9CC8pDY3nCfN4i4X3lGFS1j-s-XzO_y1hkX',
            // views.verify.order.findById
            VERIFY_ORDER_FIND_BY_ID: 'gnlmfKhGf5pyeXZ8iL-N1aGW0e7xiru6RGfbUok',
            // views.verify.order.item.query
            VERIFY_ORDER_FIND_ITEM_QUERY: 'qfqbp7CyXzb5ehgSGC4zz_SLL-Pcpumc7y8nQicpdx5',
            // views.anti.verify
            ANTI_VERIFY: 'wAr-0_QnzxfCOtZbRRyzc8zt9hX',
            // views.verify.detail.query
            VERIFY_DETAIL_QUERY: 'GA7K1M1S3_rZG9Dh6hO5Ok3cqBwrdL2s8eF6oWW',

            //入库调整单
            // views.adjust.order.query
            ADJUST_ORDER_QUERY: 'r2uhnGzWnpROmmmcyWg92ApPR8ax-GoUUFC',
            // views.adjust.order.findById
            ADJUST_ORDER_FIND_BY_ID: '8S1DI8XcSr8vN9mc2mGq5PRok4Rr298BE0itj3D',
            // views.adjust.order.item.query
            ADJUST_ORDER_ITEM_QUERY: 'lduci9-GzdfVwpMEG_QWwG6QPM3Rgq5ia66ROgwmws3',
        }
    },

    //操作记录获取接口
    LOG_SERVICE: {
        // /biz/t8t-sys-opl/app
        name: "BtRjXvD_I-d1jvvBZNDmSK3apNL_67b",
        methods:{
            // queryPage
            QUERY_PAGE: "AK1xE_JF3yW56Bc"
        }
    },

    // 资金渠道管理配置板块
    FUND_CHANNEL_CONFIG: {
        // /biz/t8t-fi-tpc/app
        name: 'nR8JLAch41sNDCUYO6TyV_mpld6ftSq',
        methods: {
            // channelConfig.query
            QUERY: '8EtF4GHz3iwRZ2Go62WZVri5P-oeOqc',
            // channelConfig.create
            CREATE: 'u542zw386qXd-c9puu1-5f9n2uqJp_P',
            // channelConfig.update
            UPDATE: 'QwP540-BAxdgzys0w1e7UN1eo61OveW',
            // channelConfig.queryPage
            QUERY_PAGE: 'mRBq7xX_oeo9oxjy62Sa_42eSp8zbuyzRiN',
            // batchChannel.status.update
            UPDATE_STATUS: 'Og7sd-qbNS8-jhweHmCzZqSNJ6k7DytS_GnnPO3',
            // views.channelKey.query
            QUERY_KEY: 'CNMKXtEVQecVTKcNTpZgzKF5erTO8q2GL04',
            // views.payOrder.create
            PAYORDERCREATE: '487B0OVz1igMX7lthCubJuuNl8vgWz-',
            // views.payOrderCode.query
            QUERY_PAYORDER: 'RUGGOWqe_31mbIrna4K_3JXyWqF1KY-K4ru',
            // views.status.query
            QUERY_ORDERSTATUS: 'sxrxUxZllDcomTgW8EyLEkdPVxw',
            // views.payOrder.getAliScanQrCode
            QUERY_ALIPAY_CODE: 'FLKH-gtBGYpnj4arKLArrW-b3V53ETmY3G-H-sZkZlJ-yhp'
        }
    },
    //应收核算
     RECEIVABLE: {
        // //biz/t8t-fi-acr/app
        name: "_BO0Ra_pB7IzPsv0LghYmW7QjQUC13z",
        methods:{
            // serviceTypeConfig.create
            typeConfigCeate: "bG2T0NoiTPXR_0J2G_Wz9laUeeal1jjUFMS",
            // serviceTypeConfig.update
            typeConfigUpdate: "zTtJ5EwrwsoAnjcZ0hQ_h93uzK7iJ7QvuYw",
            // serviceTypeConfig.listServiceTypeConfig
            listServiceTypeConfig:"iAd7pb5ochUJdumLe7ev-Gskel6QJe7RRCvhwRsR7bemgNaTvFilbvs",
            // serviceTypeConfig.antiForbid
            serviceTypeConfigAntiForbid:"c3YzehpUjWURmeERHKg28mbZdvTaqxZUGIxaiNYZDAB",
            //serviceTypeConfig.forbid
            serviceTypeConfigForbid:"WeNeJgigFPOlxUF-CXx1sgCOIaTj6e2Sjdc",
            //customerInvoiceInfo.getInfo
            customerInvoiceInfoGetInfo:"wMZMkB8vlNQ-7UdPQAf7IuZ0NqKRkxbSMDCRcJQ",
            //customerInvoiceInfo.createInfo
            customerInvoiceInfoCreateInfo:"EwQhIG9qYDCIYUSdTQoPLRLRnRby2iIfUeK_DCUkFRo",
            //customerInvoiceInfo.updateInfo
            customerInvoiceInfoUpdateInfo:"jBgOeliaG1yQUnEvM1EemwchUu3PSR3NEct6cykj_k5",
            //customerInvoiceInfo.createSubmitInfo
            customerInvoiceInfoCreateSubmitInfo:"etW3mPuudX_ScYaicbPVrIoX9vkj6ncceiOHIViYPjTbbaSMndv",
            //customerInvoiceInfo.updateSubmitInfo
            customerInvoiceInfoUpdateSubmitInfo:"0rGjKktZLzn5NFLPGH8mBGHpT5iln4kBT741_OFulhLH-nLSnLL",
            //customerInvoiceInfo.listInfo
            customerInvoiceInfoListInfo:"c4W0eVVCcccLkf4ZBdMZlpTX6nqKOvfqP4jWLpveIEB",
            //views.customerInvoiceInfo.verifyProcess
            customerInvoiceInfoVerifyProcess:"ITegHx6hZWHw_cLw4oRFD0IgUZUE4jLAiUFgt0uHR0WSiPKKR7cDA7d",
            //views.customerInvoiceInfo.rejectProcess
            customerInvoiceInfoRejectProcess:"Wxwvm6R2btWLriLGjlNNCmyWnj4dbVoIMxrg7v-PaiwjBaThuAZPPS4",
            // views.salesInvoice.get
            salesInvoiceGet:"hXZpf5A1h81ebZA5KnKzLKRnNaUkqjgwyaC",
            //views.salesInvoice.list
            salesInvoiceList:"QffbBeHoTd6jVADcuOPViTQDJyhrg2xDsH8",
            //views.salesInvoice.excel
            salesInvoiceExcel:"h66ovKOEsFFCssf.PecqozurQ3eorIQn2r_",
            //views.salesInvoice.canceled
            salesInvoiceCanceled:"8DIz6TZ64CoImyskgnUElO35bCnzZ9nJp2y2lww",
            //views.salesInvoice.redFlush
            salesInvoiceRedFlush:"ktxuZza-Ux9T8dURJdUnhT2hiWhH1ZdgSpnXnY0",
            //views.salesInvoice.create
            salesInvoiceCreate:"lppZn5OgRa86uMZXv8PrM3daBvNoI_nfLHnbaz0",
            //views.customerInvoiceInfo.antiVerify
            customerInvoiceInfoAntiVerify:"3Ap8hKQKyeReZ1vJSCe5Zcj1rwztaRrsa74eHOmd6rDZ9ZFeafT",
            //views.salesInvoice.sendSalesInvoiceToCloud 销售发票上传K/3
            sendSalesInvoiceToCloud:'PcZIDzexRJFWY5SQQv6QKNhQKwLyMwf9a3KR4ia_oXkRJjQ9ZP2PaEl9oKH'
        }
    },

    DEPOSIT_MANAGEMENT:{
        ///biz/t8t-fi-qad/app
        name:'ZGbM2sAZBcUsL6HIK9knEybIo-6cNyO',
        methods :{
            //views.credit.create
            CREATE_DEPOSIT_CREDIT:'AL3I2BKexE_ecN7a4VgNwVq5WYs1WHn',
            //views.credit.disuse
            DEPOSIT_DISUSE:'aTjPa0NspYw1iT_lf0U7mJ1I_wWR-XA',
            //views.deposit.query
            DEPOSIT_QUERY:'g8p1rNcupVY0t2Ny_fEK0zdalA0gAPQ',
            //views.deposit.item.query
            ITEM_QUERY:'aWWSezdnKaZBWwJz9Ycw3mN3CuHlx1HUYJn',
            //views.deposit.export
            DEPOSIT_EXPORT:'y26ohz6QEbFWs0yJm6jbM6ucEzfrmoC',
            //views.deposit.Item.export
            DEPOSIT_ITEM_EXPORT:'oIHG5D2bO2R27-Wps16IQEU_o2JX11VnnIV8cMd',
            // views.record.cancel
            RECORD_CANCEL:'1q2426MP_d_Y0zGHOMpPq6GcHQGcVKkxZK7pZ1E' ,
            //views.record.audit
            RECORD_AUDIT:'6DCy6TZjPqzk0umFnDjxmS2jyhR',
            //views.record.query
            RECORD_QUERY:'YQfhIQjEYIcRbaf1QFe8wDRFFxk',
            //views.record.item.query
            RECORD_ITEM_QUERY:'zq23zKYfwg3rzuOe9ksrKdnGECvqXpGt90T',
            //views.manual.disuse
            RECORD_DISUSE:'AWVtFLrrgLH4iQ4ljO6YxMMn1hNvyDw',
            // views.record.export
            RECORD_EXPORT:'vIIDDWq89M0717JYJbIoK-pbRY8eOoh',
            // views.record.pay.create
            RECORD_CREATE:'y-9MxNgEINsIwdeMHwQs22qg3xy6rN7Ed5V',
            // views.record.topUp.update
            RECORD_UPDATE:'jYqtg5UjisVqi9Nj4ScXX1OKdAzNvK2fGM7fU_H',
            // views.record.execlTran.import
            RECORD_EXCEL:'D5F1uYeO5EoJqZnyZHb6es2d92Zpd-511f491P99M2T',
            // views.record.topUp.import
            RECORD_IMPORT:'J6_OR4i1WyOsJDlfnP4M5b1UuBL2PNDEdjaLWrt',
            // views.record.workflow.queryById
            QUERY_WORKFLOW:'mbasni4AzRZcWds-aTqT4Rbvrc6Cs-u43OM_xBTdu-OCFB0'
        }

    },

    K3_CLOUD_MANAGER:{
        ///biz/t8t-fi-fds/app
        name:'uau5uGeIev0XB-3J-9GxWvbVvAAhUpQ',
        methods:{
            //views.map.update
            K3_MAP_UPDATE:'e3hkwCL9rokT8XmTQusDD1qM_jT',
            //views.map.batch.add
            K3_BATCH_ADD:'QcgYWYzAkiA64nxNFWGq1bBh4dV02Jl',
            // views.map.query
            K3_MAP_QUERY:'tx1A9GnQIon3jLX3RyWkynJ'
        }

    },


    //资金管理Funds management
    FUND_MANAGEMENT: {
        ///biz/t8t-fi-crs/app
        name: 'jQT357HVbTsJjHD5xUqLlATLa1KYh2N',
        methods: {
            // 列表查询
            //views.receiptDailyReConciliation.queryPage
            QUERY_PAGE: 'uKHI9Z2tVGuM6z4o3Wxply-4UZ2H8VBbJCsoX99riN9ZYQ9-nLB3Eiq8yxK',
            //views.receiptDailyReConciliation.excel.query
            EXPORTEXCEL:'72DF_Xq99Ax9kv10u7rSx_q0Rb0Ekk1STu5l83m3v55WaO3NmC91w7Nrijz8F0e',
            //views.receiptDailyReConciliation.manuallyPull
            MANUALLYPULL:'ITDPNirZMD0BJEWMwPg7MH0bp_FAz4VXTIHNb0B8W5goZ6B1L4801aMjXsRHBeK',
            //views.reconciliation.queryPage
            RECONCILIATION_QUERY_PAGE:'-6KIAffNvJ1F8YOJB1aDVKs80MDSJXB_33G-8L336-5',
            //views.reconciliation.excelQuery
            RECONCILIATION_EXPORTEXCEL:'H9QTMRkYJOCKIgkRE8eTvC_Y1OibBEIQDBf7sDDk_JJ-vma',
            //views.reconciliation.manuallyReconciliation
            MANUALLYRECONCILIATION:'MYBYOqsN5TAVJhtUg7DPYKGzEaOWXLIB3VcIK2NIlUE1J-i7FqWG4TMR3Gc5Pyc'
        }
    },
    //存货核算
    INVENTORY_ACCOUNTING: {
        // /biz/t8t-fi-ina/app
        name: "jJa61zN4mHZj_b7J38taL5eHWHtQEPY",
        methods: {
            // views.costDomainConfig.create
            costDomainConfigCeate: "VSdOd42qDi2gdw7qbVgvshHc2vcQVUFrm8jIQQhcwMs",
            // views.costDomainConfig.update
            costDomainConfigUpdate: "GTORY0DqDx6sFA9qVObASIN5qYdVbRUUvydYyMbVB9t",
            // views.costDomainConfig.findById
            costDomainConfigConfigfindById: "gnYrS5Bzg1y7Se3XuNGDLscXTkdbexYnBnNc64WAtoKMG1C",
            // costDomainConfig.query
            costDomainConfigConfigQuery: "CjUZIu3X2CdRB-mIDVATdGJfcH89NK2joom",
            //views.costDomainConfig.queryPage
            costDomainConfigQueryPage: "axy4r3aArzJxrSchslnFmmxg9b0r8wW-3_rmOS8vV-smJiA",

            //views.initialAccountingData.batchImport
            initialAccountingDataBatchImport: "x9vvzUo22tb_wji671hZ3vAHL4DZkFyskK0sr7lo6d4nQjFueRHh-PQ",
            //views.initialAccountingData.create
            initialAccountingDataCreate: "l9-66lOQ1faVu3P960fjJrvLS9yrYufCiehvCq6mqVJurNLdXFE",
            //views.initialAccountingData.update
            initialAccountingDataUpdate: "dblsT8B0gMqxPIpXk6JtjN2ErgcXvRXl2abHqBrVlZN753sOWG2",
            //views.initialAccountingData.deleteById
            initialAccountingDataDeleteById: "cl60bHM_hu-oGpcUlhcFXiXLMzrni9tzdDm9XRiM4QkwVTEZldLfWPO",
            //views.initialAccountingData.batchDeleteByIdList
            initialAccountingDataBatchDeleteByIdList: "y265wFOwaWLpw6Ti0cVH4NoLRIppTpbV4dXlUkicoexyag2TIVsrXkyN6mabZB-wKeC",
            //initialAccountingData.findById
            initialAccountingDataFindById: "OXtoggLpge42ifo93bvqXdcacHdbQk_XYw_NmTChaZl",
            //initialAccountingData.query
            initialAccountingDataQuery: "qpI8d_Fk0qUZ3qn2zRDb5j5u1wEXWkwb7ZEZrX5",
            //views.initialAccountingData.queryPage
            initialAccountingDataQueryPage: "Sydch9PFGk-Sh8xmJprkILYku05hgHhmplNbbbqPt6BRON_N89ycYJD",
            //views.initialAccountingData.batchDeleteInsertOrUpdate
            initialAccountingDataBatchDeleteInsertOrUpdate: "yjniqHK8aWWN5yD1vaQC4V4z6Crlfpb6tZVnfgXjeefDa4PUVstnmTiik4_WsG2QEZTqGR1tbRQ",
            //views.initialAccountingData.uploadFile
            initialAccountingDataUploadFile: 'GC_AOTonJHKGEnFLzU8IyyM0QYm3CsWJU5yFGsO5U-M1hu90fGXJiCt',

            //views.accountingTask.query
            accountingTaskQuery: "fnhmKT3QdVWPSbqnOQbcynwaxSOc6brcZElMiR_",
            //accountingTask.queryPage
            accountingTaskQueryPage: "FT6ednRscJ4zVoT1UOaisbZEQnMjjPJFGXf",
            //views.accountingTask.startForWkf
            startWkf: "SEWZRUqP3HAY4p3dRLtkTj3mFV5UNNNqG-OJ-A05l-1LqMd",
            //views.accountingTask.processDataForWkf
            executeWkf: "bljhZk6cXn_T6ganarPIVsYzNdJkatZ0GuI7SlekPmgbCBzJlIUHzXw",

            //views.accountingTaskItem.queryPage
            accountingTaskItemQueryPage: "ir87l8RJscityPt4iatZz3eMnpUh7IdjbfEj_P6tfO-rcNserUG",

            //views.goodsCostPrice.queryPage
            goodsCostPriceQueryPage: "vsqnu4Qxv8QweYWSEc47QGaMSL6Z6XEiqWqtsmRcZvr",

            //views.inventoryAccoutingItem.queryPage
            inventoryAccountingItemQueryPage: "Wzwcq_lD5j8dCsSQxvnwBydhEwjug9hfvgMPMxU0Ky-oNi6VgKoisN6",

            //views.transceiverDepositBooks.queryPage
            transceiverDepositBooksQueryPage: "TbaiXyCnUDHtGcWiJZ_LcsOMG-UNnVCzgvLizVPuCWjRUPgSNL2VRYg",

            //views.inventoryAccoutingItem.queryBizTypes
            queryBizTypes:"v765wLlxecsAKya-HhPQzLlrh2vQYT4wdNAWckrzZLGyqoG3XN_l5q9hZbL"
        }
    },

    //成本核算
    PROJECT_COSTS:{
        // /biz/t8t-fi-pca/app
        name:"7mIoim_081CvJZSyfLPR7.1E0gVCA4u",
        methods:{
            //views.projectCosts.queryPage
            projectCostsQueryPage:"v5NG-cxVBcuDCBK1p15EtwBvfyUwMsau8dg4aXOCzST",
            //views.materialCosts.queryPage
            materialCostsQueryPage:"29680OkU-tccw_iCx_aIcyMDkLzWKfU0t9JGua6CNtX",
            //views.laborCosts.queryPage
            laborCostsQueryPage:"oijic06HtpXV0rrH0bTYBJ_Yw2waRUAvlTxpIk9"
        }
    },

    // 组件架构
    ORGANIZATION:{
        name: "mMkw3nBKlOTyf-63TdM-uXNEV6hLW2X",
        methods:{
            organizationQuery:"8TqE2fXZHE_vgB5hG8nzPW14mIX"
        }
    },
    ORG: {
        // /biz/t8t-sys-acc/app
        name: 'PQ7MA37RKUMX182N4Ldrany1U61bWrG',
        methods: {
            // organization.queryTree
            ORG_TREE: 'pG9Z2VOEhahU-kS2rS3SDonYC2NSBhYUfKK'
        }
    },
    // 虚拟卡配置管理
    VIRTUAL_CARD_CONFIG: {
        // /biz/t8t-fi-tpc/app
        name: 'nR8JLAch41sNDCUYO6TyV_mpld6ftSq',
        methods: {
            // views.virtualCardConfig.queryPage
            QUERY_PAGE: 'SUTI-nAiREXSM8KVt529rWKU0kLqta4I8dRMTJDOFa-G5-V',
            // views.virtualCardConfig.create
            CONFIG_CREATE: 'd2jizvKgBt51Er6DmyrsAZhZjfVuKM2tmu8UIa2UjRi',
            // views.virtualCardConfig.query
            QUERY_LIST: '1-K_0OijDHTNJDe75EGv350LrayNOQH-zUz9MtOHR8Y',
            // views.virtualCardConfig.update
            CONFIG_UPDATE: '40BD9Tm7nHBP4mixBp3gZ8qCvj3QGw7y5J4zhy0jMsz',
            // views.virtualCardConfig.status.update
            UPDATE_STATUS: 'Qck13o2LqtAkjxpWgdJlRHga2jOa112YUb6rCNrqBUxb5gvYCVyXPMP'
        }
    },
    // 虚拟卡管理
    VIRTUAL_CARD: {
        // /biz/t8t-fi-tpc/app
        name: 'nR8JLAch41sNDCUYO6TyV_mpld6ftSq',
        methods: {
            // views.virturalCard.queryPage
            QUERY_PAGE: '_CDHkBnQsH8zG97nk9CiyQl05lukHeUm4UX0VQx1vic',
            // views.virturalCard.request.query
            REQUEST_QUERY: '0w57yNWI4A5N4ew6vtMairsf5hxjA2rwAzSYWFzysvw95Wi',
            // views.virturalCard.requestCMB
            REQUEST_CMB: 'EcnNcWxGaVrefqZx-p0SBrqO_AdFh1dURNhGgI9-Ov2',
            // views.virturalCard.requestCMBTrade
            REQUEST_CMB_TRADDE: 'rEzGrFqI-FF_qVhuUzxN8R2HlqyZFjG73iy2QzeufXyqHTy3qhf',
            // views.virtualCardUse.queryPage
            QUERY_BIND_PAGE: '2__4g_R2i8sEiednuXii61AkpYk7czyenqzXvrjrr2-',
            // views.virtualCardRemittance.queryPage
            QUERY_REMIT_PAGE: 'z_8RzOjIJOk7a407GBy63199owtPVFdz58IMyeL5UbOwDfQrgxPv4bt',
            // views.virturalCard.queryExcel
            QUERY_CARD_EXCEL: 'j-993Qpz57I884MyJepwIJwvh-kEKRuuTUW04pzt2Yz',
            // views.virtualCardUse.queryExcel
            QUERY_CARD_BIND_EXCEL: '7CDW5mmY3VCaNvqx-0v2_4ECxLQ-IL09VEDC8eJvrB5xScv',
            // views.virturalCard.status.update
            CARD_STATUS_UPDATE: '9HaETtrkPGbVT7zf5JTj5MoaBGDm4N0rrQQmgWPoxCSlKy2',
            // views.virturalCard.batch.unwarp
            CARD_HAND_UNWRAP: 'UYVEMotS_UYiBpKk6Ikf6KHoT8HtDL59MMtcTHQPp8kMfvx',
            // views.initialVirtualData.uploadFile
            INITIAL_VIRTUAL_EXCEL_CARD: 'qhxts_Unlk11WUkxoqOOU2XzZEgeqPmTdaZzc_kkBKclMoxj_fO',
            // views.virturalCard.batch.create
            BTCH_CARD_IMPORT: 'Uc2QkZu2sVRddVCwPpP_w6OCIgCQHZI-4g0gOEpCV8qEP83',
            // views.initiaCardRemitData.uploadFile
            INITIAL_CARD_REMIT_EXCEL: 'lcvdiwXjhMZFJhgMxmc-qO6PPBqUha7US93ee-BQP5liOW_lL4o',
            // views.virtualCardRemittance.batch.create
            BATCH_CARD_REMIT_CREATE: 'frcqRBQxRkYongKZoR3_jhdWGja4dPKGkeqUby-YLmULByPpBkcL7I3dX2z',
            // views.virtualCard.virtualCardManaCreate
            VIRTUAL_CARD_BIND_CREATE: 'KaLYV-j8e64aZ4f7o1M31BOQZAPJWVPR7C_8k49Na-BLGaNAnmZMEvG',
            // views.initialBindData.uploadFile
            INITIAL_CARD_BIND_EXCEL: 'mfw1pwGpTe1O6rTyuU4VSyUxhQRRMaTjm-oTSKaqNiimWg5'
        }
    },
    // 凭证模板及生成
    VOUCHER_ORDER: {
        // /biz/t8t-fi-fvg/app
        name: 'gMLBznAEgZSz_tqoFsAs8h4EdFhDQpS',
        methods: {
            // 创建凭证模板views.voucherTemplate.create
            TEMPLATE_CREATE: 'KgmhN3Hxdjp1TmP8Sa_VQSPVY9cYSUlISNtJEyyJPt6',
            // 更新凭证模板views.voucherTemplate.update
            TEMPLATE_UPDATE: 'of0xmGU7muKyRzpusuVgwUamN1nfpeuT0SpWOOEifL5',
            // 根据ID查询凭证模板views.voucherTemplate.findById
             TEMPLATE_FINDBYID: 'zt830KhzfpOaPwQ2_z8L3n7iuTDrsWnO3zB17rZwq7r',
            // views.voucherTemplate.queryPage 分页查询凭证模板
            TEMPLATE_QUERY_PAGE: 'E7R2JEewAuKOXAbH3vu52MwolT_7j2v4nd-9wbMors8q0nn',
            // views.voucherTemplate.order.queryPage 分页查询已生成会计期间的凭证模板
            TEMPLATE_ORDER_QUERYPAGE: 'OIlgRGk3axGn7jCyikIJTSQaStVFC9OMkrcVHUe5ow0UDym_yuo',
            // views.voucherTemplate.findTemplateEntryAssistantById 根据id查询凭证模板、模板分录、辅助核算项等信息
            TEMPLATE_FINDENATRYASSISTANT_BYID: 'n1srUuHlpubL-QDwcospNvqeHjPSSIxT0iho1IggS__iM8rULh2rQBGfOZ6Whc7eNwvHztXi4NP',
            // views.voucherOrder.create创建凭证
             ORDER_CREATE: 'BMIYvBryjQN2rNEtOFbPYyW_pIW_MClAP7pQ02z',
            // views.voucherOrder.findById 根据id查询凭证
             ORDER_FINDBYID: 'fsoZk9UjRcI9gsWZRRdtw0fJJ5RuOdRkxZKUJZZ',
            // views.voucherOrder.queryPage 分页查询凭证
              ORDER_QUERYPAGE: 'LpfVL58egiskajeShbPkp5gcAFgNX14VG47BDBmZMuD',
            // views.voucherOrder.findVoucherEntryAssistantById 根据ID查询凭证，凭证分录、辅助核算项
              ORDER_FINDVOUCHERENTRYASSBYID: 'HNPACixFK4UjiLwO6PyNpcAwwX2LwEJILnuzQ_5Dy_Z7xefB-AvBNlB1hnKHR4s55QJ',
            // views.voucherOrder.invalid 批量作废凭证
              ORDER_INVALID: '61xBpVY7IZ60LRlCIsFryaPoSx-pyyLr0h5mhwP',
            // views.voucherOrder.keepAccount 批量记账
            KEEP_ACCOUNT: 't10F9Gn8sHdTmFDF-EjMCoyV1SaB7063fPnYVtR9lJD',
            // views.voucherSourceItem.export 导出凭证来源明细
             ITEM_EXPORT: 'q0AErRbN5DbVSoRxx3hGr8ryoxzjEQ20R-00ntL8VWC',
            // views.voucherEntry.queryPage 查询凭证分录
               VOUCHERENTRY_QUERYPAGE: 'LWGY6V_K-Grp0STG5W7AAcNoq8WpahW5F9Vw4mE17uw',
            // views.voucherAccountAssistant.queryPage 查询辅助核算项
              VOUCHERASSISTANT_QUERYPAGE: 'wpYr4xKTCEIyADHbO0tk7e2b8QJuunW29fs0KZpyAjxiqp4j96qeog9'
        }
    },
    // 基础账户
    ACC_ACCOUNT_CONFIG: {
        // /biz/t8t-fi-acc/app
        name: 'L2H1suP0jbhqxlo08YrbjBL0R-oSAqV',
        methods: {
            //views.account.config.create
            CREATE: 'x64qi9gCwaj2uLovfvW93IvJ-rgqwGcN5c4sqS3',
            //views.account.config.queryPage
            QUERYPAGE: 'VKbKVyzoUP1YByIXS7T1Xb_seZeV9WqV_KLXaOFRSVJ',
            //views.account.config.update
            UPDATE: 'BMcVOrwmSKIxYMdKuQU3.xHBtpXO6UgP72V-Mzc',
            //views.account.config.reuseByIds
            ENABLE: 'NhlkgjJba_ZNfdmDvduU1TW24pGTJwfmR3Lk3WCKQVfcvDs',
            //views.account.config.cancelByIds
            DISABLE: 'YljvztAF4hkbzZAh3n7BrYAH2SjPm3mEVshCue2JvtGjVcJ',
            //views.account.config.findById
            FINDBYID: 'MaXG92YqbEJAS7WpHav6zkSPoaG70JaMZUOL21WDB_0',
            //views.account.config.getUserType
            GET_USERTYPE: '7PAEGg8Z3AQnVJnHcfLuVBERYPDGHNDQHiFJK7TIBvi3l9p',
            //views.account.config.getAccountTypeByUserType
            GET_ACCOUNTTYPE: 'J79LzfjHBuy9BiqKbFFnePwOf8CtP1Xxbva7rkLAcBD1rnhzf-aDv7euux5DDW9',
            //views.account.config.isHasAccount
            IS_HASACCOUNT: 'ZsEAA2QXL6xsDmB0NqMFy5RU_zh5Q12tTi2tjsOiCcN4xSN',

            //收支类型
            //views.record.type.config.create
            TYPE_CREATE: 'u14knKb8vAmixZHI2ckjKrZT4rFLBZzzlblfk2DWoWDsPKT',
            //views.record.type.config.update
            TYPE_UPDATE: 'fp76xIcCd-s5e3b8NOR4j7fcpCpGRvx97qL5.tyqYH3vlUR',
            //views.record.type.config.queryPage
            TYPE_QUERYPAGE: 'tL3I6ZHptMq2lH4YmJn411JBY3L6Tb8p2JEsEqRn7ZempiJ2uOQ',
            //views.record.type.config.findById
            TYPE_FINDBYID: 'mqLCtZi3NxjvVoR_6YNsTCgOIzY3A1imqdTXDNrgoaGmIqk',
            //views.record.type.config.cancelByIds
            TYPE_DISABLE: 'OqKkpi29hQpWTMpHmzPRrWqgFYzXnwicnVY9kPlfr-paIO4DJF2',
            //views.record.type.config.reuseByIds
            TYPE_ENABLE: '9VEVMq6fPYLTJl4V5IydZLlEdLkHuhaLcVV5W6T-4tUvXU8H4_y',

            //业务调用模板

            //views.invoke.template.create
            INVOKE_CREATE: 'T0XEU-u9cQ1ql9qQT-gbEbM2wNPI_bqX8qUN5znND2x',
            //
            INVOKE_UPDATE: '',
            //views.invoke.template.queryPage
            INVOKE_QUERYPAGE: 'WutumEG7TOA9lxmxYzMenjfK1lRUeeDuM_UQbVGgB-vhZJN',
            //
            INVOKE_FINDBYID: '',
            //views.invoke.template.cancelByIds
            INVOKE_DISABLE: 'gmRphg66qJT6kW4tk7WRobDFwbFNUIn7cmdmFMVKEM5-aV2',
            //views.invoke.template.reuseByIds
            INVOKE_ENABLE: 'Xi1uYvDJAWhF_rC7xfY5PfXnK-kUjhWzS1plQHyilfFpQeM',

            //账户收支单
            //views.record.order.queryPage
            RECORD_QUERYPAGE: '82y0-HYcMp0wG4bVxakygRpTkTb3jCnysW4SSv2lzfQ',

            //账户余额
            //views.account.queryPage
            BALANCE_QUERYPAGE: 'nv9_2YlJjkmB2PiK8LZ7muvL_uOcsn.aPyb',

            //账户余额明细查看
            //views.transaction.record.queryPage
            TRANSACTION_QUERYPAGE: '7JM2xLx-tanC6Jte.E_QHvH-dJCwLlzuVqDtHocp1nc7XZ7-gQT',
            //views.transaction.record.findById
            TRANSACTION_FINDBYID:'Tweumu4Zzn9DYhiVtfBKflvGB3TzatRxAqGuXlwlfHMXdub'
        }
    }
}

export default Services
