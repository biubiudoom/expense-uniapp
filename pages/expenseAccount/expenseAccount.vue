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
					<basicInfo :form="form"></basicInfo>
				</view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
					<bill-detail :orderList="orderList"></bill-detail>
					<!-- <u-loadmore status="loadmore" bgColor="#f2f2f2"></u-loadmore> -->
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<collectionInfo :form2="form2"></collectionInfo>
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

				form: {
					name: '',
					dapart: '',
					company: '',
					depart2: '',
					subject: '',
					descrp: '',
					pattern: '',
					number: 0,
					order: ''
				},
				form2: {
					name: '',
					bank: '',
					account: '',
					number: 0,
					code: '',
					isCommon: ''
				},
				orderList: [{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200'
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200'
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200'
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200'
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200'
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200'
					},
				],
				popShow: false,
				show: false,
				current: 0,
				swiperCurrent: 0,
				selectLabel: '对公'
			}
		},
		methods: {
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
		width: 700rpx;
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

	// .addMore {
	// 	display: flex;
	// 	justify-content: space-around;
	// 	margin: 30rpx auto;
	// 	line-height: 100rpx;
	// 	font-size: 50rpx;

	// 	.add {
	// 		display: flex;
	// 		align-items: center;

	// 		.icon {
	// 			margin-right: 10rpx;
	// 		}
	// 	}
	// }
</style>
