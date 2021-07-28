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
	import njp from "@/api/njp.js"
	export default {
		data() {
			return {
				menuList: [{
						icon: '/static/travel.png',
						name: '差旅报销单',
						url: '/pages/travelBill/travelBill'
					},
					{
						icon: '/static/loan.png',
						name: '借款单',
						url: '/pages/loanBill/loanBill'
					},
					{
						icon: '/static/expenseAccount.png',
						name: '费用报销单',
						url: '/pages/expenseAccount/expenseAccount'
					},
					{
						icon: '/static/serveAccount.png',
						name: '招待费报销单',
						url: '/pages/serveAccount/serveAccount'
					},
					// {
					// 	icon: '/static/myWallet.png',
					// 	name: '我的票夹',
					// 	url: '/pages/myWallet/myWallet'
					// },
					{
						icon: '/static/myExamine.png',
						name: '我的审批',
						url: ''
					},
					{
						icon: '/static/myDocuments.png',
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
					fail: (res) => {
						uni.showToast({
							icon: 'error',
							title: '暂不支持，请等待后续开发'
						})
					},
					complete: () => {}
				});	
			},

			onLoad() {
				if (this.$dd.env.platform != 'notInDingTalk') {
					this.$dd.ready(() => {
						this.$dd.runtime.permission.requestAuthCode({
							corpId: this.$Common.corpId
						}).then((res) => {
							let code = res.code
							api.getAccessToken({
								url: "https://oapi.dingtalk.com/gettoken",
								appkey: this.$Common.appKey,
								appsecret: this.$Common.appSecret
							}).then(res => {
								let access_token = res.access_token
								api.getUserInfo({
									url: "https://oapi.dingtalk.com/topapi/v2/user/getuserinfo",
									access_token: access_token,
									code: code
								}).then(res => {
									let DDuserid = res.result.userid
									api.getUser({
										url: "https://oapi.dingtalk.com/topapi/v2/user/get",
										userid: DDuserid,
										access_token: access_token,
									}).then(res => {
										let userid = res.result.job_number
										uni.request({
											url: this.$Common.commonUrl,
											method: 'POST',
											header: {
												'Content-Type': "application/x-www-form-urlencoded"
											},
											data: {
												url: this.$Common.njpUrl,
												sign: '11454fbc-7395-4867-98d2-6153f122e641',
												bip: '116.62.215.38',
												pwd: 'ca1f08525519a14d2351eb84bb32be89',
												lang: 'cn',
												ipType: 0,
												userid: userid
											},
											success: (res) => {
												uni.setStorageSync('sid', res.data.sid)
											}
										})
									})
								})
							})
						}).catch((err) => {
							console.log(err);
						})
					})
				} else {
					alert("请在手机端访问本应用")
				}
				// uni.request({
				// 	url: this.$Common.commonUrl,
				// 	method: 'POST',
				// 	header: {
				// 		'Content-Type': "application/x-www-form-urlencoded"
				// 	},
				// 	data: {
				// 		url: this.$Common.njpUrl,
				// 		sign: '11454fbc-7395-4867-98d2-6153f122e641',
				// 		bip: '192.168.119.80',
				// 		pwd: 'ca1f08525519a14d2351eb84bb32be89',
				// 		lang: 'cn',
				// 		ipType: 0,
				// 		userid: 8256	
				// 	},
				// 	success: (res) => {
				// 		uni.setStorageSync('sid', res.data.sid)
				// 	}
				// })
			}
		}
	}
</script>

<style scoped lang="scss">
	.grid-text {
		font-size: 28rpx;
		margin-top: 10rpx;
		color: $u-type-info;
	}
</style>
