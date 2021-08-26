<template>
    <view>
        <view v-if="idCardInfo">

            <view style="padding: 0 0rpx">
                <view class="idcard-title">实名认证信息</view>
                <view class="tip">已实名，项目个人信息中可修改使用该实名信息</view>
                <u-gap height="32"></u-gap>
                <u-cell-group>
                    <u-cell-item title="姓名" :arrow="false" hover-class="none">{{idCardInfo.real_name}}</u-cell-item>
                    <u-cell-item title="身份证号" :arrow="false" hover-class="none">{{idCardInfo.number}}</u-cell-item>
                    <u-cell-item title="性别" :arrow="false" hover-class="none">{{idCardInfo.sex}}</u-cell-item>
                    <u-cell-item title="民族" :arrow="false" hover-class="none">{{idCardInfo.nation}}</u-cell-item>
                    <u-cell-item title="出生年月" :arrow="false" hover-class="none">{{idCardInfo.birth}}</u-cell-item>
                    <u-cell-item title="地址" :arrow="false" hover-class="none">{{idCardInfo.address}}</u-cell-item>
                    <u-cell-item title="签发机关" :arrow="false" hover-class="none">{{idCardInfo.authority}}</u-cell-item>
                    <u-cell-item title="有效期" :arrow="false" hover-class="none">
                        {{idCardInfo.start_at}}至{{idCardInfo.stop_at}}
                    </u-cell-item>
                </u-cell-group>
                <view class="u-flex" style="justify-content: space-around; margin-top: 32rpx">
                    <view  @click="showBigImage(idCardInfo.front_side)">
                        <u-image width="200rpx" :src="idCardInfo.front_side" mode="widthFix"></u-image>
                    </view>
                    <view @click="showBigImage(idCardInfo.back_side)">
                        <u-image width="200rpx" :src="idCardInfo.back_side" mode="widthFix"></u-image>
                    </view>
                </view>
                <u-gap height="20"></u-gap>
                <u-line></u-line>
            </view>
            <view class="btn-pri" v-if="idcardOcrId > 0">
                <u-button type="primary" :ripple="false" shape="square" @click="modifyByOcr()">提交</u-button>
            </view>
            <view class="btn-pri" v-if="false">
                <u-button type="primary" :ripple="false" shape="square" @click="modify()">重新实名</u-button>
            </view>
<!--            <u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>-->
            <u-gap height="80"></u-gap>
        </view>
        <view v-else="idCardInfo">
            <view class="content">
                <view class="title">请拍摄并上传你的身份证正反面照片</view>
                <view class="idcard">
<!--                    <view class="u-type-info">正面照</view>-->
                    <u-upload class="add-btn" ref="frontPic" :width="500" height="300" :max-size="5 * 1024 * 1024" :action="action"
                              :custom-btn="true" :auto-upload="false" max-count="1" upload-text="身份证正面图(人像面)"
                              @on-choose-complete="onFrontChooseComplete">
                        <view slot="addBtn"  >

                            <u-image width="500rpx" height="300rpx" src="https://jianyb.oss-cn-shenzhen.aliyuncs.com/cpms/app/icon/idcard/front-bg.png"></u-image>
                            <view class="add-btn-wrap">
                                <view class="add-btn-camera">
                                    <u-icon name="http://oss.jianyb.com/cpms/app/icon/idcard/camera.png" size="124"></u-icon>
                                    <view class="tips">点击上传人像面</view>
                                </view>
                            </view>
<!--                            <u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon>-->
                        </view>
                    </u-upload>
                    <view class="u-type-error" v-if="frontError">{{frontError}}</view>
                </view>
                <view class="idcard">
<!--                    <view class="u-type-info">反面照</view>-->
                    <u-upload class="add-btn" ref="backPic" :width="500" height="300" :max-size="5 * 1024 * 1024" :action="action"
                              :custom-btn="true" :auto-upload="false" max-count="1" upload-text="身份证反面图(国徽面)"
                              @on-choose-complete="onBackChooseComplete">
                        <view slot="addBtn"  >

                            <u-image width="500rpx" height="300rpx" src="http://oss.jianyb.com/cpms/app/icon/idcard/back-bg.png"></u-image>
                            <view class="add-btn-wrap">
                                <view class="add-btn-camera">
                                    <u-icon name="http://oss.jianyb.com/cpms/app/icon/idcard/camera.png" size="124"></u-icon>
                                    <view class="tips">点击上传国徽面</view>
                                </view>
                            </view>


                        </view>
<!--                        <view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">-->
<!--                            <image src="http://oss.dianxiangit.com/cpms/uploads/user/1383505164501025/info/frontPic_9549207121924313798wx2f27fcf537f3ba28.o6zAJs1EQNbZ3UF5zuOM0Ze2-3FA.KKRQfYdgsd9Bd407a3f17f2b8ec3d2fafbca2cebc186.jpg"-->
<!--                                   width="500" height="300"></image>-->
<!--                        </view>-->
                    </u-upload>
                    <view class="u-type-error" v-if="backError">{{backError}}</view>
                </view>
                <u-cell-group v-if="frontOcr || backOcr">
                    <view v-if="frontOcr">
                        <u-cell-item title="姓名" :arrow="false" hover-class="none">{{frontOcr.real_name || ""}}</u-cell-item>
                        <u-cell-item title="身份证号" :arrow="false" hover-class="none">{{frontOcr.number}}</u-cell-item>
                        <u-cell-item title="性别" :arrow="false" hover-class="none">{{frontOcr.sex}}</u-cell-item>
                        <u-cell-item title="民族" :arrow="false" hover-class="none">{{frontOcr.nation}}</u-cell-item>
                        <u-cell-item title="出生年月" :arrow="false" hover-class="none">{{frontOcr.birth}}</u-cell-item>
                        <u-cell-item title="地址" :arrow="false" hover-class="none">{{frontOcr.address}}</u-cell-item>
                    </view>
                    <view v-if="backOcr">
                        <u-cell-item title="签发机关" :arrow="false" hover-class="none">{{backOcr.authority}}</u-cell-item>
                        <u-cell-item title="有效期" :arrow="false" hover-class="none">
                            {{backOcr.start_at}}至{{backOcr.stop_at}}
                        </u-cell-item>
                    </view>
                </u-cell-group>
            </view>
            <view class="btn-pri">
                <u-button type="primary" :ripple="false" shape="square" @click="upload()">上传</u-button>
            </view>


        </view>

    </view>
</template>

<script>
    import auth from '@/common/auth.js'
    import log from '@/common/log-util.js'
    import utils from '@/common/utils.js'
    import api from '@/common/api-util.js'
    import UButton from "../../../../../uview-ui/components/u-button/u-button";
    import UImage from "../../../../../uview-ui/components/u-image/u-image";
    import UGap from "../../../../../uview-ui/components/u-gap/u-gap";
    import UIcon from "../../../../../uview-ui/components/u-icon/u-icon";
    import ULine from "../../../../../uview-ui/components/u-line/u-line";

    export default {
        components: {ULine, UIcon, UGap, UImage, UButton},
        data() {
            return {
                projectId:0,
                confirmBack: 0,
                loading: false,
                idCardInfo: null,
                idcardOcrId: 0, //是否是通过ocrID进行实名认证
                action: "",
                frontOcr: null,
                backOcr: null,
                frontError: null,
                backError: null,
            }

        },
        onLoad(options) {
            log.debug("idCardInfo")
            this.projectId = options.projectId || 0,
            this.loading = true;
            this.idcardOcrId = options.idcardOcrId || 0;
            this.projectId = options.projectId || 0;
            this.confirmBack = options.confirmBack;
            if (this.idcardOcrId) {
                this.loading = false;
                api.user.idCardOcrInfo(this.idcardOcrId).then(res => {
                    if (res.code == api.SUCCESS && res.data) {
                        this.idCardInfo = res.data;
                        this.idCardInfo = this.format(res.data);
                    }
                })
            } else {
                api.user.idCardInfo().then(res => {
                    this.loading = false;
                    if (res.code == api.SUCCESS && res.data) {
                        this.idCardInfo = res.data;
                        this.idCardInfo = this.format(res.data);
                    }
                })
            }
        },
        methods: {
            onFrontChooseComplete(index, name) {
                console.log(index, name)
                utils.showLoading("身份证识别中...");
                api.user.uploadFrontIdcard(this.$refs.frontPic.lists[0].file.path).then(res => {
                    console.log(res);
                    utils.hideLoading();
                    if (res.code == api.SUCCESS) {
                        var frontOcr = res.data;
                        frontOcr.birth = utils.formatDate(frontOcr.birth);

                        this.frontOcr = frontOcr;
                        if (!this.frontOcr.front_side) {
                            this.frontError = "身份证正面照识别失败, 请重新上传";
                            //utils.toast("身份证正面照识别失败, 请重新上传")
                        } else {
                            this.frontError = null;
                        }
                    } else {
                        this.frontError = "身份证正面照识别失败, 请重新上传";
                        utils.toast(api.getErrorMessage(res.code));
                    }
                })
            },
            onBackChooseComplete(index, name) {
                log.debug(index, name)
                utils.showLoading("身份证识别中...");
                api.user.uploadFrontIdcard(this.$refs.backPic.lists[0].file.path).then(res => {
                    console.log(res);
                    utils.hideLoading();
                    if (res.code == api.SUCCESS) {
                        var backOcr = res.data;
                        backOcr.start_at = utils.formatDate(backOcr.start_at);
                        backOcr.stop_at = utils.formatDate(backOcr.stop_at);
                        this.backOcr = backOcr;
                        if (!this.backOcr.back_side) {
                            this.backError = "身份证背面照识别失败,请重新上传";
                        } else {
                            this.backError = null;
                        }
                    } else {
                        this.backError = "身份证背面照识别失败,请重新上传";
                        utils.toast(api.getErrorMessage(res.code));
                    }
                })
            },
            showBigImage(url) {
                utils.previewImage(url);
            },
            format(idcard) {
                idcard.birth = utils.formatDate(idcard.birth);
                idcard.start_at = utils.formatDate(idcard.start_at);
                idcard.stop_at = utils.formatDate(idcard.stop_at);
                return idcard
            },
            modify(){
                this.idCardInfo = null;
            },
            modifyByOcr(){
                api.user.bindIdcardByOcr(this.idcardOcrId, this.projectId).then(res => {
                    if (res.code == api.SUCCESS) {
                        utils.toast("实名认证成功");
                        utils.navigateBack();
                    } else {
                        utils.toast(api.getErrorMessage(res.code));
                    }
                })
            },
            upload() {
                if (this.backError != null || this.frontError != null) {
                    return utils.toast("请重新上传身份证照片");
                }
                if (!this.frontOcr || !this.backOcr) {
                    return utils.toast("请重新上传身份证照片");
                }
                api.user.rebindIdcard(this.projectId, this.frontOcr.id, this.backOcr.id).then(res => {
                    if (res.code == api.SUCCESS) {
                        utils.toast("实名认证成功");
                        this.idCardInfo = this.format(res.data);
                        if (this.confirmBack) {
                            utils.navigateBack();
                        }
                    } else {
                        utils.toast(api.getErrorMessage(res.code));
                    }
                })
                console.log(this.$refs.frontPic.lists[0]);
                log.debug(this.$refs.frontPic.lists[0]);
                log.debug(this.$refs.backPic.lists[0]);
            }
        }
    }
</script>

<style lang="scss">
    .content {
        margin: 32rpx;
    }

    .title{
        font-size: 16px;
        font-weight: 600;
        color: rgba(0,0, 0, 0.6);
        line-height: 1.7;
    }

    .idcard-title{
        margin-left: 32rpx;
        font-weight: 500;
        font-size: 36rpx;
        color: #151515;
        line-height: 1.5;
        word-wrap: break-word;
        word-break: break-all;
    }

    .tip {
        margin: 16rpx 0 32rpx 32rpx;
        color: #9B9B9B;
        font-size: 28rpx;
        line-height: 1.5;
    }

    .idcard{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 32rpx;
        margin-bottom: 32rpx;

    }

    .add-btn{
        box-shadow: 0px 0px 8px 4px rgba(45, 45, 45, 0.04);
        border-radius: 6px;
    }


    .add-btn-wrap{
        position: relative;
        .add-btn-camera{
            position: absolute;
            top: -250rpx;
            left: 150rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .tips{
                margin-top: 20rpx;
                font-size: 32rpx;
                line-height: 1.5;
                font-weight: 500;
                color: #2979FF;
            }
        }
    }



    .btn-pri {

        margin:32rpx 128rpx;
        margin-top: 64rpx;
        padding-bottom: 128rpx;;
    }


</style>

