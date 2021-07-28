<template>
	<view>
		<u-button @tap="checkedAll()" type="primary" shape="square" class="checkAllBtn">全选</u-button>
		<scroll-view scroll-y="true" style="height:850rpx;">
			<view class="order" v-for="(item, index) in orderList" :key="index">
				<view class="checkbox">
					<u-checkbox v-model="item.checked" :key="index"></u-checkbox>
				</view>
				<view class="info">
					<view class="top" v-if="item.purchaser">
						<view class="purchaser">购买方：{{ item.purchaser }}</view>
						<u-line color="#06A7E2"></u-line>
					</view>
					<view class="content">
						<view class="left">
							<view class="seller" v-if="item.BZ">
								{{ item.seller ? item.seller : item.title }}({{item.BZ}})
							</view>
							<view class="seller" v-else>{{ item.seller ? item.seller : item.title }}</view>
							<view class="date">
								<u-icon name="calendar" size="30"></u-icon>{{ item.date }}
							</view>
						</view>
						<view class="medium">
							<view class="trip" v-if="item.trip">
								{{item.trip}}
							</view>
						</view>
						<view class="right">
							<view class="price">￥{{ item.price }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<u-button @tap="submit()" type="primary" shape="square" class="submitBtn">确认</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [],
				sid: '',
				GSGS: '',
				allChecked: false,
			}
		},
		
		mounted() {
			uni.showLoading({
				title:'加载中'
			})
			this.GSGS = uni.getStorageSync('GSGS')
			this.sid = uni.getStorageSync('sid')
			const endTime = this.changeDate('end')
			const startTime = this.changeDate('start')
			uni.request({
				url: this.$Common.commonUrl,
				method: 'POST',
				header: {
					'Content-Type': "application/x-www-form-urlencoded"
				},
				data:{
					url: this.$Common.bpmUrl,
					sid: this.sid,
					cmd: this.$Common.CMDList.getBill,
					STARTTIME: startTime,
					ENDTIME: endTime,
					PAGENUM: 1,
					PAGESIZE: 10,
					GSGS: this.GSGS,
				},
				success: (res) => {
					let data = res.data
					for (let i in data) {
						this.sortInfo(data[i])
					}
					this.orderList.sort(this.sortDate)
					for (let i in this.orderList) {
						this.$set(this.orderList[i], 'checked', false)
					}
					uni.hideLoading();
				}
			})
		},
		
		methods: {
			// 根据不同的发票种类处理第三方接口返回的数据并添加进明细
			sortInfo(data) {
				let info = {}
				let type = data.fpzl ? data.fpzl : data.invoice.fpzl
				let result = data
				let number, start, end
				if	(!type) {
					info.title = data.msg
					info.price = result.je
					info.region_path = data.region_path
					info.date = '暂无日期'
				} else {
					switch (type) {
						// 定额发票
						case '101':
							info.title = '定额发票'
							info.price = result.total
							info.region_path = data.region_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.Invoiceno = data.invoiceid
							break
							// 机打发票
						case '102':
							info.title = '机打发票'
							info.price = result.total
							info.region_path = data.region_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.purchaser = result.gfmc
							info.seller = result.xfmc
							info.Invoiceno = data.invoiceid
							break
							// 出租车发票
						case '103':
							info.title = '出租车发票'
							info.region_path = data.region_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.price = result.total
							info.Invoiceno = data.invoiceid
							break
							// 火车票
						case '104':
							info.title = '火车票'
							info.region_path = data.region_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.price = result.total
							start = result.station_geton
							end = result.station_getoff
							info.trip = start + "-" + end
							info.JTGJ = 'TRAIN'
							info.CFD = start
							info.MOD = end
							info.Invoiceno = data.invoiceid
							break
							// 客运汽车
						case '105':
							info.title = '客运汽车票'
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.price = result.total
							info.JTGJ = 'CAR'
							info.Invoiceno = data.invoiceid
							break
							// 航空运输电子客票行程单
						case '106':
							info.title = result.issue_by
							info.date = result.flights[0].date ? this.dateTransform(result.flights[0].date) : '暂无日期'
							start = result.flights[0].from_station.slice(0, 2);
							end = result.flights[0].to_station.slice(0, 2);
							info.price = result.total
							info.region_path = data.region_path
							info.JTGJ = 'AIR'
							info.CFD = start
							info.MOD = end
							info.Invoiceno = data.invoiceid
							break
							// 小票
						case '107':
							info.title = data.store_name
							info.date = data.date
							info.price = data.total
							// 过路费发票
						case '108':
							info.title = '过路费发票'
							info.region_path = data.region_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.price = result.total
							start = result.entrance_station
							end = result.exit_station
							info.Invoiceno = data.invoiceid
							break
						default:
							info.region_path = data.region_path
							info.price = data.invoice.jshj ? data.invoice.jshj : ''
							info.purchaser = data.invoice.gfmc
							info.seller = data.invoice.xfmc
							info.date = data.invoice.kprq ? this.dateTransform(data.invoice.kprq) : '暂无日期'
							info.Invoice = data.invoice.invoiceid
							break
					}
				}
			this.orderList.push(info)
			},
			
			// 将各种日期格式统一为yyyy-mm-dd
			dateTransform(val) {
				let date = val.toString()
				let result = ''
				if (date.length > 8) {
					let year = date.slice(0, 4)
					let month = date.slice(5, 7)
					let day = date.slice(8, 10)
					result = year + '-' + month + '-' + day
				} else {
					let year = date.slice(0, 4)
					let month = date.slice(4, 6)
					let day = date.slice(6, 8)
					result = year + '-' + month + '-' + day
				}
				return result
			},
			
			// 对发票根据日期进行升序排序
			sortDate(a, b) {
				return Date.parse(a.date) - Date.parse(b.date);
			},
			
			changeDate(type) {
				let currentDate = new Date()
				let year = currentDate.getFullYear()
				let month = currentDate.getMonth() + 1
				if (month < 10) {
					month = '0' + month.toString()
				} else {
					month = month.toString()
				}
				let day = currentDate.getDate()
				if (day < 10) {
					day = '0' + day.toString()
				} else {
					day = day.toString()
				}
				let changeDate
				if ('end' == type) {
					changeDate = (year).toString() + month + day + '235959'
				} else if ('start' == type) {
					changeDate = (year - 1).toString() + month + day + '000000'
				}
				return changeDate
			},
			
			checkedAll() {
				if (!this.allChecked) {
					this.orderList.map(val => {
						val.checked = true;
					})
					this.allChecked = true
				} else {
					this.orderList.map(val => {
						val.checked = false;
					})
					this.allChecked = false
				}
			},
			
			submit() {
				const checkedList = []
				const eventChannel = this.getOpenerEventChannel()
				for (let i in this.orderList) {
					if (this.orderList[i].checked) {
						checkedList.push(this.orderList[i])
					}
				}
				eventChannel.emit('acceptDataFromOpenedPage', checkedList)
				eventChannel.emit('index', this.index);
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.submitBtn {
		width: 400rpx;
		margin-top: 20rpx;
	}
	
	.checkAllBtn {
		margin-top: 30rpx;
		margin-bottom: 20rpx;
		width: 400rpx;
	}

	.checkbox {
		float: left;
		height: 200rpx;
		width: 40rpx;

		.u-checkbox {
			position: relative;
			top: 40%;
		}
	}

	.info {
		margin-left: 50rpx;
	}

	.order {
		width: 680rpx;
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

				.seller {
					font-size: 28rpx;
					line-height: 60rpx;
					margin: 20rpx 10rpx 10rpx;
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.date {
					display: flex;
					margin: 40rpx 0rpx auto;
					font-size: 26rpx;
					text-align: center;
				}
			}

			.medium {
				margin-top: 20rpx;
				width: 180rpx;
				text-align: center;

				.trip {
					font-size: 20rpx;

				}
			}

			.right {
				margin-left: 20rpx;
				.price {
					margin: 50% auto;
				}
			}
		}
	}

	
</style>
