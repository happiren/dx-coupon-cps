<template>

    <view>
        <view class="dx-flex-center" v-if="loading">
            <u-loading :show="true" mode="flower" size="50"></u-loading>
        </view>
        <view v-else="loading">
            <view class="wrap">
                <u-swiper :list="bannerList" @click="onBannerClick"></u-swiper>
            </view>
            <view class="info-title" @click="goArticleList()">
                <view class="title">
                    资讯热点
                </view>
                <view class="more">
                    更多
                </view>
            </view>
        


            <view class="articles">
               <view v-for="(item, index) in articleList" :key="index" class="article" @click="onArticleClick(item)">
                   <view class="square-cover" v-if="item.cover_type == 1">
                       <view class="left">
                           <view class="title u-line-2">{{item.title}}</view>
                           <view class="square-tail">
                               <view class="square-left">
                                   <dx-tag :text="item.cat_name" type="primary" font-size="20rpx" padding="12rpx 22rpx" border="none"/>
                                   <view class="time">{{item.publishStr}}</view>
                               </view>
                               <view class="square-right">
                                   <view class="line">
                                       <u-icon name="eye" size="30"></u-icon>
                                       <text style="margin-left: 8rpx; line-height: 37rpx">{{item.view_num}}</text>
                                   </view>
                                   <view class="line">
                                       <u-icon name="heart" size="30"></u-icon>
                                       <text style="margin-left: 8rpx; line-height: 37rpx">{{item.collect_num}}</text>
                                   </view>
                               </view>
                           </view>
                       </view>
                       <view class="right">
                           <u-image :src="item.image" width="100%" height="200rpx" border-radius="8"></u-image>
                       </view>
                   </view>
                   <view class="rect-cover" v-else-if="item.cover_type == 2">
                       <view v-if="item.image">
                           <u-image :src="item.image" mode="widthFix" border-radius="8"></u-image>
                       </view>
                       <view class="title u-line-2">{{item.title}}</view>

                   </view>
                   <view class="no-cover" v-else-if="item.cover_type == 0">
                       <view class="title u-line-2">{{item.title}}</view>
                   </view>
                   <view class="tail" v-if="item.cover_type != 1">
                       <view class="left">
                           <dx-tag :text="item.cat_name" type="primary" font-size="20rpx" padding="12rpx 22rpx" border="none"/>
                           <view class="time">{{item.publishStr}}</view>
                       </view>
                       <view class="right">
                           <view class="line">
                               <u-icon name="eye" size="30"></u-icon>
                               <text style="margin-left: 8rpx; line-height: 37rpx">{{item.view_num}}</text>
                           </view>
                           <view class="line">
                               <u-icon name="heart" size="30"></u-icon>
                               <text style="margin-left: 8rpx; line-height: 37rpx">{{item.collect_num}}</text>
                           </view>
                       </view>
                   </view>

               </view>
            </view>
            <view v-if="noMoreFlag" style="margin-top: 16rpx; padding-bottom: 32rpx" @click="goArticleList()">
                <u-divider half-width="200" bgColor="#F8F8F8" color="#2979FF">查看更多</u-divider>
            </view>
        </view>
    </view>
</template>

<script>
    import auth from '@/common/auth.js'
    import utils from '@/common/utils.js'
    import commonFun from '@/common/common-func.js'
    import api from '@/common/api-util.js'
    import log from '@/common/log-util.js'
    import UImage from "../../uview-ui/components/u-image/u-image";
    import UGap from "../../uview-ui/components/u-gap/u-gap";

    import aes from '@/common/aes.js'
    import DxTag from "../../components/dx-tag/dx-tag";
    export default {
        components: {DxTag, UGap, UImage},
        data() {
            return {
				loading:true,
                timer: null,    //定时器
                showOfficialAccount:true,
                bannerList: [],
                articleList: [],
                noMoreFlag: false,
            }
        },
        onPullDownRefresh() {
            log.debug("onPullDownRefresh")
            this.page = 1;
            this.articleList = [];
            this.noMoreFlag = false;
            this.getArticle();
            uni.stopPullDownRefresh();
        },
        onReachBottom() {
            // this.getArticle();
        },
        onLoad() {
            let that = this;
            var word = "hello";

            setTimeout(function(){
                that.loading = false;
            },500 );

            var enctyData = aes.encrypt(word);
            var decodeData = aes.decrypt(enctyData);
            // var enctyData = this.encrypt(key, iv, "hello" );
            // var decodeData = this.decrypt(enctyData, key);
            console.log(enctyData)
            console.log(decodeData)
            utils.timeFormat("2021-01-11T08:40:54","hh:MM")
            api.home.getBanner().then(res => {
            	this.loading = false;
                if (res.code = api.SUCCESS) {
                    this.bannerList = res.data;
                }
            })

            //#ifdef MP-WEIXIN
            api.common.officialAccountSwitch().then(res => {
                if (res.code == api.SUCCESS && res.data == 1) {
                    log.debug("officialAccountSwitch true")
                    this.showOfficialAccount = true;
                }
            })
            //#endif
            this.getArticle();

        },
        onUnload:function(){
            if(this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        onShow(){

        },
        methods: {

            async onShareAppMessage(res) {
                log.debug("onShareAppMessage")
                log.debug(res)

                let coverImage = await api.common.miniappShareCover();
                log.debug("coverImage", coverImage);

                return {
                    title: "携筑项目管理",
                    path: "pages/index/index" ,
                    imageUrl: coverImage
                }
            },



            //封装加密
            //  encrypt(word, key) {
            //     var encrypted = aes.CryptoJS.AES.encrypt(word, key, {
            //         mode: aes.CryptoJS.mode.ECB,
            //         padding:aes.CryptoJS.pad.Pkcs7 });
            //     return encrypted.ciphertext.toString();
            // },

            encrypt(key, iv, data)
            {
                key = aes.enc.Utf8.parse(key);
                iv = aes.enc.Utf8.parse(iv);
                data = aes.enc.Utf8.parse(data);
                var option = {
                    iv: iv,
                    mode: aes.mode.CBC,
                    padding: aes.pad.Pkcs7
                };
                return aes.AES.encrypt(data, key, option).toString();
            },
            //封装解密
             decrypt(word, key) {
                var encryptedHexStr = aes.CryptoJS.format.Hex.parse(word);
                var decrypt = aes.CryptoJS.AES.decrypt(encryptedHexStr, key, {
                    mode: aes.CryptoJS.mode.ECB,
                    padding: aes.CryptoJS.pad.Pkcs7
                });
                return aes.CryptoJS.enc.Utf8.stringify(decrypt);
            },
            goArticleList(){
                utils.navigateTo("/pages/common/article/list")
            },
            getArticle() {
                if (this.noMoreFlag == true) {
                    return;
                }

				api.article.getArticleList(1, 0, 1, this.page).then(res => {
				    if (res.code == api.SUCCESS) {
				        if (res.data.length == 0) {
                            this.noMoreFlag = true;
                        }
                        this.noMoreFlag = true; //获取一次后强制提示没有跟过
                        for(var i=0; i<res.data.length; i++) {
                            var article = res.data[i];
                            article.publishStr = utils.formatMonthDate(article.publish_at);
                            article.view_num = utils.formatNumber(article.view_num);
                            article.collect_num = utils.formatNumber(article.collect_num);
                            this.articleList.push(article);
                        }
                        this.page = this.page + 1;
                    }

				})
            },
            onBannerClick(index) {
                var banner = this.bannerList[index];
                log.debug(banner);
                commonFun.clickNavigate(banner.action, banner.action_param)
                if (banner.action == 5){
                    utils.navigateTo("/pages/index/projectjoin/projectjoin?scene=" + banner.action_param)
                }
            },
            onArticleClick(article){
                log.debug(article);
                var param = {
                    articleId:article.id,
                    url:article.url
                }
                utils.navigateTo("/pages/common/article/article" + utils.queryParams(param));
            }

        }
    }
</script>

<style lang="scss" >
    page{
        background-color: #F8F8F8;
    }

    .wrap{
        margin: 24rpx 20rpx;
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    /*.title{*/
    /*    font-size: 16px;*/
    /*    font-weight: 600;*/
    /*    color: #606266;*/
    /*    line-height: 1.7;*/
    /*}*/

    .info-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 50rpx 20rpx 25rpx 20rpx;
        font-size: 34rpx;
        line-height: 48rpx;
        .title{
            color: #3D3D3D;
            font-weight: 600;
        }
        .more{
            margin-right: 15rpx;
            color: #929292;
        }
    }

    .article{
        position: relative;
        overflow: hidden;
        font-size: 28rpx;
        background-color: #ffffff;
        box-sizing: border-box;
        /*border: solid 1px #E1E1E1;*/
        margin: 24rpx 20rpx;
        border-radius: 16rpx;
        padding-bottom: 24rpx;

        .rect-cover{
            .title{
                margin: 24rpx 30rpx 0 30rpx;
                font-weight: 600;
                font-size: 32rpx;
                line-height: 45rpx;
            }
        }

        .square-cover{
            display: flex;
            justify-content: space-between;


            .left{
                margin: 37rpx 32rpx 0rpx 34rpx;
                /*margin: 70rpx 0rpx 32rpx 34rpx;*/
                font-weight: 600;
                font-size: 32rpx;
                width: 420rpx;

                display: flex;
                align-items: flex-start;
                flex-direction: column;
                justify-content: space-between;
                .title{
                    font-weight: 600;
                    font-size: 32rpx;
                    line-height: 45rpx;
                }

                .square-tail{
                    line-height: 45rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 76rpx 32rpx 0 0rpx;
                    .square-left{
                        display: flex;
                        align-items: center;
                        .time{
                            margin-left: 12rpx;
                            font-size: 26rpx;
                            color: #9A9A9A;
                            line-height: 37rpx;
                        }
                    }
                    .square-right{
                        display: flex;
                        align-items: center;
                        font-size: 26rpx;
                        line-height: 37rpx;
                        color: #9A9A9A;
                        .line{
                            margin-left: 20rpx;
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
            .right{
                flex-shrink: 0;
                flex-basis: 200rpx;
                margin-right: 28rpx;
                margin-top: 35rpx;
            }
        }

        .no-cover{
            .title{
                margin: 37rpx 49rpx 75rpx 34rpx;
                font-weight: 600;
                font-size: 32rpx;
                line-height: 45rpx;
            }
        }

        .tail{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 34rpx 45rpx 0 30rpx;

            .left{
                display: flex;
                align-items: center;
                .time{
                    margin-left: 12rpx;
                    font-size: 26rpx;
                    color: #9A9A9A;
                    line-height: 37rpx;
                }
            }
            .right{
                display: flex;
                align-items: center;
                font-size: 26rpx;
                line-height: 37rpx;
                color: #9A9A9A;
                .line{
                    margin-left: 20rpx;
                    display: flex;
                    align-items: center;
                }
            }
        }

    }





</style>
