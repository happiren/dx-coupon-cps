import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
export default {
    /***************************************************** 首页 start *******************************************/

    /**
     * 搜索
     * @returns {*}
     */
    search(q){
        return http.get("/api/tbk/search", {
            q:q
        })
    },

    getItemInfo(itemId){
        return http.get("/api/tbk/getItemInfo", {
            itemId:itemId
        })
    },


    getTaoCode(url){
        return http.post("/api/tbk/getTaoCode", {
            url:url
        })
    },


    /***************************************************** 首页 end *********************************************/
}
