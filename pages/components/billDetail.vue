<template>
	<view>
		<view class="order" v-for="(item, index) in orderList" :key="index" @tap="openDetail(item, index)">
			<view class="top" v-if="item.purchaser">
				<view class="purchaser">购买方：{{ item.purchaser }}</view>
				<u-line color="#06A7E2"></u-line>
			</view>
			<view class="content">
				<view class="left">
					<view class="seller" v-if="item.remark">
						{{ item.seller ? item.seller : item.title }}({{item.remark}})
					</view>
					<view class="seller" v-else>{{ item.seller ? item.seller : item.title }}</view>
					<view class="contact">
						<u-icon name="calendar" size="40"></u-icon>{{ item.date }}
					</view>
				</view>
				<view class="medium">
					<view class="trip" v-if="item.isTrip">
						G5555 济南→青岛北
					</view>
				</view>
				<view class="right">
					<view class="price">￥{{ item.price }}</view>
				</view>
			</view>
		</view>
		<u-popup v-model="popShow" mode="bottom">
			<view class="importBtn">
				<u-button :hair-line="false">从我的票夹导入</u-button>
				<u-button :hair-line="false" @tap="openCamera()">直接拍照导入</u-button>
				<u-button :hair-line="false" @tap="openDetail()">手动输入</u-button>
				<u-button @tap="popShow = false" :hair-line="false">取消</u-button>
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
		data() {
			return {
				orderList: [{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXXXXX酒店',
						date: '2021-5-12',
						price: '1200',
						remark: '1',
						region_path: 'https://www.chinajack.com/1.png'
					},
					{
						title: '其他金额',
						date: '2021-5-12',
						price: '1200',
						remark: ''
					},
				],
				popShow: false,
				sid: '',
				GSGS: ''
			}
		},

		mounted() {
			this.sid = uni.getStorageSync('sid');
			this.GSGS = uni.getStorageSync('GSGS')
		},

		methods: {
			openCamera() {
				this.popShow = false
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'],
					success: (res) => {
						let url = res.tempFiles[0]
						this.urlToFile(url).then(res => {
							let blob = res
							this.blobToBase64(blob).then(res => {
								let data = res
								uni.request({
									url: this.$Common.bpmUrl,
									data: {
										sid: this.sid,
										cmd: "JACK_APP_MOBILE_OCR_RECONGNIZE",
										FILEDATA: data,
										GSGS: this.GSGS
									},
									success: (res) => {
										console.log(res)
										let data = res.data.data
									}
								})
							})
						})
					}
				})
			},
			openDetail(item, index) {
				if (!item) {
					this.popShow = false
				}
				let that = this;
				uni.navigateTo({
					url: '/pages/components/addBill',
					events: {
						acceptDataFromOpenedPage(data) {
							if (item) {
								that.orderList[index] = data
								//数组改变需要重新绑定
								that.$set(that.orderList, index, data)
							} else if (!item) {
								that.orderList.push(data)
							}
						}
					},
					success: (res) => {
						res.eventChannel.emit('acceptDataFromOpenerPage', JSON.stringify(item))
					},
				})
			},

			// 将url转换为blob
			urlToFile(url) {
				return new Promise((resolve, reject) => {
					var xhr = new XMLHttpRequest()
					xhr.open('GET', url, true)
					xhr.responseType = 'blob'
					xhr.onload = function() {
						resolve(this.response)
					}
					xhr.onerror = reject
					xhr.send()
				})
			},


			// 将blob转换为Base64
			blobToBase64(blob) {
				return new Promise((resolve, reject) => {
					const fileReader = new FileReader();
					fileReader.onload = (e) => {
						resolve(e.target.result);
					};
					// readAsDataURL
					fileReader.readAsDataURL(blob);
					fileReader.onerror = () => {
						reject(new Error('blobToBase64 error'));
					};
				});
			}
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
				font-size: 24rpx;
			}
		}

		.content {
			display: flex;

			.left {
				width: 40%;

				.type {
					margin: 0 10rpx;
					font-size: 30rpx;
				}

				.seller {
					display: flex;
					font-size: 30rpx;
					text-align: center;
					margin: 20rpx 10rpx 10rpx;
					font-weight: bold;
				}

				.contact {
					display: flex;
					margin: 30rpx 0rpx auto;
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
					margin: 50% auto;
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
