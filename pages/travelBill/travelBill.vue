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
					<basicInfo @basicInfo="getBasicInfo" @caterCost="getCaterCost" @gasCost="getGasCost" 
							   @photoList="getPhotoList" @ :travel="travel" @totalCount="getTotalCount"></basicInfo>
				</view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y style="height: 100% ;width: 100%;">
					<u-collapse :head-style="headStyle" :body-style="bodyStyle">
						<u-collapse-item v-for="(item,index) in typeList" :title="item.title" :showAnimation="true" 
						                 :total="totalCount[index]" :open="item.open">
							<bill-detail @billInfo="getBillInfo" @totalCount="getTotalCount" @billPhotos="getBillPhotos" 
										 @invoiceList="getInvoiceList" @invoicenoList="getInvoicenoList" 
										 :travel="travel" :index="index"></bill-detail>
						</u-collapse-item>
					</u-collapse>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<collectionInfo :basicForm="form" :caterCost="caterCost" :gasCost="gasCost" 
									:billInfo="billInfo" :invoiceList="invoiceList" :invoicenoList="invoicenoList" 
									:totalCount="totalCount" :SKJE="SKJE" :photoList="photoList" :type="type"></collectionInfo>
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
				typeList: [{
						title: '行程',
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
					color: '#000000',
				},
				travel: true,
				show: false,
				current: 0,
				swiperCurrent: 0,
				billInfo: [],
				photoList: [],
				totalCount: [],
				invoiceList: [],
				invoicenoList: [],
				caterCost: 0,
				type: 'postTravelBill',
				SKJE: 0,
				gasCost: 0
			}
		},
		methods: {
			getBasicInfo(data) {
				this.form = data
			},
			getGasCost(data) {
				this.gasCost = parseFloat(data)
			},
			getCaterCost(data) {
				this.caterCost = data
			},
			getPhotoList(data) {
				this.photoList = data
			},
			getBillPhotos(data) {
				for (let i in data) {
					this.photoList.push(data[i])
				}
			},
			getInvoiceList(index, data) {
				this.invoiceList[index] = data
			},
			getInvoicenoList(index, data) {
				this.invoicenoList[index] = data
			},
			getBillInfo(index, data) {
				this.billInfo[index] = data
			},
			getTotalCount(index, data) {
				if (data) {
					this.$set(this.totalCount, index, data)
				} else {
					this.$set(this.totalCount, index, 0)
				}
				let stayStandard = 0
				let taxiStandard = this.form.CZCTS * (this.form.CZCBZ.split('-')[1])
				let stayCost
				let taxiCost 
				let travelCost = this.totalCount[0] ? this.totalCount[0] : 0
				let otherCost = this.totalCount[4] ? this.totalCount[4] : 0
				for (let i in this.form.ZSBZ) {
					if (this.form.ZSTS[i]) {
						stayStandard +=  parseInt(this.form.ZSTS[i]) * (this.form.ZSBZ[i].split('-')[2])
					}
				}
				if (this.totalCount[1]) {
					stayCost = this.totalCount[1] > stayStandard ? stayStandard : this.totalCount[1]
				} else {
					stayCost = 0
				}
				if ('营销(Marketing)-20' == this.form.CZCBZ) {
					taxiCost = taxiStandard
				} else if (this.totalCount[2]) {
					taxiCost = this.totalCount[2] > taxiStandard ? taxiStandard : this.totalCount[2]
				} else {
					taxiCost = 0
				}
				this.SKJE = travelCost + stayCost + taxiCost + otherCost
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
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
