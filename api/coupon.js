import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
export default {
    /***************************************************** 首页 start *******************************************/
    /**
     * 饿了么优惠券
     * @returns {*}
     */
    eleCoupon(){
        return http.get("/api/coupon/eleCoupon")
    },

    meituanCoupon(){
        return http.get("/api/coupon/meituanCoupon")
    },


    /***************************************************** 首页 end *********************************************/
}
