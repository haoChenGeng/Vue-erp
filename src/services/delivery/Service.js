//交付模块接口
let Services = {
    TEMPLATE: {
        ///biz/dsp-ps-pmd/app
        name: '_dEkUaZ5NFumhFABUT_vYryxAsT8pEp',
        methods: {
            QUERY: 'WhdgS1GsGt4OW7893bZsRnWO4ZbQvPCSry_9Nv36D-iRL1-', //views.schedule.module.queryPage
            CREATE: 'WShhFg1VUsKRWR8dCEUKnYHS5MaG_YdBj2vUBtbXG5s', //views.schedule.module.create
            UPDATE: '9IVF-qqMLmBJIIzj53lCOa9GdFQ0PU7b2fLozS9K-gi', //views.schedule.module.update
            GETBYID: 'cRdbXfAPkTApUdLYWsd4aiSMvmmZnc1HtKWfbwmKctaUE7wcNI1lJXm', //views.schedule.moduleRedundancy.getById
            SETMODULESTATUS: 'GKRNxLxZ14e3U988YrybqX_Cl4x7c-zQ1FDxw_pM-Y_-R4CBKN-j1HIqsQI', //views.schedule.module.batchSetModuleStatus
            QUERYMODULEANDMODULEITEMBYID: 'YgZNUxwoYuEaPP_FcAtJpVKlbX6rhDLesrCLwe6L4eR-of0Q1cK9zNeR9WMHSLZDLDdMSI3', //views.schedule.module.queryModuleAndModuleItemById
            queryModuleQuotaionById: 'HM_MBPwb1bxTF-t4ObFs-YBwkI16e-wLwhB-vj5AnK39V945EuUBxxRCcjoI-L-', //views.schedule.module.queryModuleQuotaionById
            moduleItemQueryPage: 'Fq99NEPB3CHLjR8uoeAHcpWyulL1BFQnt6IzpiWzr9J29o5EK_V', //views.schedule.moduleItem.queryPage
            scheduleRef: 'LTSUa7QdfQ0SaIFR3Yd1GcJEEskhK03Ybvd6nH3IJ3m9WiRflUzg4E4ZCCv', //views.schedule.quotation.queryByModuleId
            scheduleRefUpdate: '4h7DHE09R71yAgM2wcG830QFEYc5SlBMk_Y0yuDJGtQ', //schedule.quotation.batchUpdate
            NodeRelation: 'KHEXKZAcOj5K71zqcO52b81vR_KfX5_DzH63-YOoyV5IqQ_V3iF5rY274a7n9hf', //views.schedule.moduleItemRelation.queryPage
            NodeRelationSave: 'l8_8wSo0y7dmt6wvZQ3Lv2xwU34y37MXwW80dkBghNK0tQJntjm2rrZ', //views.schedule.moduleItemRelation.save
            referenceRelation: 'DKfN2E_92Wwp8E_s7Vy3pobuoiUyMmK8_fclNLi-Z4Jtr7w-hVj', //schedule.quotation.queryByModuleId
            itemBillQueryPage: 'Yjn7p25RxxJQpruWFgfX0btV-adZM-uJxA0culq1qrRua2n', //views.schedule.itemBill.queryPage
            moduleItemSave: 'uFD47UQyU_ZeO93xDtXVk_60GQC68XI1o3J8yHFnnqE', //views.schedule.moduleItem.save
            itemBillSave: 'nOq_C6xATH08TwtzX_s0ec4z0m5kbiBhM4C58PPxYKZ',//views.schedule.itemBill.save
            queryPagePqmQuotaion: 'WvDKL8HrApLhQPkVTIcSlfEdnn_N_eT394cS8ynNJ_uRZDHQMiR', //schedule.module.queryPagePqmQuotaion
            contractUnitPriceQueryPage: '78mvDmSl6gPF67lT8fRnzxwD9vgVxx-gM6hwws29QDmi0mA', // views.contractUnitPrice.queryPage
            unitPriceSave: 'm9CB6CVK4sC13RLKmvmuiEpV-ovwX6b', // views.unitPrice.save
            unitPriceSetExpire: 'zg49418AeAwu79gItDLfmQod_g9iWnL0I51cSZF', // views.unitPrice.setExpire
            unitPriceQueryOplog: 'Y5zgw1vKqbiE2qPTlwohege1AIXVF3fCO5lIaOG', // views.unitPrice.queryOplog
            unitPriceImport: '09oshLmHhrNC0XZExbU8ipLsxwgW2yfU3ZX', // views.unitPrice.import
            unitPriceExport: '5UsC_OnqcLwCYY6wybHxpB5DvpMkrgL3fvd', // views.unitPrice.export
            expenseDictionaryQueryPage: 'r001f4hDonWwAppN1X2Xh3mGhrcLOwb20-vr.Xjf3zenmfm', // views.expenseDictionary.queryPage
            expenseDictionarySave: 'SfWeNn-eO5NYWRGen9-4FJeRoKZLopWSeKmMb5a9E15', // views.expenseDictionary.save
            expenseDictionaryBatchSetStatus: 'fiViLlPcZTugxTC4NibVBrUnOXJ5nhYmloEl02ZmjPJU_BgP0FwcYGs', // views.expenseDictionary.batchSetStatus
            expenseDictionaryImport: 'r0z1fdJPtqlgwurJ2E7umh3mFhpt54yqmkDvm4FtHXC', // views.expenseDictionary.import
            expenseQuotaQueryPage: 'v726c4Owbqv9no3zrlXIHwImcgMpH3qslWHmEF5pTSV', // views.expenseQuota.queryPage
            expenseQuotaSetExpire: 'zw410wGO_brs5yaqJGApZJItHg0apenxcX5wW4CdUTS', // views.expenseQuota.setExpire
            expenseQuotaSave: 'tk53e0MuXofBlW4FZlJVFZLjiInNfufkzlM', // views.expenseQuota.save
            expenseDictionaryExport: 'FmyxclyZ2Php9SMx-jngJykDIxWDBXmvxnPPs6nvpSA', // views.expenseDictionary.export
            expenseQuotaExport: 'vIKI-dfT86zmE4-KZE5omH9c0Cwx56b_YRRFRRg', // views.expenseQuota.export
            expenseQuotaImport: 'Qborf8DjgJVzOe97fid7o5Q6XjQda0O65AnlEIJ', // views.expenseQuota.import
            listModuleNodeAsTree: 'NXVUIrqPd8JrC8JjDoIEkfK2DZPkGUQWyjSI5nC37wx',//views.module.node.listAsTree
            queryPageModeuleItemByNode: 'w6--2u9lzym6grsrTKgYqBzvO1jv27WqU4wUO2vBsoK3mSny7rYvpo6', //views.schedule.moduleItem.queryPageTree
            saveNodeProjectStatus: 'ZhzIOOu7oWJQwsOtOKCYQlnERzp7dNeS-SoygHdHORr', //schduleNodeProjectStatus.save
            workerBaseServiceQueryPageInternal: '2PC-MnnWIpibbFjCP_qEgMCymUMCBUEU9ZJEy_6C-5Q1vMVt-kg3A0bFzKe', // views.workerBaseService.queryPageInternal
            cityScheduleQuery: 'HnmiKlLYqW-xISG_SybwQYcX6RLVbfGiviCYG5-CvoaSg2Taw_vVAqX',//views.schedule.module.queryPageRelation
            cityScheduleBan: '8IDKCayO5ZcKp7iTAUW5N90XiJA8RCu2r1AX.jZo7cQuLqR',//views.schedule.module.relationBan
            cityScheduleUse: 'y63GLwYfNvL2hQ_r2Vtt8Dv3j3-pQ4g7xLwrClGB-SC29gG',//views.schedule.module.relationUse
            cityScheduleCreate: '-GUS_W-NLqvJHM_o940uP7FqG8IQU_JqTR04WM2peO_krEKm2AZ',//views.schedule.module.relationCreate
            scheduleReturnAllPs: '2NSLJO4dFf6CzjvqhKfuHCDjQ60CgO0Uj_2gZBh0_aa_88X',//views.schedule.module.returnPsId
        }
    },
    PROPERTY: {
        ///biz/t8t-scm-cfg/app
        name: 'R8b7h4AHkMWAu5hFhrksUafEPkyKTyW',
        methods: {
            propertyQueryPage: 'xxyFxYonI0x3Fv7Po3D98lC_z76', //property.queryPage
            propertyQueryBatchByCodeAndPcode: '0wkcHzF4iIw08WJGyNJA9aBy-OH05k5OlRIxLtbydZM2j8S', // property.queryBatchByCodeAndPcode
            queryPropertyUnion: 'RxFkZaxSYW_PlV98ePFifFGinuEUvtWDAMnA9nX', //property.queryPropertyUnion
            queryUnionParent: 'vWcCqRRuqavrv2SkNxuXiloq549mh9uvxSBYPMS',//property.queryUnionParent
            queryGroupsAndChilds: '4Sz-mEp7nAoeRzkDi-N40TVsFUK7jK_Zfa9sTqI4QtO',//sys.group.queryGroupsAndChilds
            queryChildrenByWholeCode: 'XHjwvpIXoaQBZ7YUkB6uSsoZifxtyfBUWxonWR2msD2gAtAmAT9rCNz', // views.property.queryChildrenByWholeCode
            queryChildrenByWholeCodes: '0AAA4PS0mMRdG0wdyJ5ftF2ywA0trNka8AwkgBztgTwR8HhMfNvNl8k5HcY', // views.property.queryChildrenByWholeCodes
        }
    },
    PLAN: {
        ///biz/dsp-ps-psm/app
        name: 'qhXoFH8DI96EZMplm8pkqMsVhO9LZBe',
        methods: {
            projectDetailTree: 'PW-uTQZIeGB2ukCs5MBLscTc13PoMbsNLKn', //project.node.listAsTree
            projectDetailList: 'ULNnTOfZuSLw1R8BJeBzRtdbByNKQcFiHH2', //project.node.queryPage
            findNodeDetail: 'm-iarVuI4BvnI_vUm2HbH_LuI3i9Zv32VmI27H8', //project.node.findNodeDetail
            nodePropertyQueryPage: '4vY7guTPtyuU8xhhV70cXOmxs56vg3IhNgI',//node.property.queryPage
            nodeRelationQueryPage: 'd5N0rn9zsZCzyKd6DamHzwmlEzZC0cwRHmV',//node.relation.queryPage
            projectQueryPage: 'nTEpUJyccWuM09mOg_tkKslxOf6', //project.queryPage
            projectNodeGetByProcessId: 'rxiwxJLCwTb9l1-Shd_28mzc5dlx5pWXEj7EiHvVzj-Z_52', // views.project.node.getByProcessId
            findProjectDetail: 'MTBjPUKz4rL1GpHRSlJCjWGBAxVDOQlITqt', // views.project.getDetail
            projectNodeStatusModify: '9_Ay9_X61iTMlFTs88LSGO0ReFcCd64Ry-q9OOOifF_5dgI', // views.project.nodeStatus.modify
            projectInitProjectNode: '5w5B3Tp0j.QfD0Art6JMSFl6BbOwkP2j8p93aDMjfwK', // views.project.initProjectNode
            accountQueryByRole: 'z6F2xfx_ou6j5Bc3bB_XeHx2mGG5taP48TS-yTi', // views.account.queryByRole
            projectReportQueryPage: 'kfpaV8XjWqM3QvN6X1s98OSb-xZR6hRdHH1',//views.report.queryPage
            projectReportExport: 'mD-_jSn4jAIs5yBSPU_KvB5fX44bKTH',//views.report.export
            queryByRootId: 'HC9N1PkKDw4JBj-VX5wlb5u9.K2slfkuRjVJtMA',//views.account.queryByRootId
        }
    },
    ENTRY: {
        // /biz/t8t-ps-pcm/app
        name: 'iB3nC05G9oimE2RX4jRWEWUeGzJwJ-a',
        methods: {
            groupListAsTree: 'paXdCy9S_BZFW8WaZmux18CkTWV', // group.listAsTree,
            groupBillTypeList: '9U6FqaR_aWjnoAL092bBDpeCgwX_sN-', // group.billType.list
            groupCreate: 'YGc6ZXSsRYJTiqrqhzf', //group.create
            groupBatchCreate: 'rLYEctTDX0YGOtHEyVq5ZzxVpM_', // group.batchCreate
            groupDelete: '8ehFA8sVr8aZ5X9spJv', // group.delete，
            groupQuestionQueryPage: 'vKhGmgWE2cZsiOWtvMTEvvsZulR97q5dakr', // group.question.queryPage
            questionAnswerCreate: 'bifxqJag3VHz3STDuooBSxWwZArfTuRqLJ6', //question.answer.create
            questionFindDetailById: 'cONSJVx5jW2FlWGhcYUu-lU-yWVsD0tSD4t', //question.findDetailById
            questionAnswerUpdate: 'zWURjIk9lXzzvUSliWj0UsIjTcGyBwiWLB8', //question.answer.update
            questionAuditStatus: 'VXXid4KmagnoUYUgYSA2MdIC1e.QJT_', //question.auditStatus
            accountsConfigQueryPage: 'kqt7zSeXHwtk616oBvbciKf-P81ow1Gzus_f64itrkp', // views.accountsConfig.queryPage
            accountsContractDetailQueryPage: 'IYZRcQl3h46J8A8izLI5_uNqlnKR4DlQzuGIkiUN0kjRCIgJIhUIT1r', // views.accountsContractDetail.queryPage
            accountsItemDetailQueryPage: 'f6klrNg8t-Xd0vX6jygJViLxFV7najJZm2AO1J4nsLNTGT9teVB', // views.accountsItemDetail.queryPage
            accountsConfigGetQuotaItem: 'HT6NIPwXDQ90MIgtX2g6tILhRy6JFZAd-h9vb-I2zv2yuAF', // views.accountsConfig.getQuotaItem
            accountsConfigQueryFormula: 'Zf0tlyZqmdJti8NyiqXXZ_UFBuVjY8jTfsX0OhArDFmse5c', // views.accountsConfig.queryFormula
            accountsConfigCreate: 'VGHLN0ZzW6pgNAK9mWFbjs82ch989EQrKzKr_5N', // views.accountsConfig.create
            accountsConfigUpdate: '8VXBIq-0bJ3BWLo1taM974iKoVRNIJf-L0UJ3vF', // views.accountsConfig.update
            accountsConfigQueryDosage: 'NqkerQpNdJcPXf2TxPwFNzf1_ZMXLfiZJpbl.o2Z39lY8Hy', // views.accountsConfig.queryDosage
            accountsConfigFindById: '04sm2x6jBcuR8r9u_jnNkah3K6dtvyxq--fda_YtBnG', // views.accountsConfig.findById
            accountsConfigSetDeleted: 'qpyyyZ_cnjgZfpEk7pBJPnDGiimV5mCRCeViA4TTdxmNu8I', // views.accountsConfig.setDeleted
        }
    },
    YANSHOU: {
        // /biz/dsp-ps-qcm/app
        name: '5g2VJO-hIQhqaYG7rwKSNb1jxbIB9Js',
        methods: {
            platCheckQueryPage: '8T__OWpNXI1a85_xtra4yoK4Bfm40ylDvgDGuyf', // views.platCheck.queryPage
            getCheckProject: 'EKILDouTB9nTO1Ehf8PySvJDLOmyNQM_cFR-PASTL8HAmmx', // views.platCheck.getCheckProject
            createStartCheck: 'gqmlOsOP0NHkRcL-pbaVuPoNlNaPl7G', // views.platCheck.start
            getOrderInfo: 'vpoj6zMasaUBt0wYd12cVi9Opb7yS7wnWoFmmGpaFSD',//views.platCheck.getOrderInfo
            createCheck: '4BII4GnL8iQB_StGlztGmJwNVoxi5Uc1vgi',//views.platCheck.create
            getCheckDetail: 'ijcloNo7te0fmcB_lLsaKwImgVOzMqEHESqO4SmcTqp',//views.platCheck.getCheckDetail
            getAgainOrderInfo:'0QQBFlzZzuXQFc7ABu5C1R5NLbrwC-A8UWrlZhMxDgzGCBd',//views.platCheck.getAgainOrderInfo
            againCreate:'tK8prfIhGsmeCztYwh_rbl7hqLppr9-oIb1sro3',//views.platCheck.againCreate
            queryCorpMember:'CG3FzczQAvSJFozK9_fQr5lL--rd5XlaAqhXtJEouFuAWli',//views.platCheck.queryCorpMember
            queryPageAccountByRootId:'4USU3RzXDqgXN5y5R__mG5U20Pz-ygusxDHAuJBPYjIWWrcF-wJBjt3Fpmp',//views.platCheck.queryPageAccountByRootId
            verifyFit:'blkNJ3GpcwvKJcC15fFOyJpKmBRcggmISCVbo3s',//views.platCheck.verifyFit
            checkUpdate: 'w6M5AVqhT5IwL7VSU78V53s-lUI', // views.check.update
            checkGetHead: 'hnpnTAAuAf2lrlgqh0e2V4TKXXi0ArH', // views.check.getHead
            checkDetailGetDetail: 'HQPKyMjTBEN0N6IWkpws7LEAVDuN6doZ9Wq_KJD', // views.checkDetail.getDetail
            checkSubmitOrUpdate: 'AI21BTpQN2WtwIoaxO-AZ3F9n1YvUrz8V0xBokk', // views.check.submitOrUpdate
            checkQueryOplog: 'C33EDGrT3dHJ.6XLCt34Kt5E1rlWOAuWk.i', // views.check.queryOplog
            projectShutdownQueryPage: 'm0Fx7RXOnfi7jBeDS8fE8onhS9zRdCz7F64fZ1R7gKv5Cya', // views.project.shutdown.queryPage
            projectShutdownSave: 'rxw3nIZ7nUTrn4h2kp_GBlSn-qTKCaos1Aqjscx', // views.project.shutdown.save
            projectShutdownRestart: 'Trumg_9kjM7Q0wPZVZMRK-pfQW3h3z-gU6nMXDogc_5', // views.project.shutdown.restart
            projectShutdownFindDetailByCode: 'RUJZTpBeT-VriQaGEPmnnImrJqL7tuSEscOHaW10DJi8KbeFXc69pHZ', // views.project.shutdown.findDetailByCode
            projectShutdownFindDetailByProcessId: '0ONK1djGAurXuL46yyYjKCv6M_dVbCEh6g_5Q5nwscA79Sn_J3-gORI8uiJ8t4o', // views.project.shutdown.findDetailByProcessId
            projectShutdownListRecord: 'mLqnnS5TykJ-hOaZriFt8eJXupbNB_dXrgObYV5Xaend5-m', // views.project.shutdown.listRecord
            projectShutdownApprove: 'XgQcbh3mdVDGWEl-LbI7wtUyMyDx1wXhfgLbwpwUuTf', // views.project.shutdown.approve
            projectDelayBillQueryPage: 'rj2zsDfuqDU5ZylVgt-5yWn_wqnJ3XR6toXSn1YnOzNpksx', // views.project.delayBill.queryPage
            projectDelayBillSave: 'lpreksRrLvg360OWGpFSH9sccwVSTKtL31iMnLreUID', // views.project.delayBill.save
            projectDelayBillFindDetailByCode: 'hO4860-PIafgP2xru-4UUortG4l6Xjs0M3Fe_AJrfV30bcweeMSW9UpyrbS', // views.project.delayBill.findDetailByCode
            projectDelayBillFindDetailByProcessId: 'WuyfUEF0lVU5UwPtelMAdhjrYrNPypR16ojgv2jLKtqA82UKSHfRD5SCAd9jttx', // views.project.delayBill.findDetailByProcessId
            projectDelayNodeQueryPage: 'FQPQ5n3KHw4Z2Wv9IdUMDAc9O_VaC1-KMxvQkkw3CN6CB5V', // views.project.delayNode.queryPage
            projectDelayBillListRecord: 'de104uFdxwYWvs6j4cRAGlolEyslM9sATwAvU6ysSK0nJOAqDUR', // views.project.delayBill.listRecord
            projectDelayBillApprove: 'VtcQbVATwm7QzSxJqlw4_cgNnZnbLzPN0mjLSI4Ss19QG4J', // views.project.delayBill.approve
            checkGetProjectDetail: 'Jdelb3LZVvOiQ0RsYWotTgLAJtalAgWxOdbGvmS-sO3', // views.check.getProjectDetail
            batchConfigQueryBatchPage: '8YZDRp3c0DyjLQqPjeKhsFMK6iOCDB5UU1MFNxSF4gTNUIy', // views.batchConfig.queryBatchPage
            batchConfigQueryPkgTmpTree: 'SRfNVxCUTfrt_hMsCzgbFaVQEmWN7gVNe3FhWG7Y-2_WONf', // views.batchConfig.queryPkgTmpTree
            batchConfigQueryBatchConfig: '5POQMn2aGYjd3USd1RnxCD_HdwMBBTOFOh2Ir91ypYERIZDcuyY', // views.batchConfig.queryBatchConfig
            batchConfigGetBatchProperty: 'fqjpjr5_zMsIyH8jDKoe5oeUg0NpaoW3pDje4h_Om_0XbPoRV0G', // views.batchConfig.getBatchProperty
            batchConfigSyncPkgTmpGoods: 'AGC8-SDQhayNeNCi7nHfgLwvJU1MRI_OaVFPu1ZFrCF0j3M', // views.batchConfig.syncPkgTmpGoods
            batchConfigUpdateBatch: 'AIIXXxzk7Z_m6pI6PqozJ85OoX-3-HLRDHDN8oMwDbi', // views.batchConfig.updateBatch
        }
    },
    FOREMANWORKER: {
        // /biz/dsp-ps-pmd/app
        name: '_dEkUaZ5NFumhFABUT_vYryxAsT8pEp',
        methods: {
            // views.workerInfoService.create
            CREATE: 'yO760eSwYDJka9K9G9Gpab7DLi8DLDPrd8RsfdQr5mN',
            //views.workerInfoService.update
            workerServiceUpdate: "IAW-63g1e5PsP2QANBT_ujR1mmCFQJFxlxK3CcTBB8_",
            //views.workerBaseService.query
            workerBaseServiceFind: "OLKdWxDVRcglMqLUk35b2k0-6FeWeAd-ZHgQNHMRYVl",
            //views.workerIdentityService.query
            workerIdentityServiceQuery: "u1KEDKXq89TbYqcnFxp32qMwQPwlzz21vGAoGgEeNWE-2vM",
            //views.workerEmergencyService.query
            workerEmergencyServiceQuery: "Ymlibiq6qb56id3B1LT4xgcmajGUJ3XzF1eSodWO0xdToTdMM-D",
            //views.workerFrozenService.query
            workerFrozenServiceQuery: "3utC3DYLkPUOmB07dzjJZmuyIg5Cy529BvkxUC9pwv6mtaM",
            //views.workerFrozenService.cancel
            workerFrozenServiceCancel: "JASQ3V9ZGRuh1jzP6Fkb4TAIynAb4XU-2GwgjWM2xl9GBKe",
            //views.workerFrozenService.create
            workerFrozenServiceSave: "4CrsnhVjFkNZQvRdQu-mK6sc4yNs50CD40RazXAzDw9jNee",
            //views.workerEmergencyService.cancel
            workerEmergencyServiceCancel: "ho8s1JQCA1PWLrKo1UroGpe9k9tqhRtPuDx5omuj95lvdR1dqIZ",
            //views.workerIdentityService.cancel
            workerIdentityServiceCancel: "5-W6B5MUG3Oa3gQu5mt0aBz8atFyP9tx0O80vU5ivp5wCp6jYaY",
            //views.workerBankAccountService.queryByWorkerId
            workerBankAccountServiceQueryByWorkerId: "reyskHc4ZBEBWBj9XhA8SBMqoGHxVmumgPklU9VcRbdYuMFphFEX2hipCQmUlBWgHQQ",
            //views.workerBankAccountService.cancel
            workerBankAccountServiceCancel: "c6zkzGL_BfgKQCeJqBe8GtuCE5n1O3v6h9XssYEwXM5Zljwa3P5uQET",
            //views.workerAttachService.query
            workerAttachServiceQuery: "MjeeJzMutMl7tE1Aw-URHjVPGUQ2UhMkgNY9U3faWEvXJs8",
            //views.workerAttachService.cancel
            workerAttachServiceCancel: "9H1CqFnJ8Ea_qCx_s1zU5imq1iRwRrDyzluzVG_24ZEpz9O",
            //views.workerBaseService.queryWorkerSub
            queryWorkerSub: "1wv9z-YGm4HlOGJyUd5bsLLjfl7jBjxw_rG6fcwit9hlPfyzhRrmtge",
            //views.workerInfoService.findWorkerOther
            findWorkerOther: "ufmnldIdvuACOztEoFgT7ob3Nlt4a6kHVBn548WHfvemt2tluOArHoA",
            //views.workerInfoService.query
            workerInfoServiceQuery: "x893sLQAluN-3yMnEjynI6xNf0wrr6v3ZGypn2tI24W",
            //views.workerBaseService.anew
            workerBaseServiceAnew: "NFRUQOlrZ6qSag5fFRK9XfjEE4WKGEG0TCNBGYSOKwr",
            //views.workerBaseService.approvalAnew
            workerBaseServiceApprovalAnew: "_PH8ChjC_hAjaFO9JyPouVC3kKG-tLDc8Zw_YSFPfKf6tWry63i",
            //views.workerDimissionService.cancel
            workerDimissionServiceCancel: "_VFbGPnCiUpsWJY6kDqhFPJ3ulKMxlHl5hD_LXV9ybS43rTPKnz",
            //views.workerDimissionService.create
            workerDimissionServiceCreate: "CH54DJqr-wXOV83G3D5OW2S7rgZs1NB1H4UtI2LpjeEw57z8Wnh",
            //views.workerInfoService.findInfoProcess
            workerInfoServiceFindInfoProcess: "kMXpke5OyOq5shY5EmBbqVM5MmepdablDscVZde1UfdAl-SequmIGL2",
            //views.workerBaseService.approvalCreate
            approvalCreate: "zA743LfGmwI6T5zJsKT8bJzrg_w6x8cMbHruZzy80TQupLXv-olzNtT",
            //views.workerBaseService.startWork
            startWork: "WZbfUdDjEtwtTv7lKVdAsMdLHcCeOQPpPnVdREbTiKKRxAR",
            //views.workerInfoService.getProcessDetail
            getProcessDetail: "DR8SJbzW3reULENvM86lMGM6RAOBDANtYwQnve4zvavjiBXDcrN0fvA1aqk",
            //views.workerBaseService.submitBatch
            submitBatch: "MqTia78dZ18hcizFtOW_2idDKigXIlX1DwZnqQgLHU4-jC4Ilc_",
            //views.workerDimissionService.approvalDimission
            approvalDimission: "MASR6Ro3Y7UsRJl_b6jkAc0E5QLBnMyFl0hMQOM3to7JzejGh3_KjAYF_OR3l_cH9xr",
            //views.workerInfoService.queryUserBySubOrgAndRole
            queryUserBySubOrgAndRole: "SHXW_rsfAp1hRZ3pFI5xb8n-HQHKMLumDl_5MY_Rfa2On3mwYIGVFAy-dQkTbyEMYlF"
        }
    },
    // 组件架构
    ORGANIZATION: {
        // /biz/t8t-sys-acc/app
        name: "mMkw3nBKlOTyf-63TdM-uXNEV6hLW2X",
        methods: {
            //organization.query
            organizationQuery: "8TqE2fXZHE_vgB5hG8nzPW14mIX",
            queryTreeByType: 'IefMV_-kDFPfZ-shDibTaiAtug9yEjMCuudrr6HFltn', // organization.queryTreeByType
            organizationQueryWithoutDel: '2S0YnKyWFMXgSG1sN9EEgQ0C6rxTBiLhbh8zwX4bbPb', // organization.queryWithoutDel
            queryCorpMember: 'aKSFfdOqzrh31zOBiXt0yqUky_PaZwZeICZ',//corpMember.queryPageAll
        }
    },
    PERMISSION: {
        // /biz/t8t-sys-pem/app
        name: "qFoK8IUbHxpgP9cHXZoPEqxe_.ClTZj",
        methods: {
            //accountRole.queryByRoleAndOrg
            queryByRoleAndOrg: "ePWrk-bnmMX1lOanojnarVwtLlbUC4iUbLjsKborai5",
            //role.list
            roleList: "yqnMwsoPDfnsOS3",

        }
    },
    ACCOUNT: {
        // /biz/t8t-sys-acc/app
        name: "Y6DwpoJpFyLWnhvc4EfMwc7sEsiT1n3",
        methods: {
            //account.query
            accountQuery: "WPDNHg_8pU7irGSSL4wFGn-",
            //account.findByName
            accountFindByName: "59iF8d5TCtVNO52hIjKNVv_rXHG"
        }
    },
    PRSPQM: {
        name: 'hMNCl9S9hJbGkcd4dsaHxWWo3cOZFd3', // /biz/dsp-prs-pqm/app
        methods: {
            productPkgTempBaseQuery: 'NXmkNqU1P3KdfeJJjjN1bK2QVOfHhIn14bG5n3lKLFjfPwz', // views.productPkgTemp.base.query
            productPkgTempBaseQueryPage: 'AIaJWwyQT8tpLQStKVWM-mO7q1eU9ilNKms_HrqW74UT56a_YL1', // views.productPkgTemp.base.queryPage
            productPackageQueryPage: 'C0JFucrPsWWU-ZzG9xRJVm6t891-1a0qar1sqZjWq19RwRl', // views.product.package.queryPage
            packageQuery: 'oe0uUFI1nAF5TVhsUmMD7ZQlWimpSkwEjPvnjSC'//views.product.package.query
        }
    },
    PSCONFIG: {
        // /biz/t8t-ps-pcm/app
        name: 'jMEmBe55DNVel0mRV2hjoFhTdLzGZCH',
        methods: {
            shutConfigQueryPage: 'drkrh8RcipTjcxqTlco9mfViyhcpDrPZTPHHNm_', //views.shut.config.queryPage
            shutConfigSave: 'cVSiSe47vdnQmhumQXy1qlJDZvdlG3EK_xE' //views.shut.config.save
        }
    },
    SYSESM: {
        // /biz/t8t-sys-esm/app
        name: 'xOMOwi2_Fken0zL7Fcadn2xXElwJRTW',
        methods: {
            queryModelBasic: 'PL1gTNapVOMGhPntoQ75mTI48x6',//modelbasic.query
        }
    },
    PSSUB: {
        // /biz/t8t-ps-sub/app
        name: 'BuElZIzsGxGiZDDTXdLxYjDxBrC24x4',
        methods: {
            accountItemGetAccountItem: 'MKIHAZClSLF9SPYFi-nTj95WR7s5n_G8X8nJHPASyUY84Xi', // views.accountItem.getAccountItem
            contractBillGetDetail: 'JMSA4Sj2ZCMYW3sx7-Fie3uADMH3QIPzf5_CufPGmsm', // views.contractBill.getDetail
            contractBillQueryPage: 'w420fGKwa1-CwXJ1aLbduVsnAualTH3YYdMkGZptcTS',//views.contractBill.queryPage
        }
    },
    CONFIGURE: {
        // /biz/to8to-it/app.tit-configure
        name: 'Ihw1UIintVvO0J0kUY_5eWzrYdweuHDNddnVBEkWzSsF7qA',
        methods: {
            listNextLevelUnforbidden: 'K4SRf0fzCaS5-gYA4paFT5iUTB6KxengnRrDV2mXj3jHCTRGD6D', //systemCode.listNextLevelUnforbidden
        }
    },
    SYSACC: {
        // /biz/t8t-sys-acc/app
        name: 'vCZeOB2kcjemAyKNYBvBsH7HiEwuovV',
        methods: {
            queryPageOwner: '71SnHxu_iF4vf-5ACsseq6_',//owner.queryPage
        }
    },
    DEMAND: {
        ///biz/t8t-ps-pim/app views.goodsDemand.queryProperty
        name: 'Ky7aOj92RGBfe2-xiOLjsHo2gdQACaD',
        methods: {
            QUERYPAGE: "_CB_7PGoP2Qf97Tsrwe0jXD3CqMrz2C2Jzyk13A",//views.goodsDemand.queryPage
            QUERYPROPERTY: "18SN2fiEyioXHflr_wUc5PxT4HEtr-ISN-0-SkWz-hKL4Zo",//views.goodsDemand.queryProperty
            QUERYDETAIL: "ZXVnd5NqK6tzVCQIYHSehdMWSueYRWgXbpAUaVgLCsx",//views.goodsDemand.queryDetail
            CREATENORMALORDER: "OZufeBawl9afg79x9CMR5vSOgJS7bAJ85CHJK2l-Q2fNwtH9Osk",//views.goodsDemand.createNormalOrder
            CREATEAUXILIARYORDER: "_L2z8XqS4D1Z92ZeV61YkDA3eN4VtElzfCiomZ55TOploZxbox1llST",//views.goodsDemand.createAuxiliaryOrder
            QUERYNODEBYPROJECTID: "f31zjvHh8mxL9-YXbRZr1js2OAssjyxn0NrEellnnhskP6ukaJ4SlPQ",//views.goodsDemand.queryNodeByProjectId
            QUERYTOOKGOODS: "SXssf2A0bb8D0c7QK1Le3WMtXwbLbnitqXP5_DdZ4yggOO_",//views.goodsDemand.queryTookGoods
            QUERYNOTOOKGOODS: "Oikjbnn6da3syVD_ELDunSXlOsMFEmdWoKXnRhIoeDa07UK3fBB",//views.goodsDemand.queryNoTookGoods
            QUERYAUXILIARYMATERIAL: "r3GJ8EvRnzaYSoTdT1kGvsH0Np64zACIQpnwFUpXzy9LEa76fJ3Jk0trPcO",//views.goodsDemand.queryAuxiliaryMaterial
            CONFIRMRECEIPT: "f936sMQ_oNRS9cJiWaYKjy34l9t6O9w7z1dqWbmaLXAucfV",//views.goodsDemand.confirmReceipt
            APPLYREPLENISHGOODS: "oF_G8AxpMy8QJ6jimkjfRs6AxNh0fJ1Twc0wh2iyEI2XAQ4UW-o77Kb",//views.goodsDemand.applyReplenishGoods
            VERIFY: "fqTSYkPvGnrgGG7_HVE3zjfU9pKpWfULEKm",//views.goodsDemand.verify
            GETPROCESSDETAILBYID: "SfrcOHxFXN4djZ_xF7TKaWUd5YTv-o7tzVCuMtQZGeUvvhjUt9g4A2q",//views.goodsDemand.getProcessDetailById
            GETDETAILBYPROCESSID: "0HM5M2jvRA__hmS_vxpBtOLB63HFZ4a8v4aA6KUnAP2wNWP86ze752o",//views.goodsDemand.getDetailByProcessId
            CLOSEORDER: "ThhkHNuIkR0u0qUFG_LPCrXWiPYPynnatQKafMbIW27",//views.goodsDemand.closeOrder
            CHECKOUTGOODSDOSAGE: "wQnXYe_-xigqB2dORIdK2UcYDvgokuM60AzkbVLP3wlOnS3O5ObdXEH",//views.goodsDemand.checkoutGoodsDosage
            QUERYPROJECTID: "uMF2_IvT_dfQvvf2q_6HyBGhQt66LDJGmE4jrQ9oeaynPyR",//views.goodsDemand.queryProjectId
            ITEMQUERYLISTBYID: "D7IHZxMkXxZTT8rzrw5VZHEwJzdye-Fu9pY99wQ2qLIAmdOq_oj",//views.goodsDemandItem.queryListById
            ITEMQUERYPAGEBYID: "c72ng7Ltt59FveRGtaLvgw3TMXhFUBOnbLwbLNYcE8qWM9RVYkD",//views.goodsDemandItem.queryPageById
            ITEMQUERYDETAIL: "SqabVsYSiPqD5hQDPgZ_WfbHB0SMJj_tP9iNGUAUQK4NMdh",//views.goodsDemandItem.queryDetail
            ITEMQUERYORDERALLITEM: "MOTL2fzbIOUjoIwx1vxxi_QDU3iFtCcjSeMD_0Ruk4MH9ipCzghIfsX",//views.goodsDemandItem.queryOrderAllItem配件无配件成品
            ITEMQUERYPAGEALLITEM: "mfQxCvnuXpEoDK5TSb7ROwqUybTURQ8Y0PvklAxMBOglePjm_0BmguL",//views.goodsDemandItem.queryPageAllItem
            ITEMADDREMARK: "mbualJ_F2gGtD6gSHIfOsqQvGRl_d0CsQrk_FNrTNOnjlII",//views.goodsDemandItem.addRemark
            CANCELORDER: "kattS8P6cAFI1iPVQkbc-oPuYjd5zRxiBb1b_VvfgP0",//views.goodsDemand.cancelOrder
            queryProjectList: "ftbanir_0YnAhMLB4KZ04jibSzQKbAkNqXDgaxbcZP7IIqnQG_x",//views.goodsDemand.queryProjectList
            goodsDemandReport: "C4HH-IzU_ZgVCuzats-JGtIyPtN7W-0-avd",//views.goodsDemand.report
            goodsDemandSave: "XwtvYuW0RtPJnfWF_TkEbluapTAKLu9Qc4G",//views.goodsDemand.save
            querySaveOrder: "_2z2hwIyP7YMT8ovSqoVDr0hBt92H-2J25I5En2lXr0nobR",//views.goodsDemand.querySaveOrder
            querySaveOrderItems: "PqVoh2QTxaH0AyV4MIeF0yTfWTybbYmaqoPJWdqC27oJaNIhJWrfz8x", //views.goodsDemand.querySaveOrderItems
            goodsDemandItemDeleteByIds: 'MRGfZ6moZ6kqgHk6iLzmQGHFmMiAO5TCZT4zDzm2F4kzKui', //views.goodsDemandItem.deleteByIds
            goodsDemandQueryReplenishOrder: 'boljb6cvbGg-BtXaFanKfdmOsfknWnso3ZmpkCtqr3rc0fSsnT1dyUQ', // views.goodsDemand.queryReplenishOrder
            goodsDemandQueryReplenishOrderItem: 'dOgjSZ1DaBYuncVz44xBO0hVk9qaOBkURSOFCuURV5jajdNTSQdGRhgEDc4', // views.goodsDemand.queryReplenishOrderItem
            goodsDemandCheckDeletePermission: '62zwEn3WnF25_WO4iai3iM6oxv43R4FhPMj0jPDpdudk2TM1ut8z1cJ', // views.goodsDemand.checkDeletePermission
        }
    },
    DISTRIBUTION: {
        // /biz/t8t-ps-pim/app
        name: "LgHodN-sJIJnYbF1ZV_gt1L0EvHB4W7",
        methods: {
            getApplyInfo: "bRVkaxObVGPYXXFFWTMlgsHnlQeVIeMbJwr5SLVe_DbMFuzUD1meb9u",//views.deliverInstallPlan.getApplyInfo
            getScheduleOptions: "PjiYP99OfcGGZueGKaUPkrgZ0EThIiTbKHy6nMYdL_gX5HqfH0lX5FjbFwuii99", //views.deliverInstallPlan.getScheduleOptions
            planWorkerCreate: "Zwh4sDdsrBxS-Ynr0YixqmzkwnXviWDXsb5sraypvY3_c-qUXvqWi-Q", //views.deliverInstallPlan.workerCreate
            drawDeliverPlanView: "MaVBRVA8i6nGNO1E4DJXRdQntV56lx83mipRvfLDM4JylHRa2TFnl_GDGHcFGQw",//views.deliverInstallPlan.drawDeliverPlanView
            getGoodsInfo: "s63zzGbwobXnHuwtY4cl19wJ.f3qVzfwYHEhlwleUsDtEnChYI7tyWW",//views.deliverInstallPlan.getGoodsInfo
            makeDeliverPlan: "RnsXPsi-xGQPL2fYbcRXXid-DTQ40Hk8PzMopsWNoJFgIjePpM7KQ2idX1z",//views.deliverInstallPlan.makeDeliverPlan
            getDeliverDispatchView: "9KE1_GqAqZ5OB94FsHLOAWhDqkDlhuqbnVxF91AuqxJ6WHF3paX-50W33hGAl9Ip5re",//views.deliverInstallPlan.getDeliverDispatchView
            uploadImgs: "9HRH9kAPO2CO836V8DXXO9jzwBI6SFLznQrIFQ64dCFmFaNYBw1",//views.deliverInstallPlan.uploadImgs
            validateDeliverPlan: "pHDu2UoK6kgK4vyA7n9-69Va64iNx5RjMjA0s0fxF2gqCti2Kl81391AMFxixZe",//views.deliverInstallPlan.validateDeliverPlan
        }
    },
    MEASURE: {
        ///biz/t8t-ps-pim/app
        name: 'o0PvBL5Yf5x2SZ3w3HLf8Wkcddzbr8r',
        methods: {
            queryItem: 'XbVsVfqReaHZjg6XzXAVAwINF30FcBkMW71gYWwfT-v',//views.measureOrderItem.query
            queryItemList: 'LUAEPRnMIEHG_MmCQG_vgHh0ksyrOMDXhMDzmfJHGfX3WCa',//views.measureOrderItem.queryList
            queryDetail: 'ivooTqS1dZZnO8Yd6NlKE3iJYo-tM3cbPrWJdoPOdq1',//views.measureOrder.queryDetail
            queryPage: 'AQ8H_igCAC8tLwh7KBn8TVDd3U27Za_vzN-sdPBmJjq',//views.measureOrder.queryPage

            verify: '9JcXD_r6hRK3BBJmz3lOFzSP4zU_VMbQIFTNyz1',//views.measureOrder.verify
            submitLine: '18MRBQhoaGstGJh6axx_SKvtBWk85gu-aWHpZBG7sWb',//views.measureOrder.submitLine
            submit: 'TFbGSX9MSLI2ULWFuRNJ9go482nrYrlKHoY8wf0',//views.measureOrder.submit
            createOrder: 'cruVsh1_QtfeIjiqU5sdWBxe2c2TqM2hJH6MTE2bKU3',//views.measureOrder.createOrder
            queryProject: 'HQcibtLtWP9ZU2ArRO6cD9SwBmECwS_BxTyCpnUj_NbU9-2',//views.measureOrder.queryProject

            queryProperty: 'XxxbXTEVmVQZtiuyi9jNEskSLsYw9vTbV_LUPU5VNP9p9eN',//views.measureOrder.queryProperty-列表页测量人类型
            processDetail: 'MiqneK67gZqIVmY4WzKE_hVLXfOW3zLXO1VIKgI4EvhE2-oM4DbbF8B', //views.measureOrder.queryProcessDetail
            getDetailByProcessId: 'pCEy7Sq5nek1p6_x6zuU-1liQmEoxlkZDliNDp1bVVzaUnK2Bh788Ds'//views.measureOrder.getDetailByProcessId
        }
    },
    COMPLAINT: {
        name: 'dzE3teKGaGZM_bDHorKK_IxT_YnNSaM',///biz/t8t-ps-csm/app
        methods: {
            //配置
            CUSTOMERDISTRIBUTIONCREATE: "_G63DYxX9b3UDZSS_9yMm6sfa9LOHB5yPuLdk.U-grFtp3G",//views.customerDistribution.create
            CUSTOMERDISTRIBUTIONQUERYLIST: "kCrAiNpEv-fPoyhDHfyMPL2do5yD75kht-28S03dcBwiCqi3tk7",//views.customerDistribution.queryList
            CUSTOMERDISTRIBUTIONSTATUSUPDATE: "2-EVUAPm3FN2XHPPnbZIJ2l4H8mLREA9Jtb8UkdOky_N2Hi2GzQLi3V38vy",//views.customerDistribution.status.update
            CUSTOMERDISTRIBUTIONUPDATE: "dpoWcsR2L-ZyQOH-zFdZ6Eda-zRrtVkbQac36-yfIBnbIQa",//views.customerDistribution.update
            CUSTOMERORDERQUERYLIST: "TedsUtXlrQDYrxi8Hk3jLTFUeYcStwppZN3UeozQBG4",//views.customerOrder.queryList
            CUSTOMERORDERSAVE: "qDC9-Ts51AvS74lXG3jpc5DpG4ChEQMhx4A",//views.customerOrder.save
            CUSTOMERORDERSTATUSUPDATE: "zoo1yNbaBZIqBuH9Enpcleph6ywMP0ubTFeX0j8vqXmbnm7",//views.customerOrder.status.update
            COMPLAINTUPGRADECREATE: "oVIcaRvFfJwwg-oXYLAMgs3O2bUf2VTFsF-MMSTtMiZ",//views.complaintUpgrade.create
            COMPLAINTUPGRADEQUERYLIST: "uG16wMzTocgO_sGI-6bF1nW6xNq0_1aUDr8mjWC2mCJsMjV",//views.complaintUpgrade.queryList
            COMPLAINTUPGRADEQUERYPAGE: "rDDD_RsJoRbH4SR940H9Cy1fJ2TGg00wTNp2axQ8jP-3U2a",//views.complaintUpgrade.queryPage
            COMPLAINTUPGRADESTATUSUPDATE: "mdaGrXEWykCDCmRN9lfLfA9MMHhpwJwlXyokSJ5meVlSd7xibdx",//views.complaintUpgrade.status.update
            COMPLAINTUPGRADEUPDATE: "5s6X909UKc_EEzOJnytrRQbsZf-iuhoiZQMkeX5yewG",//views.complaintUpgrade.update
            COMPLAINTOBJECTCREATE: "kcswXEXoi-HzUKYqWi4ez7J9UkEmhH-TwTqdP68hKH2",//views.complaintObject.create
            COMPLAINTOBJECTQUERYLIST: "bk3x7pw1bvWEN-yH_ftm6yRIf9XlOyZ3WLalDHMjHjxvWT-",//views.complaintObject.queryList
            COMPLAINTOBJECTSTATUSUPDATE: "0124g2ffDuM87zYzzrX44LiHctYpiKhmbHLqZjGdxQEtZUgwbqW",//views.complaintObject.status.update
            COMPLAINTOBJECTUPDATE: "xI48HJjU_KmB-v_E137t9iI1JgUrtzbfQpSCZZHA5Ui",//views.complaintObject.update
            COMPLAINTCONTENTQUERYLIST: "99xuMoEmJhUGGp5R79khZUnCG5qgw37LSOogyx8p0RAoAbN",//views.complaintContent.queryList
            COMPLAINTCONTENTQUERYPAGE: "YdxsTctF3R736hS4okPDvHCEkT_en0i8G2pdFc8Xf8Yl9K2",//views.complaintContent.queryPage
            COMPLAINTMANACREATE: "jqYX8TtTzMsywPHoRTEker6XJ3kOZ-XSbYUe9GK",//views.complaintMana.create
            COMPLAINTMANAQUERYLIST: "v825-asVpbfVyaVI85TglGpnZP7ygCC49Iy4YL_4eiW",//views.complaintMana.queryList
            COMPLAINTMANAQUERYPAGE: "ntZZo_XxO_0yghNml27OgE-aK55gd8nmNa2lKFVjBeH",//views.complaintMana.queryPage
            COMPLAINTMANAFINDBYID: "LFFISZkteIVsuMR8kT25Imiy2ojFzpW5FYZGaXoLtuf",//views.complaintMana.findById
            COMPLAINTMANASTATUSUPDATE: "chVWd1MccGx-vaI0dIW4zOG2uWSnhoYHHyfaHIcdWAfIIRj",//views.complaintMana.status.update
            COMPLAINTMANAUPDATE: "4UAO0fjYuejZJz0cg4A-UPBxuFApjLEs9M4Lxrm",//views.complaintMana.update
            COMPLAINTSTAFFQUERYLIST: "zsv72TnLgAJH3zbG9hocQKaBn61B12mhf8x8BTgujz6",//views.complaintStaff.queryList
            COMPLAINTSTAFFQUERYPAGE: "tI2JBWq81YZNPAXAC_ilbE2I1F4EmL_n3Jty2G1n4tH",//views.complaintStaff.queryPage
            COMPLAINTSORDERASSIGNTYPE: "VbcnU_CkeuGyiOq2ZiaDsRr_phO8L4DvK5k7advfvJuTILI",//views.complaintsOrder.assignType
            COMPLAINTSITEMQUERYPAGE: "90uypB5o44Pc65URAkp1aUq9yAjy-O12iCqHEa339zG",//views.complaintsItem.queryPage
            COMPLAINTSORDERCREATE: "AVFG6-lujImgP-qlPME.MbXLUeTHoKi7JvU9KzmPyjv",//views.complaintsOrder.create
            COMPLAINTSORDERFINDBYID: "HRebrYzykPezrHDZbXW_3eHEtztVsLpzcXUYOL_HSPP",//views.complaintsOrder.findById
            COMPLAINTSORDERFINDBYPROCESSID: "4BwEIsIaM44Fc54pAB72VP3TgBqUzSaFlF-1xj-xcN6Zc2qVtYD4Mcj",//views.complaintsOrder.findByProcessId
            COMPLAINTSORDERHANDUPGRADE: "VihxsxkT4Tt13jVroWQGsYwJBTNftCeroqgYsRWTVuUigGf",//views.complaintsOrder.handUpgrade
            COMPLAINTSORDERQUERYPAGE: "C6EGFLJ0_pgKhQvaUy_3fZwTeatumDfLoIt6Gae1sq74xoU",//views.complaintsOrder.queryPage
            COMPLAINTSORDERUPDATE: "odcsX0xE8T-0y2V9rrvTcx_TrEsT-jtTeepQAPtfIL3",//views.complaintsOrder.update
            UPDATEHANDLERANDVISTOR: "Z3zivzbR5eUUiZmj1ea50ds0O-VwmUCY5PXppdHuKER",//views.update.handlerAndVistor
            COMPLAINTSORDERPROTECT: "VNkMIg1XvRgkmZEaZWmV1sDzkdCv-r1O6vZgJhXxzIn",//views.complaintsOrder.protect
            COMPLAINTCONTENTFINDCONTENT: "zY3lqfBIkwt5B9zdJ1fGqPKh2CwueXDgGJ9xuNpkMT_dLX_1CVD",//views.complaintContent.findContent
            COMPLAINTSORDERSPECIFICNAME: "dlighNm6waiAecKvebClm0Yv5iI0X03q-wdUKqBFTlfOi1cHSCs",//views.complaintsOrder.specificName
            VISTORORHANDLEQUERY: "SrrWqh6_0TZvpjJyD3I9A9dc5-oe5akPhLrfcp1",//views.vistorOrHandle.query
            COMPLAINTSORDERPICTURE: "kxCsmRq0fQS0jAOL5wYzE7nREN7zkb5l8IwgRpL5xbL",//views.complaintsOrder.picture
            COMPLAINTORDERTEMPCREATE: "mwmslXpFV2c4Fyh57phM79d4QsLgQyfOayPO1V5PYO-aXIy",//views.complaintOrder.tempCreate
            COMPLAINTORDERTEMPUPDATE: "omi3azXCYyQ7ta_vZlF_T0rbhVWicuZZj-wTajvoSQ0Wi98",//views.complaintOrder.tempUpdate
            COMPLAINTORDERSUBMITCREATE: "ZURkKnHwIntue0gkZCU3w3BjIRJSKeNnWkJF.oz81FTEW-V",//views.complaintOrder.submitCreate
            COMPLAINTORDERSUBMITUPDATE: "kYVlR3SdM9vwmaJlfhZ-7FnJYZd3ijpYgeKjM7YccIWIXFl",//views.complaintOrder.submitUpdate
            COMPLAINTORDERAPPROVE: "WeQIhYiItRCu4rDBsYtXOltLiFfETHYQS_XXh0zR854",//views.complaintOrder.approve
            COMPLAINTORDERHANDLE: "cTupoOkNdJbjreczCgdWYqzA7MVGY3fH02uG1th",//views.complaintOrder.handle
            UPDATEVISTOR: "oE77mRX31vbyqvybumxi06KNn42rJpY",//views.update.vistor
            UPDATEHANDLER: "_ZMnYUqvhVQlI_IJY9dWDONEjM67g64",//views.update.handler
            COMPLAINTORDERGETPROCESSDETAILBYID: "umBst6Qoz2g7Tz4fM3hfR9u-RByzN2eMbQtif2hOeOj8u-5LNuxKlStAsXJ",//views.complaintOrder.getProcessDetailById
            COMPLAINTSFOLLOW: "oA_s6PiKjQHI70dQqjvSl_2MADzMN3N1B3f",//views.complaints.follow
            COMPLAINTSORDEREXPORTDETAIL: "8POPIRnMBQcbNiaR2wjuTFdndzhzbvlFDp4vtO3uwOGwwD2cepa",//views.complaintsOrder.exportDetail
        }
    },

    dst: {
        // /biz/t8t-sys-dst/app
        name: '8YrgUXxW9ssENMmHroANBk_k0XR7iov',
        methods: {
            // configCity.list.get
            city: 'nD6sOtmkmgGz1fT-JquoKDYjb5d__PQ',
        }
    },

    SYSDST: {
        name: "_msMOVtqD6K_iUnbKU-22nNlgRP32O1",///biz/t8t-sys-dst/app
        methods: {
            //城市获取
            CITYTREE: "2O671M7IF8ppyxoS4_oMw_u5I_g8d1H",//standardCity.tree.get
            pctreeGetConfig: "vhErxe1cvalLLHx7492ZUEz-ZLhasDcOoJg5MnIyBtEg4ZI" //localDistrict.pctree.get.config
        }
    },
    OPL: {
        name: "3eDfVL5cKE6pbwpPxyS3rcD8zYFDoy8",///biz/t8t-sys-opl/app
        methods: {
            queryPage: "kbLXOomJXhjkfRl"//queryPage
        }
    },
    PRSMDM: {
        name: 'iHN-g6Vkr5LBs_zXaIMr57sWSj0fAoP', // /biz/dsp-prs-mdm/app
        methods: {
            decorationOrderFindOrderById: '50GvsFZ73Sv8A2ClvnkiALpFHBnTiQXA2EmLCfZ6Btz9uYHfjuM', // views.decorationOrder.findOrderById
            decorationOrderQueryDetailPage: 'L-T_3jjdGeawOySyQ0dSdzSXMFdjEfjCwM0A45QozDMGw_Yr1y_07Xb', // views.decorationOrder.queryDetailPage
            decorationOrderQuerySheetPage: 'u757FIyS5vqn84wdxFDIXIAw4Taqs5DsOaK__tflZy6tt5h-6uG', // views.decorationOrder.querySheetPage
            decorationOrderQueryAccountByRole: '-aEENYph6h0IRMlmUM5FQPDci6jIT5azmHm08oD21uX6WFP63qnHUua2Dvz', // views.decorationOrder.queryAccountByRole
            decorationOrderFindSheetById: '9bgZJPrCm6nEaQarSR9saPQYhkN8NTsVQe-ICHR71aRo7ztIOxh', // views.decorationOrder.findSheetById
            decorationOrderExportSheet: 'w84q3AUIsOe6g-Bcq3cpCx3CMiOvFTvs9jZGnMzJ7g-sbv9', // views.decorationOrder.exportSheet
            visitRecordStanDingBookQueryPage: 'MXCV5T3ZIIrRXXfK2tyEJ6eNDAK4i8VMYJU5yZSDTsg3lhREC9qGy1G1wrz', // views.visitRecord.stangdingBookQueryPage
            decorationOrderQueryOrderPage: 'GlSkIz5uQ9LAAOZyEMZ8CgYaR8dVzVpCSwzUS01PyyjGW0MFWUc',//views.decorationOrder.queryOrderPage
        }
    },
    FIRVM: {
        name: 'IGjySajBrs6AQWWfcadRWq4fusdu4Bs', // /biz/t8t-fi-rvm/app
        methods: {
            receiptOrderQuery: 'AC1xq6FRp8mdP7qI00swKV52jDCwhIf', // receipt.order.query
            receiptOrderLeftJoinQuery: 'lJbKBK0Dj94XOJIAZLqTZZOL3lpEcPQ0Xb-GJUNuHR1', // receipt.order.left.join.query
        }
    },
    COMPANYALLOCATION: {
        name: "3OvR1cNjj7isVDwxOiFvf0Yl4HtvtFV",///biz/t8t-prs-ass/app
        methods: {
            COMPANYALLOCATIONVIEWSQUERYPAGE: "SJWdWPqBTRB2ZzPO6mjP6rhL-uVLM2i-sagRHaWDdCBVHHlT66EPYG0",//views.companyAllocation.viewsQueryPage
        }
    },
    ITEM_ASSIGN: {
        // /biz/t8t-prs-ass/app
        name: 'kQCHV35uKPnjuOphj9WgkM2-L8oUbgZ',
        methods: {
            // assignPrincipal.assignRecordPage
            LIST_ASSIGN_RECORD: 'rrooIscgCpdPui7SxxeZ_fBaFi558xrOst7FDHxZU130LmG',
            assignPrincipalQueryPage: 'MItg5HDMeH6mLNrHOqVPo3g8HyUKG5sHjnZ6tsz', // assignPrincipal.queryPage
        }
    },
    PSSET: {
        name: 'Yn3Jqti-HeZXR6fUL_wJUBM2G_cBTfQ', // /biz/t8t-ps-set/app
        methods: {
            settleConfigQueryPage: '2GR7KELwFyerZCva8o9MAkXE8KOfLcLBtue9vc_v3pr', // views.settleConfig.queryPage
            settleConfigSetStatus: 'iaoco9X0h8lXrR6orbjpIzNpcyRyTqjHEoMOKXAP7F0', // views.settleConfig.setStatus
            settleConfigListAsTree: 'uoj4rEK8c0V2fBbNG3Pi5K_bk41Yk_pa3TDxKjEcjlC', // views.settleConfig.listAsTree
            settleConfigCreate: 'yLFHzJdVFZmbGrGG20N2MfD-GH9d30b8nsd-lom', // views.settleConfig.create
            settleConfigUpdate: 'YOgKEc0VFe_aT6oP3ER8gkpBhKOwP8ZBwrqNHq0', // views.settleConfig.update
            settleConfigGetDetail: 'f5nDYnxKd8s3n0fK14DT5Qwson7e3r1eWRnhKYseTCT', // views.settleConfig.getDetail
            settleConfigItemQueryPage: '-FKcCTTsuhOkMV-3jUDttP4dTdH5EXJJaSOIyElVFiAQkK1', // views.settleConfigItem.queryPage
            settleBillQueryPage: 'IAQSLQ6aGg_gGyKB5t-QQAX1tmf2EBcI_tKFPwu', // views.settleBill.queryPage
            settleBillItemQueryPage: 'uNL3EbeSBH8VuYV4lITNh9Cq3b9oYTt-22u8L4l6-uM', // views.settleBillItem.queryPage
            settleBillFindDetailByProcessId: 'ijmsnOt9ih2oGne7jnFrqybJ7XQHtpD3I1NI4nhVsrQjouZKLSlDJR1', // views.settleBill.findDetailByProcessId
            settleBillPrint: 'SFDD9p18bLqCgQ6eW_aXhB6gXQOWSdGRtsz', // views.settleBill.print
            settleBillQueryProcessDetail: 'VfcdHg6AUZq-wHsuf4MT3NkU5xbGK7vS-9cBzHNCfF9QP7KO8t0', // views.settleBill.queryProcessDetail
            settleBillRemit: 'G0A9_GkkUKkua5we8oTLV1aTbGubXLgZmic', // views.settleBill.remit
            settleConfigListPkgTemps: 'SXXfUsDlDaLpR_VXXzqgjKYfteAdoQAtGETa9P3N5qhOq31', // views.settleConfig.listPkgTemps
            settleBillVerify: 'j-Jmqh6OF03lJvMFrn8qyCzD-6cZgBVa35S', // views.settleBill.verify
            settleConfigPkgTempList: '-YXDS8Y5N-VzgS0jTvBicPKESGjsUgN4T9aJJvrG2ul', // views.settleConfig.pkgTempList
            bankManageQueryPage: 'w0n305bFX9a9q09_cXVJv0n4mFemsTkz80gaavk', // views.bank.manage.queryPage
            bankManageQueryOne: 'knWrba2TdYqmGtY1KrsHVAoanasbeElcokNeYTv', // views.bank.manage.queryOne
            bankManageCreateOne: 'un24tQfzd6IAz46xbuuONyaHn-xK3Oqsaj-Z397', // views.bank.manage.createOne
            projectGetById: 'Wuvqn-CnjLPzUeuccpFwgMhhWMlKezr', // views.project.getById
            defaultBankQuery: 'EePQMLepJCvFDE_BZFe0IERTcD0wOFjX2Bs', // views.defaultBank.query
            bankManageSetOneDefault: 'pNlVifo6aVWFyXtpbVS9RYmRwNkBxD29iM2DujUbFrN09Cx', // views.bank.manage.setOneDefault
            supplyerQueryByProjectId: 'KETWQj7h8ryqQQyflKDmb6FGYIWYiSyhmHkV5WEV-nHxZzs', // views.supplyer.queryByProjectId
            compensationBillFindByProcInsId: '5-OTH9f0c6_vgqGIhBUHP0Qy_rY4OTDFvSS1CfPpWBoFUnL6EQd_v8b', // views.compensationBill.findByProcInsId
            compensationBillComplete: 'MsjXQo8zVz8qaYETcdmKjgUvhoBWqpYB2hZ0NjxLLE6XCzx', // views.compensationBill.complete
            compensationVoucherPicEdit: 'oCDE4PmGgV6cL21diLzPc_20cJtAV93V__zy4eAxJEB3lAM', // views.compensationVoucherPic.edit
            saveInstallQuota: 'ajNhEIZvKr6FwBcHCsjyNerZfNdTEu6XCleUN3J_QOgCAJqXTuuF4q8',//views.settle.installQuota.batchCreate
            invalidInstallQuota: 'idbyrEGmUtOAWN_faBzvzTtevoA9pJUPJtfg-zfoxeYRTzx',//views.settle.installQuota.invalid
            settleInstallBillQueryPage: '-FXJAlzBkAaMlLpSICdUa3P7p1EJ7nm-NiauIosQMqYGqoVOGkk', // views.settle.installBill.queryPage
            settleInstallBillFindDetailById: 'f02nw5PtwNmsGtKIkL74wqIT0dJwWxtaD8P9Ypwe5TSqZkjdVFZ1m1o', // views.settle.installBill.findDetailById
            settleInstallBillExport: 'cBY2hkr1bucHjEcBEhVkztszQvZVxCrkBrG5BRCaU8CZ_O-', // views.settle.installBill.export
            settleInstallBillExportItem: '2rs2u7kB16YOkbGpOs6eHh-iyfeEbemdZLzg7Z7ibW3kV24xpNE', // views.settle.installBill.exportItem
            settleInstallBillFindByProcessId: '_fHIV_nDgEUpOkA5nV_HWQVnZ0DL9j6NPhP-cJd8Xz7A4jiSoFYVnw8Pw0h', // views.settle.installBill.findByProcessId
            settleInstallBillVerify: 'bhjnLdm7bcxY1ZEBzTJWlsX1ThK1eCVZyoGp8HjMmjhcSAv', // views.settle.installBill.verify
            settleInstallBillPrintById: '3uxA0nBTK2nRxS8R7sqJysIkDs4lNNN1yPLWxIRmdT8cC8TgcLb', // views.settle.installBill.printById
            settleInstallBillApplyRemit: 'DQ57zc3UyOrN0PxFXQfNN-UGLn3AxXYysKD26wEDfXjo8rSF9mY', // views.settle.installBill.applyRemit
            settleBillExport: 'UVIcBrtm8Z1W_-SUj1eIjIKnAFQXMO83DSTYU4Z',//views.settleBillBase.export
            settleBillItemExport: 'jqmaS8LvP1a4M3iGMhVDmqyfFapeV1hYcl1bn5n',//views.settleBillItem.export
        }
    },
    SYSSTI: {
        name: 'q5R6V6Ank7j9N5lXg9y-id1Dp96xwzt', // /biz/t8t-sys-sti/app
        methods: {
            sensitvieInfoGetPhone: '22GBC4ZnLoCz95JY-Aqswx-yyWB9NWzl1gt8fJ9jcZg', // views.sensitvieInfo.getPhone
            sensitvieInfoGetPhoneOfUser: 'vIKI-dfT_ZnC7e2F95GZ307cHBwFeK8plvCXOOs1PI66uLvFjjm', // views.sensitvieInfo.getPhoneOfUser
        }
    },
    PSCSM: {
        name: 'CbwfGae90ZFB2mPvIiPqykwd7sY3l.3', // /biz/t8t-ps-csm/app
        methods: {
            callRecordGetByUuid: 'te2AAtZnQ6WVB54WMrI6GgCpdU37yzk-liSr4zi', // views.callRecord.getByUuid
            MAKECALL: 'm9CD55M-oD0sg23co55uMMJ'//views.makeCall
        }
    },
    BROADCAST: {
        name: "4i4AhI5ob6i4GFxcZEkDqOHBULzynRs",///biz/t8t-app-pam/app
        methods: {
            BROADCASTDURATIONCREATE: 'WfmhH24YTgTEaEE_RGlXRMtKIRcXD7kUxk_HF3kaVGeMi3xFAAtU7su',//views.broadcastDurationService.create
            BROADCASTDURATIONFINDBYID: 'HjidHe2VTkjIuOUMiVTIeOENMc_B4kY14JXSXIzWR3iIeDQFNM_dTbi',//views.broadcastDurationService.findById
            BROADCASTDURATIONQUERYPAGE: 'UaaaYeBnvIVN_VSKMd-UDrF8Kt_MKmBsfNNSDcXMEZAcAcOQGNfKs_bUKm9',//views.broadcastDurationService.queryPage
            BROADCASTDURATIONUPDATESTATUS: "HE_BHhoWHRjcDvtRZBG5evhxcC6z5YFQm-yz3fJC3DlD_a1u0ezC4N0F6kIalea",//views.broadcastDurationService.updateStatus
            BROADCASTDURATIONITEMCREATE: "ZgPnMpxJaFYU0qDD-fETNwLxXhSU9pIh00KzRZQ2RsHboUdW-5QHhAOKCA8",//views.broadcastDurationItemService.create
            BROADCASTDURATIONITEMUPDATE: "WRPlHuKpWpiDuYO7QQCFt8xVcPVMnWw4_JVwCl_uOdfHmPaXN3wWFRZHzMr",//views.broadcastDurationItemService.update
            BROADCASTDURATIONITEMFINDBYID: "ozE9mBUM0GTK3ub-4xgX_bemt7ifvF6AUo1QwGdAg_8-uthwVFkxY8aC-USjLNf",//views.broadcastDurationItemService.findById
            BROADCASTDURATIONITEMFINDBYDURATIONID: "1U__IenHzNkKFDqNx_F1M_hvd_yqEBRU2Kf_GCetg3AQK0rUM1xmRpRR-yFv373xMlK0_L_",//views.broadcastDurationItemService.findByDurationId
            BROADCASTDURATIONITEMQUERYPAGE: "VTQeGvKbGi1nRONjrRAJs-yHObQV-XWixCVCVm9yNfIfWObX_nsJOOqaV6KVuBr",//views.broadcastDurationItemService.queryPage
            BROADCASTDURATIONITEMDELETEBYIDS: "ViQkHwLoEgDZFAShXFAFsNyUcRWLVUwhj2QHHTa9uNuIlPcYMldTAePeECrWMhPba5_",//views.broadcastDurationItemService.deleteByIds
            GETBROADCASTRECORDINFOFORPC: "dqXYe4KeHX52IXQWdYM0YYIkc15TEmcielYoaR5rLKSrD4aWsRJN9ibqWrTYWRhPnSHLVJfYW-xHJN_",//views.broadcastRecordService.getBroadcastRecordInfoForPC
            GETCALENDARBYPROJECTIDFORSHARE: "gkjiekjQeEo5uYXCSFW63SkSkH75QVmUyeXUQpY_8lX-USvcGdmLlRiNT24BKHtXnBnNwmUQm-jDjgOfkS9",//views.broadcastRecordService.getCalendarByProjectIdForShare
            GETCALENDARBYPROJECTID: "NaaD6quMGWqOICtzEIKukIbzAOZnSDX0iJIGTMzpbO1u26B0fU8FBNO-F5s139k4DIF7yUF",//views.broadcastRecordService.getCalendarByProjectId
            QUERYBROADCASTRECORDPROJECTINFOFORPC: "cIoqpP3-vDbkFddHBThbJ6zWrZVbpKnRyD3OojmL_4ziaHyQVMvXkKVa0IlKELqco9kaI-uJ7anW6D2aoezDmvzXBIu",//views.broadcastRecordService.queryBroadcastRecordProjectInfoForPC
            QUERYPAGE: 'qhtcquTuUkNcB3iMYrdbEBbdaZS__ZAfN_PeFR-Y9SuQV23'//views.broadcastRecord.queryPage
        }
    }
};

export default Services
