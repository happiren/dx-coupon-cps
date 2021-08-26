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
        return http.get("/api/v2/home/banner/miniapp")
    },


    /***************************************************** 首页 end *********************************************/
}
