<template>
	<view class="">
		<view v-if="loading">
			<view class="weui-loadmore">
				<view class="weui-loading"></view>
				<view class="weui-loadmore__tips">正在加载</view>
			</view>
		</view>
		<view v-if="!loading">
			<view class="title">
				<view class="userinfo">
					<image class="user-avatar" :src="userInfo.avatar" background-size="cover"></image>
					<view class="button-area">
						<view class="bottom-item">
							<view class="word" v-if="userInfo.user_spec.following" @click="followUser">取消关注</view>
							<view class="word" v-else="userInfo.user_spec.following" @click="followUser">关注</view>
						</view>
						<view class="bottom-item" @click="requestUserContact(userInfo.user_id, '')">
							<view class="word">联系TA</view>
						</view>
					</view>
				</view>
				<view class="nickname">{{userInfo.nickname}}</view>
				<view v-for="(shop, index) in shops" :key="index" class="shop-name" @click="goShopPage(shop.shop_id)">
					{{shop.name}}
				</view>
				<view class="description">{{userInfo.description || ""}}</view>
				<view class="follow">
					<navigator :url="'/pages/user/userfollow/userfollowing?userId='+userInfo.user_id" class="item">
						<view class="num">{{userInfo.following_count}}</view>
						<view class="word">关注</view>
					</navigator>
					<navigator :url="'/pages/user/userfollow/userfollowers?userId='+userInfo.user_id" class="item">
						<view class="num">{{userInfo.followers_count}}</view>
						<view class="word">粉丝</view>
					</navigator>
				</view>
			</view>
			<view class="dx-division-space"></view>

			<!-- <view class="user-shop">他的铺子</view> -->
			<view class="dynamic">

				<!-- <view class="follow-title">我的收藏</view>
				<view class="follow">
					<navigator :url="'/pages/user/userfollow/productfollows'" class="item">
						<view class="nav">好物</view>
					</navigator>
					<navigator :url="'/pages/user/userfollow/shopfollows'" class="item">
						<view class="nav">铺子</view>
					</navigator>
				</view>				 -->
			</view>
		</view>

		<view v-if="showContact">
			<view class="weui-mask"></view>
			<view class="weui-half-screen-dialog half-screen" style="height: 75%;">
				<view class="weui-half-screen-dialog__hd">
					<view class="weui-half-screen-dialog__hd__side" @click="closeContactDialog()">
						<view class="weui-icon-btn">关闭
							<view :class="'weui-icon-close-thin'">
							</view>
						</view>
					</view>
					<view class="weui-half-screen-dialog__hd__main">
						<strong class="weui-half-screen-dialog__title input-text-title">联系方式</strong>
					</view>
				</view>
				<view class="weui-half-screen-dialog__bd">
					<view>
						<view v-if="contact.mobile" class="weui-form-preview__hd">
								<view class="weui-form-preview__label">
									手机号
								</view>
								<view class="weui-form-preview__value">{{contact.mobile}}</view>

						</view>
						<view v-if="contact.wechat" class="weui-form-preview__hd">
								<view class="weui-form-preview__label">
									微信号
								</view>
								<view class="weui-form-preview__value">{{contact.wechat}}</view>

						</view>

						<view  v-if="contact.wechat_pic" class="weui-form-preview__hd">
								<view class="weui-form-preview__label" style="float: none; text-align: left; text-align-last:left">微信二维码</view>
								<image :src="contact.wechat_pic" mode="aspectFit"></image>
						</view>


					</view>
				</view>
			</view>
		</view>
		<view v-if="noDataFlag">
			<view class="dx-content-empty-2"></view>
			<view class="dx-content-empty-tips">用户不存在</view>
		</view>
	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import api from '@/common/api-util.js'
	import ErrorCode from '@/api/error-code.js'
	import utils from '@/common/utils.js'
	export default {
		data() {
			return {
				loading: true,
				noDataFlag: false,
				userInfo: null,
				showContact: false,
				contact: {},
				shops: [],
			}
		},
		onLoad(option) {
			let that = this;
			var userId = option.userId;
			api.userInfo(userId).then(res => {
				that.loading = false;
				if (res.code == ErrorCode.SUCCESS) {
					that.userInfo = res.data;
				} else {
					that.noDataFlag = true;
					utils.toast(api.getErrorMessage(res.code);
				}

			});
			api.getOtherUserShops(userId).then(res => {
				if (res.code == ErrorCode.SUCCESS) {
					this.shops = res.data;
				}
			})
		},
		methods: {

			goShopPage(shopId) {
				log.debug("goShopPage")
				utils.navigateTo("/pages/shop/others/shop?shopId=" + shopId);
			},
			requestUserContact(userId, remark){
				// api.requestUserContact(userId, remark).then(res => {
				// 	if (res.code == ErrorCode.SUCCESS) {
				// 		utils.toast("申请成功，等待对方确认");
				// 	}
				// })
				api.getUserContactInfo(userId).then(res => {
					if (res.code == ErrorCode.SUCCESS) {
						this.contact = res.data;
						if (!this.contact.mobile && !this.contact.wechat && !this.contact.wechat_pic) {
							utils.toast("对方未留联系方式");
						} else {
							this.showContact = true;
						}
					}
				})
			},
			closeContactDialog(){
				this.showContact = false;
			},
			followUser() {
				log.debug("followUser")
				let that = this;
				if (!auth.checkLogin()) {
					utils.goLoginPage(1);
					return;
				}
				log.debug("go follow")
				var status = this.userInfo.user_spec.following ? 0 : 1;
				api.followUser(this.userInfo.user_id, status).then(res => {
					if (res.code == ErrorCode.SUCCESS) {
						if (res.data) {
							that.userInfo.user_spec.following = status;
						}
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFF;
	}


	.content {
		margin-left: 32rpx;
		margin-right: 32rpx;
	}

	.title {
		background-color: #fff;
		padding-top: 24rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
	}

	.shop-name{
		display: inline-block;
		padding-left: 16rpx;
		padding-right: 16rpx;
		border-radius: 8rpx;
		color: #fa9d3b;
		line-height: 1.9;
		font-size: 12px;
		background: #F7F7F7;
		margin-bottom: 8rpx;
	}
	.userinfo {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.button-area {
		display: flex;
		width: 250rpx;
		justify-content: flex-end;
	}

	.bottom-item {
		display: inline-block;
		background-color: var(--dx-color-blue);
		display: flex;
		justify-content: center;
		align-items: center;
		margin: auto;
		border-radius: 8rpx;
		border: 1px solid rgba(255, 255, 255, 1);
		padding: 4rpx 16rpx 4rpx 16rpx;
	}

	.bottom-item .word {
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.user-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
	}

	.nickname {
		font-size: 32rpx;
		font-weight: 600;
		color: #000000;
		margin-top: 16rpx;
		margin-bottom: 16rpx;

	}

	.follow {

		border-top: 1px solid #DDD;
		padding: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 12rpx;
	}

	.follow .item {

		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.follow .item .num {
		line-height: 1.0;
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(0, 0, 0, 1);
	}

	.follow .item .word {
		font-size: 28rpx;
		color: rgba(102, 102, 102, 1);
	}
	.follow .item .nav{
		font-size: 32rpx;
		font-weight: 600;
		color: rgba(102, 102, 102, 1);
	}
	.follow-title {
		background-color: #fff;
		font-weight: 600;
		font-size: 36rpx;
		padding-top: 24rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
	}

	.description {
		/* border-top: 1px solid #DDD; */

		font-size: 28rpx;
		padding-top: 8rpx;
		padding-bottom: 8rpx;
		color: #AAAAAA;
	}



	.word-over-hidden {
		max-width: 300rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-shop{
		display: inline-block;
		padding-top: 4rpx;
		padding-bottom: 4rpx;
		padding-left: 16rpx;
		padding-right: 16rpx;
		border: 1px solid #5F74FF;
	}


</style>
