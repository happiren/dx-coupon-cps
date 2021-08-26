
import utils from '@/common/utils.js'

/**
 * 点击跳转
 * @param action
 * @param actionParam
 */
function clickNavigate(action, actionParam) {
    if (action == 0) {
        return;
    } else if (action == -1) { //测试使用
        utils.navigateTo("/pages/index/projectjoin/projectjoin?projectId=" + actionParam);
        return;
    } else if (action == 1) { //打开链接
        utils.navigateTo("/pages/webview/webview/webview?url=" + actionParam);
        return;
    } else if (action == 2) { //打开文章
        utils.navigateTo("/pages/webview/webview/webview?url=" + actionParam);
        return;
    } else if (action == 3) { //审批操作
        var params = JSON.parse(actionParam);
        var param = {
            "projectId": params.projectId,
            "approvalId": params.approvalId
        }
        utils.navigateTo("/pages/project/approval/detail" + utils.queryParams(param));
        return;
    }

}


module.exports = {
    clickNavigate: clickNavigate  //导出
}
