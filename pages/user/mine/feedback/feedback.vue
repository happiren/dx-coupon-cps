<template>
    <view>
        <u-top-tips ref="uTips"></u-top-tips>
        <view class="content">
            <u-form :model="form" ref="uForm" style="margin-left:16rpx">
<!--                <u-form-item label="标题" :required="false" label-position="top" label-align="left" :label-width="130">-->
<!--                    <u-input v-model="form.title" placeholder="请输入标题"/>-->
<!--                </u-form-item>-->
                <u-form-item label="反馈描述" :required="false" label-position="top" label-align="left" :label-width="130" @click="titleClick()">
                    <u-input v-model="form.content" type="textarea" maxlength="1024" height="200" placeholder="请填写10字以上的问题描述以便我们提供更好的帮助"
                             style="margin-right: 16rpx"/>
                </u-form-item>
                <u-form-item label="图片（选填）" :required="false" label-position="top" label-align="left" :label-width="250">
                    <view>
                        <u-upload ref="frontPic" :width="150" height="150" :max-size="3 * 1024 * 1024"
                                  :action="uploadUrl"
                                  :custom-btn="false" :auto-upload="true" max-count="5" upload-text="添加" index="1"
                                  name="image"
                                  :header="header"
                                  @on-list-change="onListChange"
                                  @on-remove="onRemove"
                                  @on-success="onSuccess"
                                  @on-choose-complete="onPicChooseComplete">
                        </u-upload>
                    </view>
                </u-form-item>
                <u-form-item label="联系姓名" :required="false" label-align="left" :label-width="150">
                    <u-input v-model="form.name" type="text" placeholder="联系姓名"/>
                </u-form-item>
                <u-form-item label="联系方式" :required="false" label-align="left" :label-width="150">
                    <u-input v-model="form.phone" type="text" placeholder="手机号/微信号"/>
                </u-form-item>
            </u-form>
            <view style="margin: 64rpx 128rpx">
                <u-button type="primary" :ripple="false" shape="square"  @click="submit()">提交</u-button>
            </view>

        </view>
    </view>
</template>

<script>
    import auth from '@/common/auth.js'
    import utils from '@/common/utils.js'
    import api from '@/common/api-util.js'
    import log from '@/common/log-util.js'
    import sha1 from '@/common/sha1.js'
    import UGap from "../../../../uview-ui/components/u-gap/u-gap";
    export default {
        components: {UGap},
        data() {
            return {
                uploadUrl: api.common.getUploadImageUrl(),
                userInfo: null,
                titleClickCount:1,
                form:{
                    title:"",
                    content:"",
                    phone:"",
                    name: "",
                    images:[]
                },
                header:{
                    'Authorization': api.user.getBearerToken(),
                }
            }
        },
        onLoad() {
            this.userInfo = auth.getLocalUserInfo();
        },
        methods: {

            onPicChooseComplete(lists, name) {
                console.log(lists)
                console.log(name)
                var sha11 = sha1.sha1("1234")
                console.log("sha1:"+sha11)

            },
            onRemove(index, lists, name){
                log.debug("onRemove")
                log.debug(index)
                log.debug(lists)
                log.debug(name)
                this.images.splice(index, 1); //删除一个元素
            },
            onSuccess(data, index, lists, name){
                log.debug("onsuccess")
                log.debug(data)
                log.debug(index)
                log.debug(lists)
                log.debug(name)
                if (data.code == api.SUCCESS) {
                    this.form.images.push(data.data); //添加一个元素
                } else {
                    utils.toast(api.getErrorMessage(data.code));
                }
            },
            onListChange(lists, name){
                log.debug(lists)
                log.debug(name)
            },
            topTips(message){
                this.$refs.uTips.show({
                    title: message,
                    type: 'warning',
                    duration: '2300'
                })
            },
            submit(){
                if (this.form.content.length == 0) {
                    this.topTips("请输入反馈描述")
                    return;
                }
                if (this.form.content.length <= 10) {
                    this.topTips("反馈描述不得少于10个字")
                    return;
                }
                // if (this.form.phone.length > 0 ) {
                //     this.topTips("联系方式格式不正确")
                //     return;
                // }
                var imageUrl = "";
                for(var i=0; i<this.form.images.length; i++) {
                    imageUrl = imageUrl + this.form.images[i].url+",";
                }
                if (imageUrl.length > 0) {
                    imageUrl = imageUrl.substring(0,imageUrl.length-1);
                }
                log.debug(imageUrl)
                api.common.feedback(0, this.form.title, this.form.content, imageUrl, this.form.phone, this.form.name).then(res => {
                    if (res.code == api.SUCCESS) {
                        utils.toast("意见反馈提交成功")
                        utils.navigateBack();
                    }
                })
            },
        }
    }
</script>

<style>
    .content{
        margin: 32rpx;
    }

    .btn-add {
        margin: 128rpx 32rpx 0 32rpx;
        color: #FFF;
        background-color: var(--dx-color-pri);
    }
</style>
