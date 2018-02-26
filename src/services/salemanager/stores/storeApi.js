/**
 * File: storeApi.js
 * Comment:
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/19
 * Time: 16:29
 */
import Service from './Service.js'
import http from 'src/utils/http.js'

export default {
    SPECIALSERVICE: {
        update(args) {
            return http.fetch(
                Service.SPECIALSERVICE.UPDATE,
                args
            )
        },
        create(args) {
            return http.fetch(
                Service.SPECIALSERVICE.CREATE,
                args
            )
        },
        deleteById(args) {
            return http.fetch(
                Service.SPECIALSERVICE.DELETEBYID,
                args
            )
        },
        cancelRecomend(args) {
            return http.fetch(
                Service.SPECIALSERVICE.CANCELRECOMEND,
                args
            )
        },
        queryPage(args) {
            return http.fetch(
                Service.SPECIALSERVICE.QUERYPAGE,
                args
            )
        },
        setRecommend(args) {
            return http.fetch(
                Service.SPECIALSERVICE.SETRECOMMEND,
                args
            )
        }
    },
    PROMOTION: {
        create(args) {
            return http.fetch(
                Service.PROMOTION.PROMOTIONCREATE,
                args
            )
        },
        update(args) {
            return http.fetch(
                Service.PROMOTION.PROMOTIONUPDATE,
                args
            )
        },
        delete(args) {
            return http.fetch(
                Service.PROMOTION.PROMOTIONDELETE,
                args
            )
        },
        setShow(args) {
            return http.fetch(
                Service.PROMOTION.PROMOTIONSETSHOW,
                args
            )
        },
        queryPage(args) {
            return http.fetch(
                Service.PROMOTION.PROMOTIONQUERYPAGE,
                args
            )
        }
    },
    DISCOUNTS: {
        create(args) {
            return http.fetch(
                Service.PROMOTION.DISCOUNTSCREATE,
                args
            )
        },
        update(args) {
            return http.fetch(
                Service.PROMOTION.DISCOUNTSUPDATE,
                args
            )
        },
        delete(args) {
            return http.fetch(
                Service.PROMOTION.DISCOUNTSDELETE,
                args
            )
        },
        setShow(args) {
            return http.fetch(
                Service.PROMOTION.DISCOUNTSSETSHOW,
                args
            )
        },
        queryPage(args) {
            return http.fetch(
                Service.PROMOTION.DISCOUNTSQUERYPAGE,
                args
            )
        }
    },
    OWNERAPPOINTMENT: {
        queryPage(args) {
            return http.fetch(
                Service.OWNERAPPOINTMENT.QUERYPAGE,
                args
            )
        },
        queryDetail(args) {
            return http.fetch(
                Service.OWNERAPPOINTMENT.DETAIL,
                args
            )
        },
        getPhone(args) {
            return http.fetch(
                Service.OWNERAPPOINTMENT.GETPHONE,
                args
            )
        }
    },
    BANNER: {
        query(args) {
            return http.fetch(
                Service.BANNER.QUERY,
                args
            )
        },
        create(args) {
            return http.fetch(
                Service.BANNER.CREATE,
                args
            )
        },
        update(args) {
            return http.fetch(
                Service.BANNER.UPDATE,
                args
            )
        },
        delete(args) {
            return http.fetch(
                Service.BANNER.DELETE,
                args
            )
        }
    }
}
