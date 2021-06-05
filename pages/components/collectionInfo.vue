<template>
	<view>
		<u-form :model="form" ref="collectionForm" label-width="200" label-align="center">
			<u-form-item label="收款人" class="form-item">
				<u-input v-model="form.SKR" type="text"  height="60" :disabled="true"/>
			</u-form-item>
			<u-form-item label="收款银行" class="form-item">
				<u-input v-model="form.SKYH"  type="text"  height="60" :disabled="true"/>
			</u-form-item>
			<u-form-item label="收款账号" class="form-item">
				<u-input v-model="form.SKZH"  type="text"  height="60" :disabled="true"/>
			</u-form-item>
			<u-form-item label="收款金额" class="form-item">
				<u-input v-model="form.SKJE"  type="text" border="border" height="60"/>
			</u-form-item>
			<u-form-item label="开户代码" class="form-item">
				<u-input v-model="form.KHH"  type="text"  height="60" :disabled="true"/>
			</u-form-item>
			<u-form-item label="对公对私" class="form-item">
				<!-- <u-select v-model="show" mode="single-column" :list="selectionList"
					@confirm="confirm">
				</u-select> -->
				<u-input v-model="selectLabel" type="text" @click="show = true" :disabled="true"/>
			</u-form-item>
		</u-form>
		<view class="submitBtn" @tap="submit">
			<view class="submit">提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['basicForm'],
		data() {
			return {
				// selectionList: [{
				// 		value: '1',
				// 		label: '对公'
				// 	},
				// 	{
				// 		value: '2',
				// 		label: '对私'
				// 	},
				// ],
				form: {
					SKR: '', // 收款人姓名
					SKYH: '', // 收款银行
					SKZH: '', // 收款账号
					SKJE: '', // 收款金额（等同于借款金额）
					KHH: '', // 开户代码，
					DGDS: '1' ,//对公对私 (2, 1)
					YWLX: '出差人民币借款', // 业务类型（暂时写死）
					// YSKM: '', // 预算科目（暂时写死）
					YFORDER: '', //研发订单 传个空值
				},
				sid: '',
				show: false,
				selectLabel: '对私' //手机端暂时写死
			}
		},
		watch: {
			'basicForm.JKJE'(val) {
				this.form.SKJE = val
			}
		},
		mounted() {
			this.sid = uni.getStorageSync('sid');
			this.getCollectInfo(this.sid);
		},
		methods: {
			getCollectInfo() {
				uni.request({
					url: this.$Common.bpmUrl,
					data: {
						sid: this.sid,
						cmd: "JACK_APP_MOBILE_WSBX_GET_PAYEEINFO"
					},
					success: (res) => {
						let data = res.data.jsonData[0]
						this.form.SKR = data.xm;
						this.form.SKYH = data.yhmc;
						this.form.SKZH = data.yhzh;
						this.form.KHH = data.YHLHH;
						// if (2 == data.DGDSBZ) {
						// 	this.selectLabel = this.selectionList[1].label
						// } 
					}
				})
			},
			// confirm(e) {
			// 	this.selectLabel = e[0].label;
			// 	this.form.DGDSBZ = e[0].value;
			// },
			
			submit() {
				console.log(this.basicForm)
				let data = Object.assign(this.basicForm, this.form)
				uni.request({
					url: this.$Common.bpmUrl,
					data: {
						sid: this.sid,
						cmd: "JACK_APP_MOBILE_WORKFLOW_FI_JKD",
						//这里要拆出来 代码很丑 我也没办法
						SQRBMID: data.SQRBMID, //申请人部门ID
						JKJE: parseInt(data.JKJE, 10), //借款金额
						YWLX: data.YWLX, // 业务类型
						GSGS: data.GSGS, // 公司代码
						YWBMID: data.YWBMID, //业务部门代码
						YWBM: data.YWBM, //业务部门名称
						YSKM: data.YSKM ? data.YSKM : '其他应收款-职工借款', // 预算科目（暂时写死）
						YWSM: data.YWSM, //业务描述
						YFORDER: '', //研发订单 传个空值
						SKR: data.SKR, // 收款人姓名
						SKYH: data.SKYH, // 收款银行
						SKZH: data.SKZH, // 收款账号
						SKJE: parseInt(data.SKJE, 10), // 收款金额（等同于借款金额）
						DGDS: data.DGDS, // 对公对私（2, 1）
						KHH: data.KHH, // 开户代码，
						JSFS: data.JSFS, // 结算方式
					},
					success:(res) => {
						console.log(res)
						uni.showToast({
							title:'提交成功'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-item {
		height: 60px;
	}

	.submitBtn {
		display: flex;
		justify-content: space-around;
		width: 600rpx;
		line-height: 100rpx;
		position: absolute;
		bottom: 30rpx;
		left: 70rpx;
		background-color: #06A7E2;
		border-radius: 60rpx;
		font-size: 30rpx;

		.submit {
			display: flex;
			align-items: center;
			color: #ffffff;
		}
	}
</style>
