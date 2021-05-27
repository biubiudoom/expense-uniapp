<template>
	<view>
		<u-tabbar activeColor="#06A7E2" inactive-color="#000000" @change="change" v-model="current" :list="list" icon-size="40"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						count: 0,
						customIcon: false,
						pagePath: '/pages/myWallet/myWallet', 
					},
					{
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '发票',
						count: 0,
						customIcon: false,
						pagePath: '/pages/myWallet/bill/bill', 
					},
					{
						iconPath: "setting",
						selectedIconPath: "setting-fill",
						text: '应用',
						count: 0,
						customIcon: false,
						pagePath: '/pages/myWallet/function/function', 
					}
				],
			}
		},
		methods: {
			change(index) {
				this.current = index;
				uni.navigateTo({
					url: this.list[index].pagePath,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			onBackPress(options) {
				if(options.from == 'backbutton') {
					uni.redirectTo({
						url: '../../index/index'
					});
				}
				return true
			}
		}
	}
</script>

<style>

</style>
