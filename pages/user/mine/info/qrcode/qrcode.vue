<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
			}
		},
		onLoad(){
			this.userInfo = auth.getLocalUserInfo();
		},
		methods: {

		}
	}
</script>

<style>

</style>
