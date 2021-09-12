<template>
	<view class="coupon-item" :style="{backgroundColor: theme, color:color,}">
		<image v-if="coupon.top_image" :src="coupon.top_image" style="position: absolute; width: 50px; height: 50px;  left:0rpx"></image>
		<view class="coupon-left">
			<view style="line-height: 1.7; margin: 10rpx 50rpx">
				<view class="title">{{coupon.title}}</view>
				<view style="color: #FF304D; line-height: 1.2;">
					<text style="font-size: 50rpx">{{coupon.money}}</text><text style="margin: 0 8rpx">元</text><text v-if="coupon.tips" style="background-color:#FFEBE3; color: #fa5151; padding: 0 8rpx">{{coupon.tips}}</text>
				</view>
			</view>
		</view>
		<view class="coupon-right">
			<dx-tag style="margin-left: 30rpx" color="#fff" text="免费领取" shape="circle" bg-color="#FF5C74" border-color="#FF5C74" padding="18rpx 30rpx"></dx-tag>
		</view>
		<image v-if="coupon.bottom_image" :src="coupon.bottom_image" style="position: absolute; width: 50px; height: 50px; bottom:0rpx; left:0rpx"></image>
	</view>
</template>

<script>
	export default {
		name: 'dx-coupon-card',
		components:{

		},
		data() {
			return {

			}
		},
		props:{
			coupon:{
				type: Object
			},
			types:{
				type: String,
				default: ''
			},
			theme:{
				type: String,
				default: '#ff9000'
			},
			solid:{
				type: String,
				default: '#ffffff'
			},
			color:{
				type: String,
				default: '#ff9000'
			},
			title:{
				type: String,
				default: '饿了么天天抢红包'
			},
			money:{
				type: String,
				default: '65'
			},
			tips:{
				type: String,
				default: ''
			},
			topImage:{
				type: String,
				default: ''
			},
			bottomImage:{
				type: String,
				default: ''
			},
		},
		methods: {

		}
	}
</script>

<style lang='scss'>
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
				font-size: 36rpx;
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
</style>
