<template>
	<view>
		<view class="dx-flex-center" v-if="!article">
		    <u-loading :show="true" mode="flower" size="50"></u-loading>
		</view>
		<view  v-if="article" class="article">
			<view class="title">
				{{article.title}}
			</view>
			<view class="info">
				<view class="left">
					<dx-tag :text="article.cat_name" type="primary" font-size="20rpx" padding="12rpx 22rpx" border="none"/>
					<view v-if="article.publishStr" style="margin-left: 16rpx">{{article.publishStr}}</view>
				</view>
				<view class="right">
					<view class="line">
						<u-icon name="eye" size="30"></u-icon>
						<text style="margin-left: 8rpx; line-height: 37rpx">{{article.viewNum}}</text>
					</view>
					<view class="line" @click="collectArticle()">
						<u-icon name="heart" size="30" :color="article.collected ? '#2979ff':'#9A9A9A' " ></u-icon>
						<text style="margin-left: 8rpx; line-height: 37rpx">{{article.collectNum}}</text>
					</view>
				</view>
			</view>
			<view></view>
			<u-parse :html="article.content" style="padding-bottom: 120rpx" :tag-style="tagStyle"></u-parse>
			<view class="copyrihgt" v-if="article.copyright">
				<text>版权说明：本文来自</text><text>{{article.copyright}}</text><text>，如有侵权，请联系删除！</text>
			</view>
			<view class="bottom-tab">
				<view class="left" @click="collectArticle()">
					<u-icon v-if="!article.collected" name="heart" size="48" color="#585858" ></u-icon>
					<u-icon v-if="article.collected" name="/static/icon/collected.png" size="48" :color="article.collected ? '#2979ff':'#9A9A9A' " ></u-icon>
					<text v-if="!article.collected" style="margin-left: 8rpx; color:#585858" >收藏</text>
					<text v-if="article.collected" style="margin-left: 8rpx; color:#2979ff">收藏</text>
				</view>
				<u-line class="center" color="" direction="col" length="48rpx" />
				<button open-type="share" class="btn-share" @click="plusShare">
					<view class="right">
						<u-icon name="zhuanfa" size="48" color="#585858"></u-icon>
						<view style="margin-left: 8rpx; color: #585858">分享</view>
					</view>
				</button>

			</view>
		</view>
<!--		<web-view v-if="url" :src="url"></web-view>-->
	</view>
</template>

<script>
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import log from '@/common/log-util.js'
	import router from '@/common/router.js'
	import ErrorCode from '@/api/error-code.js'
	import UIcon from "../../../uview-ui/components/u-icon/u-icon";
	export default {
		components: {UIcon},
		data() {
			return {
				articleId:0,
				article: null,
				tagStyle: {
					// 字符串的形式
					p: 'font-size:32rpx; line-height:1.7;',
				}
			}
		},
		onLoad(options){
			this.articleId = options.articleId;
			const scene = decodeURIComponent(options.scene);
			if (!utils.isEmpty(scene) && scene != "undefined") {
				this.articleId = scene;
			}
			this.getArticleInfo(this.articleId);
		},
		async onShareAppMessage(res) {
			log.debug("onShareAppMessage")
			log.debug(res)
			let coverImage = await api.common.miniappShareCover();
			api.article.incShareNum(this.articleId);
			log.debug("coverImage", coverImage);

			return {
				title: this.article.title,
				path: "pages/common/article/article?articleId="+this.articleId ,
				imageUrl: coverImage
			}
		},

		methods: {
			getArticleInfo(articleId){
				utils.showLoading("加载中...");
				api.article.getArticleDetail(articleId).then(res => {
					utils.hideLoading();
					if (res.code == api.SUCCESS) {
						this.article = res.data;
						this.article.publishStr = utils.formatDate(this.article.publish_at);
						this.article.viewNum = utils.formatNumber(this.article.view_num);
						this.article.collectNum = utils.formatNumber(this.article.collect_num);

					} else {
						this.url = null;
						utils.toast(api.getErrorMessage(res.code));
					}
				})
			},
			collectArticle(){
				let status = 1;
				if (this.article.collected) {
					status = 0;
				}
				api.article.articleCollect(this.article.id, status).then(res => {
					if (res.code == api.SUCCESS) {
						this.article.collected = status;
						if (status) {
							this.article.collect_num = this.article.collect_num + 1;
							this.article.collectNum = utils.formatNumber(this.article.collect_num);
						} else {
							this.article.collect_num = this.article.collect_num - 1;
							if (this.article.collect_num < 0) {
								this.article.collect_num = 0;
							}
							this.article.collectNum = utils.formatNumber(this.article.collect_num);
						}
					} else {
						if (res.code == ErrorCode.ERROR_USER_NO_LOGIN) {
							router.goUserLogin(true);
						}
						utils.toast(api.getErrorMessage(res.code));
					}
				})

			},
			plusShare(){
				log.debug("plus share")
				// #ifdef APP-PLUS
				plus.share.sendWithSystem(						{
							content: article.title,
							href: article.url
						},
				function(){
					utils.toast("分享成功")
					console.log('分享成功');
				}, function(e){
					utils.toast("分享失败")
					console.log('分享失败：'+JSON.stringify(e));
				});
				// uni.shareWithSystem({
				// 	type: "text",
				// 	href: article.url || 'http://www.happiren.com',
				// 	summary: article.title,
				// 	success(e){
				// 		// 分享完成，请注意此时不一定是成功分享
				// 		utils.toast("分享成功")
				//
				// 	},
				// 	fail(e){
				// 		// 分享失败
				// 		utils.toast("分享成功"+JSON.stringify(e));
				// 	}
				// })
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.article{
		margin: 0 50rpx;

		.title {
			color: #2D2C3C;
			font-size: 42rpx;
			font-weight: 600;
			line-height: 60rpx;
		}
		.info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 28rpx;
			margin-bottom: 48rpx;
			color: #9A9A9A;

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
		.copyrihgt{
			font-size: 22rpx;
			color: #909399;
		}
		.bottom-tab{
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 28rpx 0;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #FFF;
			color: #585858;
			font-size: 30rpx;
			font-weight: 600;
			line-height: 48rpx;
			.left{
				display: flex;
				align-items: center;
				justify-content: center;
				/*flex: 0 1;*/
				flex-basis: 374rpx;

			}
			.center{
				flex-basis: 2rpx;
				/*flex: 1 0;*/
			}
			.btn-share {
				flex-basis: 374rpx;
				background-color: #FFF;
				border-radius: 0;
				border: 0px;
			}
			.right{
				display: flex;
				justify-content: center;
				align-items: center;
				flex-basis: 374rpx;
				font-size: 30rpx
				/*flex: 0 1;*/
			}
			button::after {
				border: none;
			}
		}
	}

</style>
