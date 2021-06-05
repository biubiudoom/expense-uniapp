<template>
	<view class="wrapper">
		<u-form :model="form"  label-width="160" label-align="center" :border-bottom="false">
			<u-form-item label="购买方" class="form-item" v-if="form.purchaser">
				<u-input  v-model="form.purchaser" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="销售方" class="form-item" v-if="form.purchaser">
				<u-input  v-model="form.seller" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="类型" class="form-item" v-else>
				<u-input  v-model="form.title" placeholder="请输入报销单标题" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="日期" class="form-item">
				<u-calendar v-model="show" :mode="mode" @change="change" active-bg-color="#06A7E2"></u-calendar>
				<u-input v-model="form.date" placeholder="请选择日期" type="select" height="60" :disabled="true" @tap="show = true"/>
			</u-form-item>
			<u-form-item label="金额" class="form-item">
				<u-input  v-model="form.price" placeholder="请输入金额" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="附件" class="form-item" v-if="form.region_path">
				<u-image width="100%" height="100rpx" mode="aspectFill" :src="form.region_path"
				@click="preview()"></u-image>
			</u-form-item>
			<u-form-item label="备注" class="form-item">
				<u-input  v-model="form.remark" placeholder="请输入备注" type="text" border="border" height="60" />
			</u-form-item>
		</u-form>
		<view class="submitBtn" @tap="confirm">
			<view class="submit">确认</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				form: {
					purchaser: '',
					seller: '', 
					title: '',
					date: '',
					price: '',
					remark: '',
					region_path: ''
				},
				oldForm: {},
				show: false,
				mode: 'date'
			}
		},
		
		onLoad(option) {
			let that = this
			const eventChannel = this.getOpenerEventChannel()
			// eventChannel.emit('acceptDataFromOpenedPage', this.form);
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('acceptDataFromOpenerPage', function(data) {
				that.oldForm = JSON.parse(data)
			})
			this.form = this.oldForm
		},
		
		methods: {
			change(e) {
				this.form.date = e.result
			},
			confirm() {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('acceptDataFromOpenedPage', this.form);
				uni.navigateBack()
			},
			preview() {
				let urlList = [];
				urlList.push(this.form.region_path)
				uni.previewImage({
					urls: urlList,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		margin: 0rpx 20rpx auto
	}
	.form-item {
		height: 140rpx;
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
