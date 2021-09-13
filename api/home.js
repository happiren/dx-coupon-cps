import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
export default {
    /***************************************************** 首页 start *******************************************/
    /**
     * 获取小程序banner
     * @returns {*}
     */
    getBanner(){
        return http.get("/api/home/banner/miniapp")
    },

    /**
     * 获取首页导航
     * @returns {*}
     */
    getNavigation(){
        return http.get("/api/home/navigation/miniapp")
    },

    /**
     * 获取转链
     * @param id
     * @returns {*}
     */
    getNavigationConvertUrl(navigationId){
        return http.get("/api/common/navigation/convert", {
            navigationId: navigationId,
        })
    },

    getCouponCard(){
        return http.get("/api/home/coupon/miniapp")
    },



    /***************************************************** 首页 end *********************************************/
}
