import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
export default {
    /***************************************************** 首页 start *******************************************/

    /**
     * 获取文章分类
     * @returns {*}
     */
    getArticleCats(){
        return http.get("/api/v2/common/article/category", {
        })
    },

    /**
     * 获取文章列表
     * @param type 1:首页内容 0：其他全部
     * @param catId 分类ID, 0为全部
     * @param order 排序， 1：时间倒序， 2：热度倒序
     * @param page
     * @returns {*}
     */
    getArticleList(type, catId, order, page=1){
        return http.get("/api/v2/common/article/list", {
            type:type,
            catId:catId,
            order:order,
            page:page
        })
    },

    /**
     * 获取文章详情
     * @param articleId
     * @returns {*}
     */
    getArticleDetail(articleId){
        return http.get("/api/v2/common/article/detail", {
            articleId:articleId
        })
    },

    /**
     * 收藏文章
     * @param articleId
     * @param status 1：收藏 0：取消收藏
     * @returns {*}
     */
    articleCollect(articleId, status){
        return http.post("/api/v2/common/article/collect", {
            articleId:articleId,
            status:status,
        })
    },

    /**
     * 添加文章分享数
     * @param articleId
     * @returns {Promise<unknown>}
     */
    incShareNum(articleId){
        return http.post("/api/v2/common/article/incShareNum", {
            articleId:articleId,
        })
    },


    /***************************************************** 首页 end *********************************************/
}
