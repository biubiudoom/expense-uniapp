<template>
	<view>
		<u-form style="height: 950rpx;" :model="form" ref="collectionForm" label-width="200" label-align="center">
			<u-form-item label="收款人" class="form-item">
				<lv-select @handleSearch="getpayeeList()" @change="change($event)" :infoList="payeeList"
					:showValue="showValue" v-model="form.SKR" :loading="loading" type="primary" :uniShadow="true">
				</lv-select>
			</u-form-item>
			<u-form-item label="收款银行" class="form-item">
				<u-input v-model="form.SKYH" type="text" height="60" :disabled="true" />
			</u-form-item>
			<u-form-item label="收款账号" class="form-item">
				<u-input v-model="form.SKZH" type="text" height="60" :disabled="true" />
			</u-form-item>
			<u-form-item label="收款金额" class="form-item">
				<u-input v-model="form.SKJE" placeholder=" " type="text" height="60" :disabled="true" />
			</u-form-item>
			<u-form-item label="开户代码" class="form-item">
				<u-input v-model="form.KHH" type="text" height="60" :disabled="true" />
			</u-form-item>
			<u-form-item label="对公对私" class="form-item">
				<u-input v-model="selectLabel" type="text" :disabled="true" />
			</u-form-item>
		</u-form>
		<u-button @tap="isCheck()" type="primary" shape="square" class="submitBtn">确认</u-button>
	</view>
</template>

<script>
	export default {
		props: ['basicForm', 'billInfo', 'totalCount', 'type', 'photoList', 'SKJE', 'caterCost', 'invoiceList', 'invoicenoList', 'gasCost'],
		data() {
			return {
				selectionList: [{
						value: '1',
						label: '对私'
					},
					{
						value: '2',
						label: '对公'
					},
				],
				form: {
					SKR: '', // 收款人姓名
					SKYH: '', // 收款银行
					SKZH: '', // 收款账号
					SKJE: '', // 收款金额（等同于借款金额）
					KHH: '', // 开户代码，
					DGDS: '', //对私对公 (1, 2)
					YWLX: '出差人民币借款', // 业务类型（暂时写死）
					// YSKM: '', // 预算科目（暂时写死）
					YFORDER: '', //研发订单 传个空值
				},
				sid: '',
				loading: false,
				payeeList: [],
				showValue: '',
				overStay: 0,
				overTaxi: 0,
				overStayReason: '',
				overTaxiReason: '',
				selectLabel: '对私', //手机端暂时写死
			}
		},
		watch: {
			// 借款单下 收款金额值根据借款金额变换
			'basicForm.JKJE'(val) {
				this.form.SKJE = val
			},
			SKJE(val) {
				this.form.SKJE = (val + this.caterCost + this.gasCost).toFixed(2)
			},
			caterCost(val) {
				this.form.SKJE = (val + this.SKJE + this.gasCost).toFixed(2)
			},
			gasCost(val) {
				this.form.SKJE = (val + this.SKJE + this.caterCost).toFixed(2)
			},
			totalCount(val) {
				if ('postTravelBill' != this.type) {
					this.form.SKJE = val
				}
			}
		},

		mounted() {
			this.sid = uni.getStorageSync('sid');
			this.getCollectInfo();
		},

		methods: {
			// 获取默认收款信息
			getCollectInfo() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data: {
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.getPayInfo
					},
					success: (res) => {
						let data = res.data.jsonData[0]
						this.form.SKR = data.xm;
						this.form.SKYH = data.yhmc;
						this.form.SKZH = data.yhzh;
						this.form.KHH = data.YHLHH;
						this.form.DGDS = data.DGDSBZ
					}
				})
			},

			// 根据收款人姓名获取可选列表
			getpayeeList() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data: {
						url: this.$Common.bpmUrl,
						cmd: this.$Common.CMDList.getPayeeList,
						sid: this.sid,
						SKR: this.form.SKR
					},
					success: (res) => {
						this.payeeList = res.data.jsonData
					}
				})
			},

			change(e) {
				let index = parseInt(e.DGDSBZ, 10) - 1;
				this.form.SKR = e.xm
				this.form.KHH = e.YHLHH
				this.form.SKYH = e.yhmc
				this.form.SKZH = e.yhzh
				this.form.DGDS = e.DGDSBZ
				this.selectLabel = this.selectionList[index].label
			},

			// 提交数据
			submit() {
				let data = Object.assign(this.basicForm, this.form)
				let datas = JSON.stringify(this.billInfo)
				if ('postTravelBill' == this.type) {
					this.arrangeTravelInfo()
					let travelInfo = []
					let CYFXJ
					for (let i in this.billInfo) {
						for (let j in this.billInfo[i]) {
							travelInfo.push(this.billInfo[i][j])
						}
					}
					if (0 != this.basicForm.QYFFY) {
						let QYF = {
							TYPE: 'QYF',
							GCD: this.basicForm.GCD,	
							CFLCS: this.basicForm.startMileage,
							GCLCS: this.basicForm.endMileage,
							CCLCS: this.basicForm.endMileage - this.basicForm.startMileage,
							QCPL: this.basicForm.PL,
							QYFGL: this.basicForm.QYFBZ,
							QYFZE: this.basicForm.QYFFY,
							RQ: '',
							BZ: '',
							PCLX: this.basicForm.PCLX
						}
						travelInfo.push(QYF)
					}
					if (this.basicForm.CCTSCS){
						for (let i in this.basicForm.CYBZ) {
							if (this.basicForm.CCTSCS[i]) {
								let CYFItem = {
									TYPE: 'CYF',
									CYFBZ: this.basicForm.CYBZ[i],
									CYFZE: this.basicForm.CYBZ[i].split('-')[2] * this.basicForm.CCTSCS[i],
									CCTSCS: this.basicForm.CCTSCS[i],
									BZ: '',
								}
								travelInfo.push(CYFItem)
							}
						}
						CYFXJ = this.caterCost
					}
					uni.request({
						url: this.$Common.commonUrl,
						method: 'POST',
						header: {
							'Content-Type': "application/x-www-form-urlencoded"
						},
						data: {
							url: this.$Common.bpmUrl,
							sid: this.sid,
							cmd: this.$Common.CMDList[this.type],
							DATAS: JSON.stringify(travelInfo),
							SQRBMID: data.SQRBMID, //申请人部门ID
							YWLX: data.YWLX, // 业务类型
							GSGS: data.GSGS, // 公司代码
							YWBMID: data.SQRBMID, //业务部门代码
							YWBM: data.YWBM, //业务部门名称
							YSKM: data.YSKM ? data.YSKM : '其他应收款-职工借款', // 预算科目（暂时写死）
							YWSM: data.YWSM, //业务描述
							YFORDER: '', //研发订单 传个空值
							SKR: data.SKR, // 收款人姓名
							SKYH: data.SKYH, // 收款银行
							SKZH: data.SKZH, // 收款账号
							SKJE: parseFloat(data.SKJE), // 收款金额（等同于借款金额）
							DGDS: data.DGDS, // 对公对私（2, 1）
							KHH: data.KHH, // 开户代码，
							JSFS: data.JSFS, // 结算方式
							CCTS: '', // 出差天数
							CLFPLX1: '管理费用-差旅费',
							CLFPLX2: '管理费用-餐饮费',
							FPYBJE1: this.SKJE,
							FPYBJE2: CYFXJ ? CYFXJ : 0,
							FPBBJE1: this.SKJE,
							FPBBJE2: CYFXJ ? CYFXJ : 0,
							JTFXJ: this.totalCount[0] ? this.totalCount[0] : 0,
							CYFXJ: CYFXJ ? CYFXJ : 0,
							ZSFXJ: this.totalCount[1] ? this.totalCount[1] : 0,
							TXFXJ: 0,
							CZCFXJ: this.totalCount[2] ? this.totalCount[2] : 0,
							QYFXJ: this.totalCount[3] ? this.totalCount[3] : 0,
							QTFXJ: this.totalCount[4] ? this.totalCount[4] : 0,
							CZCFCB: this.overTaxi,
							CZCFCBSM: this.overTaxiReason ? this.overTaxiReason : 0,
							ZSFCB: this.overStay,
							ZSFCBSM: this.overStayReason ? this.overStayReason : 0,
							BMBS: data.BMBS,
							Invoice: this.invoiceList.toString(), // 增值税
							Invoiceno: this.invoicenoList.toString() // 非增值税
						},
						success: (res) => {
							let errorMsg = res.data.errorMsg
							if (res.data.flag1) {
								this.uploadPhotos(res.data.flag1)
								uni.showModal({
									content: errorMsg + '\n' + '点击确定返回首页',
									showCancel: false,
									success: () => {
										uni.navigateTo({
											url: '/pages/index/index'
										})
									}
								})
							} else {
								uni.showToast({
									icon: 'error',
									title: '数据填写有误，请检查并修改'
								})
							}
							
						}
					})
				} else {
					uni.request({
						url: this.$Common.commonUrl,
						method: 'POST',
						header: {
							'Content-Type': "application/x-www-form-urlencoded"
						},
						// 借款单下 billInfo值为空 
						// 报销单下 需要上传billInfo
						data: this.billInfo ? {
							url: this.$Common.bpmUrl,
							sid: this.sid,
							cmd: this.$Common.CMDList[this.type],
							DATAS: datas,
							//这里要拆出来 没办法
							SQRBMID: data.SQRBMID, //申请人部门ID
							YWLX: data.YWLX, // 业务类型
							GSGS: data.GSGS, // 公司代码
							YWBMID: data.SQRBMID, //业务部门代码
							YWBM: data.YWBM, //业务部门名称
							YSKM: data.YSKM ? data.YSKM : '其他应收款-职工借款', // 预算科目（暂时写死）
							YWSM: data.YWSM, //业务描述
							YFORDER: '', //研发订单 传个空值
							SKR: data.SKR, // 收款人姓名
							SKYH: data.SKYH, // 收款银行
							SKZH: data.SKZH, // 收款账号
							SKJE: parseFloat(data.SKJE), // 收款金额（等同于借款金额）
							DGDS: data.DGDS, // 对公对私（2, 1）
							KHH: data.KHH, // 开户代码，
							JSFS: data.JSFS, // 结算方式
							Invoice: this.invoiceList.toString(), // 增值税
							Invoiceno: this.invoicenoList.toString() // 非增值税
						} : {
							url: this.$Common.bpmUrl,
							sid: this.sid,
							cmd: this.$Common.CMDList[this.type],
							SQRBMID: data.SQRBMID, //申请人部门ID
							JKJE: parseFloat(data.JKJE), //借款金额
							YWLX: data.YWLX, // 业务类型
							GSGS: data.GSGS, // 公司代码
							YWBMID: data.SQRBMID, //业务部门代码
							YWBM: data.YWBM, //业务部门名称
							YSKM: data.YSKM ? data.YSKM : '其他应收款-职工借款', // 预算科目（暂时写死）
							YWSM: data.YWSM, //业务描述
							YFORDER: '', //研发订单 传个空值
							SKR: data.SKR, // 收款人姓名
							SKYH: data.SKYH, // 收款银行
							SKZH: data.SKZH, // 收款账号
							SKJE: parseFloat(data.SKJE), // 收款金额（等同于借款金额）
							DGDS: data.DGDS, // 对公对私（2, 1）
							KHH: data.KHH, // 开户代码，
							JSFS: data.JSFS, // 结算方式
						},
						success: (res) => {
							let errorMsg = res.data.errorMsg
							if (res.data.flag1) {
								uni.showModal({
									content: errorMsg + '\n' + '点击确定返回首页',
									showCancel: false,
									success: () => {
										uni.navigateTo({
											url: '/pages/index/index'
										})
									}
								})
							} else {
								uni.showToast({
									title: '数据填写有误，请检查并重新填写'
								})
							}
						}
					})
				}
			},

			// 上传图片
			uploadPhotos(flag1) {
				for (let i in this.photoList) {
					uni.uploadFile({
						url: this.$Common.commonUrl + '?url=' + this.$Common.upFileUrl + '&isPost=1' +
							"&flag1=" + flag1 + "&sid=" + this.sid +
							"&flag2=15109&rootDir=FormFile&maxFileSize=52428800",
						filePath: this.photoList[i],												
						name: 'File',
						success: (res) => {
							
						}
					})
				}
			},

			// 差旅数据较复杂 单独处理
			arrangeTravelInfo() {
				for (let i in this.billInfo[1]) {
					if (this.basicForm.ZSBZ[i]) {
						this.billInfo[1][i].ZSFBZ = this.basicForm.ZSBZ[i]
						this.billInfo[1][i].ZSTS = this.basicForm.ZSTS[i]
					} else {
						this.billInfo[1][i].ZSFBZ = '--0'
						this.billInfo[1][i].ZSTS = 0
					}
				}
				for (let i in this.billInfo[2]) {
					this.billInfo[2][i].CCTS = this.basicForm.CZCTS ? this.basicForm.CZCTS : ''
					this.billInfo[2][i].CZCFT = this.basicForm.CZCTS ? (this.billInfo[2][i].CZCFZE / this.basicForm.CZCTS)
						.toFixed(2) : ''
					this.billInfo[2][i].CZFBZ = this.basicForm.CZCBZ ? this.basicForm.CZCBZ : ''
				}
			},

			isCheck() {
				if ('postLoanBill' == this.type) {
					if (this.form.SKJE) {
						this.submit()
					} else {
						uni.showToast({
							title: '请完善借款单信息',
							icon: 'error'
						})
					}
				} else if ('postTravelBill' == this.type) {
					let errList = []
					if (!this.billInfo[0]) {
						errList.push('请至少添加一张行程票')
					} else {
						for (let i in this.billInfo[0]) {
							if(!this.billInfo[0][i].CFD || !this.billInfo[0][i].MOD) {
								errList.push('请补充行程票信息')
								break;
							}
						}
					}
					if (this.billInfo[3]) {
						if (0 !== this.billInfo[3].length && '' == this.basicForm.QYFFY) {
							errList.push('请补充汽油费标准信息')
						}
					}
					if (this.billInfo[2]) {
						if (0 !== this.billInfo[2].length && '' == this.basicForm.CZCBZ) {
							errList.push('请补充出租车费标准信息')
						}
					}
					if (this.billInfo[1]) {
						
					}
					if (0 == errList.length) {
						this.check()
					} else {
						uni.showToast({
							title: errList[0],
							icon: 'error'
						})
					}
				} else {
					if(0 != this.billInfo.length && this.basicForm.YSKM) {
						this.check()
					} else {
						uni.showToast({
							title: '请完善报销单信息',
							icon: 'error'
						})
					}
				}
			},

			// 提交前进行预算核查 
			check() {
				let overTags = []
				if ('postTravelBill' == this.type) {
					overTags = this.checkStandrd()
				}
				let date = new Date()
				let CJRQ = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-0" + date.getDate();
				let content = '报销总计金额超出预算 '
				// 根据预算科目与当前日期获取限制金额
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data: {
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.checkBudget,
						LC: this.$Common.BOList[this.type],
						YSKM: this.basicForm.YSKM,
						YWBMID: this.basicForm.SQRBMID,
						CJRQ: CJRQ
					},
					success: (res) => {
						let flag = false
						let overBudget = false //超出预算
						let data = res.data.toString()
						let budget = parseInt(data.split('[@]')[0], 10)
						if (this.form.SKJE > budget) {
							overBudget = true
						}
						if (overBudget || overTags.length != 0) {
							flag = true
						}
						if (!overBudget && overTags.length != 0) {
							content = overTags + '超出费用标准'
						}
						if (overBudget && overTags.length != 0) {
							content = content + '\n' + overTags + '超出费用标准'
						}
						if (this.basicForm.QYFFY > this.totalCount[3]) {
							content = content + '\n' + '汽油票面金额不足'
						}
						// 当金额超出时提示
						if (flag) {
							uni.showModal({
								title: '提示',
								content: content + '\n' + '是否继续提交',
								success: (res) => {
									if (res.confirm) {
										if (overTags.length != 0) {
											let that = this;
											uni.navigateTo({
												url: '/pages/components/overBudgetReason',
												events: {
													acceptDataFromOpenedPage(data) {
														that.overStayReason = data
															.overStayReason
														that.overTaxiReason = data
															.overTaxiReason
														that.submit()
													}
												},
												success: (res) => {
													res.eventChannel.emit('overTaxi',
														that.overTaxi)
													res.eventChannel.emit('overStay',
														that.overStay)
												}
											})
										} else {
											this.submit()
										}
									}
								}
							})
						} else {
							this.submit()
						}
					},
				})
			},

			checkStandrd() {
				let overTags = []
				let stayStandard
				for (let i in this.basicForm.ZSBZ) {
					if (this.basicForm.ZSTS[i]) {
						stayStandard +=  this.basicForm.ZSTS[i] * (this.basicForm.ZSBZ[i].split('-')[2])
					}
				}
				let taxiStandard = this.basicForm.CZCTS * (this.basicForm.CZCBZ.split('-')[2])
				// let gasStandard = this.basicForm.QYFFY
				if (this.totalCount[1] > stayStandard) {
					this.overStay = 1
					overTags.push('住宿费')
				}
				if (this.totalCount[2] > taxiStandard) {
					this.overTaxi = 1
					overTags.push('出租车费')
				}
				// if (this.totalCount[3] > gasStandard) {
				// 	overTags.push('汽油费')
				// }
				return overTags
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-item {
		height: 120rpx;
	}

	.submitBtn {
		width: 400rpx;
		margin-top: 0rpx;
	}
</style>
