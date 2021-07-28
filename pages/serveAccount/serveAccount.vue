<template>
	<view class="wrap">
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#06A7E2" inactive-color="#000000" ref="tabs" :list="list" :current="current"
				@change="change" bar-width="100" :is-scroll="false" swiperWidth="750">
			</u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item>
				<view class="swiper-item">
					<basicInfo @basicInfo="getBasicInfo" :serve="serve"></basicInfo>
				</view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
					<bill-detail @billInfo="getBillInfo" @totalCount="getTotalCount"></bill-detail>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<collectionInfo :basicForm="form" :billInfo="billInfo" :totalCount="totalCount" :type="type"></collectionInfo>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import basicInfo from '../components/basicInfo.vue'
	import billDetail from '../components/billDetail.vue'
	import collectionInfo from '../components/collectionInfo.vue'
	export default {
		components: {
			basicInfo,
			billDetail,
			collectionInfo
		},
		data() {
			return {
				list: [{
						name: '基础信息'
					},
					{
						name: '报销明细'
					},
					{
						name: '收款信息'
					}
				],
				form: {},
				popShow: false,
				show: false,
				current: 0,
				type: 'postServeBill',
				swiperCurrent: 0,
				billInfo: [],
				totalCount: 0,
				serve: true
			}
		},
		methods: {
			getBasicInfo(data) {
				this.form = data
			},
			getInvoiceList(index, data) {
				this.invoiceList = data
			},
			getBillInfo(index, data) {
				this.billInfo = data
			},
			getTotalCount(index, data) {
				this.totalCount = data
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				// this.getOrderList(index);
			},
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},

		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		width: 100%;
		height: 100%;
	}

	.swiper-box {
		width: 98%;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		padding: 10rpx;
		font-size: 28rpx;
		height: 90%;
	}

	.swiper-item {
		height: 100%;
	}

</style>
