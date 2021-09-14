<template>

    <view>
        <view class="dx-flex-center" v-if="loading">
            <u-loading :show="true" mode="flower" size="50"></u-loading>
        </view>
        <view v-else="loading">
            <view class="wrap">
                <view class="banner">
                    <u-swiper :list="bannerList" @click="onBannerClick"></u-swiper>
                </view>
            </view>

            <swiper class="swiper" style="height: 370rpx;" v-if="navList.length > 1" :autoplay="false" :vertical="false" :interval="4000"
                    :circular="true" :indicator-dots="navList.length > 0" indicator-color="rgba(0, 0, 0, 0.1)" indicator-active-color="rgba(0, 0, 0, 0.2)"
                    >
                <swiper-item v-for="(list, listIndex) in navList"  :key="listIndex">
                        <u-grid :col="5" :border="false">
                            <u-grid-item class="nav" v-for="(item, index) in list" :custom-style="{padding: '40rpx 0 0 0'}" @click="navClick(item)" :key="index">
                                <u-icon class="icon" :name="item.image"  :size="80"></u-icon>
                                <view class="text" >{{item.title}}</view>
                            </u-grid-item>
                        </u-grid>
                </swiper-item>
            </swiper>
            <view class="swiper"  v-else="navList.length > 1">
                <u-grid :col="5" :border="false">
                    <u-grid-item class="nav" v-for="(item, index) in navList[0]" :custom-style="{padding: '40rpx 0 0 0'}" @click="navClick(item)">
                        <u-icon class="icon" :name="item.image" :size="80"></u-icon>
                        <view class="text">{{item.title}}</view>
                    </u-grid-item>
                </u-grid>
                <u-gap height="40"></u-gap>
            </view>

<!--            <view style="margin: 0 20rpx;">-->
<!--                <DxCoupon  theme="#FFF" color="#33333">-->
<!--                    <image src="/static/temp/14-34-15.png" style="width: 50px; height: 50px; top:-20rpx; left:-20rpx"></image>-->
<!--                    <view style="line-height: 1.7">-->
<!--                        <view>饿了么天天抢红包</view>-->
<!--                        <view>有效期：2</view>-->
<!--                    </view>-->
<!--                    <view slot="right">-->
<!--                        hello-->
<!--                    </view>-->
<!--                </DxCoupon>-->
<!--            </view>-->
            <view style="margin: 0 20rpx">

                <view v-for="(item, index) in couponCards" :key="index" @click="couponCardClick(item)">
                    <DxCouponCard  :coupon="item" color="#000" theme="#FFF">
                    </DxCouponCard>
                </view>



<!--                <view class="coupon-item" :style="{backgroundColor: '#FFF', color:'#000'}">-->
<!--                    <image src="/static/temp/14-34-15.png" style="position: absolute; width: 50px; height: 50px;  left:0rpx"></image>-->
<!--                    <view class="coupon-left">-->
<!--                        <view style="line-height: 1.7; margin: 10rpx 50rpx">-->
<!--                            <view class="title">饿了么天天抢红包</view>-->
<!--                            <view style="color: #FF304D; line-height: 1.2;">-->
<!--                                <text style="font-size: 50rpx">66</text><text style="margin: 0 8rpx">元</text><text style="background-color:#FFEBE3; color: #fa5151; padding: 0 8rpx">今日仅剩156个</text>-->
<!--                            </view>-->
<!--                        </view>-->
<!--                    </view>-->
<!--                    <view class="coupon-right">-->
<!--                            <dx-tag style="margin-left: 30rpx" color="#fff" text="免费领取" shape="circle" bg-color="#FF5C74" border-color="#FF5C74" padding="18rpx 30rpx"></dx-tag>-->
<!--                    </view>-->
<!--                </view>-->
            </view>





            <view class="info-title" @click="goArticleList()">
                <view class="title">
                    资讯
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
        <dx-tabbar v-model="tabBarIndex" @change="tabBarChange"></dx-tabbar>
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
    import DxCoupon from '@/components/dx-coupon/dx-coupon';
    import DxCouponCard from '@/components/dx-coupon-card/dx-coupon-card';
    import aes from '@/common/aes.js'
    import DxTag from "../../components/dx-tag/dx-tag";
    import UTag from "../../uview-ui/components/u-tag/u-tag";
    export default {
        components: {UTag, DxTag, UGap, UImage, DxCouponCard},
        data() {
            return {
                tabBarIndex: 2,
                loading:true,
                timer: null,    //定时器
                showOfficialAccount:true,
                bannerList: [],
                navList:[],
                articleList: [],
                couponCards:[],
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
            // uni.hideTabBar();
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
            api.home.getNavigation().then(res => {
                if (res.code = api.SUCCESS) {
                    this.navList = [];
                    for(let i=0; i<res.data.length / 10; i++) {
                        let end = (i + 1) * 10;
                        end = end <= res.data.length ? end : res.data.length;
                        let nav = [];
                        for (let j=i*10; j<end; j++) {
                            nav.push(res.data[j]);
                        }
                        this.navList.push(nav);
                    }
                }
            })
            api.home.getCouponCard().then(res => {
                if (res.code == api.SUCCESS) {
                    this.couponCards = res.data;
                }
            })


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
            tabBarChange(e){
                log.debug("tabBarChange", e)
            },
            async onShareAppMessage(res) {
                log.debug("onShareAppMessage")
                log.debug(res)
                let coverImage = await api.common.miniappShareCover();
                log.debug("coverImage", coverImage);
                return {
                    title: "爱享外卖优惠券",
                    path: "pages/index/index" ,
                    imageUrl: coverImage
                }
            },
            navClick(item) {
                log.debug("navClick", item);
                if (item.action == 5) { //外部转链H5
                    api.home.getNavigationConvertUrl(item.id).then( res => {
                        if (res.code == api.SUCCESS) {
                            //#ifdef H5
                                log.debug("naviaget to:", res.data);
                                if (res.data && res.data.startsWith("http")) {
                                    window.location.href = res.data;
                                }
                                utils.navigateTo(res.data);
                            //#endif
                            //#ifndef H5
                                let url = res.data;
                                if (!url) {
                                    url = item.action_appid;
                                }
                                utils.navigateTo("/pages/webview/webview/webview?url=" + url);
                            //#endif
                        }
                    });
                } else {
                    commonFun.clickNavigate(item.action, item.action_param, item.action_appid)
                }
            },
            couponCardClick(coupon) {
                commonFun.clickNavigate(coupon.action, coupon.action_param, coupon.action_appid)
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
            goTaobao(){
                utils.navigateTo("/pages/taobao/tbk/search/search")
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
                commonFun.clickNavigate(banner.action, banner.action_param, banner.action_appid)
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
        background-color: #FFF;
        .banner {
            margin: 0rpx 20rpx;
        }
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

    .swiper{
        background-color: #FFF;

        .nav{
            .icon {
                border-radius: 50%;
                width: 80rpx;
                height: 80rpx;
            }
            .text {
                margin-top: 8rpx;
                font-size: 24rpx;
                line-height: 34rpx;
                color: #333333;
            }
        }
    }

    .coupon-item {
        width:100%;
        height:auto;
        display:flex;
        border-radius:20rpx;
        padding:0 20rpx;
        margin-top:20rpx;
        border:1px solid #eeeeee;
        position:relative;

        .coupon-left {
            flex-basis: 465rpx;
            width:465rpx;
            height:auto;
            padding:26rpx 0;
            border-style:none dotted none none;
            border-color:#eeeeee;
            .title{
                font-weight: 500;
            }
        }
        .coupon-right{
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
        }
    }
    .coupon-item:after {
        width:20rpx;
        height:10rpx;
        position:absolute;
        left:470rpx; top:-1px;
        border-radius:0 0 40rpx 40rpx;
        content:""; display:block;
        background:#F5F5F5;
        border:1px solid #eeeeee;
        border-top:0px;
    }
    .coupon-item:before {
        width:20rpx;
        height:10rpx;
        position:absolute;
        left:470rpx;
        bottom:-1px;
        border-radius:40rpx 40rpx 0 0;
        content:"";
        display:block;
        background:#F5F5F5;
        border:1px solid #eeeeee;
        border-bottom:0px;
    }

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
