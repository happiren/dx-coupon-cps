<template>
	<view class="page">
		<!-- 搜索 -->
		<view style="margin: 0 32rpx;">
			<u-search placeholder="搜索商品优惠券" v-model="keyword" :clearabled="true" :show-action="true" @search="onSearch" @custom="onSearch"></u-search>
		</view>

<!--		<view class="search-head">-->
<!--			<view class="back" @click="onBack">-->
<!--				<text></text>-->
<!--			</view>-->
<!--			<u-search placeholder="搜索商品优惠券" v-model="keyword" :clearabled="true" :show-action="true" @search="onSearch" @custom="onSearch"></u-search>-->
<!--			<view class="search">-->
<!--				<text class="cuIcon-search"></text>-->
<!--				<u-input type="text" v-model="keyword" placeholder="搜索商品优惠券" />-->
<!--			</view>-->
<!--			<view class="btn" @click="onSearch">-->
<!--				<text>搜索</text>-->
<!--			</view>-->
<!--		</view>-->
		<!-- 搜索历史 -->
		<view class="search-record">
			<view class="search-title">
				<view class="title">搜索历史</view>
				<view class="cuIcon-delete" @click="clearHistory()"></view>
			</view>
			<view class="record-list">
				<view class="list" v-for="(item,index) in SearchRecordArr"
				@click="onRecord(item)"
				 :key="index">
					<text>{{item}}</text>
				</view>
			</view>
		</view>
		<!-- 搜索发现 -->
		<view v-if="false" class="search-found">
			<view class="search-title">
				<view class="title">搜索发现</view>
				<view class="cuIcon-delete"></view>
			</view>
			<view class="found-list">
				<view class="list" v-for="(item,index) in 10" :key="index">
					<text>移动电源</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SearchRecordArr: [],
				keyword: '',
			};
		},
		onLoad() {
			if(uni.getStorageSync('SearchRecordArr')){
				this.SearchRecordArr = JSON.parse(uni.getStorageSync('SearchRecordArr'));
			}
		},
		methods:{
			/**
			 * 返回点击
			 */
			onBack(){
				uni.navigateBack();
			},
			clearHistory(){
				uni.clearStorageSync("SearchRecordArr");
				this.SearchRecordArr = [];
			},
			/**
			 * 搜索点击
			 */
			onSearch(){
				if(!this.keyword){
					uni.showToast({
						title:'请输入搜索内容',
						icon:'none',
					})
					return;
				}
				for (var i = 0; i < this.SearchRecordArr.length; i++) {
					if (this.SearchRecordArr[i] == this.keyword) {
						this.SearchRecordArr.splice(i, 1);
					}
				}
				this.SearchRecordArr.unshift(this.keyword);
				uni.setStorageSync('SearchRecordArr', JSON.stringify(this.SearchRecordArr));
				uni.navigateTo({
					url: '/pages/taobao/tbk/searchGoodsList/searchGoodsList?keyword=' + encodeURIComponent(this.keyword),
				})
			},
			/**
			 * 记录点击
			 */
			onRecord(val){
				uni.navigateTo({
					url: '/pages/taobao/tbk/searchGoodsList/searchGoodsList?keyword=' + encodeURIComponent(val),
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	@import 'search.scss';
</style>
