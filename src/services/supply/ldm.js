/**
 * Created by moomove.deng on 2017/05/17.
 * 运输管理相关配置
 */
let Services = {

    //异常管理
    EXCEPTION: {
        // /biz/t8t-scm-ldm/app
        name: 'MGNrtiPs2lemDxIkO_em1lrW_wcZClX',
        methods: {
            //异常管理列表 views.exceptionList.queryPage
            LIST: 'NqoWikJbGFdhIEChdIfYBeXJW4K_meLSQThLWuPb6EE',
            //异常管理创建 views.exception.create
            CREATE: 'OWWYMo94ONLXGM64oP2ff7XAhKHloNeoGjz',
            //异常管理修改 views.exception.update
            UPDATE: 'mE9w149VKkwq4xzeLyeZ3p_goIfPh_FyZVY',
            //异常管理详情 views.exception.findById
            FINDBYID: 'lt9u3QoH323931L-yxb2S_-iD0Cqg93qw_C',
            //异常管理详情-任务单 views.exceptionDetail.queryPage
            FINDDETAILBYID: '3Gw95ErN4i_FvxxfQihGIxRLtQl1ELWFRNz1XlBfPfHkocN',
            //异常管理详情-附件 views.exceptionFile.queryPage
            FINDFILEBYID: 'cpnTh2KzedengcXwzaLFstUoTwYQ-2jTS1eEAhIlTbD',
            //异常管理导出 views.exceptionList.queryExport
            QUERYEXPORT: 'dhTeXjMrXReObRB1WEpuO0etJC2vXTA0YUW0oKy9tqL536s',
            //异常管理关闭异常 views.exception.close
            CLOSE: 'FKN3wdtD83CYGv8UU7o4mWvOf_BYiwI',
            //运单详情 views.exception.proxyOrderData
            FINDBYNO: 'SHeJWtxg74CV9O37klOL8xjsglrRcTb0Y7IQ661-LGC',
            //获取任务单费用 views.trans.proxyOrder.calculateExpense
            CALCULATEEXPENSE: 'faZoO57heKs9Sdo7iPIMxS7oAeVEmfWqlZFlWeZzVR5JGpHN6CoPYPm',
        }
    },

}

export default Services

