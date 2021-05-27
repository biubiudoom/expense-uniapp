<template>
	<u-grid :col="3" :border="false">
		<u-grid-item class="gird-item" style="height: 340rpx;" v-for="(item,i) in menuList" :key="i"
			@tap="openPage(item)">
			<u-icon :name="item.icon" size="92"></u-icon>
			<view class="grid-text">
				{{item.name}}
			</view>
		</u-grid-item>
	</u-grid>
</template>

<script>
	import api from "@/api/dd.js"
	export default {
		data() {
			return {
				menuList: [{
						icon: 'order',
						name: '差旅报销单',
						url: '/pages/travelBill/travelBill'
					},
					{
						icon: 'order',
						name: '借款单',
						url: '/pages/loanBill/loanBill'
					},
					{
						icon: 'order',
						name: '费用报销单',
						url: '/pages/expenseAccount/expenseAccount'
					},
					{
						icon: 'order',
						name: '招待费报销单',
						url: ''
					},
					{
						icon: 'account',
						name: '我的票夹',
						url: '/pages/myWallet/myWallet'
					},
					{
						icon: 'account',
						name: '我的审批',
						url: ''
					},
					{
						icon: 'account',
						name: '我的单据',
						url: ''
					},
				],
			}
		},
		methods: {
			openPage(item) {
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			
			onLoad() {
				if (this.$dd.env.platform != 'notInDingTalk') {
					this.$dd.ready(() => {
						this.$dd.runtime.permission.requestAuthCode({
							corpId: this.$Common.corpId
						}).then((res) => {
							uni.setStorageSync('code', res.code)
							
							api.getAccessToken({
								appkey: this.$Common.appKey,
								appsecret: this.$Common.appSecret
							}).then(res => {
								uni.setStorageSync('token', res.access_token)
								let code = uni.getStorageSync('code')
								api.getUserInfo({
									access_token: res.access_token,
									code: code
								}).then(res => {
									console.log(res)
								})
							})
						}).catch((err) => {
							console.log(err);
						})
					})
				} else {
					alert("请在手机端访问本应用")
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
</style>
