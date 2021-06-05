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
					<basicInfo :loan="loan" @basicInfo="getBasicInfo"></basicInfo>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<collectionInfo :basicForm="form"></collectionInfo>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import basicInfo from '../components/basicInfo.vue'
	import collectionInfo from '../components/collectionInfo.vue'
	export default {
		components: {
			basicInfo,
			collectionInfo
		},
		data() {
			return {
				form: {
					// SQRBMID: '', //申请人部门ID
					// JKJE: '', //借款金额
					// YWLX: '出差人民币借款', // 业务类型（暂时写死）
					// GSGS: '', // 公司代码
					// YWBMID: '', //业务部门代码
					// YWBM: '', //业务部门名称
					// YSKM: '其他应收款-职工借款', // 预算科目（暂时写死）
					// YWSM: '', //业务描述
					// YFORDER: '', //研发订单 传个空值
					// SKR: '', // 收款人姓名
					// SKYH: '', // 收款银行
					// SKZH: '', // 收款账号
					// SKJE: '', // 收款金额（等同于借款金额）
					// DGDS: '', // 对公对私（2, 1）
					// KHH: '', // 开户代码，
					// JSFS: '', // 结算方式
					// days: '',
				},
				list: [{
						name: '基础信息'
					},
					{
						name: '收款信息'
					}
				],
				loan: true,
				show: false,
				current: 0,
				swiperCurrent: 0,
				sid: ''
			}
		},
		
		methods: {
			getBasicInfo(data) {
				this.form = data
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				// this.getOrderList(index);
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
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
