<template>
	<view>
		<view class="dx-flex-center" v-if="!url">
		    <u-loading :show="true" mode="flower" size="50"></u-loading>
		</view>
		<web-view v-if="url" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:null,
			}
		},
		onLoad(options){
			this.url = decodeURIComponent(options.url);
		},
		methods: {

		}
	}
</script>

<style>

</style>
