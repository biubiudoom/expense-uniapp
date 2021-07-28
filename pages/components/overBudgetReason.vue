<template>
	<view class="wrapper">
		<u-form :model="form" style="height: 1100rpx;" label-width="260" label-align="center" :border-bottom="false">
			<u-form-item label="出租车费超标说明" class="form-item" v-if="1 == form.overTaxi">
				<u-input  v-model="form.overTaxiReason" placeholder="请输入出租车费超标说明" border="border" type="textarea"  height="50" />
			</u-form-item>
			<u-form-item label="住宿费超标说明" class="form-item" v-if="1 == form.overStay">
				<u-input  v-model="form.overStayReason" placeholder="请输入住宿费超标说明" border="border" type="textarea" height="50" />
			</u-form-item>
		</u-form>
		<u-button @tap="confirm()" type="primary" shape="square" class="submitBtn">确认</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					overTaxiReason: '',
					overStayReason: '',
					overTaxi: 0,
					overStay: 0
				}
			}
		},
		
		onLoad() {
			let that = this
			const eventChannel = this.getOpenerEventChannel()
			// eventChannel.emit('acceptDataFromOpenedPage', this.form);
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('overTaxi', function(data) {
				that.form.overTaxi = data
			})
			eventChannel.on('overStay', function(data) {
				that.form.overStay = data
			})
		},
		
		methods: {
			confirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', this.form);
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		margin: 0rpx 20rpx auto
	}
	.form-item {
		height: 250rpx;
	}
	
	.submitBtn {
		width: 400rpx;
		margin-top: 20rpx;
	}
</style>
