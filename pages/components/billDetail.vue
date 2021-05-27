<template>
	<view>
		<view class="order" v-for="(item, index) in orderList" :key="item.id">
			<view class="top" v-if="item.isPurchaser">
				<view class="purchaser">购买方：{{ item.purchaser }}</view>
				<u-line color="#06A7E2"></u-line>
			</view>
			<view class="content">
				<view class="left">
					<view class="seller">销售方：{{ item.seller }}</view>
					<view class="contact">
						<u-icon name="calendar" size="40"></u-icon>{{ item.contact }}
					</view>
				</view>
				<view class="medium">
					<view class="trip" v-if="item.isTrip">
						G5555  济南→青岛北
					</view>
				</view>
				<view class="right">
					<view class="price">￥{{ item.price }}</view>
				</view>
			</view>
		</view>
		<u-popup v-model="popShow" mode="bottom">
			<view class="importBtn">
				<u-button hair-line="false">从我的票夹导入</u-button>
				<u-button hair-line="false">直接拍照导入</u-button>
				<u-button @tap="popShow = false" hair-line="false">取消</u-button>
			</view>
		</u-popup>
		<view class="addMore" @tap="popShow = true">
			<view class="add">
				<u-icon name="plus" class="icon" :size="50"></u-icon>添加明细
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['orderList'],
		data() {
			return {
				popShow: false,
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.order {
		width: 710rpx;
		background-color: #f2f2f2;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;
	
		.top {
			.purchaser {
				height: 40rpx;
				margin: 0 10rpx;
				font-size: 20rpx;
			}
		}
		
		.content {
			display: flex;
			
			.left {
				.type {
					margin: 0 10rpx;
					font-size: 30rpx;
				}
			
				.seller,
				.contact {
					display: flex;
					margin: 10rpx 10rpx;
					font-size: 30rpx;
					text-align: center;
				}
			}
			
			.medium {
				margin-top: 10rpx;
				width: 240rpx;
				font-size: 10rpx;
				.trip {
					// margin: 20rpx;
					
				}
			}
			
			.right {
				.price {
					margin: 50rpx 24rpx auto;
				}
			}
		}
	
		
	}
	.addMore {
		display: flex;
		justify-content: space-around;
		margin: 30rpx auto;
		line-height: 100rpx;
		font-size: 50rpx;
	
		.add {
			display: flex;
			align-items: center;
	
			.icon {
				margin-right: 10rpx;
			}
		}
	}
</style>
