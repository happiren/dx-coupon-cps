import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
export default {
    /***************************************************** 消息相关 start *******************************************/
    /**
     * 获取系统消息聊天对话
     * @returns {*}
     */
    getSysMessageChat(){
        return http.get("/api/v2/message/system/chat")
    },

    /**
     * 清空用户系统消息数
     * @returns {*}
     */
    clearSysMessageChat(){
        return http.post("/api/v2/message/system/clearChat")
    },

    /**
     * 获取系统消息
     * @param publishedAt
     * @param page
     * @returns {*}
     */
    getSysMessageList(page=1){
        return http.get("/api/v2/message/system/list", {
            page:page
        })
    }

    /***************************************************** 消息相关 end *********************************************/
}
