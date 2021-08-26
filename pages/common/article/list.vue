<template>
	<view>
		<view class="dx-flex-center" v-if="loading">
			<u-loading :show="true" mode="flower" size="50"></u-loading>
		</view>
		<view v-else="loading" class="tab">

<!--			<u-tabs-swiper style="width: 650rpx" ref="uTabs" :list="articleCats" :current="current"  :is-scroll="false"  height="80" @change="onTabChanged"-->
<!--						   swiperWidth="650"></u-tabs-swiper>-->
			<u-tabs style="width: 650rpx" ref="uTabs" :list="articleCats" :current="current" duration="0.3" :is-scroll="false"  height="80" @change="onTabChanged"
						   swiperWidth="650"></u-tabs>
			<view class="switch">
				<u-image width="28rpx" height="28rpx" src="/static/icon/switch.png" mode="widthFix" @click="showSwitch = !showSwitch" ></u-image>
				<view class="switch-option" v-if="showSwitch">
					<view class="option">
						<view class="triangle"></view>
						<view class="wrap">
							<view class="line" @click="switchTime()">按时间</view>
							<u-line style="flex-basis: 2rpx;"></u-line>
							<view class="line" @click="switchScore()">按热度</view>
						</view>

					</view>
				</view>
			</view>


		</view>
		<view>
			<view class="articles">
				<view v-for="(item, index) in articleList" :key="index" class="article" @click="onArticleClick(item)">
					<view class="square-cover" v-if="item.cover_type == 1">
						<view class="left">
							<view>
								<view class="title u-line-2">{{item.title}}</view>
							</view>
							<view>
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
			<view v-if="noMoreFlag" style="margin-top: 16rpx; padding-bottom: 32rpx">
				<u-divider half-width="200" bgColor="#F8F8F8">没有更多了</u-divider>
			</view>
		</view>

	</view>
</template>

<script>
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import log from '@/common/log-util.js'
	import ULine from "../../../uview-ui/components/u-line/u-line";
	export default {
		components: {ULine},
		data() {
			return {
				loading: true,
				articleCats:[ {
					id: 0,
					name: "全部"
				}],
				articleList:[],
				current:0,
				catId: 0,
				page: 1,
				order: 1,
				article: null,
				showSwitch: false,
				noMoreFlag:false,
			}
		},
		onLoad(options){

			this.getArticleCats();
			this.getArticle();
		},
		onPullDownRefresh() {
			this.page = 1;
			this.articleList = [];
			this.noMoreFlag = false;
			this.getArticle();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.getArticle();
		},
		methods: {
			onTabChanged(index){
				log.debug("onTabChanged", index)
				this.current = index;
				this.catId = this.articleCats[index].id;
				this.refresh();
			},
			refresh(){

				this.page = 1;
				this.articleList = [];
				this.noMoreFlag = false;
				this.getArticle();
			},
			switchTime(){
				this.showSwitch = false;
				this.order = 1;
				this.refresh();
			},
			switchScore(){
				this.showSwitch = false;
				this.order = 2;
				this.refresh();
			},
			getArticle() {
				if (this.noMoreFlag == true) {
					return;
				}

				api.article.getArticleList(0, this.catId, this.order, this.page).then(res => {
					if (res.code == api.SUCCESS) {
						if (res.data.length == 0) {
							this.noMoreFlag = true;
						}
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
			onArticleClick(article){
				log.debug(article);
				var param = {
					articleId:article.id,
				}
				utils.navigateTo("/pages/common/article/article" + utils.queryParams(param));
			},
			getArticleCats(){
				utils.showLoading("加载中...");
				api.article.getArticleCats().then(res =>  {
					utils.hideLoading();
					if (res.code == api.SUCCESS) {
						if(res.data && res.data.length > 0) {
							res.data.forEach(item => {
								let tab = {};
								tab.id = item.id;
								tab.name = item.name;
								this.articleCats.push(tab)
							})

						}
						this.loading = false;
					} else {
						this.loading = false;
						utils.toast(api.getErrorMessage(res.code));
					}

				})
			}
		}
	}
</script>

<style lang="scss" >
	page{
		background-color: #F8F8F8;
	}

	.tab{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFF;
		.switch{
			display: inline;
			background-color: #FFF;
			margin-right: 38rpx;
		}
	}
	.switch-option{
		position: relative;
		.option{
			position: absolute;
			/*background-color: #FFF;*/
			z-index: 1000;
			/*position: absolute;*/
			top: 26rpx;
			right: -16rpx;


			.triangle{
				position: relative;
				z-index: 11002;
				width: 0;
				height: 0;
				right: 4rpx;
				border-right: 16rpx solid transparent;
				border-bottom: 20rpx solid #fff;
				border-left: 16rpx solid transparent;
				margin-left: auto;
				margin-right: 13rpx;
			}
			.wrap{
				z-index: 10001;
				position: relative;
				right: -6rpx;
				top: -2rpx;
				width: 166rpx;
				/*height: 140rpx;*/
				background: #FFFFFF;
				box-shadow: 0px 0px 6rpx 0px rgba(133, 133, 133, 0.28);
				border-radius: 8px;
				/*display: flex;*/
				/*align-items: center;*/
				/*justify-content: space-around;*/
				/*flex-direction: column;*/
				.line{
					margin: 16rpx  40rpx;
					display: inline-block;
					color: #343434;
					font-size: 26rpx;
					line-height: 1.5;
				}
			}
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
			/*background: #2979ff;*/

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
