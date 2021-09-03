<template>
	<view class="coupon-item" :style="{backgroundColor: theme, color:color,}">
		<view class="coupon-money">
			<slot></slot>
		</view>
		<view class="get-btn"  >立即使用</view>
	</view>
</template>

<script>
	export default {
		components:{

		},
		data() {
			return {

			}
		},
		props:{
			item:{
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
		border-radius:10rpx;
		padding:0 20rpx;
		margin-top:22rpx;
		border:1px solid #eeeeee;
		position:relative;

		.coupon-money {
			width:465rpx;
			height:auto;
			padding:26rpx 0;
			border-style:none dotted none none;
			border-color:#eeeeee;
		}
		.get-btn {
			width:146rpx;
			height:52rpx;
			line-height:50rpx;
			position:absolute;
			top:50%; right:26rpx;
			margin-top:-26rpx;
			text-align:center;
			border-radius:60rpx;

			font-size:34rpx;

		}
	}
	.coupon-item:after {
		width:20rpx;
		height:10rpx;
		position:absolute;
		left:470rpx; top:-1px;
		border-radius:0 0 40rpx 40rpx;
		content:""; display:block;
		background:#fff;
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
		background:#fff;
		border:1px solid #eeeeee;
		border-bottom:0px;
	}
</style>
