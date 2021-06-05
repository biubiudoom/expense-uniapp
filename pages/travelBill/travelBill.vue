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
					<basicInfo :form="form" :travel="travel"></basicInfo>
				</view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y style="height: 90%;width: 100%;" @scrolltolower="reachBottom">
					<u-collapse :head-style="headStyle" :body-style="bodyStyle">
						<u-collapse-item v-for="(item,index) in typeList" :title="item.title" :showAnimation="true" :open="item.open">
							<bill-detail :orderList="orderList"></bill-detail>
							<!-- <u-loadmore status="loadmore" bgColor="#f2f2f2"></u-loadmore> -->
							<u-popup v-model="popShow" mode="bottom">
								<view class="importBtn">
									<u-button hair-line="false">从我的票夹导入</u-button>
									<u-button hair-line="false">直接拍照导入</u-button>
									<u-button @tap="popShow = false" hair-line="false">取消</u-button>
								</view>
							</u-popup>
						</u-collapse-item>
					</u-collapse>
				</scroll-view>
				<!-- <view class="bottom">
					<view class="totalCount">
						<view class="travelCost">
							管理费用-差旅费         ￥
						</view>
						<view class="dinningCost">
							管理费用-餐饮费
						</view>
					</view>
				</view> -->
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
					company: '',
					depart: '',
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
				typeList: [{
						title: '行程',
						open: true
					},
					{
						title: '住宿'
					},
					{
						title: '出租车'
					},
					{
						title: '汽油费'
					},
					{
						title: '其他'
					}
				],
				headStyle: {
					marginBottom:'20rpx',
					backgroundColor: '#F2F2F2',
					height: '80rpx'
				},
				bodyStyle: {
					color: '#000000'
				},
				popShow: false,
				travel: true,
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
	
	
	.bottom {
		height: 200rpx;
		padding: 10rpx;
		background-color: #CCCCCC;
		
		.totalCount {
			margin: 15rpx 20rpx;
			background-color: #F2F2F2;
			height: 100rpx;
			
			.travelCost {
				margin-bottom: 14rpx;
			}
		}
	}

</style>
