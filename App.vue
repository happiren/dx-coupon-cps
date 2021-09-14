<script>
    import auth from '@/common/auth.js'
    import api from '@/common/api-util.js'
    import config from '@/config/config.js'
    import utils from "./common/utils";
    import store from '@/store';

	export default {
		 onLaunch: function() {
             uni.hideTabBar()
		     console.log('App Launch')
             // #ifdef MP-WEIXIN
             const accountInfo = wx.getAccountInfoSync();
             store.commit('version', accountInfo.miniProgram.version);// 小程序 版本号
             // #endif

             this.userInit();





             //#ifdef APP-PLUS
             this.checkArguments();
             plus.globalEvent.addEventListener('newintent', (e)=>{
                 this.checkArguments(); // 检测启动参数
             });
             //#endif
		},



		onShow: async function() {
			console.log('App Show')
            //#ifndef H5
            //从磁盘获取token到store，避免内存中的数据被清空
            await auth.setStoreToken();
            //#endif


		},
		onHide: function() {
			console.log('App Hide')
		},
        methods:{
            async userInit() {
                await auth.setStoreToken();
                auth.getUserInfo();
                api.user.addEntryLog(0);
            },
            checkArguments(){
                console.error("checkArgument");
                //参数为intent传递过来的数据以 json格式
                var cmd = JSON.parse(plus.runtime.arguments);
                if (cmd) {
                    var page = cmd.page;
                    var tab = cmd.tab;
                    if (page) {
                        if (tab) {
                            utils.switchTab(page)
                        } else {
                            utils.navigateTo(page)
                        }
                    }
                }



                console.log('plus.runtime.arguments: ' + plus.runtime.arguments);
            }
        }

    }

</script>

<style lang="scss">

    @import "common/iconfont.css";

	/*每个页面公共css 只适用colorui的icon*/
	/*@import 'colorui/main.css';*/
	@import 'colorui/icon.css';

	/*每个页面公共css */
    @import "uview-ui/index.scss";
    /*@import "thridui/weui/weui.min.css";*/
    @import "thridui/dxui/dxui.css";


</style>
