<template>
	<view>
		<scroll-view scroll-y="true" :class='[travel ? "shortScroll" : "scrollClass"]'>
			<view class="order" v-for="(item, index) in orderList" :key="index" @click="openDetail(index, item)">
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
							<u-icon name="calendar" size="40"></u-icon>{{ item.date }}
						</view>
					</view>
					<view class="medium">
						<view class="trip" v-if="item.CFD">
							{{item.CFD}} - {{item.MOD}}
						</view>
					</view>
					<view class="right">
						<view class="price">￥{{ item.price }}</view>
					</view>
					<view class="del" @click.stop="delBill(index)">
						<u-icon name="close-circle" size="40" ></u-icon>
					</view>
				</view>
			</view>
			<view class="addMore" @tap="popShow = true">
				<view class="add">
					<u-icon name="plus" class="icon" :size="50"></u-icon>添加明细
				</view>
			</view>
		</scroll-view>
		<view class="bottom">
			<view class="totalCount">
				总计金额：￥ {{totalCount}}
			</view>
		</view>
		<u-popup v-model="popShow" mode="bottom">
			<view class="importBtn">
				<u-button :hair-line="false" @tap="importBill()">从我的票夹导入</u-button>
				<u-button :hair-line="false" @tap="openCamera()">直接拍照导入</u-button>
				<u-button :hair-line="false" @tap="openDetail(index)">手动输入</u-button>
				<u-button @tap="popShow = false" :hair-line="false">取消</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/mmmm-image-tools/index.js'
	export default {
		props: ['travel', 'index'],
		data() {
			return {
				orderList: [],
				popShow: false,
				sid: '',
				GSGS: '',
				totalCount: 0,
			}
		},

		watch: {
			// 每次新增明细后将数据传递给其他组件
			orderList: {
				handler(newValue, oldValue) {
					const index = this.index
					let total = 0
					let billInfo = []
					let invoiceList = []
					let invoicenoList = []
					let billPhotos = []
					if (0 != this.orderList.length) {
						for (let i in this.orderList) {
							let info = {}
							let data = this.orderList[i]
							if (data.Invoiceno) {
								invoicenoList.push(data.Invoiceno)
							} else if (data.Invoice){
								invoiceList.push(data.Invoice)
							}
							if (data.region_path) {
								billPhotos.push(data.region_path)
							}
							// 统计报销总金额
							if (data.price) {
								total += parseFloat(data.price)
							}
							if (0 == index || index) {
								switch (index) {
									// 行程类
									case 0:
										info.TYPE = 'JTF'
										info.TS = '1'
										info.BZ = data.BZ ? data.BZ : ''
										info.CFRQ = data.date
										info.JTFJE = data.price
										info.JTGJ = data.JTGJ ? data.JTGJ : "OTHERS"
										info.CFD = data.CFD
										info.MOD = data.MOD
										break
										// 住宿类
									case 1:
										info.TYPE = 'ZSF'
										info.ZSFPH = ''
										info.ZSFZE = data.price
										info.BZ = data.BZ ? data.BZ : ''
										// info.ZSTS = data.ZSTS ? data.ZSTS : ''
										info.ZSFT = 0
										break
										// 出租车类
									case 2:
										info.TYPE = 'CZF'
										info.CZCFZE = data.price
										info.BZ = data.BZ ? data.BZ : ''
										break
										// 汽油费
									case 3:
										info.TYPE = 'QYF'
										// 其他类
									case 4:
										info.TYPE = 'QTF'
										info.QTFYZE = data.price
										info.BZ = data.BZ ? data.BZ : ''
										info.FYSM = data.FYSM ? data.FYSM : ''
								}   
							} else {
								info.BBJE = parseFloat(data.price)
								info.YBJE = parseFloat(data.price)
							}
							if(0 !== Object.keys(info).length) {
								billInfo.push(info)
							}
							
						}
					}
					
					this.totalCount = Math.round(total*100)/100
					this.$emit('invoiceList', this.index, invoiceList)
					this.$emit('invoicenoList', this.index, invoicenoList)
					this.$emit('totalCount', this.index, this.totalCount)
					this.$emit('billInfo', this.index, billInfo)
					this.$emit('billPhotos', billPhotos)
				},
				deep: true
			}
		},

		mounted() {
			this.sid = uni.getStorageSync('sid');
			this.GSGS = uni.getStorageSync('GSGS')
		},

		methods: {
			// 拍照导入功能 调用第三方接口
			// openCamera1() {
			// 	this.popShow = false
			// 	uni.chooseImage({
			// 		count: 1,
			// 		sizeType: ['original', 'compressed'],
			// 		sourceType: ['camera'],
			// 		success: (res) => {
			// 			let url = res.tempFilePaths[0]
			// 			pathToBase64(url).then(base64 => {
			// 				let that = this
			// 				that.dealImage(base64, 500, useImg)

			// 				function useImg(base64) {
			// 					uni.request({
			// 						url: that.$Common.commonUrl,
			// 						method: 'POST',
			// 						header: {
			// 							'Content-Type': "application/x-www-form-urlencoded"
			// 						},
			// 						data: {
			// 							url: that.$Common.bpmUrl,
			// 							sid: that.sid,
			// 							cmd: that.$Common.CMDList.recongnizeOCR,
			// 							FILEDATA: base64,
			// 							GSGS: that.GSGS
			// 						},
			// 						success: (res) => {
			// 							let data = res.data.data
			// 							for (let i in data) {
			// 								that.sortInfo(data[i])
			// 							}
			// 							that.orderList.sort(that
			// 								.sortDate)
			// 						}
			// 					})
			// 				}
			// 			})
			// 		}
			// 	})
			// },

			openCamera() {
				this.popShow = false
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'],
					success: (res) => {
						uni.showLoading({
							title:'上传发票中'
						})
						let url = res.tempFilePaths[0]
						let that = this
						uniCloud.uploadFile({
							filePath: url,
							cloudPath: 'OCR.jpg',
							success(res) {
								uni.hideLoading()
								uni.showLoading({
									title:'识别发票中'
								})
								let fileID = res.fileID
								uni.request({
									url: that.$Common.commonUrl,
									method: 'POST',
									header: {
										'Content-Type': "application/x-www-form-urlencoded"
									},
									timeout: 10000,
									data: {
										url: that.$Common.bpmUrl,
										sid: that.sid,
										cmd: that.$Common.CMDList.recongnizeOCR,
										FILEDATA: fileID,
										GSGS: that.GSGS,
										ISCHECK: 2
									},
									success: (res) => {
										let data = res.data.data
										for (let i in data) {
											that.sortInfo(data[i])
										}
										that.orderList.sort(that
											.sortDate)
									},
									fail: () => {
										uni.showToast({
											icon: 'error',
											title: '识别失败，请检查网络环境'
										})
									},
									complete: () => {
										uni.hideLoading()
										uniCloud.deleteFile({
											fileList: [fileID]
										})
									}
								})
							},
						});

					}
				})
			},

			// 根据不同的发票种类处理第三方接口返回的数据并添加进明细
			sortInfo(data) {
				let info = {};
				let type = data.fpzl;
				let result = data.ocr_result;
				let start, end;
				if ('未检测到可用发票' == data.msg) {
					uni.showToast({
						icon: 'error',
						title: '未检测到可用发票',
						duration: 3000
					})
				} else if ('重复录入' == data.msg) {
					uni.showToast({
						icon: 'error',
						title: '该发票已识别过，请从票夹中导入',
						duration: 3000
					})
				} else if (!type) {
					info.title = data.msg
					info.price = result.je
					info.region_path = data.invoice.file_path
					info.date = '暂无日期'
					this.orderList.push(info)
				} else {
					switch (type) {
						// 定额发票
						case '101':
							info.title = '定额发票'
							info.price = result.total
							info.region_path = data.invoice.file_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.Invoiceno = data.invoiceid
							break
							// 机打发票
						case '102':
							info.title = '机打发票'
							info.price = result.total
							info.region_path = data.invoice.file_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.purchaser = result.gfmc
							info.seller = result.xfmc
							info.Invoiceno = data.invoiceid
							break
							// 出租车发票
						case '103':
							info.title = '出租车发票'
							info.region_path = data.invoice.file_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.price = result.total
							info.Invoiceno = data.invoiceid
							break
							// 火车票
						case '104':
							info.title = '火车票'
							info.region_path = data.invoice.file_path
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
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							start = result.flights[0].from_station.slice(0, 2);
							end = result.flights[0].to_station.slice(0, 2);
							info.price = result.total
							info.region_path = data.invoice.file_path
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
							info.region_path = data.invoice.file_path
							info.date = result.date ? this.dateTransform(result.date) : '暂无日期'
							info.price = result.total
							start = result.entrance_station
							end = result.exit_station
							info.Invoiceno = data.invoiceid
							break
						default:
							info.region_path = data.invoice.file_path
							info.price = data.invoice.jshj ? data.invoice.jshj : ''
							info.purchaser = data.invoice.gfmc
							info.seller = data.invoice.xfmc
							info.Invoice = data.invoiceid
							info.date = data.invoice.kprq ? this.dateTransform(data.invoice.kprq) : '暂无日期'
							break
					}
					this.orderList.push(info)
				}
			},


			// 从app票夹导入
			importBill() {
				this.popShow = false
				let that = this
				uni.navigateTo({
					url: '/pages/components/importBill',
					events: {
						acceptDataFromOpenedPage(data) {
							that.orderList = that.orderList.concat(data)
						}
					},
				})
			},

			// 点击每条明细进行金额编辑
			openDetail(index, item) {
				let that = this;
				if (!item) {
					that.popShow = false
				}
				uni.navigateTo({
					url: '/pages/components/editBill',
					events: {
						acceptDataFromOpenedPage(data) {
							if (item) {
								that.orderList[index] = data
								//数组改变需要重新绑定
								that.$set(that.orderList, index, data)
							} else if (!item) {
								that.orderList.push(data)
								that.orderList.sort(this.sortDate)
							}
						}
					},
					success: (res) => {
						if (item) {
							res.eventChannel.emit('acceptDataFromOpenerPage', JSON.stringify(item))
						}
						res.eventChannel.emit('index', JSON.stringify(that.index))
					},
				})
			},
			
			delBill(index) {
				uni.showModal({
					content: '是否确定删除此条发票信息',
					success: (res) => {
						if (res.confirm) {
							this.$delete(this.orderList, index)
						}
					},
					
				})
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
				if (10 == a.date.length && 10 == b.date.length) {
					return Date.parse(a.date) - Date.parse(b.date);
				}
			},

			urlToBase64(url) {
				var toBase64Url;
				uni.request({
					url: url,
					method: 'GET',
					responseType: 'arraybuffer',
					success: async res => {
						let base64 = wx.arrayBufferToBase64(res.data); //把arraybuffer转成base64
						toBase64Url = 'data:image/png;base64,' + base64; //不加上这串字符，在页面无法显示
					}
				});
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

			dealImage(base64, w, callback) {
				var newImage = new Image();
				var quality = 0.6; //压缩系数0-1之间
				newImage.src = base64;
				newImage.setAttribute("crossOrigin", 'Anonymous'); //url为外域时需要
				var imgWidth, imgHeight;
				newImage.onload = function() {
					imgWidth = this.width;
					imgHeight = this.height;
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					if (Math.max(imgWidth, imgHeight) > w) {
						if (imgWidth > imgHeight) {
							canvas.width = w;
							canvas.height = w * imgHeight / imgWidth;
						} else {
							canvas.height = w;
							canvas.width = w * imgWidth / imgHeight;
						}
					} else {
						canvas.width = imgWidth;
						canvas.height = imgHeight;
						quality = 0.6;
					}
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
					// 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
					// while (base64.length / 1024 > 150) {
					// 	quality -= 0.01;
					// 	base64 = canvas.toDataURL("image/jpeg", quality);
					// }
					// 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
					// while (base64.length / 1024 < 50) {
					// 	quality += 0.001;
					// 	base64 = canvas.toDataURL("image/jpeg", quality);
					// }
					callback(base64); //必须通过回调函数返回，否则无法及时拿到该值
				}
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
	.shortScroll {
		height: 850rpx;
	}

	.scrollClass {
		height: 1000rpx;
	}

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

				.seller {
					font-size: 30rpx;
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
					font-size: 30rpx;
					text-align: center;
				}
			}

			.medium {
				margin-top: 20rpx;
				width: 220rpx;
				text-align: center;
				margin-right: 5rpx;

				.trip {
					font-size: 24rpx;

				}
			}

			.right {
				.price {
					margin: 50% auto;
				}
			}
			.del {
				margin: 9% auto
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

	.bottom {
		width: 100%;
		height: 80rpx;
		padding: 18rpx;
		background-color: #bfeaf2;

		.totalCount {
			background-color: #FFFFFF;
			height: 50rpx;
			text-align: center;
			font-size: 34rpx;
		}
	}

	scroll-view ::-webkit-scrollbar {
		width: 0 !important;
		height: 0 !important;
		background-color: transparent;
	}
</style>
