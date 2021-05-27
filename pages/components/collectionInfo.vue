<template>
	<view>
		<u-form :model="form2" ref="collectionForm" label-width="200" label-align="center">
			<u-form-item label="收款人" class="form2-item">
				<u-input v-model="form2.name" placeholder="请输入收款人姓名" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="收款银行" class="form2-item">
				<u-input v-model="form2.bank" placeholder="请输入收款银行" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="收款账号" class="form2-item">
				<u-input v-model="form2.account" placeholder="请输入收款账号" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="收款金额" class="form2-item">
				<u-input v-model="form2.number" placeholder="请输入收款金额" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="开户代码" class="form2-item">
				<u-input v-model="form2.code" placeholder="请输入开户代码" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="对公对私" class="form2-item">
				<u-select v-model="show" :default-value="defaultValue" mode="single-column" :list="selectionList" @confirm="confirm">
				</u-select>
				<u-input v-model="selectLabel" type="select" @click="show = true" />
			</u-form-item>
		</u-form>
		<view class="submitBtn" @tap="submit">
			<view class="submit">提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['form2'],
		data() {
			return {
				selectionList: [{
						value: '0',
						label: '对公'	
					},
					{
						value: '1',
						label: '对私'
					},
				],
				show: false,
				defaultValue: [0],
				selectLabel: '对公'
			}
		},
		methods: {
			confirm(e) {
				this.selectLabel = e[0].label;
				this.form2.isCommon = e[0].value;
				this.defaultValue[0] = parseInt(e[0].value);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form2-item {
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
