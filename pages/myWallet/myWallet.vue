<template>
	<view class="wrap">
		<view class="top">
			<view class="email">
				<u-icon class="icon" name="email" size="120"></u-icon>
				<view class="text">
					发票邮箱<br />
					18257637050@ifp.com
				</view>
			</view>
			<view class="tips">
				<u-icon class="icon" name="volume-fill" size="60"></u-icon>
				<view class="text">
					开电子发票时填写，自动收取商家电子发票
				</view>
			</view>
		</view>
		<view class="medium">
			<u-grid :border="false">
				<u-grid-item class="gird-item" style="height: 200rpx;" v-for="(item,i) in funcList" :key="i">
					<u-icon :name="item.icon" size="90"></u-icon>
					<view class="grid-text">
						{{item.name}}
					</view>
				</u-grid-item>
			</u-grid>
			<view class="getBill">
				收发票
			</view>
			<u-grid :border="false">
				<u-grid-item class="gird-item" style="height: 200rpx;" v-for="(item,i) in billList" :key="i">
					<u-icon :name="item.icon" size="90"></u-icon>
					<view class="grid-text">
						{{item.name}}
					</view>
				</u-grid-item>
			</u-grid>
		</view>
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
				billList: [
					{
						icon: 'weixin-fill',
						name: '微信',
					},
					{
						icon: 'email',
						name: '邮箱',
					},
					{
						icon: 'file-text',
						name: '文件',
					},
				],
				funcList: [
					{
						icon: 'scan',
						name: '扫一扫',
					},
					{
						icon: 'camera',
						name: '拍发票',
					},
					{
						icon: 'file-text-fill',
						name: '发票查验',
					}
				],
				current: 0
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 100%;
		width: 100%;
	}
	.top {
		background-color: #F5F5F5;
		height: 360rpx;

		.email {
			display: flex;
			padding: 40rpx;

			.icon {
				margin: 30rpx;
			}

			.text {
				font-size: 40rpx;
				margin: 30rpx;
			}
		}

		.tips {
			display: flex;
			margin-left: 40rpx;

			.icon {
				margin: 20rpx;
			}

			.text {
				font-size: 30rpx;
				margin: 20rpx;
			}
		}


	}

	.medium {
		margin-top: 20rpx;

		.getBill {
			margin-top: 20rpx;
			margin-left: 40rpx;
			font-size: 40rpx;
			font-weight: bold;
		}
	}


	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
</style>
