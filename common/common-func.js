
import utils from '@/common/utils.js'
import store from '@/store';
/**
 * 点击跳转
 * @param action
 * @param actionParam
 * @param extra appid等
 */
function clickNavigate(action, actionParam, extra = null) {

    if (action == 0) {
        return;
    } else if (action == -1) { //测试使用
        utils.navigateTo("/pages/index/projectjoin/projectjoin?projectId=" + actionParam);
        return;
    } else if (action == 1) { //打开链接
        if (extra) { //如果有指定则直接跳转H5
            //#ifdef H5
            utils.navigateTo(actionParam);
            //#endif
        } else {
            utils.navigateTo("/pages/webview/webview/webview?url=" + actionParam);
        }
        return;
    } else if (action == 2) { //打开应用内页面
        if (actionParam && (actionParam.startsWith("/pages/index/index") || actionParam.startsWith("/pages/meituan/meituan") || actionParam.startsWith("/pages/ele/ele") || actionParam.startsWith("/pages/user/mine/mine"))) {
            let index = utils.getQueryValue(actionParam, "index");
            if (index) {
                console.log("store", store);
                store.commit('tabParam', index);
            } else {
                store.commit('tabParam', "");
            }
            utils.switchTab(actionParam);
        } else {
            utils.navigateTo(actionParam);
        }
        return;
    } else if (action == 3) { //打开小程序
        utils.navigateToMiniProgram(extra, actionParam);
        return;
    }
}


module.exports = {
    clickNavigate: clickNavigate  //导出
}
